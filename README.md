![Screenshot of BTWTweak showing most of the new blocks and items](https://i.imgur.com/2AqGnYX.png)

[BTWTweak](http://grompe.org.ru/btwtweak/) is a mod that is intended to improve Better Than Wolves mod experience.

Assuming BTWTweak v0.9o and Better Than Wolves 4.A9,
(as of 25 Feb 2018) here is the list of changes.


# When launching Minecraft:

- (In some launchers may not work) a no-to-wolf icon for the program

- BTW and BTWTweak versions displayed in the corner of the main menu

- Controls configuration is now a scrollable list, and has a key binding for
  sprinting (default to Left Ctrl).

- Easy difficulty is selectable again, but resets to normal after restarting the
  game.

- Hardcore (permadeath) mode has optional hard difficulty, and normal otherwise.


# In the early game:

- Achievements are now technically possible in BTW. Ideally they need an
  overhaul but that's some future task.

- Spruce and jungle trees are now easier to break. This makes softer tree types
  more suited for crafting, while harder ones are best left for fuel.

- Tree trunk tops textures now correspond to the type of the tree instead of
  having oak texture, just like in later Minecraft versions. Stumps have correct
  textures as well.

- The wooden and stone pickaxes last for 2 and 7 uses respectively, and don't
  immediately expire when you try to attack mobs with them. This makes starting
  (and restarting) just a little bit less tedious, and may prevent death when
  pickaxe is only weapon you have.

- Stone and cobblestone breaks into loose rocks, which can be assembled together
  to make cobblestone slabs and cobblestone blocks. Stone tools are now made
  from loose rocks instead of cobblestone. This makes stone tools a bit cheaper,
  and the first furnace a bit more expensive to craft.

- (Feature now in BTW)
  The furnace now shows whether it is full. Since ores take forever to smelt,
  you probably want lots of furnaces, and now you don't have to click every
  single one to figure out which one has contents.

- When you dig gravel, sometimes you get a loose rock out of it. This makes
  shovel a viable choice for a first tool in order to get your first rocks.

- Flints appear only rarely in place of rocks when digging gravel and stone.
  This makes flint more valuable.

- Chests are now placeable next to each other, regardless of any adjacent
  double chests. Single chests will be merged to double chests as before. This
  allows configurations (especially together with hoppers) that were not
  possible before. Not being able to place a chest seemed like an arbitrary and
  awkward limitation. Placing a chest while sneaking allows to control which
  chest it combines with, or none at all.

- Eating on the ladder is now dangerous. Don't try shooting with a bow or
  blocking with a sword while on the ladder either. It felt like an exploit
  that you could eat while climbing ladders.

- Gloom has some nice visual effects, so you can be sure it's not that you go
  insane and beat yourself to death in complete darkness. It's something else.

- If you die, a gravestone will be placed nearby, if possible. If you destroy
  it, you only get one rock. This is so you can have memories of your death if
  you manage to find your past gravestone. This can be disabled in BTWTweak.cfg.

- If you play with "short" or "tiny" view distance, you will see the sun and the
  moon, since keeping track of time and moon phases are important parts of the
  gameplay. Fog distance has been pushed back like on "normal" view distance to
  let you see the ghasts that shoot at you in the nether.

- Some convenience crafting recipes, like dirt/sand/gravel slab to piles, two
  cobblestone/stonebrick slabs to full blocks, book from cut tanned leather,
  grinding sandstone back to sand and concentrated hellfire back to dust.

- A bunch of bugfixes. For example, you will no longer experience severe hunger
  loss while climbing a ladder. For a complete list of bug fixes, check the
  changelog.


# A bit further to the game:

- Seeds now root themselves when dropped on suitable ground. This makes some
  designs for farm automation possible in the mid game. Make sure not to lose
  your first elusive hemp seeds, though.

- Chickens now drop one more feather on average. This helps reduce their amount
  (and the lag caused) when you decide to breed them for arrows.

- Jack-o-lantern is now placed and dropped just like pumpkins, and if destroyed,
  attempts to place a torch. This is useful for lighting up ravines.
  Jack-o-lantern will go off underwater if facing water.
  
- Ladder, wooden door, sign and sugar cane no longer stops lava, so do not
  attempt this if you were abusing this before.

- It's now possible to jump out of boats and minecarts (and off pigs) without
  silly and somewhat unpredictable teleportation. This also could lead to
  interesting contraptions with jumping out of a speeding minecart.

- If you are lucky and manage to find a witch hut (and loot it without dying),
  you can use the cistern you find in it to craft a cauldron. Just add a bucket
  of water and a bone on top.

- Cauldron and crucible inventory has been reduced from 27 to 9 slots, and the
  interface now indicates if the fire underneath is stoked. If you want to
  process lots of items, you are encouraged to make automated builds that tilt
  the cauldron/crucible periodically with axle-supplied mechanical power.

- Creepers are now hurt when deoystered. Not so stoic anymore!

- Creeper hiss is now stopped immediately with killing or deoystering. Much more
  satisfying.

- Hand crank bounding box has been lowered to avoid accidental clicking and to
  conform to the shape better.

- Wearing boots now makes you walk faster, but added weight from heavy armor
  slows you down. Consider crafting boots first, it might help you escape death.

- Snow blocks are no longer heat-resistant and will melt in warmer biomes under
  the sun or when placed close enough to any other light source.

- Spider, enderman, zombie pigmen and blazes also have a chance to drop heads.
  Collect them all! Note that spider head is craftable to two spider eyes.

- Renaming items is now possible again, thanks to the new Writing Table block.
  It is crafted with a piece of paper on top of planks. You can even create name
  tags with it to name entities. Named entities will not despawn. You will need
  Ink and Quill, crafted with glass bottle, feather and ink sac; paper,
  and 1 experience level to rename stuff / make name tags.

- Name tags can also rename chests, furnaces, dispensers, brewing stands.

- Written Book recipe was also changed to require Ink and Quill.

- Ink and Quill can also be used to edit sign posts.

- Fishing hook can now catch items and other entities it couldn't before.

- Block of Padding now reduces fall damage, like a proper soft block.

- Cows and sheep heal when they eat grass. Punch them to teach them a lesson
  every once in a while.

- Silk, crafted from 9 string (and craftable back to string) can be used to
  store spider string in a more compact way.

- Now beds are made with 3 silk on top of 3 padding on top of 3 wooden slabs
  and it's possible to use beds and lie down to rest, and regenerate even when
  hungry. Regeneration rate is doubled and hunger rate is halved when resting.
  Obviously, beds won't skip the night and won't set your spawn point anymore.
  They also work in other dimensions.

- Diamond ingot recipe has been moved to the cauldron. Yep, this requires you to
  burn some wooden logs under the cauldron. This is more fitting for the now
  permanent nature of diamond ingots.

- Logs destroyed by fire now drop ash. Also wither skeletons drop ash. It can be
  used as a fertilizer.

- Wolves now respawn in forest biome (but not forest hills) like hostile mobs.
  This is mainly done to support long term servers, where no animals and wolves
  left for kilometers around. This can be disabled in BTWTweak.cfg.

- (Feature now in BTW)
  Sitting wolf cubs no longer teleport to player as they grow up.

- The void fog is gone. It was annoying.

- Dynamite is now lit with hold and thrown with release of a button. This makes
  throwing dynamite more precise and much more fun! This feature is dedicated to
  the good old Blood 3D game.

- Thrown rocks now destroy vases, and vases with blasting oil cause chain
  explosions.

- Note blocks that stand on top of companion cubes will make bark sound. It is
  now possible to recreate Dogsong in Minecraft.


# When you progress to the saw and tanned leather:

- Better microblocks: it's now possible to fill blocks to the next appropriate
  shape by placing corners, mouldings and sidings: corners can combine into
  mouldings, mouldings can combine with sidings to become stairs or with stairs
  to become full blocks, sidings can combine into full blocks. Better yet, you
  can see where exactly your microblocks will go and if they get merged!

- Sneaking now prevents falling from a rope. Rope climbing is much safer now. 

- Chest, gearbox, note block, jukebox, door, trapdoor, fence gate, pulley,
  bellows, ladder, bookshelf, hopper, platform, barrel, axle and saw, as well as
  decorative wooden blocks like pedestal, table, bench, column can be sawed
  with a bit of a loss. We all like recycling.

- The saw won't touch pressure plate you put in front of it. It was strange when
  it made it pop out.

- The saw won't break anymore when facing a wool block but will produce wool
  slabs.

- (Feature now in BTW)
  Ladders are now placeable on vertically put sidings, or any suitable surface
  for that matter, not just full blocks.

- Ladders try to place in the same orientation as a piece above it or below, if
  aiming at a side that cannot support ladder.

- Torches, buttons, ladders are now placeable on backsides of stairs.

- Buttons can now be placed on the top and bottom of the blocks. Unlike new
  versions of Minecraft, such buttons are symmetric. Also, the buttons are now
  placeable on any flat surface, not just full blocks.

- Loose rocks can be launched with a dispenser or a sling. The sling is crafted
  with a piece of cut tanned leather and two ropes on sides. Note that the price
  for throwing rocks manually is hunger, and the arc they make is not really
  suitable against the Ghasts.

- Thrown rocks will shatter glass blocks, or if something lands on them from
  a height.

- The turntable doesn't only make smoke and clicks now, it spins visually!

- Hardcore Packing with pistons now applies to loose rocks, which makes
  cobblestone, and ender pearls, which makes ender blocks.

- New enchantment: Velocity. Applied to boots, and each level of it increases
  walking speed by 10%, up to 30%. Ocelots rarely drop Arcane Scrolls of
  Velocity, and also level 1 of that enchantment can be found in trades or made
  in vanilla enchanter.

- Hard-boiled eggs can be made from raw eggs in a cauldron. Complementary to
  this, if you place an egg on a padding block with an active light block above,
  it will hatch. This allows you to control the end result of eggs precisely.

- Storage blocks for Wheat, Diamond Ingot, Coal, Charcoal, Coal Dust,
  Nethercoal, Sugar, Bone, Nitre, Potash, Ash, Flour (requires 9 of each).
  All of them can be retrieved by crafting back to items.
  Block of Bone can be only crafted by Hardcore Packing.

- (Feature now in BTW)
  Block of Flesh, squishy block made of 9 Rotten Flesh by Hardcore Packing and
  uncrafted by hand.

- Block of Sawdust, made of 16 Sawdust by Hardcore Packing and uncrafted by saw.

- Block of Slime, sticky transparent block made of 9 slimeballs. Note that it
  doesn't affect piston mechanics like it does in later versions of Minecraft.

- Redstone and Lapis are now handled by Hardcore Packing, and all of the
  above storage blocks.

- Small BTW fixes such as correct soap, rope, padding and wicker block hardness;
  Gloom now consumes player's meat, mycelium and huge mushroom blocks no longer
  show swirling True Sight particles, even though mobs cannot spawn on them.
  

# When you get access to stoked fire:

- Rails in abandoned mineshafts are rusted and won't give as much of iron
  anymore. If you need lots of iron, you need a mob trap.

- On the other hand, ores are still relevant because cooking them in the Kiln
  doubles the nugget output.

- Potash and ash can be used as a fertilizer for farmland or planter. It can
  simply be dropped on the top of the block, like bonemeal.

- Stoked cauldron can make glue from 64 bone meal.

- Wool blocks can be boiled in a stoked cauldron to retrieve components.

- Piston can be melted down in a stoked crucible to retrieve metallic
  components. More recycling!

- Charcoal texture has been backported the from newer Minecraft versions.

- It is no longer possible to escape through the roof of Nether.


# When you find a village:

- (Similar feature now in BTW)
  Villagers now display newest offers in the beginning of the list rather than
  the end, to put an end to constant scrolling through offers.


# Late game:

- Cobblestone and stone drop in cobblestone blocks if destroyed by a soulforged
  tool. Like in good old times.

- The effect of swiftness potion is restored. How to obtain it is left for the
  player to discover.


# And finally, some general goodness:

- Scoreboard sidebar is now shown only when player list (Tab) key is held.

- Pressing Space (jump key) takes all items from a container. Complex slots such
  as crafting ones are untouched.

- Pressing the hotbar key of already selected slot will cycle items in the
  corresponding inventory column. This is configurable in BTWTweak.cfg.

- /playtime command that can be used to track the age of the world, and how
  long you've kept being alive.

- New key shortcut, default on R, to open the chat with "/tell " + last told
  username so you can chat easily in private.

- Sign posts now accept unicode characters.

- Chat now accepts IME input and messages can be 256 characters long.

- Improved font display for latin and cyrillic scripts when unicode font
  is chosen. That includes a fix for wider characters.

- Removed the annoying inventory shift when player has effects/buffs.
  It was getting unbearable when running in and outside of a beacon range.

- If you install over CraftGuide, it will be patched so it works from the
  inventory screen and compass and clock stop displaying real data in its GUI.

- When disconnecting, the player entity is removed only after 60 ticks
  (3 seconds). This prevents exploiting initial invulnerability by
  repeatedly disconnecting and connecting in dangerous situations.
  Make sure to disconnect only when safe from now on.


# Concerns, suggestions, feedback?

Go to the chat: http://chat.grompe.org.ru/#mcmoddev

Minecraft Forum discussion: http://www.minecraftforum.net/forums/mapping-and-modding/minecraft-mods/1290803-better-than-wolves-btwtweak-v0-9b-with-slings-and

# Useful links

Changelog: https://raw.github.com/grompe/BTWTweak/master/patcher/readme.txt

MCP 7.51 download link: http://www.mediafire.com/download/95vlzp1a4n4wjqw/mcp751.zip

BTW download link: http://www.minecraftforum.net/forums/mapping-and-modding/minecraft-mods/1272992-btw
(first MediaFire link in the post)

Minecraft 1.5.2 download link: http://s3.amazonaws.com/Minecraft.Download/versions/1.5.2/1.5.2.jar
Minecraft 1.5.2 server download link: http://s3.amazonaws.com/Minecraft.Download/versions/1.5.2/minecraft_server.1.5.2.jar

Libraries download links:  
https://libraries.minecraft.net/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar  
https://libraries.minecraft.net/org/lwjgl/lwjgl/lwjgl/2.9.1/lwjgl-2.9.1.jar  
https://libraries.minecraft.net/org/lwjgl/lwjgl/lwjgl_util/2.9.1/lwjgl_util-2.9.1.jar  

Natives for Windows:  
https://libraries.minecraft.net/net/java/jinput/jinput-platform/2.0.5/jinput-platform-2.0.5-natives-windows.jar  
https://libraries.minecraft.net/org/lwjgl/lwjgl/lwjgl-platform/2.9.1/lwjgl-platform-2.9.1-natives-windows.jar  

Natives for Linux:  
https://libraries.minecraft.net/net/java/jinput/jinput-platform/2.0.5/jinput-platform-2.0.5-natives-linux.jar  
https://libraries.minecraft.net/org/lwjgl/lwjgl/lwjgl-platform/2.9.1/lwjgl-platform-2.9.1-natives-linux.jar  

Natives for OS X:  
https://libraries.minecraft.net/net/java/jinput/jinput-platform/2.0.5/jinput-platform-2.0.5-natives-osx.jar  
https://libraries.minecraft.net/org/lwjgl/lwjgl/lwjgl-platform/2.9.1/lwjgl-platform-2.9.1-natives-osx.jar  

---

# Source installation instructions

1. Unpack MCP 7.51
2. Install BTW into 1.5.2 minecraft.jar
3. Place minecraft.jar, jinput.jar, lwjgl.jar, lwjgl_util.jar into ./jars/bin/ directory,
   and natives (.dll or .so or .jnilib files) into ./jars/bin/natives/ directory
4. Decompile with MCP, it will complain a bit
5. Apply MCP fix patch using the mcp_fix.diff file:
   patch -p 1 -i mcp_fix.diff
   If you have trouble with patch.exe crashing on Windows,
   use the one from Git distribution or make changes by hand.
6. Run MCP updatemd5
7. backup the ./temp/client.md5 file
8. Run MCP cleanup
9. Install BTWTweak into minecraft.jar with BTW
10. Decompile with MCP again
11. Apply MCP fix again
12. put back the saved ./temp/client.md5 file
13. If working with BTW version BTW v4.AAAAAAAAAAHHHH or newer, delete dummy ./tweakres/FC\*.\* files
14. Copy ./tweakres/\*.\* directory contents to your ./bin/minecraft/ directory
15. Copy ./tweaksrc/\*.java files to your ./src/minecraft/net/minecraft/src/ directory

Now you can modify source, MCP recompile and play using MCP startclient!

# Binary installation instruction

1. Follow the Source installation instructions
2. MCP recompile, then MCP reobfuscate
3. Insert all ./reobf/minecraft/GPE\*.class files into patcher/GPEBTWTweak_files.zip
4. If you added/modified textures, put them back to ./tweakres/ directory
5. Insert all ./tweakres/\*.\* files into patcher/GPEBTWTweak_files.zip
6. Compile the patcher if you haven't yet: "javac BTWTweaker.java CliPatcher.java"
7. Repackage the patcher: "jar cvfe BTWTweak.jar CliPatcher \*"

Now you have BTWTweak.jar!
