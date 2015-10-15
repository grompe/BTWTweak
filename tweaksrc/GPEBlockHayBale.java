package net.minecraft.src;

public class GPEBlockHayBale extends Block
{
  private Icon iconTop;
  private Icon iconSide;

  public GPEBlockHayBale(int id)
  {
    super(id, Material.cloth);
    setHardness(0.3F);
    setStepSound(soundClothFootstep);
    setUnlocalizedName("gpeBlockHayBale");
    setCreativeTab(CreativeTabs.tabBlock);
  }

  public int onBlockPlaced(World world, int x, int y, int z, int side, float hitX, float hitY, float hitZ, int meta)
  {
    return side >> 1;
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    iconTop = r.registerIcon("gpeBlockHayBale_top");
    iconSide = r.registerIcon("gpeBlockHayBale_side");
  }

  @ClientOnly
  public Icon getIcon(int side, int meta)
  {
    return (side >> 1 == meta) ? iconTop : iconSide;
  }

  @ClientOnly
  public boolean RenderBlock(RenderBlocks r, int x, int y, int z)
  {
    int meta = r.blockAccess.getBlockMetadata(x, y, z);
    if (meta == 1)
    {
      r.SetUvRotateSouth(1);
      r.SetUvRotateNorth(1);
    } else if (meta == 2) {
      r.SetUvRotateEast(1);
      r.SetUvRotateWest(1);
      r.SetUvRotateTop(1);
      r.SetUvRotateBottom(1);
    }
    setBlockBoundsBasedOnState(r.blockAccess, x, y, z);
    r.setRenderBoundsFromBlock(this);
    boolean result = r.renderStandardBlock(this, x, y, z);
    r.ClearUvRotation();
    return result;
  }
}
