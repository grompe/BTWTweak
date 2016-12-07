Grom PE's Better Than Wolves Total Conversion tweak mod v0.9j
(Compatible with Better Than Wolves V4.8911+)

[********** Change Log ************]

v0.9j

- Removed BTWTweak stumps as they are now implemented in BTW.

- Removed termites from mineshafts, logs are now whole again. This change
  is due to the way stumps are implemented in BTW.

- Added stump textures for non-oak wood types.

- Changed pistons to melt down to 2 gold nuggets and 6 iron nuggets to be
  consistent with reduction in BTW.

- Allowed normal difficulty for hardcore (permadeath) mode.

- Allowed easy difficulty to be selected only in the main menu. It is now
  called "wimpy". Resets to normal after restarting the game.

- Extended maximum chat line length to 256 characters.

- Added BTWTweak version to the announcement message when connecting.
  You don't want to use BTWTweak on non-BTWTweak servers and vice-versa.

- When disconnecting, the player entity is removed only after 60 ticks
  (3 seconds). This prevents exploiting initial invulnerability by
  repeatedly disconnecting and connecting in dangerous situations.
  Make sure to disconnect only when safe from now on.

v0.9i

- Restored the ability of Glass Block to contain piston packing.

- Removed the void fog.

- Refactored the patches, now it should be much easier to write new ones,
  also you can add your own in the BTWTweak.jar/scripts/custom.js file.

- Fixed patcher failing to remove client-only stuff on server.

- Fixed tables and columns showing moulding placement preview box.

v0.9h

- If CraftGuide is found in the minecraft.jar, it will be patched so the
  guide key works on inventory screens and displays recipes involving the
  item under the cursor. I find it interesting the code was there all this
  time yet unable to execute due to a bug.

- Added key shortcut for quick usage of /tell command for quick and
  hassle-free private messaging on servers. Default on R. It will open the
  chat with "/tell" + last told username.

- Fixed possible server crash when loading a corrupted world where chest tile
  entity does not match the chest block.

- Fixed problem with falling out of the world causing an infinite loop if
  gravestones are enabled.

- Improved microblock preview: now it supports additional microblocks from
  add-ons and displays only when the block placement is not obstructed by
  player or other entities.

- Added recipes for joining nether brick slabs and white cobble slabs into
  blocks.

- Fixed problem where ladder couldn't be placed when standing in the same
  block even though the player did not intersect its collision box (MC-9704).
  This also allows placing microblocks when partially standing in the target
  block; the preview feature was adjusted accordingly.

v0.9g

- Limited chicken egg incubating to one at a time. No more happily hatching
  stacks of eggs, unless you build a whole room dedicated to that.

- New hotbar cycling mode: fill empty slot. People who previously didn't
  like hotbar cycling may find this feature useful.

- Increased the chance of flint from digging and filtering gravel as it felt
  way too rare. Also digging gravel has higher chance to drop a loose rock.

- Extended block IDs! This means there is no more shortage of them and new
  blocks can be added freely. Thanks to Yhetti for pioneering the technique.

- Made Soap blocks slippery. You will have to replace and recraft soap
  blocks you already have for this to take effect.

- Added storage blocks for Wheat, Diamond Ingot, Coal, Charcoal, Coal Dust,
  Nethercoal, Sugar, Bone, Nitre, Potash, Ash, Flour (requires 9 of each).
  All of them can be retrieved by crafting back to items.
  Block of Bone can be only crafted by Hardcore Packing.

- Added Block of Flesh, squishy block made of 9 Rotten Flesh by Hardcore
  Packing and uncrafted by hand.

- Added Block of Sawdust, made of 16 Sawdust by Hardcore Packing and
  uncrafted by saw.

- Added Block of Slime, sticky transparent block made of 9 slimeballs. Note
  that it doesn't affect piston mechanics like it does in later versions of
  Vanilla Minecraft.

- Redstone and Lapis are now handled by Hardcore Packing, and all of the
  above storage blocks.

- Added preview for microblocks: now you can see where your sidings,
  mouldings and corners will go.

- Removed bone to glue recipe; bonemeal to glue ratio nerfed to 64 to 1.

- If CraftGuide is found in the minecraft.jar, it will be patched so it will
  not display actual compass and clock data in its GUI.

- Added support for IME input (MC-2781).

v0.9f (patcher fix)

- Changed the way BTW version is detected when patching to be more reliable,
  and also to fix an odd error

v0.9f

- Changed villagers to display newest offers in the beginning of the list
  rather than the end, to put an end to constant scrolling through offers.

- Changed beds to not explode in other dimensions, so you can sleep in
  a bed anywhere now.

- Changed chests to be placeable next to each other, regardless of any
  adjacent double chests. Single chests will be merged to double chests as
  before. This allows configurations (especially together with hoppers) that
  weren't possible before. Not being able to place a chest seemed like an
  arbitrary and awkward limitation. Placing a chest while sneaking allows to
  control which chest it combines with, or none at all.

- Fixed chests, ender chests, wall signs, beds, beacons and cocoa beans so
  they display cracks while being harvested (MC-676).

- Fixed kiln so it is able to display multiple cracked blocks at once.

- Improved item frames: fixed items being dark (MC-7001), or off-center
  (MC-8662); framed maps now occupy full block, and label of a renamed item
  is displayed when looking at the frame.

- Greatly reduced chance for scroll drop from ocelots, for balance

- Added ability for wolves to respawn in forest biome (but not forest hills)
  like hostile mobs. This is mainly done to support long term servers, where
  no animals and wolves left for kilometers around. This feature can be
  turned off in BTWTweak.cfg.

- Added hard-boiled eggs, made from raw eggs in a cauldron, and ability to
  hatch chicks from eggs placed on a padding block and immediately below an
  active light block.

- Increased delay for seeds rooting themselves to 2 seconds

- Changed explosion of stone and cobblestone so there is a small chance
  to drop a pile of gravel

- Added item tooltips to see different unfired pottery and planter types
  more clearly

- Made snow and ice blocks melt in more consistent manner: stay in dark,
  melt in light (skylight is ignored in cold biomes). Coincidentally, this
  also makes snow blocks let a little bit of light through.

v0.9d

- Removed restriction to Java 6/7 because of the way script engine was used.
  Now the patcher can run on OpenJDK or Java 8

- Script fixes related to the above update.

- Backport correct tree tops textures

- Add Sprint key, default to Left Ctrl. This required updating the settings
  page to a scrollable list, which was borrowed from Minecraft Forge.

- Fix FC's oversight that caused mycelium and huge mushroom blocks display
  swirling True Sight particles, even though mobs cannot spawn on them

- Added some visual explanation to Gloom.

- Fixed writing table causing crash when used simultaneously in multiplayer,
  and possible duplicating of items.

- Fixed /playtime command for multiplayer

- Renamed Haste enchantment on boots to Velocity, not to confuse with the
  Haste beacon which increases mining speed.

- Made loose rocks to cobblestone recipe shapeless

- Added loose rocks and ender pearls to piston Hardcore Packing

- Made sign posts accept unicode characters

- Improved font display for latin and cyrillic scripts when unicode font
  is chosen. That includes a fix for wider characters.

- Patcher now looks in its own directory in addition to
  "current working directory", as on some configurations the latter was
  defaulting to a wrong place.

- Fixed problem with unicode characters when renaming

- Removed the annoying inventory shift when player has effects/buffs.
  It was getting unbearable when running in and outside of a beacon range.

v0.9b

- Added a whole bunch of items to regain renaming feature:
  Ink and Quill, crafted with glass bottle, feather and ink sac;
  Writing Table, crafted with paper and planks;
  Name Tags, created on the new Writing Table when there's
  no item to rename. Those tags can be used to name entities.
  Written Book recipe is also changed to require Ink and Quill.
  Writing Table requires Ink and Quill, Paper and 1 experience level.

- Made Minecraft display BTW icon in the window title

- Fixed vanilla issue (MC-190) with misaligned textures facing
  East and North on partial blocks

- Made wooden and stone pickaxes not break instantly when attacking
  mobs; coincidentally, this also raises their normal uses to 2 and 7
  respectively, which helps balance against random and reduced
  output from breaking stone (in terms of cobblestone blocks)

- New sling weapon is now required to throw rocks. It is crafted with
  a piece of cut tanned leather and two ropes on sides.

- Thrown rocks now inflict variable damage according to their velocity.
  This makes slings more or less viable alternative to bows, albeit
  at the price of exhaustion and leather.

- Rocks are now stackable to 64

v0.9a

- Fix vanilla issue (MC-12964) with chunk coordinates using
  a bad hash function

- Fix vanilla issue (MC-92) with wrong lighting of partial
  blocks when enclosed from top and sides with solid blocks

- Fix vanilla issue (MC-486) with zombies and skeletons not
  burning on slabs when exposed to sun

- Fix vanilla issue (MC-3631) with creeper model appearing
  floating

- Fix vanilla issue (MC-4855) with mob spawner spawn area
  not being centered on the spawner

- Add ability to turn off gravestones by setting
  gpeBlockGravestoneID to zero in BTWTweak.cfg

- Add hotbar cycling configuration, now adaptive by default

- If Deco Add-On v1.2 is found in the minecraft.jar, it
  will be fixed and working with the latest BTW version!

v0.9

- Fix crash when attempting to view Achievements

- Fix vanilla bug (MC-881) with boats causing fall damage when
  just out of water, i.e. arriving on a dock made of slabs

- Add "tree stumps" feature: bottommost log is much harder
  to gather without digging it up first

- Change (reduce) jungle and pine tree hardness a bit for more
  variety and to signify weaker wood types

- Make cows and sheep heal when they eat grass

- Re-add the feature of sawing decorative wooden blocks
  such as pedestal, table, bench, column

- Fix missing beacon texture

- Adjust visual fullness of cauldron and crucible to 9 item
  slots to correspond better with the reduced inventory

- Backport new charcoal texture

- Prevent cave and jungle spiders from dropping heads due to
  small size and to correspond better with eye drop being
  exclusive to big spiders

- Allow grinding hellfire and sandstone back to their
  respective dust/pile form

- Add visual rotation to the top surface of the turntable

- Pressing the hotbar key of already selected slot will cycle
  items in the corresponding inventory column

- Make wither skeletons and logs destroyed by fire drop ash,
  which also can be used as a fertilizer

- To pay tribute to death, now gravestone is placed after the
  player's death, if terrain allows. Graves will only be
  created if the player lived long enough to Hardcore Spawn.

- Logs in abandoned mineshafts are now eaten by termites and
  will only drop a piece of sawdust when harvested

- Rails in abandoned mineshafts are now rusted and
  give several times less iron when smelted

v0.8

- Render sun/moon on short and tiny view distances as it is now
  an important part of gameplay, and was becoming an artificial
  difficulty for those with lower spec PCs

- Set fog to stay minimum at normal distance (configurable),
  for same reason as above and to see ghasts shooting at you

- Tell BTW and BTWTweak version info in main menu

- REALLY fix Cistern to Cauldron recipe

- Fix quick rock conversion: had wrong cobblestone metadata,
  causing weird stacks and non-operability in crucible

- Fix glass not being efficiently broken by pickaxe

v0.7d

- Fix Cistern to Cauldron recipe caused by a typo

v0.7c

- Fix bed regeneration patch for BTW "4.99999A0Eb Marsupial?!!!"


v0.7b

- Spider head can now be crafted to 2 spider eyes

- Glass blocks shatter when landed on from a height

- Fixed FlowerChild's terrible oversight that caused
  darkness not to consume the player's mystery meat

- Cistern can now be crafted to Cauldron by adding
  a bucket of water and a bone on top

- For BTW version "4.99999A0D Marsupial??!!" or newer, since it
  changed item stay to 20 minutes when dropped after death,
  boosting item stay patch is no longer applied

- For BTW version "4.99999A0D Marsupial??!!" or newer, since it
  added gravel and sand slabs, replace corresponding BTWTweak
  recipes and allow crafting old slabs to new slabs


v0.7a

- Ocelots now rarely drop arcane scroll of haste, which could be applied to
  boots for up to 30% speed boost.

- Fixed crash when attempting to view recipes with CraftGuide.


v0.7

- Now beds are usable again and allow players to regenerate even when hungry.
  Regeneration rate is doubled and hunger rate is halved when resting.

- Fix quick rock conversion, hopefully

- Thrown or dispensed rocks shatter glass

- Potash fertilizes farmland or planter when dropped on it

- Seeds root themselves when dropped on suitable ground

- Kiln doubles nugget output from iron and gold ore

- New /playtime command shows age of the world in real time

- Cooking progress in furnace, cauldron, etc. now reverts slowly when without
  fire. This should make starter diamonds in cauldron more reliable to make.


v0.6a

- Fix version detection, this fixes melting pistons in particular

- Fix crash when sawing on newer BTW versions [#1]


v0.6

- Fixed packed earth, gravel and sand slab textures broken in v0.5

- Piston can be melted down in a stoked crucible to retrieve metallic components

- BTWTweak.cfg is now automatically created if doesn't exist

- Shift+right-click rocks to quickly convert them to cobblestone

- Support for Six's BTW Research Add-On

- Moved diamond ingot recipe to the cauldron. Yep, this requires
  you to burn some wooden logs under the cauldron and is more
  fitting for the now permanent nature of diamond ingots.

- Added silk crafted from 9 string, only for storage purposes for now

- Block Dispenser no longer assembles cobblestone from loose rocks in BTW 4.89666+


v0.5

- Refactoring and a new patching method - hardcore modding!
  Should be compatible with BTW v4.8911 and up

- Because of low profit for amount of effort ratio, and belief that original
  mod author should fix his own bugs, some tweaks were discontinued:
  - Axle seamless texture animation change
  - Bellows, gearbox, pulley, turntable breaking drops fixes
  - Decorative wooden blocks such as pedestal, table, bench, column splitting in saw
  - Arcane scroll not crashing with invalid enchantment
  - Infernal Enchanter exploding instead of crashing with invalid enchantment

- Increased item stay to 30 minutes

- Wool blocks can be sawed to slabs

- Wool blocks can be boiled in a stoked cauldron to retrieve components

- New feature: regenerate stratification

- Fixed (restored) axe effectiveness against Jack-o-lantern

- Fixed gravel filtering randomness in hopper

- Fixed Jack-o-lanterns replacing blocks with a torch when falling

- Added a recipe to merge 2 stone brick slabs

- Cobblestone and stone drop in block form if destroyed by soulforged tool

- Renamed rotted arrow to rotten arrow to conform with rotten flesh

- Made books craftable with cut tanned leather

- Also note that Jack-o-lantern dropping like pumpkin behavior will replace
  any new Jack-o-lantern behavior, such as going off underwater.


v0.4a

- Updated to BTW v4.891124

- Due to the old patcher and code based on BTW v4.8911,
  some features are not available in this release, and work like in the original BTW:
  - Bellows drops extra tanned leather when overpowered
  - Player still can eat on ladder and armor/boots don't affect movement speed
  - Chicken doesn't drop more feathers
  - Spider doesn't drop head
  - Zombie pigman doesn't drop head
  - Hardcore spawn radius is not configurable in this release


v0.4

- Added loose rocks that come from breaking stone and cobblestone;
  they can be thrown as a basic weapon for the price of making player exhausted;
  cobblestone can be crafted from 2x2 loose rocks and slab from 2 loose rocks

- Changed gravel to give loose rocks and rarely flint when harvested or filtered

- Changed stone to have a rare chance to drop flints

- Let item dispenser throw loose rocks

- Let block dispenser make cobblestone from loose rocks

- Changed stone axe, pickaxe and lever recipes to use loose rocks instead of cobblestone blocks

- Hardcore spawn radius is now configurable; use at your own risk

- Fixed furnace display update when cooked item is taken out

- (not in this release) Raised feather drop from chicken to 1-3 - huge chicken farms aren't hard to make, just laggy and annoying

- Refactored code, smaller patch size

- Updated the patch to BTW v4.891123 but not the patcher or code itself

- Due to the old patcher and code based on BTW v4.8911,
  some features are not available in this release, and work like in the original BTW:
  - Bellows drops extra tanned leather when overpowered
  - Player still can eat on ladder and armor/boots don't affect movement speed
  - Chicken doesn't drop more feathers
  - Spider doesn't drop head
  - Zombie pigman doesn't drop head


v0.3a

- Updated to BTW v4.8911


v0.3

- New cauldron inventory GUI texture filename to support texture packs

- Changed axle texture filename to support texture packs better

- Added new heads names

- Changed version string

- Ported to Minecraft server!


v0.2

- Fixed furnace progress being reset on world load

- Cauldron GUI fire is now below the inventory slots

- Chance to drop flint when gravel is broken to piles

- Eating on the ladder is now dangerous

- Walking is faster with boots but slower with heavy armor

- Stoked cauldron can make glue from 8 bones or 24 bone meal

- Potash can be used as farmland or planter fertilizer

- Ladders are placeable on sidings

- Snow blocks are no longer heat-resistant

- Renamed shafts to rods

- Gearbox and pulley drop redstone latch instead of redstone dust when overpowered

- Bellows no longer joins tanned leather when overpowered

- Turntable drops clock instead of redstone when overpowered

- Lower hand crank clickable height

- Fixed soap, rope, padding and wicker block hardness

- Using invalid scrolls results in an explosion rather than crash

- Creepers are hurt when deoystered

- Seamless powered axle animated texture

- Block of Padding reduces fall damage

- Added spider, enderman, zombie pig, blaze heads


v0.1

- Furnace progress reset when item currently processing is replaced

- Cauldron, crucible have 9 slot inventory and indicate if the fire is stoked

- Jack-o-lantern is placed, pushed by pistons and dropped just like pumpkins,
  and if destroyed, tries to place a torch
  
- Dirt slab craftable to 2 dirt piles

- Ladder, wooden door, sign and sugar cane no longer stops lava
  (sign is a bit odd with updating, though)

- Saw won't touch pressure plates

- Chest, gearbox, note block, jukebox, door, trapdoor, fence gate, pulley,
  bellows, ladder, table, pedestal, column, bench, bookshelf, hopper,
  platform, barrel, axle and saw itself can be sawed with a bit of loss
