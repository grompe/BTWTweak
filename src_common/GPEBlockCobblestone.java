package net.minecraft.src;

import java.util.Random;

public class GPEBlockCobblestone extends Block
{
  public GPEBlockCobblestone(int id)
  {
    super(id, Material.rock);
    setHardness(2.0F);
    setResistance(10.0F);
    setStepSound(soundStoneFootstep);
    setUnlocalizedName("stonebrick");
    setCreativeTab(CreativeTabs.tabBlock);
  }

  public void OnBlockDestroyedWithImproperTool(World world, EntityPlayer player, int x, int y, int z, int meta)
  {
    if (world.rand.nextInt(10) == 0) makeDrop(world, x, y, z);
  }

  public void dropBlockAsItemWithChance(World world, int x, int y, int z, int meta, float chance, int bonus)
  {
    if (!world.isRemote)
    {
      for (int i = 0; i < 4; i++)
      {
        if (world.rand.nextFloat() <= chance) makeDrop(world, x, y, z);
      }
    }
  }

  private void makeDrop(World world, int x, int y, int z)
  {
    dropBlockAsItem_do(world, x, y, z, new ItemStack(GPEBTWTweak.gpeItemLooseRock.itemID, 1, 0));
  }
}
