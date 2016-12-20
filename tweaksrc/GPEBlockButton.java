package net.minecraft.src;

import java.util.List;
import java.util.Random;

public abstract class GPEBlockButton extends Block
{
  private final boolean sensible;

  protected GPEBlockButton(int id, boolean wooden)
  {
    super(id, Material.circuits);
    setTickRandomly(true);
    setCreativeTab(CreativeTabs.tabRedstone);
    sensible = wooden;
  }

  public AxisAlignedBB getCollisionBoundingBoxFromPool(World world, int x, int y, int z)
  {
    return null;
  }

  public int tickRate(World world)
  {
    return sensible ? 30 : 20;
  }

  public boolean isOpaqueCube()
  {
    return false;
  }

  public boolean renderAsNormalBlock()
  {
    return false;
  }

  public boolean canPlaceBlockAt(World world, int x, int y, int z)
  {
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y + 1, z, 0)) return true;
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y - 1, z, 1)) return true;
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z + 1, 2)) return true;
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z - 1, 3)) return true;
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x + 1, y, z, 4)) return true;
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x - 1, y, z, 5)) return true;
    return false;
  }

  public int onBlockPlaced(World world, int x, int y, int z, int side, float hitX, float hitY, float hitZ, int initmeta)
  {
    int meta = world.getBlockMetadata(x, y, z);
    int press = meta & 8;
    meta &= 7;
    if      (side == 0 && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y + 1, z, 0))
    {
      meta = 0;
    }
    else if (side == 1 && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y - 1, z, 1))
    {
      meta = 5;
    }
    else if (side == 2 && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z + 1, 2))
    {
      meta = 4;
    }
    else if (side == 3 && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z - 1, 3))
    {
      meta = 3;
    }
    else if (side == 4 && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x + 1, y, z, 4))
    {
      meta = 2;
    }
    else if (side == 5 && FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x - 1, y, z, 5))
    {
      meta = 1;
    }
    else
    {
      meta = getOrientation(world, x, y, z);
    }
    return meta + press;
  }

  private int getOrientation(World world, int x, int y, int z)
  {
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y + 1, z, 0)) return 0;
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y - 1, z, 1)) return 5;
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z + 1, 2)) return 4;
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z - 1, 3)) return 3;
    if (FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x + 1, y, z, 4)) return 2;
    return 1;
  }

  public void onNeighborBlockChange(World world, int x, int y, int z, int id)
  {
    int orientation = world.getBlockMetadata(x, y, z) & 7;
    boolean shouldDrop = false;
    if (orientation == 0 && !FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y + 1, z, 0))
    {
      shouldDrop = true;
    }
    if (orientation == 5 && !FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y - 1, z, 1))
    {
      shouldDrop = true;
    }
    if (orientation == 4 && !FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z + 1, 2))
    {
      shouldDrop = true;
    }
    if (orientation == 3 && !FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x, y, z - 1, 3))
    {
      shouldDrop = true;
    }
    if (orientation == 2 && !FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x + 1, y, z, 4))
    {
      shouldDrop = true;
    }
    if (orientation == 1 && !FCUtilsWorld.DoesBlockHaveLargeCenterHardpointToFacing(world, x - 1, y, z, 5))
    {
      shouldDrop = true;
    }
    if (shouldDrop)
    {
      dropBlockAsItem(world, x, y, z, world.getBlockMetadata(x, y, z), 0);
      world.setBlockToAir(x, y, z);
    }
  }

  public void setBlockBoundsBasedOnState(IBlockAccess b, int x, int y, int z)
  {
    int meta = b.getBlockMetadata(x, y, z);
    setButtonBounds(meta);
  }

  private void setButtonBounds(int meta)
  {
    int orientation = meta & 7;
    boolean pressed = (meta & 8) > 0;
    float topY = 6/16F;
    float bottomY = 10/16F;
    float halfWidth = 3/16F;
    float depth = 2/16F;
    if (pressed) depth = 1/16F;
    if (orientation == 0)
    {
      setBlockBounds(0.5F - halfWidth, 1.0F - depth, 0.5F - halfWidth, 0.5F + halfWidth, 1.0F, 0.5F + halfWidth);
    }
    else if (orientation == 1)
    {
      setBlockBounds(0.0F            , topY, 0.5F - halfWidth, depth           , bottomY, 0.5F + halfWidth);
    }
    else if (orientation == 2)
    {
      setBlockBounds(1.0F - depth    , topY, 0.5F - halfWidth, 1.0F            , bottomY, 0.5F + halfWidth);
    }
    else if (orientation == 3)
    {
      setBlockBounds(0.5F - halfWidth, topY, 0.0F            , 0.5F + halfWidth, bottomY, depth);
    }
    else if (orientation == 4)
    {
      setBlockBounds(0.5F - halfWidth, topY, 1.0F - depth    , 0.5F + halfWidth, bottomY, 1.0F);
    }
    else
    {
      setBlockBounds(0.5F - halfWidth, 0.0F, 0.5F - halfWidth, 0.5F + halfWidth, depth  , 0.5F + halfWidth);
    }
  }

  public void onBlockClicked(World world, int x, int y, int z, EntityPlayer player) {}

  public boolean onBlockActivated(World world, int x, int y, int z, EntityPlayer player, int side, float xOffset, float yOffset, float zOffset)
  {
    int meta = world.getBlockMetadata(x, y, z);
    int orientation = meta & 7;
    int notPressedBit = 8 - (meta & 8);
    if (notPressedBit == 0)
    {
      // already pressed
      return true;
    }
    else
    {
      world.setBlockMetadataWithNotify(x, y, z, orientation + notPressedBit, 3);
      world.markBlockRangeForRenderUpdate(x, y, z, x, y, z);
      world.playSoundEffect((double)x + 0.5D, (double)y + 0.5D, (double)z + 0.5D, "random.click", 0.3F, 0.6F);
      notifyNeighbor(world, x, y, z, orientation);
      world.scheduleBlockUpdate(x, y, z, blockID, tickRate(world));
      return true;
    }
  }

  public void breakBlock(World world, int x, int y, int z, int id, int meta)
  {
    if ((meta & 8) > 0)
    {
      int orientation = meta & 7;
      notifyNeighbor(world, x, y, z, orientation);
    }
    super.breakBlock(world, x, y, z, id, meta);
  }

  public int isProvidingWeakPower(IBlockAccess b, int x, int y, int z, int side)
  {
    return (b.getBlockMetadata(x, y, z) & 8) > 0 ? 15 : 0;
  }

  public int isProvidingStrongPower(IBlockAccess b, int x, int y, int z, int side)
  {
    int meta = b.getBlockMetadata(x, y, z);
    if ((meta & 8) == 0)
    {
      return 0;
    }
    else
    {
      int orientation = meta & 7;
      if (orientation == 5 && side == 1) return 15;
      if (orientation == 4 && side == 2) return 15;
      if (orientation == 3 && side == 3) return 15;
      if (orientation == 2 && side == 4) return 15;
      if (orientation == 1 && side == 5) return 15;
      if (orientation == 0 && side == 0) return 15;
      return 0;
    }
  }

  public boolean canProvidePower()
  {
    return true;
  }

  public void updateTick(World world, int x, int y, int z, Random random)
  {
    if (!world.isRemote)
    {
      int meta = world.getBlockMetadata(x, y, z);
      if ((meta & 8) != 0)
      {
        if (sensible)
        {
          checkForArrows(world, x, y, z);
        }
        else
        {
          world.setBlockMetadataWithNotify(x, y, z, meta & 7, 3);
          int orientation = meta & 7;
          notifyNeighbor(world, x, y, z, orientation);
          world.playSoundEffect((double)x + 0.5D, (double)y + 0.5D, (double)z + 0.5D, "random.click", 0.3F, 0.5F);
          world.markBlockRangeForRenderUpdate(x, y, z, x, y, z);
        }
      }
    }
  }

  public void setBlockBoundsForItemRender()
  {
    float dx = 3/16F;
    float dy = 2/16F;
    float dz = 2/16F;
    setBlockBounds(0.5F - dx, 0.5F - dy, 0.5F - dz, 0.5F + dx, 0.5F + dy, 0.5F + dz);
  }

  public void onEntityCollidedWithBlock(World world, int x, int y, int z, Entity entity)
  {
    if (!world.isRemote && sensible && (world.getBlockMetadata(x, y, z) & 8) == 0)
    {
      checkForArrows(world, x, y, z);
    }
  }

  private void checkForArrows(World world, int x, int y, int z)
  {
    int meta = world.getBlockMetadata(x, y, z);
    int orientation = meta & 7;
    boolean pressed = (meta & 8) != 0;
    setButtonBounds(meta);
    List arrows = world.getEntitiesWithinAABB(EntityArrow.class, AxisAlignedBB.getAABBPool().getAABB(
      (double)x + minX, (double)y + minY, (double)z + minZ,
      (double)x + maxX, (double)y + maxY, (double)z + maxZ)
    );
    boolean hit = !arrows.isEmpty();
    if (hit && !pressed)
    {
      world.setBlockMetadataWithNotify(x, y, z, orientation | 8, 3);
      notifyNeighbor(world, x, y, z, orientation);
      world.markBlockRangeForRenderUpdate(x, y, z, x, y, z);
      world.playSoundEffect((double)x + 0.5D, (double)y + 0.5D, (double)z + 0.5D, "random.click", 0.3F, 0.6F);
    }
    if (!hit && pressed)
    {
      world.setBlockMetadataWithNotify(x, y, z, orientation, 3);
      notifyNeighbor(world, x, y, z, orientation);
      world.markBlockRangeForRenderUpdate(x, y, z, x, y, z);
      world.playSoundEffect((double)x + 0.5D, (double)y + 0.5D, (double)z + 0.5D, "random.click", 0.3F, 0.5F);
    }
    if (hit)
    {
      world.scheduleBlockUpdate(x, y, z, blockID, tickRate(world));
    }
  }

  private void notifyNeighbor(World world, int x, int y, int z, int orientation)
  {
    world.notifyBlocksOfNeighborChange(x, y, z, blockID);
    if (orientation == 0)
    {
      world.notifyBlocksOfNeighborChange(x, y + 1, z, blockID);
    }
    else if (orientation == 1)
    {
      world.notifyBlocksOfNeighborChange(x - 1, y, z, blockID);
    }
    else if (orientation == 2)
    {
      world.notifyBlocksOfNeighborChange(x + 1, y, z, blockID);
    }
    else if (orientation == 3)
    {
      world.notifyBlocksOfNeighborChange(x, y, z - 1, blockID);
    }
    else if (orientation == 4)
    {
      world.notifyBlocksOfNeighborChange(x, y, z + 1, blockID);
    }
    else
    {
      world.notifyBlocksOfNeighborChange(x, y - 1, z, blockID);
    }
  }

  public void registerIcons(IconRegister r) {}
}
