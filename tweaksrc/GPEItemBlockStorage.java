package net.minecraft.src;

public class GPEItemBlockStorage extends ItemBlockWithMetadata
{
  protected GPEItemBlockStorage(int id, Block block)
  {
    super(id, block);
  }

  public String getUnlocalizedName(ItemStack stack)
  {
    return super.getUnlocalizedName() + "." + GPEBlockStorage.names[stack.getItemDamage()];
  }
}
