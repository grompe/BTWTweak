package net.minecraft.src;

public class GPEBlockLadder extends FCBlockLadder
{
  protected GPEBlockLadder(int id)
  {
    super(id);
    setHardness(0.4F);
    setStepSound(soundLadderFootstep);
    setUnlocalizedName("ladder");
  }

  public boolean canPlaceBlockAt(World world, int x, int y, int z)
  {
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z + 1, 2)) return true;
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z - 1, 3)) return true;
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x + 1, y, z, 4)) return true;
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x - 1, y, z, 5)) return true;
    return false;
  }

  public int onBlockPlaced(World world, int x, int y, int z, int side, float hitX, float hitY, float hitZ, int meta)
  {
    int tryside = meta;
    if ((tryside == 0 || side == 2) && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z + 1, 2)) tryside = 2;
    if ((tryside == 0 || side == 3) && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z - 1, 3)) tryside = 3;
    if ((tryside == 0 || side == 4) && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x + 1, y, z, 4)) tryside = 4;
    if ((tryside == 0 || side == 5) && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x - 1, y, z, 5)) tryside = 5;
    return tryside;
  }

  public void onNeighborBlockChange(World world, int x, int y, int z, int id)
  {
    int meta = world.getBlockMetadata(x, y, z);
    boolean stays = false;

    if (meta == 2 && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z + 1, 2)) stays = true;
    if (meta == 3 && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z - 1, 3)) stays = true;
    if (meta == 4 && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x + 1, y, z, 4)) stays = true;
    if (meta == 5 && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x - 1, y, z, 5)) stays = true;

    if (!stays)
    {
      this.dropBlockAsItem(world, x, y, z, meta, 0);
      world.setBlockToAir(x, y, z);
    }
  }
}
