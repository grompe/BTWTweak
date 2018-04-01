package net.minecraft.src;

public class GPEBlockSoap extends Block
{
  private Icon iconTop;
  private Icon iconSide;

  public GPEBlockSoap(int id)
  {
    super(id, FCBetterThanWolves.fcMaterialMiscellaneous);
    slipperiness = 0.95F;
    setHardness(0.6F);
    setStepSound(soundStoneFootstep);
    setUnlocalizedName("gpeBlockSoap");
    setCreativeTab(CreativeTabs.tabBlock);
    GPEBTWTweak.setAxesEffective(this);
    GPEBTWTweak.setPicksEffective(this);
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    iconTop = r.registerIcon("fcBlockSoap_top");
    iconSide = r.registerIcon("fcBlockSoap");
  }

  @ClientOnly
  public Icon getIcon(int side, int meta)
  {
    return side == 1 ? iconTop : iconSide;
  }
}
