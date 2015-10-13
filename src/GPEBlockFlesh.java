package net.minecraft.src;

public class GPEBlockFlesh extends Block
{
  public GPEBlockFlesh(int id)
  {
    super(id, Material.clay);
    setHardness(0.6F);
    setStepSound(FCBetterThanWolves.fcSoundSquishFootstep);
    setUnlocalizedName("gpeBlockFlesh");
    setCreativeTab(CreativeTabs.tabBlock);
    ItemAxe.SetAllAxesToBeEffectiveVsBlock(this);
  }
}
