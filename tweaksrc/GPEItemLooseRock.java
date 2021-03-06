package net.minecraft.src;

public class GPEItemLooseRock extends Item
{
  public GPEItemLooseRock(int id)
  {
    super(id);
    setCreativeTab(CreativeTabs.tabMisc);
    setUnlocalizedName("gpeItemLooseRock");
  }

  public ItemStack onItemRightClick(ItemStack stack, World world, EntityPlayer player)
  {
    if (player.isSneaking())
    {
      if (!consumeInventoryRocks(player.inventory)) return stack;
      world.playSoundAtEntity(player, "dig.stone", 0.5F, 0.3F + itemRand.nextFloat() * 0.1F);
      ItemStack cobble = new ItemStack(Block.cobblestone, 1, 0);
      if (!player.inventory.addItemStackToInventory(cobble)) player.dropPlayerItem(cobble);
    }
    return stack;
  }

  boolean consumeInventoryRocks(IInventory inventory)
  {
    int i, count = 0, max = inventory.getSizeInventory();
    ItemStack stack;
    for (i = max - 1; i >= 0; i--)
    {
      stack = inventory.getStackInSlot(i);
      if (stack != null && stack.getItem().itemID == itemID) count += stack.stackSize;
      if (count >= 4) break;
    }
    if (count < 4) return false;
    count = 4;
    for (i = max - 1; i >= 0; i--)
    {
      stack = inventory.getStackInSlot(i);
      if(stack != null && stack.getItem().itemID == itemID)
      {
        if (stack.stackSize > count)
        {
          stack.stackSize -= count;
          inventory.setInventorySlotContents(i, stack);
          return true;
        }
        count -= stack.stackSize;
        inventory.setInventorySlotContents(i, (ItemStack)null);
        if (count == 0) break;
      }
    }
    return true;
  }

  public boolean IsPistonPackable(ItemStack stack)
  {
    return true;
  }

  public int GetRequiredItemCountToPistonPack(ItemStack stack)
  {
    return 4;
  }

  public int GetResultingBlockIDOnPistonPack(ItemStack stack)
  {
    return Block.cobblestone.blockID;
  }
}
