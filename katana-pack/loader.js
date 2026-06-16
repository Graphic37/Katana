// katana-pack loader — drop-in for Three.js (r128+ / module build)
// Usage:
//   import { KatanaCharacter } from './loader.js';
//   const char = new KatanaCharacter(scene, BASE_URL);
//   await char.load();
//   char.play('Idle_ver_A');
//
// BASE_URL is the raw.githubusercontent.com path to the repo root, e.g.
//   https://raw.githubusercontent.com/Graphic37/katana-pack/main/
//
// Requires THREE and GLTFLoader to be available (import them in your app and
// pass them in, or rely on the globals). See constructor.

export class KatanaCharacter {
  constructor(scene, baseUrl, { THREE, GLTFLoader, weapon = 'katana' } = {}) {
    this.scene = scene;
    this.base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    this.THREE = THREE || window.THREE;
    this.GLTFLoader = GLTFLoader || (window.THREE && window.THREE.GLTFLoader);
    this.weaponName = weapon;
    this.clips = {};            // name -> AnimationClip
    this.manifest = null;
    this.mixer = null;
    this.current = null;
    this.root = null;           // character scene root
    this.handBone = null;
    this.rootBone = null;
    this.footL = null;
    this.footR = null;
    this.groundY = 0;
    this.grounding = true;
    this._loader = new this.GLTFLoader();
  }

  _fetchGLB(relPath) {
    return new Promise((res, rej) =>
      this._loader.load(this.base + relPath, g => res(g), undefined, rej));
  }

  async load() {
    const M = await (await fetch(this.base + 'manifest.json')).json();
    this.manifest = M;

    // character
    const cg = await this._fetchGLB(M.character);
    this.root = cg.scene;
    const THREE = this.THREE;
    const box = new THREE.Box3().setFromObject(this.root);
    const h = box.getSize(new THREE.Vector3()).y || 1;
    this.scale = 1.7 / h;
    this.root.scale.setScalar(this.scale);
    this.scene.add(this.root);
    this.root.traverse(o => {
      if (o.isBone && o.name === 'hand_r') this.handBone = o;
      if (o.isBone && o.name === 'root')   this.rootBone = o;
      if (o.isBone && o.name === 'ball_l') this.footL = o;
      if (o.isBone && o.name === 'ball_r') this.footR = o;
    });

    // weapon with tuned grip offset
    const wPath = M.weapons[this.weaponName];
    if (wPath && this.handBone) {
      const wg = await this._fetchGLB(wPath);
      const w = wg.scene;
      const g = M.grip;
      w.position.set(...g.pos);
      w.rotation.set(
        THREE.MathUtils.degToRad(g.rotDeg[0]),
        THREE.MathUtils.degToRad(g.rotDeg[1]),
        THREE.MathUtils.degToRad(g.rotDeg[2]));
      w.scale.setScalar(g.scale);
      this.handBone.add(w);
      this.weapon = w;
    }

    this.mixer = new THREE.AnimationMixer(this.root);
    return this;
  }

  // Lazy-load a clip by name (from manifest), cache it.
  async _ensureClip(name) {
    if (this.clips[name]) return this.clips[name];
    const entry = this.manifest.clips.find(c => c.name === name);
    if (!entry) { console.warn('[katana] no clip named', name); return null; }
    const g = await this._fetchGLB(entry.file);
    const clip = g.animations[0];
    this.clips[name] = clip;
    return clip;
  }

  async play(name, { loop = true, fade = 0.15 } = {}) {
    const clip = await this._ensureClip(name);
    if (!clip) return;
    const THREE = this.THREE;
    if (this.current) this.current.fadeOut(fade);
    const act = this.mixer.clipAction(clip);
    act.reset();
    act.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    act.clampWhenFinished = !loop;
    act.fadeIn(fade).play();
    this.current = act;
    return act;
  }

  // call every frame with delta seconds
  update(dt) {
    if (this.mixer) this.mixer.update(dt);
    if (this.root && this.grounding && this.footL && this.footR) {
      const THREE = this.THREE;
      this._v = this._v || new THREE.Vector3();
      this.root.position.y = this.groundY;
      this.root.updateMatrixWorld(true);
      this.footL.getWorldPosition(this._v); const lY = this._v.y;
      this.footR.getWorldPosition(this._v); const rY = this._v.y;
      const lowest = Math.min(lY, rY);
      let target = this.groundY;
      if (lowest < 0) target = this.groundY - lowest; // only push up out of floor
      this.groundY += (target - this.groundY) * 0.3;
      if (Math.abs(this.groundY) < 0.002) this.groundY = 0;
      this.root.position.y = this.groundY;
    }
  }

  // convenience: list clip names, optionally by category
  list(category) {
    return this.manifest.clips
      .filter(c => !category || c.category === category)
      .map(c => c.name);
  }
}
