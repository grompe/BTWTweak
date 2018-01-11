package net.minecraft.src;

import java.util.List;
import java.util.Random;

public class GPEBlockAestheticOpaque extends FCBlockAestheticOpaque
{
  private static final int wicker = 0;
  private static final int hellfire = 3;
  private static final int padding = 4;
  private static final int rope = 6;
  private static final int flint = 7;
  private static final int whitestone = 9;
  private static final int whitecobble = 10;
  private static final int barrel = 11;
  private static final int choppingblock = 13;
  private static final int enderblock = 14;
  private static final int boneblock = 15;

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
    setCreativeTab(CreativeTabs.tabBlock);
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
    if (meta == boneblock) return soundGravelFootstep;
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

  public void getSubBlocks(int id, CreativeTabs t, List l)
  {
    l.add(new ItemStack(id, 1, wicker));
    l.add(new ItemStack(id, 1, hellfire));
    l.add(new ItemStack(id, 1, padding));
    l.add(new ItemStack(id, 1, rope));
    l.add(new ItemStack(id, 1, flint));
    l.add(new ItemStack(id, 1, whitestone));
    l.add(new ItemStack(id, 1, whitecobble));
    l.add(new ItemStack(id, 1, barrel));
    l.add(new ItemStack(id, 1, choppingblock));
    l.add(new ItemStack(id, 1, enderblock));
    if (GPEBTWTweak.isBTWVersionOrNewer("4.A3 Headed Beastie"))
    {
      l.add(new ItemStack(id, 1, boneblock));
    }
  }
}
