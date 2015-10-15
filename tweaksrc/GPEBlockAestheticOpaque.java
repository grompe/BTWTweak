package net.minecraft.src;

import java.util.List;
import java.util.Random;

public class GPEBlockAestheticOpaque extends FCBlockAestheticOpaque
{
  private static final int wicker = 0;
  private static final int padding = 4;
  private static final int barrel = 11;

  private static final float[] hardness =
  {
    1.5F, 0.6F, 7.5F, 2.0F, 0.6F, 0.6F, 0.6F, 0.6F,
    2.0F, 2.0F, 2.0F, 1.5F, 2.0F, 2.0F, 2.0F, 2.0F
  };

  public GPEBlockAestheticOpaque(int id)
  {
    super(id);
    ItemAxe.SetAllAxesToBeEffectiveVsBlock(this);
    ItemPickaxe.SetAllPicksToBeEffectiveVsBlock(this);
  }

  public float getBlockHardness(World world, int x, int y, int z)
  {
    return hardness[world.getBlockMetadata(x, y, z)];
  }

  public void onFallenUpon(World world, int x, int y, int z, Entity entity, float par6)
  {
    int meta = world.getBlockMetadata(x, y, z);
    if (meta == padding)
    {
      if (entity.fallDistance > 3.0F)
      {
        float vol = entity.fallDistance / 5.0F;
        if (vol > 3.0F) vol = 3.0F;
        world.playSoundAtEntity(entity, "step.cloth", vol, world.rand.nextFloat() * 0.4F + 0.8F);
      }
      if (entity.fallDistance < 9.0F) entity.fallDistance *= 0.5F;
      entity.fallDistance *= 0.5F;
    }
  }

  public StepSound GetStepSound(World world, int x, int y, int z)
  {
    int meta = world.getBlockMetadata(x, y, z);
    if (meta == padding) return soundClothFootstep;
    return stepSound;
  }

  public int GetItemIDDroppedOnSaw(World world, int x, int y, int z)
  {
    int meta = world.getBlockMetadata(x, y, z);
    if (meta == barrel) return FCBetterThanWolves.fcBlockWoodMouldingItemStubID;
    if (meta == wicker) return FCBetterThanWolves.fcAestheticNonOpaque.blockID;
    return -1;
  }

  public int GetItemCountDroppedOnSaw(World world, int x, int y, int z)
  {
    int meta = world.getBlockMetadata(x, y, z);
    if (meta == barrel) return 6;
    if (meta == wicker) return 2;
    return 0;
  }

}
