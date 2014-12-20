Grom PE's Better Than Wolves Total Conversion tweak mod v0.8
(Compatible with Better Than Wolves V4.8911+)

[********** Change Log ************]

v0.8a

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
