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

  public boolean onItemUse(ItemStack stack, EntityPlayer player, World world, int x, int y, int z, int side, float var8, float var9, float var10)
  {
    if (!player.canPlayerEdit(x, y, z, side, stack)) return false;

    TileEntity te = world.getBlockTileEntity(x, y, z);
    if (te == null) return false;

    // Set GUI display name
    int id = world.getBlockId(x, y, z);
    if (id == Block.chest.blockID)
    {
      ((TileEntityChest)te).func_94043_a(stack.getDisplayName());
    }
    else if (id == Block.brewingStand.blockID)
    {
      ((TileEntityBrewingStand)te).func_94131_a(stack.getDisplayName());
    }
    else if (id == Block.dispenser.blockID)
    {
      ((TileEntityDispenser)te).setCustomName(stack.getDisplayName());
    }
    else if ((id == Block.furnaceIdle.blockID) || (id == Block.furnaceBurning.blockID))
    {
      ((TileEntityFurnace)te).func_94129_a(stack.getDisplayName());
    }
    stack.stackSize--;
    return true;
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
