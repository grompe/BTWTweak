package net.minecraft.src;

import java.util.Random;

public class GPEBlockGravel extends FCBlockGravel
{
  public GPEBlockGravel(int id)
  {
    super(id);
    setHardness(0.6F);
    setStepSound(soundGravelFootstep);
    setUnlocalizedName("gravel");
    GPEBTWTweak.setShovelsEffective(this);
  }

  public int idDropped(int meta, Random random, int fortune)
  {
    if (fortune > 3) fortune = 3;
    if (random.nextInt(7 - fortune * 2) != 0) return this.blockID;
    if (random.nextInt(7 - fortune * 2) != 0) return GPEBTWTweak.gpeItemLooseRock.itemID;
    return Item.flint.itemID;
  }

  public void OnBlockDestroyedWithImproperTool(World world, EntityPlayer player, int x, int y, int z, int meta)
  {
    dropPiles(world, x, y, z, 1.0F);
  }

  public void onBlockDestroyedByExplosion(World world, int x, int y, int z, Explosion explosion)
  {
    float chance = 1.0F;
    if (explosion != null) chance = 1.0F / explosion.explosionSize;
    dropPiles(world, x, y, z, chance);
  }

  private void dropPiles(World world, int x, int y, int z, float chance)
  {
    if (world.rand.nextInt(7) == 0)
    {
      if (world.rand.nextFloat() <= chance)
      {
        Item drop = GPEBTWTweak.gpeItemLooseRock;
        if (world.rand.nextInt(7) == 0) drop = Item.flint;
        this.dropBlockAsItem_do(world, x, y, z, new ItemStack(drop));
      }
      return;
    }
    for (int i = 0; i < 3; i++)
    {
      if (world.rand.nextFloat() <= chance)
      {
        this.dropBlockAsItem_do(world, x, y, z, new ItemStack(FCBetterThanWolves.fcItemPileGravel));
      }
    }
  }
}
