package net.minecraft.src;

class GPEInventoryRename extends InventoryBasic
{
  final GPEContainerRename theContainer;

  GPEInventoryRename(GPEContainerRename container, String title, boolean isLocalized, int slotsCount)
  {
    super(title, isLocalized, slotsCount);
    theContainer = container;
  }

  public void onInventoryChanged()
  {
    super.onInventoryChanged();
    this.theContainer.onCraftMatrixChanged(this);
  }
}
