package net.minecraft.src;

public class GPEItemPotash extends Item
{
  public GPEItemPotash(int id)
  {
    super(id);
    setUnlocalizedName("fcItemPotash");
    SetBellowsBlowDistance(3);
    setCreativeTab(CreativeTabs.tabMaterials);
  }

  public boolean onItemUse(ItemStack stack, EntityPlayer player, World world, int x, int y, int z, int side, float var8, float var9, float var10)
  {
    if (!player.canPlayerEdit(x, y, z, side, stack)) return false;
    if (!usableOn(world, x, y, z)) y--;
    if (usableOn(world, x, y, z))
    {
      int id = world.getBlockId(x, y, z);
      if (id == Block.tilledField.blockID)
      {
        int meta = world.getBlockMetadata(x, y, z);
        world.setBlockAndMetadataWithNotify(x, y, z, FCBetterThanWolves.fcBlockFarmlandFertilized.blockID, meta);
      }
      else if (id == FCBetterThanWolves.fcPlanter.blockID)
      {
        ((FCBlockPlanter)FCBetterThanWolves.fcPlanter).SetPlanterType(world, x, y, z, 2);
      }
      stack.stackSize--;
      return true;
    }
    return false;
  }

  private boolean usableOn(World world, int x, int y, int z)
  {
    int id = world.getBlockId(x, y, z);
    int meta = world.getBlockMetadata(x, y, z);
    return id == Block.tilledField.blockID || id == FCBetterThanWolves.fcPlanter.blockID && meta == 1;
  }

  public boolean IsPistonPackable(ItemStack stack)
  {
    return true;
  }

  public int GetRequiredItemCountToPistonPack(ItemStack stack)
  {
    return 9;
  }

  public int GetResultingBlockIDOnPistonPack(ItemStack stack)
  {
    return GPEBTWTweak.gpeBlockStorage.blockID;
  }

  public int GetResultingBlockMetadataOnPistonPack(ItemStack stack)
  {
    return itemID == GPEBTWTweak.gpeItemAsh.itemID ? 9 : 8;
  }
}
