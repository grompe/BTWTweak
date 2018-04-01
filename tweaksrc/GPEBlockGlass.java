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
    GPEBTWTweak.setPicksEffective(this);
  }

  public void onFallenUpon(World world, int x, int y, int z, Entity entity, float par6)
  {
    if (!world.isRemote && entity.fallDistance > 3.0F)
    {
      world.playAuxSFX(2001, x, y, z, Block.glass.blockID);
      world.destroyBlock(x, y, z, true);
    }
  }

  public boolean CanContainPistonPackingToFacing(World world, int x, int y, int z, int side)
  {
    return true;
  }

  public int quantityDroppedWithBonus(int fortune, Random random)
  {
    if (GPEBTWTweak.decoGlassShard == null) return 0;
    return Math.min(4, quantityDropped(random) + random.nextInt(fortune + 1));
  }

  public int quantityDropped(Random random)
  {
    if (GPEBTWTweak.decoGlassShard == null) return 0;
    return 2 + random.nextInt(3);
  }

  public int idDropped(int meta, Random random, int fortune)
  {
    if (GPEBTWTweak.decoGlassShard == null) return 0;
    return GPEBTWTweak.decoGlassShard.itemID;
  }

  // Work around beacon missing texture
  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    super.registerIcons(r);
    Block.glass.registerIcons(r);
  }
}
