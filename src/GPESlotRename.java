package net.minecraft.src;

class GPESlotRename extends Slot
{
  final GPEContainerRename theContainer;
  final int typ;

  GPESlotRename(GPEContainerRename container, IInventory inventory, int index, int guiX, int guiY, int slotType)
  {
    super(inventory, index, guiX, guiY);
    theContainer = container;
    typ = slotType;
  }

  public boolean isItemValid(ItemStack stack)
  {
    if (typ == 1) return stack.itemID == Item.paper.itemID;
    if (typ == 0) return stack.itemID == GPEBTWTweak.gpeItemQuill.itemID;
    return false;
  }

  public boolean canTakeStack(EntityPlayer player)
  {
    if (typ != 2) return true;
    return (player.capabilities.isCreativeMode || player.experienceLevel >= 1) && this.getHasStack();
  }

  public void onPickupFromSlot(EntityPlayer player, ItemStack stack)
  {
    if (typ != 2)
    {
      super.onPickupFromSlot(player, stack);
      return;
    }
    if (!player.capabilities.isCreativeMode)
    {
      player.addExperienceLevel(-1);
    }
    theContainer.onResultTaken();
  }

  @ClientOnly
  public Icon getBackgroundIconIndex()
  {
    return GPEItemQuill.getBackgroundIcon(typ);
  }
}
