package net.minecraft.src;

public class GPEBlockLog extends FCBlockLog
{
  public static final String[] treeSide = new String[] {"tree_side", "tree_spruce", "tree_birch", "tree_jungle"};
  public static final String[] treeTop = new String[] {"tree_top", "tree_top_spruce", "tree_top_birch", "tree_top_jungle"};
  public static final String[] trunkSide = new String[] {"fcBlockTrunkOak", "fcBlockTrunkSpruce", "fcBlockTrunkBirch", "fcBlockTrunkJungle"};
  public static final String[] trunkTop = new String[] {"fcBlockTrunkTop", "trunk_top_spruce", "trunk_top_birch", "trunk_top_jungle"};
  private Icon[] iconsSide;
  private Icon[] iconsTop;
  private Icon[] iconsTrunkSide;
  private Icon[] iconsTrunkTop;

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

  public void OnDestroyedByFire(World world, int x, int y, int z)
  {
    dropBlockAsItem_do(world, x, y, z, new ItemStack(GPEBTWTweak.gpeItemAsh.itemID, 1, 0));
  }

  public float getBlockHardness(World world, int x, int y, int z)
  {
    float multiplier = 1;
    int meta = world.getBlockMetadata(x, y, z);
    // If meta is 12, it is a hard stump
    if (meta == 12) multiplier = 3;
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
    if (pos == 12)
    {
      if (side <= 1) return iconsTrunkTop[typ];
      return iconsTrunkSide[typ];
    }
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
    iconsTrunkSide = new Icon[treeSide.length];
    iconsTrunkTop = new Icon[treeSide.length];
    for (int i = 0; i < iconsSide.length; i++)
    {
      iconsTop[i] = r.registerIcon(treeTop[i]);
      iconsSide[i] = r.registerIcon(treeSide[i]);
      iconsTrunkTop[i] = r.registerIcon(trunkTop[i]);
      iconsTrunkSide[i] = r.registerIcon(trunkSide[i]);
    }
    Block.wood.registerIcons(r);
  }
}
