package net.minecraft.src;

public class GPERecipesTorchMerge implements IRecipe
{
  public boolean matches(InventoryCrafting ic, World world)
  {
    int count = 0;
    for (int i = 0; i < ic.getSizeInventory(); i++)
    {
      ItemStack stack = ic.getStackInSlot(i);
      if (stack == null) continue;
      if (isFiniteTorch(stack))
      {
        count++;
      } else {
        return false;
      }
    }
    return count >= 2;
  }

  public ItemStack getCraftingResult(InventoryCrafting ic)
  {
    int sumTime = 0;
    for (int i = 0; i < ic.getSizeInventory(); i++)
    {
      ItemStack stack = ic.getStackInSlot(i);
      if (stack == null) continue;
      if (isFiniteTorch(stack))
      {
        long outTime = stack.getTagCompound().getLong("outTime");
        int d = (int)(outTime - FCUtilsWorld.GetOverworldTimeServerOnly());
        if (d >= 0) sumTime += d;
      }
      else
      {
        return null;
      }
    }
    if (sumTime <= 0) return null;
    if (sumTime > 24000) sumTime = 24000;
    int damage = MathHelper.clamp_int((int)((24000 - sumTime)/750), 1, 31);

    ItemStack newstack = new ItemStack(FCBetterThanWolves.fcBlockTorchFiniteBurning.blockID, 1, damage);
    long newOutTime = FCUtilsWorld.GetOverworldTimeServerOnly() + (long)sumTime;
    newstack.setTagCompound(new NBTTagCompound());
    newstack.getTagCompound().setLong("outTime", newOutTime);
    return newstack;
  }

  public int getRecipeSize()
  {
    return 2;
  }

  public ItemStack getRecipeOutput()
  {
    return null;
  }

  public boolean matches(IRecipe recipe)
  {
    return false;
  }

  private boolean isFiniteTorch(ItemStack stack)
  {
    return
      stack.getItem() instanceof FCItemBlockTorchFiniteBurning
      && stack.stackSize > 0
      && stack.hasTagCompound()
      && stack.getTagCompound().hasKey("outTime");
  }
}
