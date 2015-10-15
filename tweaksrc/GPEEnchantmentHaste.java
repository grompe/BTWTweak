package net.minecraft.src;

public class GPEEnchantmentHaste extends Enchantment
{
  public GPEEnchantmentHaste(int id)
  {
    super(id, 1, EnumEnchantmentType.armor_feet);
    this.setName("haste");
  }

  public int getMinEnchantability(int level)
  {
    return 15 + (level - 1) * 20;
  }

  public int getMaxEnchantability(int level)
  {
    return this.getMinEnchantability(level) + 25;
  }

  public int getMaxLevel()
  {
    return 3;
  }
}
