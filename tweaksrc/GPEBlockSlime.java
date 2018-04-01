package net.minecraft.src;

public class GPEBlockSlime extends Block
{
  public GPEBlockSlime(int id)
  {
    super(id, Material.clay);
    setHardness(0.1F);
    setStepSound(FCBetterThanWolves.fcSoundSquishFootstep);
    setUnlocalizedName("gpeBlockSlime");
    setCreativeTab(CreativeTabs.tabBlock);
    GPEBTWTweak.setAxesEffective(this);
  }

  public int getRenderBlockPass()
  {
    return 1;
  }

  public AxisAlignedBB getCollisionBoundingBoxFromPool(World world, int x, int y, int z)
  {
    return AxisAlignedBB.getAABBPool().getAABB((double)x, (double)y, (double)z, (double)(x + 1), (double)(y) + (1 - 4/16D), (double)(z + 1));
  }
  
  public boolean isOpaqueCube()
  {
    return false;
  }
  
  public float GetMovementModifier(World world, int x, int y, int z)
  {
    return 0.5F;
  }

  @ClientOnly
  public boolean shouldSideBeRendered(IBlockAccess b, int x, int y, int z, int side)
  {
    return super.shouldSideBeRendered(b, x, y, z, 1 - side);
  }
}
