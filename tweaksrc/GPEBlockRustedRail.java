package net.minecraft.src;

public class GPEBlockRustedRail extends BlockRailBase
{
  protected GPEBlockRustedRail(int id)
  {
    super(id, true);
    setHardness(0.4F);
    setStepSound(soundMetalFootstep);
    setUnlocalizedName("gpeBlockRustedRail");
    GPEBTWTweak.setAxesEffective(this);
    GPEBTWTweak.setPicksEffective(this);
  }

  public boolean canPlaceBlockAt(World world, int x, int y, int z)
  {
    return false;
  }
}
