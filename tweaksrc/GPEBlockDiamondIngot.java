package net.minecraft.src;

public class GPEBlockDiamondIngot extends Block
{
  public GPEBlockDiamondIngot(int id)
  {
    super(id, Material.iron);
    setHardness(5.0F);
    setResistance(10.0F);
    setStepSound(soundMetalFootstep);
    setUnlocalizedName("gpeBlockDiamondIngot");
    setCreativeTab(CreativeTabs.tabBlock);
    ItemPickaxe.SetAllPicksToBeEffectiveVsBlock(this);
  }
}
