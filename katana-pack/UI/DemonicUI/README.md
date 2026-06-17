# Demonic UI

Demonic UI is a dark fantasy uGUI interface pack for Unity. It includes demo scenes, reusable prefabs, sprites, sprite atlases, fonts, materials, and shaders for RPG-style menus and HUD screens.

This file is the package documentation for setup, contents, optional integrations, and upload scope.

## Requirements

- Unity 6000.3.12f1 or newer recommended. The package was authored and saved in Unity 6000.3.12f1.
- Universal Render Pipeline, tested with URP 17.3.0.
- Unity UI/uGUI
- TextMesh Pro support. If text materials or TMP font assets appear missing after import, import TextMesh Pro essentials from Unity and reopen the demo scenes.

## Contents

- `Scenes` - 12 demo scenes: Main Menu, Loading, Gameplay, Inventory, Merchant, Quests, Settings, Skill Tree, Dialog, Difficulty, Hero Creator, and Hero Selector.
- `Prefabs/Basic components` - buttons, toggles, dropdowns, input field, progress bars, scrollbar, tabs, and text prefabs.
- `Prefabs/RPG components` - item slots, items, hero/avatar widgets, minimap, objectives, quest buttons, skill widgets, notifications, and gameplay bars.
- `Prefabs/Windows` - complete window prefabs for common RPG interface screens.
- `Sprites` - source PNGs organized by use, with sprite atlases for buttons, controls, frames, item icons, ornaments, skill icons, stained glass, and windows.
- `Fonts` - font files and generated TMP font assets.
- `Materials` and `Shaders` - UI additive and color overlay materials/shaders.
- `Install` - optional integration packages.

## Optional SubstanceOrb Integration

`Install/SubstanceOrb-GameplayBar.unitypackage` is optional. It is only intended for customers who own both Demonic UI and RPG Health/Mana Orb asset.

Import it after both packages are present in the project. The installer provides an alternate RPG Health/Mana Orb-enabled version of:

`Prefabs/RPG components/Gameplay Bar.prefab`

Do not import this optional installer if you only want the standard Demonic UI gameplay bar.