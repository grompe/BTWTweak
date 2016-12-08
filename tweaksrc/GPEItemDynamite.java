package net.minecraft.src;

public class GPEItemDynamite extends FCItemDynamite
{
  public GPEItemDynamite(int id)
  {
    super(id);
    setUnlocalizedName("fcItemDynamite");
    SetBuoyancy(1.0F);
    setCreativeTab(CreativeTabs.tabCombat);
  }

  public ItemStack onItemRightClick(ItemStack stack, World world, EntityPlayer player)
  {
    int flintSlot = -1;
    for (int i = 0; i < player.inventory.mainInventory.length; i++)
    {
      if (player.inventory.mainInventory[i] != null && player.inventory.mainInventory[i].itemID == Item.flintAndSteel.itemID)
      {
        flintSlot = i;
        break;
      }
    }
    if (flintSlot >= 0)
    {
      ItemStack flint = player.inventory.getStackInSlot(flintSlot);
      flint.damageItem(1, player);
      if (flint.stackSize <= 0)
      {
        player.inventory.mainInventory[flintSlot] = null;
      }
      world.playSoundAtEntity(player, "random.fuse", 1.0F, 1.0F);
      player.setItemInUse(stack, getMaxItemUseDuration(stack));
    }
    else if (!world.isRemote)
    {
      --stack.stackSize;
      FCEntityDynamite dynamite = new FCEntityDynamite(world, player, this.itemID, false);
      world.spawnEntityInWorld(dynamite);
      world.playSoundAtEntity(dynamite, "random.bow", 0.5F, 0.4F / (itemRand.nextFloat() * 0.4F + 0.8F));
    }
    return stack;
  }

  public void onPlayerStoppedUsing(ItemStack stack, World world, EntityPlayer player, int inUseCount)
  {
    if (!world.isRemote)
    {
      --stack.stackSize;
      float strength = 0.5F + 1.5F * (float)(Math.min(100, 120 - inUseCount)) / 100.0F;
      FCEntityDynamite dynamite = new FCEntityDynamite(world, player, this.itemID, true);
      dynamite.m_iFuse = inUseCount;
      dynamite.motionX *= strength;
      dynamite.motionY *= strength;
      dynamite.motionZ *= strength;
      world.spawnEntityInWorld(dynamite);
      world.playSoundAtEntity(dynamite, "random.bow", 0.5F, 0.4F / (itemRand.nextFloat() * 0.4F + 0.8F));
    }
  }

  public ItemStack onEaten(ItemStack stack, World world, EntityPlayer player)
  {
    if (!world.isRemote)
    {
      --stack.stackSize;
      world.createExplosion((Entity)null, player.posX, player.posY, player.posZ, 1.5F, true);
    }
    return stack;
  }

  public int getMaxItemUseDuration(ItemStack stack)
  {
    return 100;
  }

  public EnumAction getItemUseAction(ItemStack stack)
  {
    return EnumAction.bow;
  }
}
