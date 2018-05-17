package net.minecraft.src;

// Dummy class for BTW 4.AA+
public class FCItemBlockTorchIdle extends Item
{
  public FCItemBlockTorchIdle(int id)
  {
    super(id);
  }

  public boolean IsPlayerClickingOnIgniter(ItemStack stack, World world, EntityPlayer player)
  {
    return false;
  }
}
