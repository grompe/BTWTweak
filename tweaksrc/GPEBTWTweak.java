package net.minecraft.src;

import net.minecraft.client.Minecraft;
import net.minecraft.server.MinecraftServer;

import java.util.*;
import java.io.*;
import java.lang.reflect.*;

public class GPEBTWTweak extends FCAddOn
{
  public static GPEBTWTweak instance;
  private static GPEBTWTweakProxy proxy;
  public static String tweakVersion = "0.9m";

  private static boolean postPostInitialized = false;
  public static boolean isDecoPresent;
  public static Item decoGlassShard = null;

  public static Block gpeBlockStone;
  public static Block compatAxleBlock;
  public static Block gpeBlockGravestone;
  public static Block gpeBlockRustedRail;
  public static Block gpeBlockRename;
  public static Block gpeBlockDiamondIngot;
  public static Block gpeBlockHayBale;
  public static Block gpeBlockSoap;
  public static Block gpeBlockStorage;
  public static Block gpeBlockFlesh;
  public static Block gpeBlockSlime;

  public static Item gpeItemLooseRock;
  public static Item gpeItemSilk;
  public static Item gpeItemAsh;
  public static Item gpeItemQuill;
  public static Item gpeItemNameTag;
  public static Item gpeItemSling;
  public static Item gpeItemHardBoiledEgg;
  public static Item gpeItemBlockStorage;

  public static int hotbarCycling = 1;
  public static int hcSpawnRadius = 2000;
  public static int hcSpawnRadiusAdjSq = 2250*2250;
  public static int hcSpawnRadiusAdjPSq = 2500*2500;
  public static int hcSpawnRadiusAdj2Sq = 3000*3000;
  public static int minFogDistance = 128;
  public static boolean spawnWolvesInForests = isBTWVersionOrNewer("4.99999A0F");
  public static boolean writeDebugTextures = false;
  public static boolean btwBone = isBTWVersionOrNewer("4.A3 Headed Beastie");
  public static boolean btwFlesh = isBTWVersionOrNewer("4.A4 Kiloblock Boon");
  public static boolean btwSmoothstoneStairs = isBTWVersionOrNewer("4.A7 Squid A Swimming");

  public static int gpeLooseRockID = 17000;
  public static int gpeSilkID = 17001;
  public static int gpeAshID = 17002;
  public static int gpeQuillID = 17003;
  public static int gpeNameTagID = 17004;
  public static int gpeSlingID = 17005;
  public static int gpeHardBoiledEggID = 17006;
  public static int gpeBlockGravestoneID = 163;
  public static int gpeBlockRustedRailID = 164;
  public static int gpeBlockRenameID = 162;
  public static int gpeBlockDiamondIngotID = 3007;
  public static int gpeBlockHayBaleID = 3025;
  public static int gpeBlockSoapID = 1700;
  public static int gpeBlockStorageID = 1701;
  public static int gpeBlockFleshID = 1702;
  public static int gpeBlockSlimeID = 1703;
  public static int gpeEntityRockID = 25;
  public static int gpeEnchantmentHaste = 70;
  public static int gpeEntityRockVehicleSpawnType = 120;
  public static int gpeStrataRegenKey = 0;
  public static String gpeStrataRegenWorldName = null;

  public static Map<Long, Integer> chunkRegenInfo;

  public GPEBTWTweak()
  {
    instance = this;
  }

  public void Initialize()
  {
    FCAddOnHandler.LogMessage("Grom PE's BTWTweak v" + tweakVersion + " is now going to tweak the hell out of this.");
    try
    {
      Class.forName("net.minecraft.client.Minecraft");
      proxy = new GPEBTWTweakProxyClient();
    }
    catch(ClassNotFoundException e)
    {
      proxy = new GPEBTWTweakProxy();
    }
    File config = new File(proxy.getConfigDir(), "BTWTweak.cfg");

    chunkRegenInfo = new HashMap<Long, Integer>();

    try
    {
      BufferedReader br = new BufferedReader(new FileReader(config));
      String line, key, value;
      while ((line = br.readLine()) != null)
      {
        String[] tmp = line.split("=");
        if (tmp.length < 2) continue;
        key = tmp[0].trim();
        value = tmp[1].trim();

        if (key.equals("hotbarCycling")) hotbarCycling = Math.max(0, Math.min(5, Integer.parseInt(value)));
        if (key.equals("hcSpawnRadius")) hcSpawnRadius = Integer.parseInt(value);
        if (key.equals("minFogDistance")) minFogDistance = Math.min(256, Integer.parseInt(value));
        if (key.equals("spawnWolvesInForests")) spawnWolvesInForests = Integer.parseInt(value) > 0;
        if (key.equals("writeDebugTextures")) writeDebugTextures = Integer.parseInt(value) > 0;

        if (key.equals("gpeLooseRockID")) gpeLooseRockID = Integer.parseInt(value);
        if (key.equals("gpeSilkID")) gpeSilkID = Integer.parseInt(value);
        if (key.equals("gpeAshID")) gpeAshID = Integer.parseInt(value);
        if (key.equals("gpeQuillID")) gpeQuillID = Integer.parseInt(value);
        if (key.equals("gpeNameTagID")) gpeNameTagID = Integer.parseInt(value);
        if (key.equals("gpeSlingID")) gpeSlingID = Integer.parseInt(value);
        if (key.equals("gpeHardBoiledEggID")) gpeHardBoiledEggID = Integer.parseInt(value);
        if (key.equals("gpeBlockGravestoneID")) gpeBlockGravestoneID = Integer.parseInt(value);
        if (key.equals("gpeBlockRustedRailID")) gpeBlockRustedRailID = Integer.parseInt(value);
        if (key.equals("gpeBlockRenameID")) gpeBlockRenameID = Integer.parseInt(value);
        if (key.equals("gpeBlockDiamondIngotID")) gpeBlockDiamondIngotID = Integer.parseInt(value);
        if (key.equals("gpeBlockHayBaleID")) gpeBlockHayBaleID = Integer.parseInt(value);
        if (key.equals("gpeBlockSoapID")) gpeBlockSoapID = Integer.parseInt(value);
        if (key.equals("gpeBlockStorageID")) gpeBlockStorageID = Integer.parseInt(value);
        if (key.equals("gpeBlockFleshID")) gpeBlockFleshID = Integer.parseInt(value);
        if (key.equals("gpeBlockSlimeID")) gpeBlockSlimeID = Integer.parseInt(value);
        if (key.equals("gpeEntityRockID")) gpeEntityRockID = Integer.parseInt(value);
        if (key.equals("gpeEnchantmentHaste")) gpeEnchantmentHaste = Integer.parseInt(value);
        if (key.equals("gpeEntityRockVehicleSpawnType")) gpeEntityRockVehicleSpawnType = Integer.parseInt(value);
        if (key.equals("gpeStrataRegenKey")) gpeStrataRegenKey = Integer.parseInt(value);
        if (key.equals("gpeStrataRegenWorldName")) gpeStrataRegenWorldName = value;

      }
      br.close();
    }
    catch (FileNotFoundException e)
    {
      String defaultConfig = ""
        + "// **** BTWTweak Settings ****\r\n"
        + "// Delete this file so it is recreated with default values (and new settings if you've updated BTWTweak).\r\n"
        + "\r\n"
        + "// Inventory column cycling when pressing hotbar key twice.\r\n"
        + "// 0 = turn off, 1 = adaptive, 2 = two slots, 3 = three slots, 4 = four slots, 5 = only fill empty slot\r\n"
        + "\r\n"
        + "hotbarCycling=1\r\n"
        + "\r\n"
        + "// Hardcore Spawn radius, in blocks. Increasing it will make structures affected at further radius as well.\r\n"
        + "// Decreasing it won't make populated villages or anything of the sort closer to the spawn.\r\n"
        + "// Maximum value: 46340\r\n"
        + "\r\n"
        + "hcSpawnRadius=2000\r\n"
        + "\r\n"
        + "// Minimum fog distance, in blocks. 256 = far, 128 = normal, 64 = short, 0 to revert to original behavior.\r\n"
        + "// 128+ keeps ghasts visible on short, 64+ keeps sun/moon visible on tiny render distance.\r\n"
        + "\r\n"
        + "minFogDistance=128\r\n"
        + "\r\n"
        + "// Spawn (and despawn) wild wolves in forest biome, to balance them being subject to Hardcore Hunger.\r\n"
        + "\r\n"
        + (isBTWVersionOrNewer("4.99999A0F") ? "spawnWolvesInForests=1\r\n" : "spawnWolvesInForests=0\r\n")
        + "\r\n"
        + "// Whether to write debug.stitched_*.png files. Slows down the game startup.\r\n"
        + "\r\n"
        + "writeDebugTextures=0\r\n"
        + "\r\n"
        + "// **** Item IDs ****\r\n"
        + "\r\n"
        + "gpeLooseRockID=17000\r\n"
        + "gpeSilkID=17001\r\n"
        + "gpeAshID=17002\r\n"
        + "gpeQuillID=17003\r\n"
        + "gpeNameTagID=17004\r\n"
        + "gpeSlingID=17005\r\n"
        + "gpeHardBoiledEggID=17006\r\n"
        + "\r\n"
        + "// **** Block IDs ****\r\n"
        + "\r\n"
        + "// gpeBlockGravestoneID can be 0 to disable placement of gravestones\r\n"
        + "gpeBlockGravestoneID=163\r\n"
        + "gpeBlockRustedRailID=164\r\n"
        + "gpeBlockRenameID=162\r\n"
        + "// don't change gpeBlockDiamondIngotID if Deco Add-On is present\r\n"
        + "gpeBlockDiamondIngotID=3007\r\n"
        + "// don't change gpeBlockHayBaleID if Deco Add-On is present\r\n"
        + "gpeBlockHayBaleID=3025\r\n"
        + "gpeBlockSoapID=1700\r\n"
        + "gpeBlockStorageID=1701\r\n"
        + "gpeBlockFleshID=1702\r\n"
        + "gpeBlockSlimeID=1703\r\n"
        + "\r\n"
        + "// **** Entity IDs ****\r\n"
        + "\r\n"
        + "gpeEntityRockID=35\r\n"
        + "\r\n"
        + "// **** Other IDs ****\r\n"
        + "\r\n"
        + "gpeEnchantmentHaste=70\r\n"
        + "gpeEntityRockVehicleSpawnType=120\r\n"
        + "\r\n"
        + "// **** World strata regeneration ****\r\n"
        + "\r\n"
        + "// To use, set key to non-zero and name of the world you want to process\r\n"
        + "gpeStrataRegenKey=0\r\n"
        + "gpeStrataRegenWorldName=???\r\n"
        + "";
      try
      {
        FileOutputStream fo = new FileOutputStream(config);
        fo.write(defaultConfig.getBytes());
        fo.close();
      }
      catch (IOException e2)
      {
        FCAddOnHandler.LogMessage("Error while writing default BTWTweak.cfg!");
        e2.printStackTrace();
      }
    }
    catch (IOException e)
    {
      FCAddOnHandler.LogMessage("Error while reading BTWTweak.cfg!");
      e.printStackTrace();
    }
    // GitHub [#1]: fcBlockAxle got changed to fcAxleBlock
    try
    {
      try
      {
        compatAxleBlock = (Block)FCBetterThanWolves.class.getField("fcAxleBlock").get(null);
      }
      catch (NoSuchFieldException e)
      {
        compatAxleBlock = (Block)FCBetterThanWolves.class.getField("fcBlockAxle").get(null);
      }
    }
    catch (Exception e)
    {
      FCAddOnHandler.LogMessage("Error while retrieving Axle Block, assuming ID=247");
      compatAxleBlock = Block.blocksList[247];
    }

    isDecoPresent = classExists("AddonManager");
    if (!isDecoPresent && !isBTWVersionOrNewer("4.A4 Kiloblock Boon")) extendBlockIDs();

    hcSpawnRadiusAdjSq = Math.max((int)(hcSpawnRadius*hcSpawnRadius*1.265625F), 2250*2250);
    hcSpawnRadiusAdjPSq = Math.max((int)(hcSpawnRadius*hcSpawnRadius*1.5625F), 2500*2500);
    if (isBTWVersionOrNewer("4.99999A0C Marsupial?!"))
    {
      hcSpawnRadiusAdj2Sq = Math.max((int)(hcSpawnRadius*hcSpawnRadius*2.25F), 3000*3000);
    } else {
      hcSpawnRadiusAdj2Sq = Math.max((int)(hcSpawnRadius*hcSpawnRadius*1.890625F), 2750*2750);
    }

    Block.blocksList[1] = null;  gpeBlockStone = new GPEBlockStone(1);
    Block.blocksList[4] = null;  new GPEBlockCobblestone(4);
    Block.blocksList[13] = null; new GPEBlockGravel(13);
    Block.blocksList[14] = null; (new GPEBlockOre(14)).setUnlocalizedName("oreGold");
    Block.blocksList[15] = null; (new GPEBlockOre(15)).setUnlocalizedName("oreIron");
    Block.blocksList[17] = null; new GPEBlockLog(17);
    Block.blocksList[20] = null; new GPEBlockGlass(20);
    Block.blocksList[54] = null; new GPEBlockChest(54);
    Block.blocksList[65] = null; new GPEBlockLadder(65);
    Block.blocksList[79] = null; new GPEBlockIce(79);
    Block.blocksList[80] = null; new GPEBlockSnowBlock(80);
    Block.blocksList[86] = null; new GPEBlockPumpkin(86, false);
    Block.blocksList[91] = null; new GPEBlockPumpkin(91, true);
    //Block.blocksList[compatAxleBlock.blockID] = null; compatAxleBlock = new GPEBlockAxle(compatAxleBlock.blockID);

    Item.m_bSuppressConflictWarnings = true;
    FCBetterThanWolves.fcPotash = new GPEItemPotash(FCBetterThanWolves.fcPotash.itemID - 256);
    FCBetterThanWolves.fcDynamite = new GPEItemDynamite(FCBetterThanWolves.fcDynamite.itemID - 256);
    gpeItemLooseRock = new GPEItemLooseRock(gpeLooseRockID - 256);
    gpeItemSilk = new Item(gpeSilkID - 256).setUnlocalizedName("gpeItemSilk").setCreativeTab(CreativeTabs.tabMaterials).SetBuoyancy(1.0F).SetBellowsBlowDistance(2);
    gpeItemAsh = new GPEItemPotash(gpeAshID - 256).setUnlocalizedName("gpeItemAsh");
    gpeItemQuill = new GPEItemQuill(gpeQuillID - 256);
    gpeItemNameTag = new GPEItemNameTag(gpeNameTagID - 256);
    gpeItemSling = new GPEItemSling(gpeSlingID - 256);
    gpeItemHardBoiledEgg = new FCItemFood(gpeHardBoiledEggID - 256, 3, 0.25F, false, "gpeItemHardBoiledEgg");
    Item.coal = new GPEItemCoal(7);
    Item.pickaxeWood = (new GPEItemPickaxeWeak(14, EnumToolMaterial.WOOD)).setUnlocalizedName("pickaxeWood");
    Item.pickaxeStone = (new GPEItemPickaxeWeak(18, EnumToolMaterial.STONE)).setUnlocalizedName("pickaxeStone");
    Item.m_bSuppressConflictWarnings = false;

    int id = FCBetterThanWolves.fcAestheticOpaque.blockID;
    Block.blocksList[id] = null;
    new GPEBlockAestheticOpaque(id);

    id = FCBetterThanWolves.fcBlockDirtSlab.blockID;
    Block.blocksList[id] = null;
    new GPEBlockDirtSlab(id);

    if (gpeBlockGravestoneID != 0)
    {
      gpeBlockGravestone = Itemize(new GPEBlockGravestone(gpeBlockGravestoneID));
    }
    gpeBlockRustedRail = Itemize(new GPEBlockRustedRail(gpeBlockRustedRailID));
    gpeBlockRename = Itemize(new GPEBlockRename(gpeBlockRenameID));
    if (!isDecoPresent || !classExists("Addon_Diamondium"))
    {
      gpeBlockDiamondIngot = Itemize(new GPEBlockDiamondIngot(gpeBlockDiamondIngotID));
    }
    if (!isDecoPresent || !classExists("Addon_HayBale"))
    {
      gpeBlockHayBale = Itemize(new GPEBlockHayBale(gpeBlockHayBaleID));
    }
    gpeBlockSoap = Itemize(new GPEBlockSoap(gpeBlockSoapID));
    gpeBlockStorage = new GPEBlockStorage(gpeBlockStorageID);
    gpeItemBlockStorage = new GPEItemBlockStorage(gpeBlockStorageID - 256, gpeBlockStorage);
    gpeBlockFlesh = Itemize(new GPEBlockFlesh(gpeBlockFleshID));
    gpeBlockSlime = Itemize(new GPEBlockSlime(gpeBlockSlimeID));

    if (isBTWVersionOrNewer("4.A2 Timing Rodent"))
    {
      FCBetterThanWolves.fcItemStumpRemover.setMaxStackSize(64);
    }
    
    new GPEEnchantmentHaste(gpeEnchantmentHaste);

    TileEntity.ReplaceVanillaMapping(FCTileEntityChest.class, GPETileEntityChest.class, "Chest");
    TileEntity.addMapping(GPETileEntityRename.class, "Rename");

    EntityList.addMapping(GPEEntityRock.class, "gpeEntityRock", gpeEntityRockID);
    proxy.addEntityRenderers();

    if (isBTWVersionOrNewer("4.99999A0D Marsupial??!!"))
    {
      FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcItemPileGravel, 2), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockSlabFalling, 1, 0)});
      FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcItemPileSand, 2), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockSlabFalling, 1, 1)});
      // Old to new item conversion
      FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcBlockSlabFalling, 1, 0), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 6)});
      FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcBlockSlabFalling, 1, 1), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 7)});
    } else {
      FCRecipes.AddVanillaRecipe(new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 4, 6), new Object[] {"##", '#', new ItemStack(Block.gravel)});
      FCRecipes.AddVanillaRecipe(new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 6), new Object[] {"##", '#', new ItemStack(FCBetterThanWolves.fcItemPileGravel)});
      FCRecipes.AddVanillaRecipe(new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 4, 7), new Object[] {"##", '#', new ItemStack(Block.sand)});
      FCRecipes.AddVanillaRecipe(new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 7), new Object[] {"##", '#', new ItemStack(FCBetterThanWolves.fcItemPileSand)});
      FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcItemPileGravel, 2), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 6)});
      FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcItemPileSand, 2), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 7)});
    }
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Block.gravel), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 6), new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 6)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Block.sand), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 7), new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 7)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcItemPileDirt, 2), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockDirtSlab)});
    FCRecipes.AddStokedCauldronRecipe(new ItemStack(FCBetterThanWolves.fcGlue, 1), new ItemStack[] {new ItemStack(Item.dyePowder, 64, 15)});

    if (isBTWVersionOrNewer("4.891124"))
    {
      int i;
      for (i = 0; i < 16; i++)
      {
        FCRecipes.AddStokedCauldronRecipe(
          new ItemStack[]
          {
            new ItemStack(FCBetterThanWolves.fcItemWool, 4, 15 - i),
            new ItemStack(FCBetterThanWolves.fcAestheticOpaque, 1, 0)
          },
          new ItemStack[] {new ItemStack(Block.cloth, 1, i)});
      }
    }

    FCRecipes.RemoveVanillaRecipe(new ItemStack(Item.axeStone), new Object[] {"X ", "X#", " #", '#', Item.stick, 'X', Block.cobblestone});
    FCRecipes.AddVanillaRecipe(new ItemStack(Item.axeStone), new Object[] {"X ", "X#", " #", '#', Item.stick, 'X', gpeItemLooseRock});
    FCRecipes.RemoveVanillaRecipe(new ItemStack(Item.pickaxeStone), new Object[] {"XXX", " # ", " # ", '#', Item.stick, 'X', Block.cobblestone});
    FCRecipes.AddVanillaRecipe(new ItemStack(Item.pickaxeStone), new Object[] {"XXX", " # ", " # ", '#', Item.stick, 'X', gpeItemLooseRock});
    FCRecipes.RemoveVanillaRecipe(new ItemStack(Item.shovelStone), new Object[] {"X", "#", "#", '#', Item.stick, 'X', Block.cobblestone});
    FCRecipes.AddVanillaRecipe(new ItemStack(Item.shovelStone), new Object[] {"X", "#", "#", '#', Item.stick, 'X', gpeItemLooseRock});
    FCRecipes.RemoveVanillaRecipe(new ItemStack(Block.lever, 1), new Object[] {"X", "#", "r", '#', Block.cobblestone, 'X', Item.stick, 'r', Item.redstone});
    FCRecipes.AddVanillaRecipe(new ItemStack(Block.lever, 1), new Object[] {"X", "#", "r", '#', gpeItemLooseRock, 'X', Item.stick, 'r', Item.redstone});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Block.cobblestone), new Object[] {gpeItemLooseRock, gpeItemLooseRock, gpeItemLooseRock, gpeItemLooseRock});
    FCRecipes.AddVanillaRecipe(new ItemStack(Block.stoneSingleSlab, 1, 3), new Object[] {"XX", 'X', gpeItemLooseRock});

    // Slab joining back to full blocks
    if (!isBTWVersionOrNewer("4.A Dingo"))
    {
      FCRecipes.AddVanillaRecipe(new ItemStack(Block.cobblestone), new Object[] {"X", "X", 'X', new ItemStack(Block.stoneSingleSlab, 1, 3)});
      FCRecipes.AddVanillaRecipe(new ItemStack(Block.brick), new Object[] {"X", "X", 'X', new ItemStack(Block.stoneSingleSlab, 1, 4)});
      FCRecipes.AddVanillaRecipe(new ItemStack(Block.stoneBrick), new Object[] {"X", "X", 'X', new ItemStack(Block.stoneSingleSlab, 1, 5)});
    }
    if (!isBTWVersionOrNewer("4.A2 Timing Rodent"))
    {
      FCRecipes.AddVanillaRecipe(new ItemStack(Block.netherBrick), new Object[] {"X", "X", 'X', new ItemStack(Block.stoneSingleSlab, 1, 6)});
    }
    FCRecipes.AddVanillaRecipe(new ItemStack(FCBetterThanWolves.fcAestheticOpaque, 1, 10), new Object[] {"X", "X", 'X', new ItemStack(FCBetterThanWolves.fcAestheticNonOpaque, 1, 10)});

    FCRecipes.AddVanillaRecipe(new ItemStack(gpeItemSilk, 1), new Object[] {"###", "###", "###", '#', Item.silk});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Item.silk, 9), new Object[] {new ItemStack(gpeItemSilk)});

    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Item.book, 1), new Object[] {Item.paper, Item.paper, Item.paper, FCBetterThanWolves.fcItemTannedLeatherCut});

    if (isBTWVersionOrNewer("4.A2 Timing Rodent"))
    {
      FCRecipes.AddStokedCrucibleRecipe(new ItemStack[] {new ItemStack(Item.goldNugget, 2), new ItemStack(FCBetterThanWolves.fcItemNuggetIron, 6)}, new ItemStack[] {new ItemStack(Block.pistonBase, 1)});
      FCRecipes.AddStokedCrucibleRecipe(new ItemStack[] {new ItemStack(Item.goldNugget, 2), new ItemStack(FCBetterThanWolves.fcItemNuggetIron, 6)}, new ItemStack[] {new ItemStack(Block.pistonStickyBase, 1)});
      // Change rails and iron bars to smelt by one
      FCCraftingManagerCrucibleStoked.getInstance().RemoveRecipe(new ItemStack(FCBetterThanWolves.fcItemNuggetIron, 18), new ItemStack[] {new ItemStack(Block.rail, 8)});
      FCCraftingManagerCrucibleStoked.getInstance().RemoveRecipe(new ItemStack(FCBetterThanWolves.fcItemNuggetIron, 18), new ItemStack[] {new ItemStack(Block.fenceIron, 8)});
      FCRecipes.AddStokedCrucibleRecipe(new ItemStack(FCBetterThanWolves.fcItemNuggetIron, 2), new ItemStack[] {new ItemStack(Block.rail)});
      FCRecipes.AddStokedCrucibleRecipe(new ItemStack(FCBetterThanWolves.fcItemNuggetIron, 2), new ItemStack[] {new ItemStack(Block.fenceIron)});
    } else {
      Item pistonCore = isBTWVersionOrNewer("4.89666") ? Item.ingotIron : FCBetterThanWolves.fcSteel;
      FCRecipes.AddStokedCrucibleRecipe(new ItemStack[] {new ItemStack(Item.goldNugget, 3), new ItemStack(pistonCore, 1)}, new ItemStack[] {new ItemStack(Block.pistonBase, 1)});
      FCRecipes.AddStokedCrucibleRecipe(new ItemStack[] {new ItemStack(Item.goldNugget, 3), new ItemStack(pistonCore, 1)}, new ItemStack[] {new ItemStack(Block.pistonStickyBase, 1)});
    }

    FCRecipes.RemoveShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcItemIngotDiamond), new Object[] {new ItemStack(Item.ingotIron), new ItemStack(Item.diamond), new ItemStack(FCBetterThanWolves.fcItemCreeperOysters)});
    FCRecipes.AddCauldronRecipe(new ItemStack(FCBetterThanWolves.fcItemIngotDiamond), new ItemStack[] {new ItemStack(Item.ingotIron), new ItemStack(Item.diamond), new ItemStack(FCBetterThanWolves.fcItemCreeperOysters)});

    FCRecipes.RemoveVanillaRecipe(new ItemStack(Item.bed, 1), new Object[] {"###", "XXX", '#', Block.cloth, 'X', Block.planks});
    FCRecipes.RemoveVanillaRecipe(new ItemStack(Item.bed, 1), new Object[] {"###", "XXX", '#', FCBetterThanWolves.fcPadding, 'X', Block.planks});
    FCRecipes.AddVanillaRecipe(new ItemStack(Item.bed, 1), new Object[] {"sss", "ppp", "www", 's', gpeItemSilk, 'p', FCBetterThanWolves.fcPadding, 'w', Block.woodSingleSlab});

    if (isBTWVersionOrNewer("4.A3 Headed Beastie"))
    {
      FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Item.spiderEye, 2), new Object[] {new ItemStack(Item.skull.itemID, 1, 9)});
    } else {
      FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Item.spiderEye, 2), new Object[] {new ItemStack(Item.skull.itemID, 1, 5)});
    }
	
    FCRecipes.AddVanillaRecipe(new ItemStack(FCBetterThanWolves.fcCauldron, 1), new Object[] {"Y", "X", "C", 'Y', Item.bone, 'X', Item.bucketWater, 'C', Item.cauldron});

    // Rename station
    FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockRename, 1), new Object[] {"#", "X", '#', Item.paper, 'X', Block.planks});
    // Quill support
    FCRecipes.RemoveShapelessVanillaRecipe(new ItemStack(Item.writableBook, 1), new Object[] {new ItemStack(Item.book), new ItemStack(Item.dyePowder, 1, 0), new ItemStack(Item.feather)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(gpeItemQuill, 1), new Object[] {new ItemStack(Item.glassBottle), new ItemStack(Item.dyePowder, 1, 0), new ItemStack(Item.feather)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Item.writableBook, 1), new Object[] {new ItemStack(Item.book), new ItemStack(gpeItemQuill)});

    FCRecipes.AddVanillaRecipe(new ItemStack(gpeItemSling, 1), new Object[] {"RXR", 'R', FCBetterThanWolves.fcRopeItem, 'X', FCBetterThanWolves.fcItemTannedLeatherCut});

    // Allow grinding hellfire back to dust
    FCRecipes.AddMillStoneRecipe(new ItemStack(FCBetterThanWolves.fcHellfireDust, 8), new ItemStack(FCBetterThanWolves.fcConcentratedHellfire));
    // Sandstone is weak enough to grind back to sand
    FCRecipes.AddMillStoneRecipe(new ItemStack(FCBetterThanWolves.fcItemPileSand, 16), new ItemStack(Block.sandStone, 1, 32767));
    FCRecipes.AddMillStoneRecipe(new ItemStack(FCBetterThanWolves.fcItemPileSand, 12), new ItemStack(Block.stairsSandStone));
    FCRecipes.AddMillStoneRecipe(new ItemStack(FCBetterThanWolves.fcItemPileSand, 8), new ItemStack(Block.stoneSingleSlab, 1, 1));

    // Rusted rails give 6.75 times less iron when melted
    FCRecipes.AddStokedCrucibleRecipe(new ItemStack(FCBetterThanWolves.fcItemNuggetIron), new ItemStack[] {new ItemStack(gpeBlockRustedRail, 2)});

    // Real hard-boiled eggs!
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcItemHamAndEggs, 2), new Object[] {new ItemStack(gpeItemHardBoiledEgg), new ItemStack(Item.porkCooked)});
    FCRecipes.AddCauldronRecipe(new ItemStack(gpeItemHardBoiledEgg), new ItemStack[] {new ItemStack(Item.egg)});

    if (!isDecoPresent || !classExists("Addon_Diamondium"))
    {
      FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockDiamondIngot, 1), new Object[] {"###", "###", "###", '#', FCBetterThanWolves.fcItemIngotDiamond});
      FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcItemIngotDiamond, 9), new Object[] {new ItemStack(gpeBlockDiamondIngot)});
    }
    if (!isDecoPresent || !classExists("Addon_HayBale"))
    {
      FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockHayBale, 1), new Object[] {"###", "###", "###", '#', Item.wheat});
      FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Item.wheat, 9), new Object[] {new ItemStack(gpeBlockHayBale)});
    }
    FCRecipes.RemoveVanillaRecipe(new ItemStack(FCBetterThanWolves.fcAestheticOpaque, 1, 5), new Object[] {"###", "###", "###", '#', FCBetterThanWolves.fcSoap});
    FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockSoap, 1), new Object[] {"###", "###", "###", '#', FCBetterThanWolves.fcSoap});
    FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockStorage, 1, 0), new Object[] {"###", "###", "###", '#', new ItemStack(Item.coal, 1, 0)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Item.coal, 9, 0), new Object[] {new ItemStack(gpeBlockStorage, 1, 0)});
    FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockStorage, 1, 1), new Object[] {"###", "###", "###", '#', new ItemStack(Item.coal, 1, 1)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Item.coal, 9, 1), new Object[] {new ItemStack(gpeBlockStorage, 1, 1)});
    FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockStorage, 1, 2), new Object[] {"###", "###", "###", '#', FCBetterThanWolves.fcCoalDust});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcCoalDust, 9), new Object[] {new ItemStack(gpeBlockStorage, 1, 2)});
    FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockStorage, 1, 3), new Object[] {"###", "###", "###", '#', FCBetterThanWolves.fcNethercoal});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcNethercoal, 9), new Object[] {new ItemStack(gpeBlockStorage, 1, 3)});
    FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockStorage, 1, 4), new Object[] {"###", "###", "###", '#', Item.sugar});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Item.sugar, 9), new Object[] {new ItemStack(gpeBlockStorage, 1, 4)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Item.bone, 9), new Object[] {new ItemStack(gpeBlockStorage, 1, 5)});
    FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockStorage, 1, 7), new Object[] {"###", "###", "###", '#', FCBetterThanWolves.fcItemNitre});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcItemNitre, 9), new Object[] {new ItemStack(gpeBlockStorage, 1, 7)});
    FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockStorage, 1, 8), new Object[] {"###", "###", "###", '#', FCBetterThanWolves.fcPotash});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcPotash, 9), new Object[] {new ItemStack(gpeBlockStorage, 1, 8)});
    FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockStorage, 1, 9), new Object[] {"###", "###", "###", '#', gpeItemAsh});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(gpeItemAsh, 9), new Object[] {new ItemStack(gpeBlockStorage, 1, 9)});
    FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockStorage, 1, 10), new Object[] {"###", "###", "###", '#', FCBetterThanWolves.fcFlour});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcFlour, 9), new Object[] {new ItemStack(gpeBlockStorage, 1, 10)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Item.rottenFlesh, 9), new Object[] {new ItemStack(gpeBlockFlesh)});
    FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockSlime), new Object[] {"###", "###", "###", '#', Item.slimeBall});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Item.slimeBall, 9), new Object[] {new ItemStack(gpeBlockSlime)});
    // Make those craftable if Hardcore Packing is not available
    if (!isBTWVersionOrNewer("4.89666"))
    {
      FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockStorage, 1, 5), new Object[] {"###", "###", "###", '#', Item.bone});
      FCRecipes.AddAnvilRecipe(new ItemStack(gpeBlockStorage, 1, 6), new Object[] {"####", "####", "####", "####", '#', FCBetterThanWolves.fcSawDust});
      FCRecipes.AddVanillaRecipe(new ItemStack(gpeBlockFlesh), new Object[] {"###", "###", "###", '#', Item.rottenFlesh});
    }

    BlockDispenser.dispenseBehaviorRegistry.putObject(gpeItemLooseRock, new GPEBehaviorRock());

    // Balance Hardcore Hunger Wolves by adding wolves spawning in the forest
    // Patch also changes spawn and despawn in forests
    if (spawnWolvesInForests)
    {
      BiomeGenBase.forest.spawnableMonsterList.add(new SpawnListEntry(EntityWolf.class, 1, 1, 1));
    }
    
    fixUpCreativeTabs();

    FCAddOnHandler.LogMessage("Grom PE's BTWTweak is done tweaking. Enjoy!");
  }

  public void PostInitialize()
  {
    FCAddOnHandler.LogMessage("BTWTweak now looks for BTW Research Add-On to integrate with...");
    try
    {
      Class rb = Class.forName("SixModResearchBenchAddOn");
      Method addDesc = rb.getMethod("addResearchDescription", new Class[] {String.class, String.class});
      // addDesc.invoke(rb, "<KEY>", "<DESCRIPTION>");
      // Where <KEY> is of the form "ID#Metadata", (i.e. "5#3" for jungle planks)
      // and <DESCRIPTION> is the description you want the item to have
      // Try to keep the description under 300 characters or so.
      addDesc.invoke(rb, "4", "Rough broken down stone. If arranged in a hollow square, can be crafted into a simple furnace to smelt and cook things.");
      addDesc.invoke(rb, "13", "Fine chunks of stone and sand. Digging through it may yield a rock, or even a flint, but passing it through a fine filter is more efficient.");
      addDesc.invoke(rb, "44#3", "A half high block of cobblestone, useful for getting up slopes without jumping. Two of them can be joined back into a single block. Many solid blocks seem to be able to be made into slabs like this.");
      addDesc.invoke(rb, "44#5", "A half high block of stone bricks, useful for getting up slopes without jumping. Two of them can be joined back into a single block. Many solid blocks seem to be able to be made into slabs like this.");
      addDesc.invoke(rb, "80", "This block of compacted snow seems to melt into water when placed directly nearby a heat source.");
      addDesc.invoke(rb, "91", "The torch encased in this carved pumpkin gives off a comforting light, and is well-protected from water. The pumpkin is still fragile and if dropped from a height, breaks into seeds and leaves the torch standing in most cases.");
      addDesc.invoke(rb, "397#5", "Spider head now silently stares at you with its all 8 eyes.");
      addDesc.invoke(rb, "397#6", "Looks like this black person won't be teleporting anymore.");
      addDesc.invoke(rb, "397#7", "Zombie pigman head smells rotten.");
      addDesc.invoke(rb, "397#8", "Blaze head is one cool-looking fiery trophy.");
      addDesc.invoke(rb, Integer.toString(gpeLooseRockID), "A rough loose rock. It could be crafted with shafts to make basic tools, one for a shovel, two for an axe or three for a pick. Heavy, but usable as a short ranged thrown weapon. Can be assembled to slabs and blocks.");
      addDesc.invoke(rb, Integer.toString(gpeSilkID), "Fine vowen spider silk. You wonder what could it be used for...");
      addDesc.invoke(rb, Integer.toString(FCBetterThanWolves.fcBlockDirtSlab.blockID) + "#6", "Gravel makes for a good road material, even in a slab form.");
      addDesc.invoke(rb, Integer.toString(FCBetterThanWolves.fcBlockDirtSlab.blockID) + "#7", "Running and jumping is a huge drain on energy and cuts into a food supply fast. Slabs could offer a huge help in this, allowing one to walk up slopes without any jumping at all. Needs a solid surface to sit on though.");
      addDesc.invoke(rb, Integer.toString(FCBetterThanWolves.fcPotash.itemID), "Grainy ash substance from rendered down wood. Can fertilize tilled soil. Also has a bleaching quality, so should be able to bleach coloured wool white.");
      addDesc.invoke(rb, Integer.toString(FCBetterThanWolves.fcAestheticOpaque.blockID) + "#4", "Nice, soft and comfy. A handy way to store padding. Or to make a calming padded room. Softens the blow when landed onto.");
      FCAddOnHandler.LogMessage("All good!");
    }
    catch (ClassNotFoundException e)
    {
      FCAddOnHandler.LogMessage("BTW Research Add-On not found.");
    }
    catch (Exception e)
    {
      FCAddOnHandler.LogMessage("Error while integrating with BTW Research Add-On!");
      e.printStackTrace();
    }
  }

  // Because Deco is doing its core work in PostInitialize and we need to get results of that
  private void postPostInitialize()
  {
    if (postPostInitialized) return;
    postPostInitialized = true;
    if (isDecoPresent)
    {
      FCAddOnHandler.LogMessage("BTWTweak now looks for Deco 2.0+ Add-On to integrate with...");
      try
      {
        Class ag = Class.forName("Addon_Glass");
        decoGlassShard = (Item)ag.getField("glassChunk").get(null);
        FCAddOnHandler.LogMessage("Found glass chunk with ID=" + Integer.toString(decoGlassShard.itemID));
      }
      catch (ClassNotFoundException e)
      {
        FCAddOnHandler.LogMessage("Deco part 'Addon_Glass' not found.");
      }
      catch (Exception e)
      {
        FCAddOnHandler.LogMessage("Error while integrating with Deco Add-On!");
        e.printStackTrace();
      }
      // Fix Deco losing map item properties
      Item.map.SetBuoyancy(1.0F);
      Item.map.SetBellowsBlowDistance(3);
    }
  }

  private void fixUpCreativeTabs()
  {
    Block.waterStill.setCreativeTab(CreativeTabs.tabBlock);
    Block.lavaStill.setCreativeTab(CreativeTabs.tabBlock);
    Block.mushroomBrown.setCreativeTab(null);
    Block.mushroomRed.setCreativeTab(null);
    Block.tilledField.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockWoodOakMouldingAndDecorative.setCreativeTab(null);
    Block.commandBlock.setCreativeTab(CreativeTabs.tabRedstone);
    Block.web.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockAestheticOpaqueEarth.setCreativeTab(CreativeTabs.tabBlock);

    FCBetterThanWolves.fcBlockSidingAndCornerBlackStone.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockMouldingAndDecorativeBlackStone.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockSandstoneSidingAndCorner.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockSandstoneMouldingAndDecorative.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockSmoothStoneSidingAndCorner.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockSmoothStoneMouldingAndDecorative.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockBrickSidingAndCorner.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockBrickMouldingAndDecorative.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockNetherBrickSidingAndCorner.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockNetherBrickMouldingAndDecorative.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockWhiteStoneSidingAndCorner.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockWhiteStoneMouldingAndDecorative.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockStoneBrickSidingAndCorner.setCreativeTab(CreativeTabs.tabDecorations);
    FCBetterThanWolves.fcBlockStoneBrickMouldingAndDecorative.setCreativeTab(CreativeTabs.tabDecorations);

    // wood sidings             - FCBlockWoodSidingAndCornerAndDecorative => 0 1 2 3
    FCBetterThanWolves.fcBlockWoodSpruceSidingAndCorner.setCreativeTab(CreativeTabs.tabDecorations);
    // wood mouldings                  - FCBlockWoodMouldingAndDecorative => 0 1 2 3
    FCBetterThanWolves.fcBlockWoodSpruceMouldingAndDecorative.setCreativeTab(CreativeTabs.tabDecorations);
    // wood corners             - FCBlockWoodSidingAndCornerAndDecorative => 0 1 2 3
    FCBetterThanWolves.fcBlockWoodBirchSidingAndCorner.setCreativeTab(CreativeTabs.tabDecorations);
    // wood columns, pedestals, tables - FCBlockWoodMouldingAndDecorative => 0 1 2 3 4 5 6 7 8 9 10 11
    FCBetterThanWolves.fcBlockWoodBirchMouldingAndDecorative.setCreativeTab(CreativeTabs.tabDecorations);
    // wood benches, fences     - FCBlockWoodSidingAndCornerAndDecorative => 0 1 2 3 . 5 6 7
    FCBetterThanWolves.fcBlockWoodJungleSidingAndCorner.setCreativeTab(CreativeTabs.tabDecorations);

    FCBetterThanWolves.fcInfernalEnchanter.setCreativeTab(CreativeTabs.tabDecorations);
    if (isBTWVersionOrNewer("4.8999999"))
    {
      FCBetterThanWolves.fcBlockArcaneVessel.setCreativeTab(CreativeTabs.tabRedstone);
    }
    
    FCBetterThanWolves.fcItemRottenArrow.setCreativeTab(CreativeTabs.tabCombat);
    FCBetterThanWolves.fcItemWitchWart.setCreativeTab(CreativeTabs.tabBrewing);
    FCBetterThanWolves.fcItemCreeperOysters.setCreativeTab(CreativeTabs.tabBrewing);
    if (isBTWVersionOrNewer("4.89PHILLIP"))
    {
      FCBetterThanWolves.fcItemMysteriousGland.setCreativeTab(CreativeTabs.tabBrewing);
    }
    if (isBTWVersionOrNewer("4.A2 Timing Rodent"))
    {
      FCBetterThanWolves.fcItemStumpRemover.setCreativeTab(CreativeTabs.tabTools);
    }
  }

  public static Block Itemize(Block block)
  {
    int id = block.blockID;
    if (Block.blocksList[id] != null && Item.itemsList[id] == null)
    {
      Item.itemsList[id] = new ItemBlock(id - 256);
    }
    return block;
  }

  public static boolean onBlockSawed(World world, int x, int y, int z)
  {
    int id = world.getBlockId(x, y, z);
    int meta = world.getBlockMetadata(x, y, z);
    if (id == Block.bookShelf.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodSidingItemStubID, 0, 4);
      EjectSawProducts(world, x, y, z, Item.book.itemID, 0, 3);
    }
    else if (id == Block.chest.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodSidingItemStubID, 0, 6);
    }
    else if (id == Block.doorWood.blockID)
    {
      if ((meta & 8) != 0) return false;
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodSidingItemStubID, 0, 4);
    }
    else if (id == Block.fenceGate.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodMouldingItemStubID, 0, 3);
    }
    else if (id == Block.jukebox.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodSidingItemStubID, 0, 6);
      EjectSawProducts(world, x, y, z, Item.diamond.itemID, 0, 1);
    }
    else if (id == Block.ladder.blockID)
    {
      EjectSawProducts(world, x, y, z, Item.stick.itemID, 0, 2);
    }
    else if (id == Block.music.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodSidingItemStubID, 0, 6);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcItemRedstoneLatch.itemID, 0, 1);
    }
    else if (id == Block.trapdoor.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodSidingItemStubID, 0, 2);
    }
    else if (id == compatAxleBlock.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodCornerItemStubID, 0, 2);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcRopeItem.itemID, 0, 1);
    }
    else if (id == FCBetterThanWolves.fcBellows.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodSidingItemStubID, 0, 2);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcItemTannedLeatherCut.itemID, 0, 3);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcGear.itemID, 0, 1);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBelt.itemID, 0, 1);
    }
    else if (id == FCBetterThanWolves.fcGearBox.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodSidingItemStubID, 0, 3);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcGear.itemID, 0, 3);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcItemRedstoneLatch.itemID, 0, 1);
    }
    else if (id == FCBetterThanWolves.fcHopper.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodMouldingItemStubID, 0, 3);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcGear.itemID, 0, 1);
      EjectSawProducts(world, x, y, z, Block.pressurePlatePlanks.blockID, 0, 1);
    }
    else if (id == FCBetterThanWolves.fcPlatform.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodMouldingItemStubID, 0, 3);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcWicker.itemID, 0, 2);
    }
    else if (id == FCBetterThanWolves.fcPulley.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodSidingItemStubID, 0, 3);
      EjectSawProducts(world, x, y, z, Item.ingotIron.itemID, 0, 2);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcGear.itemID, 0, 1);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcItemRedstoneLatch.itemID, 0, 1);
    }
    else if (id == FCBetterThanWolves.fcSaw.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcGear.itemID, 0, 2);
      EjectSawProducts(world, x, y, z, Item.ingotIron.itemID, 0, 3);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodSidingItemStubID, 0, 1);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBelt.itemID, 0, 1);
    }
    else if (id == FCBetterThanWolves.fcBlockScrewPump.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodSidingItemStubID, 0, 3);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcGrate.itemID, 0, 1);
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcItemScrew.itemID, 0, 1);
    }
    else if (id == Block.cloth.blockID)
    {
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcWoolSlab.blockID, meta, 2);
    }
    // Benches (metadata = 12)
    else if (id == FCBetterThanWolves.fcBlockWoodOakSidingAndCorner.blockID)
    {
      if (meta != 12) return false;
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodCornerItemStubID, 0, 2);
    }
    else if (id == FCBetterThanWolves.fcBlockWoodSpruceSidingAndCorner.blockID)
    {
      if (meta != 12) return false;
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodCornerItemStubID, 1, 2);
    }
    else if (id == FCBetterThanWolves.fcBlockWoodBirchSidingAndCorner.blockID)
    {
      if (meta != 12) return false;
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodCornerItemStubID, 2, 2);
    }
    else if (id == FCBetterThanWolves.fcBlockWoodJungleSidingAndCorner.blockID)
    {
      if (meta != 12) return false;
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcBlockWoodCornerItemStubID, 3, 2);
    }
    // Columns (metaata = 12), pedestals (13, 14), tables (15)
    else if (id == FCBetterThanWolves.fcBlockWoodOakMouldingAndDecorative.blockID)
    {
      if (meta < 12) return false;
      EjectSawProducts(world, x, y, z,
        meta == 15 ? FCBetterThanWolves.fcBlockWoodCornerItemStubID : FCBetterThanWolves.fcBlockWoodMouldingItemStubID,
        0, meta == 12 ? 2 : 3);
    }
    else if (id == FCBetterThanWolves.fcBlockWoodSpruceMouldingAndDecorative.blockID)
    {
      if (meta < 12) return false;
      EjectSawProducts(world, x, y, z,
        meta == 15 ? FCBetterThanWolves.fcBlockWoodCornerItemStubID : FCBetterThanWolves.fcBlockWoodMouldingItemStubID,
        1, meta == 12 ? 2 : 3);
    }
    else if (id == FCBetterThanWolves.fcBlockWoodBirchMouldingAndDecorative.blockID)
    {
      if (meta < 12) return false;
      EjectSawProducts(world, x, y, z,
        meta == 15 ? FCBetterThanWolves.fcBlockWoodCornerItemStubID : FCBetterThanWolves.fcBlockWoodMouldingItemStubID,
        2, meta == 12 ? 2 : 3);
    }
    else if (id == FCBetterThanWolves.fcBlockWoodJungleMouldingAndDecorative.blockID)
    {
      if (meta < 12) return false;
      EjectSawProducts(world, x, y, z,
        meta == 15 ? FCBetterThanWolves.fcBlockWoodCornerItemStubID : FCBetterThanWolves.fcBlockWoodMouldingItemStubID,
        3, meta == 12 ? 2 : 3);
    }
    else if (id == gpeBlockStorage.blockID)
    {
      if (meta != 6) return false;
      EjectSawProducts(world, x, y, z, FCBetterThanWolves.fcSawDust.itemID, 0, 16);
    }
    else
    {
      return false;
    }
    return true;
  }

  private static void EjectSawProducts(World world, int x, int y, int z, int id, int meta, int count)
  {
    for (int i = 0; i < count; ++i)
    {
      FCUtilsItem.EjectSingleItemWithRandomOffset(world, x, y, z, id, meta);
    }
  }

  public static void onPlayerHardcoreDeath(EntityPlayer player)
  {
    int x = MathHelper.floor_double(player.posX);
    int y = MathHelper.floor_double(player.posY);
    int z = MathHelper.floor_double(player.posZ);
    attemptToPlaceGravestone(player.worldObj, x, y, z);
  }

  public static boolean attemptToPlaceGravestone(World world, int x, int y, int z)
  {
    if (gpeBlockGravestoneID == 0) return false;
    if (y <= 0) return false;
    while (isReplaceableBlock(world, x, y - 1, z))
    {
      y--;
      if (y <= 0) return false;
    }
    if (placeGravestoneIfPossibleAt(world, x, y, z)) return true;
    for (int xx = x - 1; xx <= x + 1; xx++)
    {
      for (int zz = z - 1; zz <= z + 1; zz++)
      {
        int yy = y + 1;
        while (isReplaceableBlock(world, xx, yy - 1, zz)) yy--;
        if (placeGravestoneIfPossibleAt(world, xx, yy, zz)) return true;
      }
    }
    return false;
  }

  public static boolean isReplaceableBlock(World world, int x, int y, int z)
  {
    int id = world.getBlockId(x, y, z);
    return id == 0 || Block.blocksList[id].blockMaterial.isReplaceable();
  }

  private static boolean placeGravestoneIfPossibleAt(World world, int x, int y, int z)
  {
    if (gpeBlockGravestone.canPlaceBlockAt(world, x, y, z) && !(world.getBlockMaterial(x, y, z) instanceof MaterialLiquid))
    {
      int side = world.rand.nextInt(4);
      world.setBlockAndMetadataWithNotify(x, y, z, gpeBlockGravestone.blockID, side);
      return true;
    }
    return false;
  }

  public static void onKeyPress(int key)
  {
    proxy.onKeyPress(key);
  }

  public void OnLanguageLoaded(StringTranslate st)
  {
    postPostInitialize();

    Properties t = st.GetTranslateTable();
    t.put(Item.stick.getUnlocalizedName() + ".name", "Rod");
    t.put(Block.railDetector.getUnlocalizedName() + ".name", "Loaded Detector Rail");
    t.put(FCBetterThanWolves.fcBlockDetectorRailSoulforgedSteel.getUnlocalizedName() + ".name", "Player Detector Rail");
    if (isBTWVersionOrNewer("4.99999A0D Marsupial??!!"))
    {
      t.put(FCBetterThanWolves.fcBlockDirtSlab.getUnlocalizedName() + ".gravel.name", "Old Gravel Slab");
      t.put(FCBetterThanWolves.fcBlockDirtSlab.getUnlocalizedName() + ".sand.name", "Old Sand Slab");
    } else {
      t.put(FCBetterThanWolves.fcBlockDirtSlab.getUnlocalizedName() + ".gravel.name", "Gravel Slab");
      t.put(FCBetterThanWolves.fcBlockDirtSlab.getUnlocalizedName() + ".sand.name", "Sand Slab");
    }
    t.put(FCBetterThanWolves.fcItemRottenArrow.getUnlocalizedName() + ".name", "Rotten Arrow");
    t.put(FCBetterThanWolves.fcItemWindMillVertical.getUnlocalizedName() + ".name", "Vertical Wind Mill");
    t.put("item.skull.spider.name", "Spider Head");
    t.put("item.skull.enderman.name", "Enderman Head");
    t.put("item.skull.pigzombie.name", "Zombie Pigman Head");
    t.put("item.skull.fire.name", "Blaze Head");
    t.put(gpeItemLooseRock.getUnlocalizedName() + ".name", "Rock");
    t.put("entity.gpeEntityRock.name", "Rock");
    t.put(gpeItemSilk.getUnlocalizedName() + ".name", "Silk");
    t.put(gpeItemAsh.getUnlocalizedName() + ".name", "Ash");
    t.put(gpeItemQuill.getUnlocalizedName() + ".name", "Ink and Quill");
    t.put(gpeItemNameTag.getUnlocalizedName() + ".name", "Name Tag");
    t.put(gpeItemSling.getUnlocalizedName() + ".name", "Sling");
    t.put(gpeItemHardBoiledEgg.getUnlocalizedName() + ".name", "Hard-Boiled Egg");
    if (gpeBlockGravestoneID != 0)
    {
      t.put(gpeBlockGravestone.getUnlocalizedName() + ".name", "Gravestone");
    }
    t.put(gpeBlockRustedRail.getUnlocalizedName() + ".name", "Rusted Rail");
    t.put(gpeBlockRename.getUnlocalizedName() + ".name", "Writing Table");
    if (!isDecoPresent || !classExists("Addon_Diamondium"))
    {
      t.put(gpeBlockDiamondIngot.getUnlocalizedName() + ".name", "Block of Processed Diamond");
    }
    if (!isDecoPresent || !classExists("Addon_HayBale"))
    {
      t.put(gpeBlockHayBale.getUnlocalizedName() + ".name", "Hay Bale");
    }
    t.put("tile.fcBlockAestheticOpaque.soap.name", "Old Block of Soap");
    t.put(gpeBlockSoap.getUnlocalizedName() + ".name", "Block of Soap");
    if (btwFlesh)
    {
      t.put(gpeBlockFlesh.getUnlocalizedName() + ".name", "Old Block of Flesh");
    } else {
      t.put(gpeBlockFlesh.getUnlocalizedName() + ".name", "Block of Flesh");
    }
    t.put(gpeBlockSlime.getUnlocalizedName() + ".name", "Block of Slime");
    t.put(gpeBlockStorage.getUnlocalizedName() + ".coal.name", "Block of Coal");
    t.put(gpeBlockStorage.getUnlocalizedName() + ".charcoal.name", "Block of Charcoal");
    t.put(gpeBlockStorage.getUnlocalizedName() + ".coaldust.name", "Block of Coal Dust");
    t.put(gpeBlockStorage.getUnlocalizedName() + ".nethercoal.name", "Block of Nethercoal");
    t.put(gpeBlockStorage.getUnlocalizedName() + ".sugar.name", "Block of Sugar");
    if (btwBone)
    {
      t.put(gpeBlockStorage.getUnlocalizedName() + ".bone.name", "Old Block of Bone");
    } else {
      t.put(gpeBlockStorage.getUnlocalizedName() + ".bone.name", "Block of Bone");
    }
    t.put(gpeBlockStorage.getUnlocalizedName() + ".sawdust.name", "Block of Sawdust");
    t.put(gpeBlockStorage.getUnlocalizedName() + ".nitre.name", "Block of Nitre");
    t.put(gpeBlockStorage.getUnlocalizedName() + ".potash.name", "Block of Potash");
    t.put(gpeBlockStorage.getUnlocalizedName() + ".ash.name", "Block of Ash");
    t.put(gpeBlockStorage.getUnlocalizedName() + ".flour.name", "Block of Flour");
    t.put("enchantment.haste", "Velocity");
    t.put("container.rename", "Write Tags & Name");
    t.put("key.sprint", "Sprint");
    t.put("key.tell", "Tell");
    t.put("options.difficulty.easy", "Wimpy");
    t.put("selectWorld.gameMode.hardcore.line1", "Same as survival mode,");
    t.put("selectWorld.gameMode.hardcore.line2", "one life only");
    t.put("achievement.acquireIron.desc", "Craft an iron ingot from 9 nuggets");
    t.put("achievement.buildHoe.desc", "Use iron ingots and rods to make a hoe");
    t.put("achievement.buildSword.desc", "Use rocks and rods to make an axe");
    t.put("achievement.enchantments.desc", "Find an enchantment table");

    t.put("pottery.crucible", "Crucible");
    t.put("pottery.planter", "Planter");
    t.put("pottery.vase", "Vase");
    t.put("pottery.urn", "Urn");
    t.put("pottery.mould", "Mould");
    t.put("planter.soil", "Soil");
    t.put("planter.fertilizedSoil", "Fertilized Soil");
    t.put("planter.soulsand", "Soul Sand");
    t.put("planter.grass", "Grass");
  }

  public static void saveWorldData(World world)
  {
    if (!readyForStrataRegen(world)) return;
    File strataRegenFile = getStrataRegenFile(world);

    try
    {
      ObjectOutputStream s = new ObjectOutputStream(new FileOutputStream(strataRegenFile));
      s.writeObject(chunkRegenInfo);
      s.close();
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }

  public static void loadWorldData(World world)
  {
    addCommands();

    if (!readyForStrataRegen(world)) return;
    FCAddOnHandler.LogMessage(String.format("BTWTweak is now going to stratify the world '%s'.", gpeStrataRegenWorldName));
    File strataRegenFile = getStrataRegenFile(world);
    if (!strataRegenFile.exists()) return;

    try
    {
      ObjectInputStream s = new ObjectInputStream(new FileInputStream(strataRegenFile));
      chunkRegenInfo = (HashMap<Long, Integer>)s.readObject();
      s.close();
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }

  public static void addCommands()
  {
    CommandHandler ch = (CommandHandler)MinecraftServer.getServer().getCommandManager();
    // Must make sure the command is added only once
    if (ch.getCommands().get("playtime") == null)
    {
      ch.registerCommand(new GPECommandPlaytime());
    }
  }

  public static void onSaveChunk(World world, Chunk chunk)
  {
    if (!readyForStrataRegen(world)) return;
    long l = (((long)chunk.xPosition) << 32) | (chunk.zPosition & 0xffffffffL);
    chunkRegenInfo.put(l, gpeStrataRegenKey);
  }

  public static void onLoadChunk(World world, Chunk chunk)
  {
    if (!readyForStrataRegen(world)) return;
    long l = (((long)chunk.xPosition) << 32) | (chunk.zPosition & 0xffffffffL);
    Integer key = chunkRegenInfo.get(l);
    if (key == null || key.intValue() != gpeStrataRegenKey)
    {
      System.out.println(String.format("Stratifying chunk at %d, %d", chunk.xPosition, chunk.zPosition));
      stratifyChunk(world, chunk);
    }
  }

  public static boolean isBTWVersionOrNewer(String ver)
  {
    return ver.compareTo(FCBetterThanWolves.fcVersionString) <= 0;
  }

  private static File getStrataRegenFile(World world)
  {
    File f;
    f = new File(proxy.getConfigDir(), "saves");
    f = new File(f, world.getSaveHandler().getWorldDirectoryName());
    f = new File(f, "strataRegen.dat");
    return f;
  }

  private static boolean readyForStrataRegen(World world)
  {
    if (gpeStrataRegenKey == 0) return false;
    if (world.provider.dimensionId != 0) return false;
    if (world.worldInfo == null) return false;
    return world.worldInfo.getWorldName().equals(gpeStrataRegenWorldName);
  }

  private static void stratifyChunk(World world, Chunk chunk)
  {
    for (int x = 0; x < 16; x++)
    {
      for (int z = 0; z < 16; z++)
      {
        int y = 1;
        int yy;
        for (yy = 24 + world.rand.nextInt(2); y <= yy; y++) stratifyBlockInChunk(chunk, x, y, z, 2);
        for (yy = 48 + world.rand.nextInt(2); y <= yy; y++) stratifyBlockInChunk(chunk, x, y, z, 1);
      }
    }
  }

  private static void stratifyBlockInChunk(Chunk chunk, int x, int y, int z, int strata)
  {
    int id = chunk.getBlockID(x, y, z);
    if (id == Block.stone.blockID)
    {
      chunk.setBlockMetadata(x, y, z, strata);
    }
    else if (id != 0)
    {
      Block b = Block.blocksList[id];
      if (b.HasStrata()) chunk.setBlockMetadata(x, y, z, b.GetMetadataConversionForStrataLevel(strata, 0));
    }
  }

  public static void onEntityCollidedWithBlock(World world, int x, int y, int z, Entity entity)
  {
    if (world.isRemote) return;
    if (entity instanceof EntityItem && !entity.isDead)
    {
      int id = world.getBlockId(x, y, z);
      int meta = world.getBlockMetadata(x, y, z);
      ItemStack item = ((EntityItem)entity).getEntityItem();

      if (item.itemID == FCBetterThanWolves.fcPotash.itemID || item.itemID == gpeAshID)
      {
        if (id == Block.tilledField.blockID)
        {
          world.playSoundEffect(x + 0.5, y + 0.5, z + 0.5, "random.pop", 0.25F, world.rand.nextFloat() * 1.5F + 2.0F);
          world.setBlockAndMetadataWithNotify(x, y, z, FCBetterThanWolves.fcBlockFarmlandFertilized.blockID, meta);
          item.stackSize--;
          if (item.stackSize <= 0) entity.setDead();
        }
        else if (id == FCBetterThanWolves.fcPlanter.blockID && meta == 1)
        {
          world.playSoundEffect(x + 0.5, y + 0.5, z + 0.5, "random.pop", 0.25F, world.rand.nextFloat() * 1.5F + 2.0F);
          world.setBlockMetadataWithNotify(x, y, z, 2);
          item.stackSize--;
          if (item.stackSize <= 0) entity.setDead();
        }
      }
      else if (item.itemID == Item.seeds.itemID
               || item.itemID == Item.pumpkinSeeds.itemID
               || item.itemID == Item.melonSeeds.itemID
               || item.itemID == FCBetterThanWolves.fcHempSeeds.itemID
              )
      {
        if ( ((EntityItem)entity).age >= 40 &&
             (id == Block.tilledField.blockID || id == FCBetterThanWolves.fcBlockFarmlandFertilized.blockID
               || (id == FCBetterThanWolves.fcPlanter.blockID && (meta == 1 || meta == 2))
             )
           )
        {
          if (world.isAirBlock(x, y + 1, z))
          {
            int plantBlock = item.itemID == Item.seeds.itemID ? Block.crops.blockID
                           : item.itemID == Item.pumpkinSeeds.itemID ? Block.pumpkinStem.blockID
                           : item.itemID == Item.melonSeeds.itemID ? Block.melonStem.blockID
                           : item.itemID == FCBetterThanWolves.fcHempSeeds.itemID ? FCBetterThanWolves.fcHempCrop.blockID
                           : FCBetterThanWolves.fcHempCrop.blockID;
            world.playSoundEffect(x + 0.5, y + 0.5, z + 0.5, "random.pop", 0.25F, world.rand.nextFloat() * 1.5F + 2.0F);
            world.setBlock(x, y + 1, z, plantBlock);
            item.stackSize--;
            if (item.stackSize <= 0) entity.setDead();
          }
        }
      }
      else if (item.itemID == Item.egg.itemID)
      {
        if (id == FCBetterThanWolves.fcAestheticOpaque.blockID && meta == 4) // Block of Padding
        {
          if (item.stackSize == 1 && ((EntityItem)entity).age > 5400 && world.getBlockId(x, y + 2, z) == FCBetterThanWolves.fcLightBulbOn.blockID)
          {
            world.playSoundAtEntity(entity, "mob.slime.attack", 0.25F, world.rand.nextFloat() * 0.2F + 1.4F);
            EntityChicken chick = new EntityChicken(world);
            chick.setGrowingAge(-24000);
            chick.setLocationAndAngles(entity.posX, entity.posY, entity.posZ, 0F, 0F);
            world.spawnEntityInWorld(chick);
            item.stackSize--;
            if (item.stackSize <= 0) entity.setDead();
          }
        }
      }
    }
  }

  @ClientOnly
  public boolean ClientCustomPacketReceived(Minecraft mc, Packet250CustomPayload packet)
  {
    if (packet.channel.equals("GPE|OI"))
    {
      try
      {
        DataInputStream stream = new DataInputStream(new ByteArrayInputStream(packet.data));
        int windowId = stream.readInt();
        int containerId = stream.readInt();
        if (containerId == 1)
        {
          WorldClient world = mc.theWorld;
          EntityClientPlayerMP player = mc.thePlayer;
          GPETileEntityRename tile = new GPETileEntityRename();
          GuiContainer gui = new GPEGuiRename(player.inventory, world, tile);
          if (gui != null)
          {
            mc.displayGuiScreen(gui);
            player.openContainer.windowId = windowId;
            return true;
          }
        }
      }
      catch (IOException e)
      {
        e.printStackTrace();
      }
    }
    if (packet.channel.equals("GPE|Shutup"))
    {
      try
      {
        DataInputStream stream = new DataInputStream(new ByteArrayInputStream(packet.data));
        int entityId = stream.readInt();
        WorldClient world = mc.theWorld;
        Entity entity = world.getEntityByID(entityId);
        if (entity != null)
        {
          proxy.stopEntitySound(entity);
          return true;
        }
      }
      catch (IOException e)
      {
        e.printStackTrace();
      }
    }
    return false;
  }

  public static boolean serverCustomPacketReceived(EntityPlayerMP player, Packet250CustomPayload packet)
  {
    if (packet.channel.equals("GPE|ItemName"))
    {
      if (player.openContainer instanceof GPEContainerRename)
      {
        GPEContainerRename container = (GPEContainerRename)player.openContainer;
        String name = "";
        try
        {
          if (packet.data != null && packet.data.length >= 1)
          {
            name = ChatAllowedCharacters.filerAllowedCharacters(new String(packet.data, "UTF-8"));
            if (name.length() > 30) name = "";
          }
        }
        catch (UnsupportedEncodingException e)
        {
          name = "";
        }
        container.updateItemName(name);
        return true;
      }
    }
    else if (packet.channel.equals("GPE|Dismount"))
    {
      if (player.ridingEntity != null)
      {
        player.ridingEntity.riddenByEntity = null;
        player.ridingEntity = null;
      }
    }
    return false;
  }

  public static void readyForInput()
  {
    proxy.addKeyBindings();
  }

  public static boolean addItemStackToChest(TileEntityChest t, ItemStack stack)
  {
    World world = t.worldObj;
    int meta = t.getBlockMetadata();
    int x = t.xCoord;
    int y = t.yCoord;
    int z = t.zCoord;
    switch (meta)
    {
      case 6:  // +x has a chest
      case 7:  return FCUtilsInventory.AddItemStackToDoubleInventory(t, (TileEntityChest)world.getBlockTileEntity(x + 1, y, z), stack);

      case 8:  // +z has a chest
      case 9:  return FCUtilsInventory.AddItemStackToDoubleInventory(t, (TileEntityChest)world.getBlockTileEntity(x, y, z + 1), stack);

      case 10: // -x has a chest
      case 11: return FCUtilsInventory.AddItemStackToDoubleInventory((TileEntityChest)world.getBlockTileEntity(x - 1, y, z), t, stack);

      case 12: // -z has a chest
      case 13: return FCUtilsInventory.AddItemStackToDoubleInventory((TileEntityChest)world.getBlockTileEntity(x, y, z - 1), t, stack);
      // single chest
      default: return FCUtilsInventory.AddItemStackToInventory(t, stack);
    }
  }

  // http://burtleburtle.net/bob/hash/integer.html
  public static int half_avalanche(int a)
  {
    a = (a + 0x479ab41d) + (a << 8);
    a = (a ^ 0xe4aa10ce) ^ (a >> 5);
    a = (a + 0x9942f0a6) - (a << 14);
    a = (a ^ 0x5aedd67d) ^ (a >> 3);
    a = (a + 0x17bea992) + (a << 7);
    return a;
  }

  public static void addKilnCrackEffect(World world, int entityId, int x, int y, int z, int damage)
  {
    // Fake entityId based on xyz coordinates so cracks won't conflict with each other
    // (actually 0.03% collisions) Negative so won't conflict with existing players
    entityId = -((half_avalanche(half_avalanche(x) + z) >>> 2) + y);
    world.destroyBlockInWorldPartially(entityId, x, y, z, damage);
  }

  public static boolean canWildWolfSpawnHere(World world, int x, int y, int z)
  {
    int light = world.getBlockLightValue(x, y, z);
    if (world.getBlockId(x, y - 1, z) == Block.grass.blockID
      && world.getBlockId(x, y + 1, z) == Block.leaves.blockID
      && light >= 2
      && light <= 8
      )
      return true;
    return false;
  }

  public static boolean isPistonPackable(ItemStack stack)
  {
    int id = stack.itemID;
    int meta = stack.getItemDamage();
    if (id == Item.redstone.itemID) return true;
    if (id == Item.rottenFlesh.itemID) return true;
    if (id == Item.enderPearl.itemID) return true;
    if (id == FCBetterThanWolves.fcSoap.itemID) return true;
    if (id == Item.wheat.itemID) return true;
    if (id == FCBetterThanWolves.fcCoalDust.itemID) return true;
    if (id == FCBetterThanWolves.fcNethercoal.itemID) return true;
    if (id == Item.sugar.itemID) return true;
    if (id == Item.bone.itemID) return true;
    if (id == FCBetterThanWolves.fcSawDust.itemID) return true;
    if (id == FCBetterThanWolves.fcItemNitre.itemID) return true;
    if (id == FCBetterThanWolves.fcFlour.itemID) return true;
    if (id == Item.dyePowder.itemID && meta == 4) return true;
    return false;
  }

  public static int getRequiredItemCountToPistonPack(ItemStack stack)
  {
    int id = stack.itemID;
    if (id == FCBetterThanWolves.fcSawDust.itemID) return 16;
    return 9;
  }

  public static int getResultingBlockIDOnPistonPack(ItemStack stack)
  {
    int id = stack.itemID;
    int meta = stack.getItemDamage();
    if (id == Item.redstone.itemID) return Block.blockRedstone.blockID;
    if (id == Item.rottenFlesh.itemID)
    {
      return btwFlesh ? FCBetterThanWolves.fcBlockRottenFlesh.blockID : gpeBlockFleshID;
    }
    if (id == Item.enderPearl.itemID) return FCBetterThanWolves.fcAestheticOpaque.blockID;
    if (id == FCBetterThanWolves.fcSoap.itemID) return gpeBlockSoapID;
    if (id == Item.wheat.itemID) return gpeBlockHayBaleID;
    if (id == FCBetterThanWolves.fcCoalDust.itemID) return gpeBlockStorageID;
    if (id == FCBetterThanWolves.fcNethercoal.itemID) return gpeBlockStorageID;
    if (id == Item.sugar.itemID) return gpeBlockStorageID;
    if (id == Item.bone.itemID)
    {
      return btwBone ? FCBetterThanWolves.fcAestheticOpaque.blockID : gpeBlockStorageID;
    }
    if (id == FCBetterThanWolves.fcSawDust.itemID) return gpeBlockStorageID;
    if (id == FCBetterThanWolves.fcItemNitre.itemID) return gpeBlockStorageID;
    if (id == FCBetterThanWolves.fcFlour.itemID) return gpeBlockStorageID;
    if (id == Item.dyePowder.itemID && meta == 4) return Block.blockLapis.blockID;
    return 0;
  }

  public static int getResultingBlockMetadataOnPistonPack(ItemStack stack)
  {
    int id = stack.itemID;
    if (id == Item.enderPearl.itemID) return 14;
    if (id == FCBetterThanWolves.fcCoalDust.itemID) return 2;
    if (id == FCBetterThanWolves.fcNethercoal.itemID) return 3;
    if (id == Item.sugar.itemID) return 4;
    if (id == Item.bone.itemID)
    {
      return btwBone ? 15 : 5;
    }
    if (id == FCBetterThanWolves.fcSawDust.itemID) return 6;
    if (id == FCBetterThanWolves.fcItemNitre.itemID) return 7;
    if (id == FCBetterThanWolves.fcFlour.itemID) return 10;
    return 0;
  }

  // Taken from Deco Add-on by Yhetti
  private static void extendBlockIDs()
  {
    boolean[] NEW_m_bBlocksPotentialFluidSources = new boolean[4096];
    for (int i = 0; i < 256; ++i)
    {
      NEW_m_bBlocksPotentialFluidSources[i] = FCBetterThanWolves.m_bBlocksPotentialFluidSources[i];
    }
    FCBetterThanWolves.m_bBlocksPotentialFluidSources = NEW_m_bBlocksPotentialFluidSources;
    for (int i = 256; i < 4096; ++i)
    {
      Block block = Block.blocksList[i];
      FCBetterThanWolves.m_bBlocksPotentialFluidSources[i] = block != null && block instanceof FCIBlockFluidSource;
    }

    StatBase[] NEW_mineBlockStatArray = new StatBase[4096];
    for (int i = 0; i < 256; ++i)
    {
      NEW_mineBlockStatArray[i] = StatList.mineBlockStatArray[i];
    }
    for (int i = 256; i < 4096; ++i)
    {
      if (Block.blocksList[i] == null || !Block.blocksList[i].getEnableStats()) continue;
      String s = StatCollector.translateToLocalFormatted("stat.mineBlock", Block.blocksList[i].getLocalizedName());
      NEW_mineBlockStatArray[i] = new StatCrafting(0x1000000 + i, s, i).registerStat();
      StatList.objectMineStats.add((StatCrafting)NEW_mineBlockStatArray[i]);
    }
    StatList.mineBlockStatArray = NEW_mineBlockStatArray;

    int[] NEW_chanceToEncourageFire = new int[4096];
    int[] NEW_abilityToCatchFire = new int[4096];
    for (int i = 0; i < 256; ++i)
    {
      NEW_chanceToEncourageFire[i] = BlockFire.chanceToEncourageFire[i];
      NEW_abilityToCatchFire[i] = BlockFire.abilityToCatchFire[i];
    }
    BlockFire.chanceToEncourageFire = NEW_chanceToEncourageFire;
    BlockFire.abilityToCatchFire = NEW_abilityToCatchFire;

    try
    {
      Field carriableBlocksField = EntityEnderman.class.getDeclaredFields()[0];
      carriableBlocksField.setAccessible(true);
      boolean[] NEW_carriableBlocks = new boolean[4096];
      boolean[] OLD_carriableBlocks = (boolean[])carriableBlocksField.get(EntityEnderman.class);
      for (int i = 0; i < 256; ++i)
      {
        NEW_carriableBlocks[i] = OLD_carriableBlocks[i];
      }
      carriableBlocksField.set(EntityEnderman.class, NEW_carriableBlocks);
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }

    Field[] BeaconFields = FCTileEntityBeacon.class.getDeclaredFields();
    Field Beacon__m_iEffectsByBlockID = BeaconFields[4];
    Beacon__m_iEffectsByBlockID.setAccessible(true);
    if (isBTWVersionOrNewer("4.99999A0Eb Marsupial?!!!"))
    {
      ArrayList[] NEW_EffectsByBlockID = new ArrayList[4096];
      for (int i = 256; i < 4096; ++i)
      {
        NEW_EffectsByBlockID[i] = new ArrayList();
      }
      try
      {
        Beacon__m_iEffectsByBlockID.set(FCTileEntityBeacon.class, NEW_EffectsByBlockID);
      }
      catch (Exception e)
      {
        e.printStackTrace();
      }
    } else {
      Field Beacon__m_iValidMetadataForBlockID = BeaconFields[5];
      Beacon__m_iValidMetadataForBlockID.setAccessible(true);
      int NEW_EffectsByBlockID[] = new int[4096];
      int[] NEW_ValidMetadataForBlockID = new int[4096];
      for (int i = 256; i < 4096; ++i)
      {
        NEW_EffectsByBlockID[i] = 0;
        NEW_ValidMetadataForBlockID[i] = -1;
      }
      try
      {
        Beacon__m_iEffectsByBlockID.set(FCTileEntityBeacon.class, NEW_EffectsByBlockID);
        Beacon__m_iValidMetadataForBlockID.set(FCTileEntityBeacon.class, NEW_ValidMetadataForBlockID);
      }
      catch (Exception e)
      {
        e.printStackTrace();
      }
    }
    FCTileEntityBeacon.InitializeEffectsByBlockID();
  }

  public static boolean canPlaceItemBlock(ItemBlock ib, World world, int x, int y, int z, int side, EntityPlayer player, ItemStack stack, float hitX, float hitY, float hitZ)
  {
    if (ib instanceof GPEItemBlockMicro)
    {
      GPEItemBlockMicro mi = (GPEItemBlockMicro)ib;
      if (mi.attemptToCombineWithBlock(stack, world, x, y, z, side, hitX, hitY, hitZ, false, true))
        return true;
    }
    int id = ib.getBlockID();
    int meta = ib.getMetadata(stack.getItemDamage());
    Block block = Block.blocksList[id];
    if (!(block instanceof BlockLadder || block instanceof FCIBlock))
    {
      return ib.canPlaceItemBlockOnSide(world, x, y, z, side, player, stack);
    }
    switch (side)
    {
      case 0: --y; break;
      case 1: ++y; break;
      case 2: --z; break;
      case 3: ++z; break;
      case 4: --x; break;
      case 5: ++x; break;
    }
    int newMeta = block.onBlockPlaced(world, x, y, z, side, hitX, hitY, hitZ, meta);
    GPEWorldProxy4BB wp = new GPEWorldProxy4BB(world, x, y, z, id, newMeta);
    block.setBlockBoundsBasedOnState(wp, x, y, z);
    AxisAlignedBB bb = AxisAlignedBB.getAABBPool().getAABB(
      (double)x + block.minX, (double)y + block.minY, (double)z + block.minZ,
      (double)x + block.maxX, (double)y + block.maxY, (double)z + block.maxZ);
    return world.checkNoEntityCollision(bb);
  }

  public static int getMinimumDifficulty()
  {
    MinecraftServer srv = MinecraftServer.getServer();
    if (srv == null) return 1;
    return srv.isServerRunning() ? 2 : 1;
  }

  public static void addCreativeEnchantment(Enchantment e, List l)
  {
    l.add(new ItemStack(FCBetterThanWolves.fcArcaneScroll, 1, e.effectId));
  }

  public static void playEntitySound(String sound, Entity entity, float volume, float pitch, boolean priority)
  {
    proxy.playEntitySound(sound, entity, volume, pitch, priority);
  }

  public static void playEntitySoundOnce(String sound, Entity entity, float volume, float pitch, boolean priority)
  {
    proxy.playEntitySoundOnce(sound, entity, volume, pitch, priority);
  }

  public static void stopEntitySound(Entity entity)
  {
    proxy.stopEntitySound(entity);
  }

  public static void stopEntitySoundBroadcast(EntityPlayer player, Entity entity)
  {
    if (!entity.worldObj.isRemote)
    {
      ServerConfigurationManager cm = MinecraftServer.getServer().getConfigurationManager();
      ByteArrayOutputStream a = new ByteArrayOutputStream();
      DataOutputStream d = new DataOutputStream(a);
      try
      {
        d.writeInt(entity.entityId);
      }
      catch (Exception e)
      {
        e.printStackTrace();
      }
      Packet packet = new Packet250CustomPayload("GPE|Shutup", a.toByteArray());
      cm.sendToAllNearExcept(player, entity.posX, entity.posY, entity.posZ, 64.0D, entity.worldObj.provider.dimensionId, packet);
    }
    proxy.stopEntitySound(entity);
  }

  public static boolean classExists(String cn)
  {
    boolean result;
    try
    {
      Class.forName(cn);
      result = true;
    }
    catch(ClassNotFoundException e)
    {
      result = false;
    }
    return result;
  }
}
