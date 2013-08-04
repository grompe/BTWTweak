package net.minecraft.src;

import java.util.Properties;

public class GPEBTWTweak extends FCAddOn
{
  public static GPEBTWTweak instance;
  public static String tweakVersion = "0.4";

  public GPEBTWTweak()
  {
    instance = this;
  }

  public void Initialize()
  {
    FCAddOnHandler.LogMessage("Grom PE's BTWTweak v" + tweakVersion + " is now going to tweak the hell out of this.");

    Block.blocksList[91] = null;
    (new FCBlockPumpkin(91, true)).setHardness(1.0F).setStepSound(Block.soundWoodFootstep).setLightValue(1.0F).setUnlocalizedName("litpumpkin");
    (new GPEItemPotash(FCBetterThanWolves.fcPotash.itemID - 256)).setUnlocalizedName("fcItemPotash").SetBellowsBlowDistance(3).setCreativeTab(CreativeTabs.tabMaterials);

    FCRecipes.AddVanillaRecipe(new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 4, 6), new Object[] {"##", '#', new ItemStack(Block.gravel)});
    FCRecipes.AddVanillaRecipe(new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 6), new Object[] {"##", '#', new ItemStack(FCBetterThanWolves.fcItemPileGravel)});
    FCRecipes.AddVanillaRecipe(new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 4, 7), new Object[] {"##", '#', new ItemStack(Block.sand)});
    FCRecipes.AddVanillaRecipe(new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 7), new Object[] {"##", '#', new ItemStack(FCBetterThanWolves.fcItemPileSand)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Block.gravel), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 6), new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 6)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(Block.sand), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 7), new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 7)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcItemPileDirt, 2), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockDirtSlab)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcItemPileSand, 2), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 7)});
    FCRecipes.AddShapelessVanillaRecipe(new ItemStack(FCBetterThanWolves.fcItemPileGravel, 2), new Object[] {new ItemStack(FCBetterThanWolves.fcBlockDirtSlab, 1, 6)});
    FCRecipes.AddStokedCauldronRecipe(new ItemStack(FCBetterThanWolves.fcGlue, 1), new ItemStack[] {new ItemStack(Item.bone, 8)});
    FCRecipes.AddStokedCauldronRecipe(new ItemStack(FCBetterThanWolves.fcGlue, 1), new ItemStack[] {new ItemStack(Item.dyePowder, 24, 15)});

    FCAddOnHandler.LogMessage("Grom PE's BTWTweak is done tweaking. Enjoy!");
  }

  public boolean OnBlockSawed(World world, int x, int y, int z)
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
    else if (id == FCBetterThanWolves.fcAxleBlock.blockID)
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
    else
    {
      return false;
    }
    return true;
  }

  private void EjectSawProducts(World world, int x, int y, int z, int id, int meta, int count)
  {
    for (int i = 0; i < count; ++i)
    {
      FCUtilsItem.EjectSingleItemWithRandomOffset(world, x, y, z, id, meta);
    }
  }

  public void OnLanguageLoaded(StringTranslate st)
  {
    Properties t = st.GetTranslateTable();
    t.put(Item.stick.getUnlocalizedName() + ".name", "Rod");
    t.put(FCBetterThanWolves.fcBlockDirtSlab.getUnlocalizedName() + ".gravel.name", "Gravel Slab");
    t.put(FCBetterThanWolves.fcBlockDirtSlab.getUnlocalizedName() + ".sand.name", "Sand Slab");
    t.put("item.skull.spider.name", "Spider head");
    t.put("item.skull.enderman.name", "Enderman head");
    t.put("item.skull.pigzombie.name", "Zombie Pigman head");
    t.put("item.skull.fire.name", "Blaze head");
  }
}
