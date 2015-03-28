package net.minecraft.src;

import java.util.Iterator;

public class GPEBlockChest extends FCBlockChest
{
  /*^^* *--* *--* *--* Chest metadata
   |2 | |3 | <4 | |5 >
   *--* *vv* *--* *--*

   *-^^ *--- *--* *--*    -z
   |6   |7   |8 | |9 | -x -|- +x
   *--- *-vv <  | |  >    +z

   ^^-* ---* <  | |  >
    10|  11| |12| |13>
   ---* vv-* *--* *--*/

  protected GPEBlockChest(int id)
  {
    super(id, 0);
    setHardness(2.5F);
    setStepSound(soundWoodFootstep);
    setUnlocalizedName("chest");
    ItemAxe.SetAllAxesToBeEffectiveVsBlock(this);
  }

  public AxisAlignedBB getCollisionBoundingBoxFromPool(World world, int x, int y, int z)
  {
    int meta = world.getBlockMetadata(x, y, z);
    AABBPool pool = AxisAlignedBB.getAABBPool();
    switch (meta)
    {
      case 6:  // +x has a chest
      case 7:  return pool.getAABB(x + 1/16F, y, z + 1/16F, x + 16/16F, y + 14/16F, z + 15/16F);

      case 8:  // +z has a chest
      case 9:  return pool.getAABB(x + 1/16F, y, z + 1/16F, x + 15/16F, y + 14/16F, z + 16/16F);

      case 10: // -x has a chest
      case 11: return pool.getAABB(x + 0/16F, y, z + 1/16F, x + 15/16F, y + 14/16F, z + 15/16F);

      case 12: // -z has a chest
      case 13: return pool.getAABB(x + 1/16F, y, z + 0/16F, x + 15/16F, y + 14/16F, z + 15/16F);
      // single chest
      default: return pool.getAABB(x + 1/16F, y, z + 1/16F, x + 15/16F, y + 14/16F, z + 15/16F);
    }
  }

  public void setBlockBoundsBasedOnState(IBlockAccess a, int x, int y, int z)
  {
    int meta = a.getBlockMetadata(x, y, z);
    switch (meta)
    {
      case 6:  // +x has a chest
      case 7:  setBlockBounds(1/16F, 0/16F, 1/16F, 16/16F, 14/16F, 15/16F); break;

      case 8:  // +z has a chest
      case 9:  setBlockBounds(1/16F, 0/16F, 1/16F, 15/16F, 14/16F, 16/16F); break;

      case 10: // -x has a chest
      case 11: setBlockBounds(0/16F, 0/16F, 1/16F, 15/16F, 14/16F, 15/16F); break;

      case 12: // -z has a chest
      case 13: setBlockBounds(1/16F, 0/16F, 0/16F, 15/16F, 14/16F, 15/16F); break;
      // single chest
      default: setBlockBounds(1/16F, 0/16F, 1/16F, 15/16F, 14/16F, 15/16F);
    }
  }

  public void onBlockAdded(World world, int x, int y, int z)
  {
    // Double call to mergeChests breaks it - don't
    // TileEntity will check and merge vanilla-style anyway, so everything works
    //mergeChests(world, x, y, z, 2);
  }

  public void onBlockPlacedBy(World world, int x, int y, int z, EntityLiving entity, ItemStack stack)
  {
    int side2 = 0;
    int side = MathHelper.floor_double((double)(entity.rotationYaw * 4.0F / 360.0F) + 0.5D) & 3;
    if (side == 0) side2 = 2;
    if (side == 1) side2 = 5;
    if (side == 2) side2 = 3;
    if (side == 3) side2 = 4;
    mergeChests(world, x, y, z, side2);

    GPETileEntityChest t = ((GPETileEntityChest)world.getBlockTileEntity(x, y, z));
    t.oldChecked = true;
    if (stack.hasDisplayName())
    {
      t.func_94043_a(stack.getDisplayName());
    }
  }
  
  public void unifyAdjacentChests(World world, int x, int y, int z)
  {
  }

  public void mergeChests(World world, int x, int y, int z, int side)
  {
    if (world.isRemote) return;
    if (world.getBlockId(x, y, z - 1) == this.blockID && world.getBlockMetadata(x, y, z - 1) <= 5)
    {
      if (side == 5)
      {
        world.setBlockMetadataWithNotify(x, y, z, 13, 2);
        world.setBlockMetadataWithNotify(x, y, z - 1, 9, 2);
      } else {
        world.setBlockMetadataWithNotify(x, y, z, 12, 2);
        world.setBlockMetadataWithNotify(x, y, z - 1, 8, 2);
      }
    }
    else if (world.getBlockId(x, y, z + 1) == this.blockID && world.getBlockMetadata(x, y, z + 1) <= 5)
    {
      if (side == 5)
      {
        world.setBlockMetadataWithNotify(x, y, z, 9, 2);
        world.setBlockMetadataWithNotify(x, y, z + 1, 13, 2);
      } else {
        world.setBlockMetadataWithNotify(x, y, z, 8, 2);
        world.setBlockMetadataWithNotify(x, y, z + 1, 12, 2);
      }
    }
    else if (world.getBlockId(x - 1, y, z) == this.blockID && world.getBlockMetadata(x - 1, y, z) <= 5)
    {
      if (side == 3)
      {
        world.setBlockMetadataWithNotify(x, y, z, 11, 2);
        world.setBlockMetadataWithNotify(x - 1, y, z, 7, 2);
      } else {
        world.setBlockMetadataWithNotify(x, y, z, 10, 2);
        world.setBlockMetadataWithNotify(x - 1, y, z, 6, 2);
      }
    }
    else if (world.getBlockId(x + 1, y, z) == this.blockID && world.getBlockMetadata(x + 1, y, z) <= 5)
    {
      if (side == 3)
      {
        world.setBlockMetadataWithNotify(x, y, z, 7, 2);
        world.setBlockMetadataWithNotify(x + 1, y, z, 11, 2);
      } else {
        world.setBlockMetadataWithNotify(x, y, z, 6, 2);
        world.setBlockMetadataWithNotify(x + 1, y, z, 10, 2);
      }
    }
    else
    {
      world.setBlockMetadataWithNotify(x, y, z, side, 2);
    }
  }

  private void unmergeChest(World world, int x, int y, int z)
  {
    if (world.isRemote) return;
    int meta = world.getBlockMetadata(x, y, z);
    switch (meta)
    {
      case 6:  // +x had a chest
      case 7:  if (world.getBlockId(x + 1, y, z) != this.blockID || world.getBlockMetadata(x + 1, y, z) != meta + 4)
               {
                 world.setBlockMetadataWithNotify(x, y, z, meta - 4, 2);
               }
               break;
      case 8:  // +z had a chest
      case 9:  if (world.getBlockId(x, y, z + 1) != this.blockID || world.getBlockMetadata(x, y, z + 1) != meta + 4)
               {
                 world.setBlockMetadataWithNotify(x, y, z, meta - 4, 2);
               }
               break;
      case 10: // -x had a chest
      case 11: if (world.getBlockId(x - 1, y, z) != this.blockID || world.getBlockMetadata(x - 1, y, z) != meta - 4)
               {
                 world.setBlockMetadataWithNotify(x, y, z, meta - 8, 2);
               }
               break;
      case 12: // -z had a chest
      case 13: if (world.getBlockId(x, y, z - 1) != this.blockID || world.getBlockMetadata(x, y, z - 1) != meta - 4)
               {
                 world.setBlockMetadataWithNotify(x, y, z, meta - 8, 2);
               }
               break;
      default:
    }
  }

  public boolean canPlaceBlockAt(World world, int x, int y, int z)
  {
    return true;
  }

  public void onNeighborBlockChange(World world, int x, int y, int z, int id)
  {
    super.onNeighborBlockChange(world, x, y, z, id);
    unmergeChest(world, x, y, z);
  }

  public IInventory getInventory(World world, int x, int y, int z)
  {
    IInventory t = (TileEntityChest)world.getBlockTileEntity(x, y, z);
    if (t == null) return null;
    if (world.isBlockNormalCube(x, y + 1, z)) return null;
    if (isOcelotBlockingChest(world, x, y, z)) return null;
    int meta = world.getBlockMetadata(x, y, z);
    switch (meta)
    {
      case 6:  // +x has a chest
      case 7:  if (world.isBlockNormalCube(x + 1, y + 1, z) || isOcelotBlockingChest(world, x + 1, y, z)) return null;
               t = new InventoryLargeChest("container.chestDouble", t, (TileEntityChest)world.getBlockTileEntity(x + 1, y, z));
               break;
      case 8:  // +z has a chest
      case 9:  if (world.isBlockNormalCube(x, y + 1, z + 1) || isOcelotBlockingChest(world, x, y, z + 1)) return null;
               t = new InventoryLargeChest("container.chestDouble", t, (TileEntityChest)world.getBlockTileEntity(x, y, z + 1));
               break;
      case 10: // -x has a chest
      case 11: if (world.isBlockNormalCube(x - 1, y + 1, z) || isOcelotBlockingChest(world, x - 1, y, z)) return null;
               t = new InventoryLargeChest("container.chestDouble", (TileEntityChest)world.getBlockTileEntity(x - 1, y, z), t);
               break;
      case 12: // -z has a chest
      case 13: if (world.isBlockNormalCube(x, y + 1, z - 1) || isOcelotBlockingChest(world, x, y, z - 1)) return null;
               t = new InventoryLargeChest("container.chestDouble", (TileEntityChest)world.getBlockTileEntity(x, y, z - 1), t);
               break;
      default:
    }
    return t;
  }

  private static boolean isOcelotBlockingChest(World world, int x, int y, int z)
  {
    Iterator iter = world.getEntitiesWithinAABB(EntityOcelot.class,
      AxisAlignedBB.getAABBPool().getAABB(x, y + 1, z, x + 1, y + 2, z + 1)).iterator();
    EntityOcelot ocelot;
    do
    {
      if (!iter.hasNext()) return false;

      ocelot = (EntityOcelot)iter.next();
    }
    while (!ocelot.isSitting());

    return true;
  }

  public TileEntity createNewTileEntity(World world)
  {
    return new GPETileEntityChest();
  }

}
