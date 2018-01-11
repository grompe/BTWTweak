package net.minecraft.src;

import java.util.List;

public class GPEBlockStorage extends Block
{
  private static final int coal = 0;
  private static final int charcoal = 1;
  private static final int coaldust = 2;
  private static final int nethercoal = 3;
  private static final int sugar = 4;
  private static final int bone = 5;
  private static final int sawdust = 6;
  private static final int nitre = 7;
  private static final int potash = 8;
  private static final int ash = 9;
  private static final int flour = 10;

  private static final float[] hardness =
  {
    2.0F, 2.0F, 0.6F, 2.0F, 0.6F, 0.8F, 0.6F, 0.6F,
    0.6F, 0.6F, 0.6F, 2.0F, 2.0F, 2.0F, 2.0F, 2.0F
  };
  
  public static final String[] names = new String[]
  {
    "coal", "charcoal", "coaldust", "nethercoal", "sugar", "bone", "sawdust", "nitre",
    "potash" , "ash", "flour"
  };
  private Icon[] icons;

  public GPEBlockStorage(int id)
  {
    super(id, FCBetterThanWolves.fcMaterialMiscellaneous);
    setHardness(2.0F);
    setStepSound(soundStoneFootstep);
    setUnlocalizedName("gpeBlockStorage");
    setCreativeTab(CreativeTabs.tabBlock);
    ItemAxe.SetAllAxesToBeEffectiveVsBlock(this);
    ItemPickaxe.SetAllPicksToBeEffectiveVsBlock(this);
  }

  public float getBlockHardness(World world, int x, int y, int z)
  {
    return hardness[world.getBlockMetadata(x, y, z)];
  }

  public int damageDropped(int meta)
  {
    return meta;
  }

  public int GetItemIDDroppedOnSaw(World world, int x, int y, int z)
  {
    int meta = world.getBlockMetadata(x, y, z);
    if (meta == sawdust) return FCBetterThanWolves.fcSawDust.itemID;
    return -1;
  }

  public int GetItemCountDroppedOnSaw(World world, int x, int y, int z)
  {
    int meta = world.getBlockMetadata(x, y, z);
    if (meta == sawdust) return 16;
    return 0;
  }

  public void getSubBlocks(int id, CreativeTabs tabs, List list)
  {
    list.add(new ItemStack(id, 1, 0));
    list.add(new ItemStack(id, 1, 1));
    list.add(new ItemStack(id, 1, 2));
    list.add(new ItemStack(id, 1, 3));
    list.add(new ItemStack(id, 1, 4));
    if (!GPEBTWTweak.btwBone)
    {
      list.add(new ItemStack(id, 1, 5));
    }
    list.add(new ItemStack(id, 1, 6));
    list.add(new ItemStack(id, 1, 7));
    list.add(new ItemStack(id, 1, 8));
    list.add(new ItemStack(id, 1, 9));
    list.add(new ItemStack(id, 1, 10));
  }

  @ClientOnly
  public Icon getIcon(int side, int meta)
  {
    return icons[meta];
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    icons = new Icon[names.length];
    for (int i = 0; i < icons.length; i++)
    {
      icons[i] = r.registerIcon("gpeBlockStorage_" + names[i]);
    }
  }
}
