package net.minecraft.src;

public class GPEBlockLog extends FCBlockLog
{
  public static final String[] treeSide = new String[] {"tree_side", "tree_spruce", "tree_birch", "tree_jungle"};
  public static final String[] treeTop = new String[] {"tree_top", "tree_top_spruce", "tree_top_birch", "tree_top_jungle"};
  private Icon[] iconsSide;
  private Icon[] iconsTop;

  protected GPEBlockLog(int id)
  {
    super(id);
    setStepSound(soundWoodFootstep);
    setUnlocalizedName("log");
    ItemAxe.SetAllAxesToBeEffectiveVsBlock(this);
    SetCanBeCookedByKiln(true);
    SetItemIndexDroppedWhenCookedByKiln(Item.coal.itemID);
    SetItemDamageDroppedWhenCookedByKiln(1);
  }

  public void OnBlockDestroyedWithImproperTool(World world, EntityPlayer player, int x, int y, int z, int meta)
  {
    if (meta == 12)
    {
      // Eaten by termites, in abandoned mineshaft
      dropBlockAsItem_do(world, x, y, z, new ItemStack(FCBetterThanWolves.fcSawDust));
    } else {
      super.OnBlockDestroyedWithImproperTool(world, player, x, y, z, meta);
    }
  }

  public void harvestBlock(World world, EntityPlayer player, int x, int y, int z, int meta)
  {
    if (meta == 12)
    {
      // Eaten by termites, in abandoned mineshaft
      dropBlockAsItem_do(world, x, y, z, new ItemStack(FCBetterThanWolves.fcSawDust));
    } else {
      super.harvestBlock(world, player, x, y, z, meta);
    }
  }

  protected boolean canSilkHarvest(int meta)
  {
    return meta != 12;
  }

  public void OnDestroyedByFire(World world, int x, int y, int z)
  {
    dropBlockAsItem_do(world, x, y, z, new ItemStack(GPEBTWTweak.gpeItemAsh.itemID, 1, 0));
  }

  public float getBlockHardness(World world, int x, int y, int z)
  {
    float multiplier = 1;
    // If dirt is below vertical log, consider it a hard stump
    int meta = world.getBlockMetadata(x, y, z);
    if (meta == 12) return 0.5F; // Eaten by termites, in abandoned mineshaft
    if (world.getBlockId(x, y - 1, z) == 3 && (meta & 12) == 0)
    {
      multiplier = 10;
    }
    // Make jungle wood somewhat softer, pine a bit softer
    if ((meta & 3) == 1) return 1.3F * multiplier;
    if ((meta & 3) == 3) return 1.0F * multiplier;
    return 1.5F * multiplier;
  }

  @ClientOnly
  public Icon getIcon(int side, int meta)
  {
    int pos = meta & 12;
    int typ = meta & 3;
    return
      (
        (pos == 0 && (side == 1 || side == 0)) ||
        (pos == 4 && (side == 5 || side == 4)) ||
        (pos == 8 && (side == 2 || side == 3))
      )
      ? iconsTop[typ]
      : iconsSide[typ];
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    iconsTop = new Icon[treeSide.length];
    iconsSide = new Icon[treeSide.length];
    for (int i = 0; i < iconsSide.length; i++)
    {
      iconsTop[i] = r.registerIcon(treeTop[i]);
      iconsSide[i] = r.registerIcon(treeSide[i]);
    }
    Block.wood.registerIcons(r);
  }
}
