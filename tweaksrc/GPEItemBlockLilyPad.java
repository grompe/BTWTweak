package net.minecraft.src;

public class GPEItemBlockLilyPad extends ItemLilyPad
{
  public GPEItemBlockLilyPad(int id)
  {
    super(id);
    setUnlocalizedName("waterlily");
  }

  public ItemStack onItemRightClick(ItemStack stack, World world, EntityPlayer player)
  {
    MovingObjectPosition mop = this.getMovingObjectPositionFromPlayer(world, player, true);
    if (mop == null) return stack;
    if (mop.typeOfHit != EnumMovingObjectType.TILE) return stack;
    
    int x = mop.blockX;
    int y = mop.blockY;
    int z = mop.blockZ;

    if (!world.canMineBlock(player, x, y, z)) return stack;
    if (!player.canPlayerEdit(x, y, z, mop.sideHit, stack)) return stack;

    if (world.getBlockMaterial(x, y, z) == Material.water
      && world.getBlockMetadata(x, y, z) == 0
      && world.isAirBlock(x, y + 1, z)
      && world.getBlockMaterial(x, y - 1, z) != Material.water)
    {
      world.setBlock(x, y + 1, z, Block.waterlily.blockID);
      if (!player.capabilities.isCreativeMode)
      {
        --stack.stackSize;
      }
    }
    return stack;
  }

  public boolean onItemUse(ItemStack stack, EntityPlayer player, World world, int x, int y, int z, int side, float hitX, float hitY, float hitZ)
  {
    return false;
  }
}
