package net.minecraft.src;

import java.util.List;

// This class is active in BTW 4.AA+
public class GPEBlockLogDamaged extends FCBlockLogDamaged
{
  public static final String[] treeSide = new String[] {"fcBlockLogChewedOak_side", "debarked_spruce", "debarked_birch", "debarked_jungle", "debarked_bloodwood"};
  public static final String[] treeTop = new String[] {"tree_top", "tree_top_spruce", "tree_top_birch", "tree_top_jungle", "fcBlockBloodWood"};
  public static final String[] trunkTop = new String[] {"fcBlockTrunkTop", "trunk_top_spruce", "trunk_top_birch", "trunk_top_jungle", "fcBlockBloodWood"};
  private Icon iconSide;
  private Icon iconTrunkTop;
  private int treeType;

  public GPEBlockLogDamaged(int id, int treeType)
  {
    super(id);
    setStepSound(soundWoodFootstep);
    setUnlocalizedName("fcBlockLogDamaged");
    GPEBTWTweak.setAxesEffective(this);
    GPEBTWTweak.setChiselsEffective(this);
    this.treeType = treeType;
  }

  public float getBlockHardness(World world, int x, int y, int z)
  {
    float multiplier = 1;
    int meta = world.getBlockMetadata(x, y, z);
    // Hard stump
    if ((meta & 12) == 12) multiplier = 3;
    // Make jungle wood somewhat softer, pine a bit softer
    if (treeType == 1) return 1.3F * multiplier;
    if (treeType == 3) return 1.0F * multiplier;
    return 1.5F * multiplier;
  }

  /*
  public void setBlockBoundsBasedOnState(IBlockAccess a, int x, int y, int z)
  {
    int meta = a.getBlockMetadata(x, y, z);
    int pos = meta & 12;
    int damage = meta & 3;
    setBlockBounds(0.0F, 0.0F, 0.0F, 1.0F, 1.0F, 1.0F);
  }
  */

  public void harvestBlock(World world, EntityPlayer player, int x, int y, int z, int meta)
  {
    player.addStat(StatList.mineBlockStatArray[blockID], 1);
    player.addExhaustion(0.025F);
    
    ItemStack tool = player.inventory.getCurrentItem();
    if (!world.isRemote && tool != null)
    {
      if (tool.getItem() instanceof FCItemAxe)
      {
        for (int i = 0; i < 4 - (meta & 3); i++)
        {
          dropBlockAsItem_do(world, x, y, z, new ItemStack(GPEBTWTweak.compatItemSawDust));
        }
        return;
      }
    }
    int fortune = EnchantmentHelper.getFortuneModifier(player);
    dropBlockAsItem(world, x, y, z, meta, fortune);
  }

  @ClientOnly
  public Icon getIcon(int side, int meta)
  {
    int pos = meta & 12;
    if (pos == 12)
    {
      if (side <= 1) return iconTrunkTop;
      return iconSide;
    }
    return
      (
        (pos == 0 && (side == 1 || side == 0)) ||
        (pos == 4 && (side == 5 || side == 4)) ||
        (pos == 8 && (side == 2 || side == 3))
      )
      ? blockIcon
      : iconSide;
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    blockIcon = r.registerIcon(treeTop[treeType]);
    iconSide = r.registerIcon(treeSide[treeType]);
    iconTrunkTop = r.registerIcon(trunkTop[treeType]);
  }
}
