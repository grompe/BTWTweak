package net.minecraft.src;

public class GPEItemQuill extends Item
{
  private static Icon quillBackgroundIcon;
  private static Icon paperBackgroundIcon;

  public GPEItemQuill(int id)
  {
    super(id);
    setUnlocalizedName("gpeItemQuill");
    setCreativeTab(CreativeTabs.tabMaterials);
    SetBuoyancy(1.0F);
    SetBellowsBlowDistance(2);
    maxStackSize = 1;
    setMaxDamage(30);
  }

  public boolean onItemUse(ItemStack stack, EntityPlayer player, World world, int x, int y, int z, int side, float var8, float var9, float var10)
  {
    if (!player.canPlayerEdit(x, y, z, side, stack)) return false;

    TileEntity te = world.getBlockTileEntity(x, y, z);
    if (te == null) return false;

    int id = world.getBlockId(x, y, z);
    if ((id == Block.signPost.blockID) || (id == Block.signWall.blockID))
    {
      player.displayGUIEditSign(te);
      stack.damageItem(1, player);
      return true;
    }
    return false;
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    super.registerIcons(r);
    quillBackgroundIcon = r.registerIcon("slot_empty_quill");
    paperBackgroundIcon = r.registerIcon("slot_empty_paper");
  }

  @ClientOnly
  static public Icon getBackgroundIcon(int typ)
  {
    if (typ == 0) return quillBackgroundIcon;
    if (typ == 1) return paperBackgroundIcon;
    return null;
  }
}
