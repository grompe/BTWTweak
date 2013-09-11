package net.minecraft.src;

public class GPEItemLooseRock extends Item
{
  public GPEItemLooseRock(int id)
  {
    super(id);
    maxStackSize = 16;
    setCreativeTab(CreativeTabs.tabMisc);
    setUnlocalizedName("gpeItemLooseRock");
  }

  public ItemStack onItemRightClick(ItemStack stack, World world, EntityPlayer player)
  {
    if (!player.capabilities.isCreativeMode)
    {
      if (player.getFoodStats().getFoodLevel() <= 18)
      {
        if (world.isRemote) player.addChatMessage("You\'re too exhausted for throwing rocks.");
        return stack;
      }
      else
      {
        if (!world.isRemote) player.addExhaustion(1.0F);
      }
      stack.stackSize--;
    }
    world.playSoundAtEntity(player, "random.bow", 0.5F, 0.3F + itemRand.nextFloat() * 0.1F);
    if (!world.isRemote) world.spawnEntityInWorld(new GPEEntityRock(world, player));
    return stack;
  }
}