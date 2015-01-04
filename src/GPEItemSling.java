package net.minecraft.src;

public class GPEItemSling extends Item
{
  public GPEItemSling(int id)
  {
    super(id);
    setUnlocalizedName("gpeItemSling");
    maxStackSize = 1;
    setMaxDamage(128);
    setCreativeTab(CreativeTabs.tabCombat);
  }

  public void onPlayerStoppedUsing(ItemStack stack, World world, EntityPlayer player, int inUseCount)
  {
    if (!player.capabilities.isCreativeMode && getRock(player) == null) return;

    int useTime = this.getMaxItemUseDuration(stack) - inUseCount;
    float tension = (float)useTime / 20.0F;
    if (tension < 0.2F) return;
    if (tension > 1.0F) tension = 1.0F;

    GPEEntityRock rock = new GPEEntityRock(world, player, tension * 0.75F);

    stack.damageItem(1, player);
    world.playSoundAtEntity(player, "random.bow", 0.5F, 0.3F + itemRand.nextFloat() * 0.1F + tension * 0.1F);

    player.addExhaustion(0.25F + 0.5F * tension);
    player.inventory.consumeInventoryItem(GPEBTWTweak.gpeItemLooseRock.itemID);

    if (!world.isRemote)
    {
      world.spawnEntityInWorld(rock);
    }
  }

  public ItemStack onEaten(ItemStack stack, World world, EntityPlayer player)
  {
    return stack;
  }

  public int getMaxItemUseDuration(ItemStack stack)
  {
    return 72000;
  }

  public EnumAction getItemUseAction(ItemStack stack)
  {
    return EnumAction.bow;
  }

  public ItemStack onItemRightClick(ItemStack stack, World world, EntityPlayer player)
  {
    if (player.getFoodStats().getFoodLevel() <= 18)
    {
      if (world.isRemote) player.addChatMessage("You\'re too exhausted for throwing rocks.");
      return stack;
    }
    if (player.capabilities.isCreativeMode || getRock(player) != null)
    {
      player.setItemInUse(stack, getMaxItemUseDuration(stack));
    }
    return stack;
  }

  public ItemStack getRock(EntityPlayer player)
  {
    for (int i = 0; i < 9; ++i)
    {
      ItemStack stack = player.inventory.getStackInSlot(i);
      if (stack != null && stack.itemID == GPEBTWTweak.gpeItemLooseRock.itemID)
      {
        return stack;
      }
    }
    return null;
  }

  public int getItemEnchantability()
  {
    return 0;
  }
}
