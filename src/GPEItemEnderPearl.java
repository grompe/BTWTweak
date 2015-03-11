package net.minecraft.src;

public class GPEItemEnderPearl extends ItemEnderPearl
{
  public GPEItemEnderPearl(int id)
  {
    super(id);
    setUnlocalizedName("enderPearl");
  }

  public boolean IsPistonPackable(ItemStack stack)
  {
    return true;
  }

  public int GetRequiredItemCountToPistonPack(ItemStack stack)
  {
    return 9;
  }

  public int GetResultingBlockIDOnPistonPack(ItemStack var1)
  {
    return FCBetterThanWolves.fcAestheticOpaque.blockID;
  }

  public int GetResultingBlockMetadataOnPistonPack(ItemStack var1)
  {
    return 14;
  }
}
