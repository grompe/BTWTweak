package net.minecraft.src;

public class GPEItemNameTag extends Item
{
  public GPEItemNameTag(int id)
  {
    super(id);
    setUnlocalizedName("gpeItemNameTag");
    SetBellowsBlowDistance(3);
    setCreativeTab(CreativeTabs.tabTools);
  }

  public boolean itemInteractionForEntity(ItemStack stack, EntityLiving entity)
  {
    if (!stack.hasDisplayName()) return false;

    // entity.setCustomNameTag
    entity.func_94058_c(stack.getDisplayName());
    entity.setPersistent();
    --stack.stackSize;
    return true;
  }
}
