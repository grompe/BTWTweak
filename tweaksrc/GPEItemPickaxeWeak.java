package net.minecraft.src;

public class GPEItemPickaxeWeak extends ItemPickaxe
{
  protected GPEItemPickaxeWeak(int id, EnumToolMaterial material)
  {
    super(id, material);
  }

  public boolean onBlockDestroyed(ItemStack stack, World world, int id, int x, int y, int z, EntityLiving entity)
  {
    if (Block.blocksList[id].getBlockHardness(world, x, y, z) != 0.0F)
    {
      stack.damageItem(8, entity);
    }
    return true;
  }
}
