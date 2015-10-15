package net.minecraft.src;

public class GPETileEntityRename extends TileEntity implements IInventory
{
  private ItemStack[] contents = new ItemStack[3];
  public GPEContainerRename theContainer;
  protected String customName;

  public int getSizeInventory()
  {
    return 3;
  }

  public ItemStack getStackInSlot(int index)
  {
    return contents[index];
  }

  public ItemStack decrStackSize(int index, int amount)
  {
    if (contents[index] == null) return null;

    ItemStack stack;
    if (contents[index].stackSize <= amount)
    {
      stack = contents[index];
      contents[index] = null;
      onInventoryChanged();
    } else {
      stack = contents[index].splitStack(amount);
      if (contents[index].stackSize == 0)
      {
        contents[index] = null;
      }
      onInventoryChanged();
    }
    return stack;
  }

  public ItemStack getStackInSlotOnClosing(int index)
  {
    if (contents[index] == null) return null;

    ItemStack stack = contents[index];
    contents[index] = null;
    return stack;
  }

  public void onInventoryChanged()
  {
    super.onInventoryChanged();
    theContainer.onCraftMatrixChanged(this);
  }

  public void setInventorySlotContents(int index, ItemStack stack)
  {
    contents[index] = stack;
    if (stack != null && stack.stackSize > getInventoryStackLimit())
    {
      stack.stackSize = getInventoryStackLimit();
    }
    onInventoryChanged();
  }

  public int addItem(ItemStack stack)
  {
    if (stack.itemID == GPEBTWTweak.gpeItemQuill.itemID)
    {
      if (contents[1] == null)
      {
        setInventorySlotContents(1, stack);
        return 1;
      }
    }
    else if (stack.itemID == Item.paper.itemID)
    {
      if (contents[2] == null)
      {
        setInventorySlotContents(2, stack);
        return 2;
      }
    } else {
      if (contents[0] == null)
      {
        setInventorySlotContents(0, stack);
        return 0;
      }
    }
    return -1;
  }

  public String getInvName()
  {
    return isInvNameLocalized() ? customName : "container.rename";
  }

  public void setCustomName(String name)
  {
    customName = name;
  }

  public boolean isInvNameLocalized()
  {
    return customName != null;
  }

  public void readFromNBT(NBTTagCompound nbt)
  {
    super.readFromNBT(nbt);
    NBTTagList tags = nbt.getTagList("Items");
    contents = new ItemStack[getSizeInventory()];

    for (int i = 0; i < tags.tagCount(); ++i)
    {
      NBTTagCompound tag = (NBTTagCompound)tags.tagAt(i);
      int slotIndex = tag.getByte("Slot") & 255;
      if (slotIndex >= 0 && slotIndex < contents.length)
      {
        contents[slotIndex] = ItemStack.loadItemStackFromNBT(tag);
      }
    }
    if (nbt.hasKey("CustomName"))
    {
      customName = nbt.getString("CustomName");
    }
  }

  public void writeToNBT(NBTTagCompound nbt)
  {
    super.writeToNBT(nbt);
    NBTTagList tags = new NBTTagList();

    for (int i = 0; i < contents.length; ++i)
    {
      if (contents[i] != null)
      {
        NBTTagCompound tag = new NBTTagCompound();
        tag.setByte("Slot", (byte)i);
        contents[i].writeToNBT(tag);
        tags.appendTag(tag);
      }
    }
    nbt.setTag("Items", tags);

    if (isInvNameLocalized())
    {
      nbt.setString("CustomName", customName);
    }
  }

  public int getInventoryStackLimit()
  {
    return 64;
  }

  public boolean isUseableByPlayer(EntityPlayer player)
  {
    if (worldObj.getBlockTileEntity(xCoord, yCoord, zCoord) != this) return false;
    return player.getDistanceSq((double)xCoord + 0.5D, (double)yCoord + 0.5D, (double)zCoord + 0.5D) <= 64.0D;
  }

  public void openChest() {}

  public void closeChest() {}

  public boolean isStackValidForSlot(int index, ItemStack stack)
  {
    if (index == 1) return stack.itemID == GPEBTWTweak.gpeItemQuill.itemID;
    if (index == 2) return stack.itemID == Item.paper.itemID;
    return true;
  }
}
