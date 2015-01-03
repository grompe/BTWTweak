package net.minecraft.src;

public class GPEContainerRename extends Container
{
  private IInventory outputSlot = new InventoryCraftResult();
  private GPETileEntityRename tile;
  private World theWorld;
  private String newItemName;
  private final EntityPlayer thePlayer;

  public GPEContainerRename(InventoryPlayer inventory, World world, GPETileEntityRename tileEntity)
  {
    theWorld = world;
    thePlayer = inventory.player;
    tile = tileEntity;
    tile.theContainer = this;
    addSlotToContainer(new Slot(tile, 0, 38, 46));
    addSlotToContainer(new GPESlotRename(this, tile, 1, 60, 37, 0)); // quill
    addSlotToContainer(new GPESlotRename(this, tile, 2, 60, 55, 1)); // paper
    addSlotToContainer(new GPESlotRename(this, outputSlot, 3, 118, 46, 2));
    int i;
    for (i = 0; i < 3; ++i)
    {
      for (int j = 0; j < 9; ++j)
      {
        addSlotToContainer(new Slot(inventory, j + i * 9 + 9, 8 + j * 18, 86 + i * 18));
      }
    }
    for (i = 0; i < 9; ++i)
    {
      addSlotToContainer(new Slot(inventory, i, 8 + i * 18, 144));
    }
  }

  public void onCraftMatrixChanged(IInventory inventory)
  {
    super.onCraftMatrixChanged(inventory);
    if (inventory == tile)
    {
      updateRenameOutput();
    }
  }

  public void updateRenameOutput()
  {
    ItemStack stackSubj = tile.getStackInSlot(0);
    ItemStack stackInk = tile.getStackInSlot(1);
    ItemStack stackPaper = tile.getStackInSlot(2);
    if (stackInk == null || stackPaper == null
      || stackInk.itemID != GPEBTWTweak.gpeItemQuill.itemID
      || stackPaper.itemID != Item.paper.itemID)
    {
      outputSlot.setInventorySlotContents(0, (ItemStack)null);
      return;
    }
    ItemStack stackResult;
    if (stackSubj == null)
    {
      stackResult = new ItemStack(GPEBTWTweak.gpeItemNameTag);
    } else {
      stackResult = stackSubj.copy();
    }
    if (newItemName != null && newItemName.length() > 0 && !newItemName.equalsIgnoreCase(thePlayer.getTranslator().translateNamedKey(stackResult.getItemName())) && !newItemName.equals(stackResult.getDisplayName()))
    {
      stackResult.setItemName(newItemName);
    }
    outputSlot.setInventorySlotContents(0, stackResult);
    detectAndSendChanges();
  }

  public void onCraftGuiClosed(EntityPlayer player)
  {
    super.onCraftGuiClosed(player);
    if (!theWorld.isRemote)
    {
      ItemStack stack = tile.getStackInSlotOnClosing(0);
      if (stack != null)
      {
        player.dropPlayerItem(stack);
      }
    }
  }

  public boolean canInteractWith(EntityPlayer player)
  {
    return this.tile.isUseableByPlayer(player);
  }

  public ItemStack transferStackInSlot(EntityPlayer player, int slotNumber)
  {
    // TODO: FIXME: shift-clicking paper in player inventory while some paper
    // is in crafting slot leaves phantom paper item in player inventory
    // Apparently also happens in Vanilla Anvil:
    // https://bugs.mojang.com/browse/MC-71367
    ItemStack stackLeft = null;
    Slot slot = (Slot)inventorySlots.get(slotNumber);

    if (slot != null && slot.getHasStack())
    {
      ItemStack stack = slot.getStack();
      stackLeft = stack.copy();
      if (slotNumber >= 4 && slotNumber < 40)
      {
        if (stack.itemID == Item.paper.itemID)
        {
          if (!mergeItemStack(stack, 2, 3, false)) return null;
        }
        else if (stack.itemID == GPEBTWTweak.gpeItemQuill.itemID)
        {
          if (!mergeItemStack(stack, 1, 2, false)) return null;
        } else {
          if (!mergeItemStack(stack, 0, 1, false)) return null;
        }
      }
      else if (!mergeItemStack(stack, 4, 40, false))
      {
        return null;
      }
      if (slotNumber == 3)
      {
        slot.onSlotChange(stack, stackLeft);
      }

      if (stack.stackSize == 0)
      {
        slot.putStack((ItemStack)null);
      } else {
        slot.onSlotChanged();
      }

      if (stack.stackSize == stackLeft.stackSize)
      {
        return null;
      }

      slot.onPickupFromSlot(player, stack);
    }
    return stackLeft;
  }

  public void updateItemName(String name)
  {
    newItemName = name;
    updateRenameOutput();
  }

  public void onResultTaken()
  {
    tile.setInventorySlotContents(0, (ItemStack)null);
    ItemStack stackInk = tile.getStackInSlot(1);
    ItemStack stackPaper = tile.getStackInSlot(2);
    int newDamage = stackInk.getItemDamage() + 1;
    stackInk.setItemDamage(newDamage);
    if (newDamage >= stackInk.getMaxDamage()) tile.setInventorySlotContents(1, (ItemStack)null);
    if (--stackPaper.stackSize <= 0) tile.setInventorySlotContents(2, (ItemStack)null);
    updateItemName(null);
  }
}
