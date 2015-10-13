package net.minecraft.src;

public class GPEBlockHayBale extends Block
{
  private Icon iconTop;
  private Icon iconSide;

  public GPEBlockHayBale(int id)
  {
    super(id, Material.cloth);
    setHardness(0.5F);
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
}
