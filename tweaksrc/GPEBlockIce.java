package net.minecraft.src;

import java.util.Random;

public class GPEBlockIce extends FCBlockIce
{
  protected GPEBlockIce(int id)
  {
    super(id);
    setHardness(0.5F);
    setLightOpacity(3);
    setStepSound(soundGlassFootstep);
    setUnlocalizedName("ice");
    GPEBTWTweak.setPicksEffective(this);
  }

  public void updateTick(World world, int x, int y, int z, Random random)
  {
    checkMelting(world, x, y, z);
  }

  private void checkMelting(World world, int x, int y, int z)
  {
    if (!FCUtilsMisc.IsIKInColdBiome(world, x, z)
      && (world.getBlockLightValue(x, y, z) > 8)
      || (world.getSavedLightValue(EnumSkyBlock.Block, x, y, z) > 8)
      )
    {
      if (IsNonSourceIce(world, x, y, z))
      {
        FCUtilsMisc.PlaceNonPersistantWater(world, x, y, z);
      }
      else
      {
        world.setBlockWithNotify(x, y, z, Block.waterMoving.blockID);
      }
    }
  }

  public void onBlockAdded(World world, int x, int y, int z)
  {
    if (world.provider.isHellWorld)
    {
      world.setBlockWithNotify(x, y, z, 0);
      world.playSoundEffect((double)x + 0.5D, (double)y + 0.5D, (double)z + 0.5D, "random.fizz", 0.5F, 2.6F + (world.rand.nextFloat() - world.rand.nextFloat()) * 0.8F);

      for (int i = 0; i < 8; ++i)
      {
        world.spawnParticle("largesmoke", (double)x + Math.random(), (double)y + Math.random(), (double)z + Math.random(), 0.0D, 0.0D, 0.0D);
      }
    } else {
      world.scheduleBlockUpdate(x, y, z, this.blockID, this.tickRate(world));
    }
  }
}
