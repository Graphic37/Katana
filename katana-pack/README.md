# Katana Pack — Three.js-ready

Converted from the Grruzam *Powerful Sword Pack (Great Sword + Katana)* Unity asset
into GLB for use in Three.js. FBX→GLB conversion, Unity-rig (`Bip01`) track cleanup,
weapon grip offset, and a drop-in loader are all included.

## What's here

```
katana-pack/
  characters/    character_base.glb         rigged base mesh (52-bone)
  weapons/       katana.glb, greatsword.glb weapon meshes
  anim/
    movement/    locomotion clips (idle, walk, run, jog, turn, crouch, jump…)
    attacks/     combo chains, dash, upper attacks
    skills/      special abilities
    reactions/   knockdowns, damage, death
  needs_review/  clips with a baked root-orientation quirk (see below)
  loader.js      drop-in KatanaCharacter class
  manifest.json  catalog of every clip (name, category, duration, file)
  index.html     standalone moveset viewer
```

## Clip counts (working set)

| Category   | Clips |
|------------|-------|
| movement   | 352   |
| attacks    | 45    |
| reactions  | 6     |
| skills     | 2     |
| **total**  | **405** |

Plus **94 clips in `needs_review/`** — see "Known issue" below.

## Quick start

Host this folder on GitHub. The raw CDN base URL looks like:

```
https://raw.githubusercontent.com/<user>/<repo>/main/katana-pack/
```

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KatanaCharacter } from './loader.js';

const BASE = 'https://raw.githubusercontent.com/<user>/<repo>/main/katana-pack/';

const char = new KatanaCharacter(scene, BASE, { THREE, GLTFLoader });
await char.load();
char.play('Idle_ver_A');

// in your animation loop:
const dt = clock.getDelta();
char.update(dt);
```

The loader handles:
- scaling the character to ~1.7 units tall
- attaching the weapon to `hand_r` with the tuned grip offset
- keeping feet on the floor (downward-only grounding, no bounce)
- cross-fading between clips

### Playing clips

```js
char.play('Run_ver_B');                       // looping
char.play('Attack_3Combo_ALL', { loop:false });// one-shot
char.list('attacks');                          // array of attack clip names
```

## Grip offset

The katana grip was hand-tuned for `hand_r`:

```
pos:    [-0.04, -0.07, -0.06]
rotDeg: [-90, -155, -155]
scale:  1
```

Stored in `manifest.json` under `grip`. Adjust there if you swap weapons.

## Character note

The base character is a **flat-colored mannequin with no texture** — this is how the
original pack ships it (it's an animation pack; the figure is a rig to display motion).
Replace it with a textured model whose skeleton matches, or restyle the material.

## Known issue — `needs_review/`

94 clips (most of the 5-combo set, some 4-combos, most skills, and some damage
reactions) were authored in the original pack with a **−90° X rotation baked into the
`root` bone's rest pose** plus a different pelvis convention. They don't play upright on
the standard skeleton and the difference isn't a clean single-axis fix. The reliable fix
is to **re-export these few from the original FBX with a corrected up-axis** rather than
patch the GLB. They're quarantined so the working 405 are usable immediately.

## Source / license

Animations © Grruzam, from the Unity Asset Store *Powerful Sword Pack (Great Sword +
Katana)*. Subject to the Unity Asset Store EULA (Single Entity license). This repo is for
the license holder's own project use.
