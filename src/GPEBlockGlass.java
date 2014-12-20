package net.minecraft.src;

import java.util.Random;

public class GPEBlockGlass extends BlockGlass
{
  public GPEBlockGlass(int id)
  {
    super(id, Material.glass, false);
    setHardness(0.3F);
    setStepSound(soundGlassFootstep);
    setUnlocalizedName("glass");
    setCreativeTab(CreativeTabs.tabBlock);
    ItemPickaxe.SetAllPicksToBeEffectiveVsBlock(this);
  }

  public void onFallenUpon(World world, int x, int y, int z, Entity entity, float par6)
  {
    if (!world.isRemote && entity.fallDistance > 3.0F)
    {
      world.playAuxSFX(2001, x, y, z, Block.glass.blockID);
      world.setBlockWithNotify(x, y, z, 0);
    }
  }

  // Work around beacon missing texture
  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    super.registerIcons(r);
    Block.glass.registerIcons(r);
  }
}
