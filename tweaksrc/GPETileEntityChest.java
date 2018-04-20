package net.minecraft.src;

public class GPETileEntityChest extends FCTileEntityChest
{
  public boolean oldChecked = false;

  public void writeToNBT(NBTTagCompound nbt)
  {
    super.writeToNBT(nbt);
    nbt.setBoolean("oldChecked", oldChecked);
  }

  public void readFromNBT(NBTTagCompound nbt)
  {
    super.readFromNBT(nbt);
    if (nbt.hasKey("oldChecked")) oldChecked = nbt.getBoolean("oldChecked");
  }

  public void checkForAdjacentChests()
  {
    if (!adjacentChestChecked)
    {
      adjacentChestChecked = true;
      adjacentChestZNeg = null;
      adjacentChestXPos = null;
      adjacentChestXNeg = null;
      adjacentChestZPosition = null; // MCP naming error...

      switch (getBlockMetadata())
      {
        case 6:  // +x has a chest
        case 7:  adjacentChestXPos = (TileEntityChest)worldObj.getBlockTileEntity(xCoord + 1, yCoord, zCoord); break;

        case 8:  // +z has a chest
        case 9:  adjacentChestZPosition = (TileEntityChest)worldObj.getBlockTileEntity(xCoord, yCoord, zCoord + 1); break;

        case 10: // -x has a chest
        case 11: adjacentChestXNeg = (TileEntityChest)worldObj.getBlockTileEntity(xCoord - 1, yCoord, zCoord); break;

        case 12: // -z has a chest
        case 13: adjacentChestZNeg = (TileEntityChest)worldObj.getBlockTileEntity(xCoord, yCoord, zCoord - 1); break;
        // single chest
        default: if (!oldChecked) checkForVanillaChests();
      }
    }
  }

  public void checkForVanillaChests()
  {
    Block block = getBlockType();
    if (block == null) return;
    if (!isChestID(block.blockID)) return;

    oldChecked = true;

    int meta = getBlockMetadata();
    ((GPEBlockChest)block).mergeChests(worldObj, xCoord, yCoord, zCoord, meta);

    if (isChestID(worldObj.getBlockId(xCoord - 1, yCoord, zCoord)))
    {
      adjacentChestXNeg = (TileEntityChest)worldObj.getBlockTileEntity(xCoord - 1, yCoord, zCoord);
      ((GPETileEntityChest)adjacentChestXNeg).oldChecked = true;
    }
    else if (isChestID(worldObj.getBlockId(xCoord + 1, yCoord, zCoord)))
    {
      adjacentChestXPos = (TileEntityChest)worldObj.getBlockTileEntity(xCoord + 1, yCoord, zCoord);
      ((GPETileEntityChest)adjacentChestXPos).oldChecked = true;
    }
    else if (isChestID(worldObj.getBlockId(xCoord, yCoord, zCoord - 1)))
    {
      adjacentChestZNeg = (TileEntityChest)worldObj.getBlockTileEntity(xCoord, yCoord, zCoord - 1);
      ((GPETileEntityChest)adjacentChestZNeg).oldChecked = true;
    }
    else if (isChestID(worldObj.getBlockId(xCoord, yCoord, zCoord + 1)))
    {
      adjacentChestZPosition = (TileEntityChest)worldObj.getBlockTileEntity(xCoord, yCoord, zCoord + 1);
      ((GPETileEntityChest)adjacentChestZPosition).oldChecked = true;
    }
  }

  private boolean isChestID(int id)
  {
    return id == Block.chest.blockID || id == 1035;
  }
}
