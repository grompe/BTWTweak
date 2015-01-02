package net.minecraft.src;

public class GPEContainerRename extends Container
{
  private IInventory outputSlot = new InventoryCraftResult();
  private IInventory inputSlots = new GPEInventoryRename(this, "container.rename", false, 3);
  private World theWorld;
  private String newItemName;
  private final EntityPlayer thePlayer;

  public GPEContainerRename(InventoryPlayer inventory, World world)
  {
    theWorld = world;
    thePlayer = inventory.player;
    addSlotToContainer(new Slot(inputSlots, 0, 38, 46));
    addSlotToContainer(new GPESlotRename(this, inputSlots, 1, 60, 37, 0)); // quill
    addSlotToContainer(new GPESlotRename(this, inputSlots, 2, 60, 55, 1)); // paper
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
    if (inventory == inputSlots)
    {
      updateRenameOutput();
    }
  }

  public void updateRenameOutput()
  {
    ItemStack stackSubj = inputSlots.getStackInSlot(0);
    ItemStack stackInk = inputSlots.getStackInSlot(1);
    ItemStack stackPaper = inputSlots.getStackInSlot(2);
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
      ItemStack stack = inputSlots.getStackInSlotOnClosing(0);
      if (stack != null)
      {
        player.dropPlayerItem(stack);
      }
      // TODO Temporary until Tile Entity for storing paper and ink
      stack = inputSlots.getStackInSlotOnClosing(1);
      if (stack != null)
      {
        player.dropPlayerItem(stack);
      }
      stack = inputSlots.getStackInSlotOnClosing(2);
      if (stack != null)
      {
        player.dropPlayerItem(stack);
      }
    }
  }

  public boolean canInteractWith(EntityPlayer player)
  {
    return true;
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
    inputSlots.setInventorySlotContents(0, (ItemStack)null);
    ItemStack stackInk = inputSlots.getStackInSlot(1);
    ItemStack stackPaper = inputSlots.getStackInSlot(2);
    int newDamage = stackInk.getItemDamage() + 1;
    stackInk.setItemDamage(newDamage);
    if (newDamage >= stackInk.getMaxDamage()) inputSlots.setInventorySlotContents(1, (ItemStack)null);
    if (--stackPaper.stackSize <= 0) inputSlots.setInventorySlotContents(2, (ItemStack)null);
    updateItemName(null);
  }
}
