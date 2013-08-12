package net.minecraft.src;

import java.util.Random;

public class GPEBlockStone extends FCBlockStone
{
  public GPEBlockStone(int id)
  {
    super(id);
    setHardness(2.25F);
    setResistance(10.0F);
    setStepSound(soundStoneFootstep);
    setUnlocalizedName("stone");
  }

  // Client only!
  public void registerIcons(IconRegister r)
  {
    super.registerIcons(r);
    Block.stone.registerIcons(r);
  }

  public void OnBlockDestroyedWithImproperTool(World world, EntityPlayer player, int x, int y, int z, int meta)
  {
    if (world.rand.nextInt(10) == 0) makeDrop(world, x, y, z);
  }

  public void dropBlockAsItemWithChance(World world, int x, int y, int z, int meta, float chance, int bonus)
  {
    if (!world.isRemote)
    {
      int drops = 1 + world.rand.nextInt(3 + bonus + meta);
      if (drops > 4) drops = 4;
      for (int i = 0; i < drops; i++)
      {
        if (world.rand.nextFloat() <= chance) makeDrop(world, x, y, z);
      }
    }
  }

  private void makeDrop(World world, int x, int y, int z)
  {
    int id = GPEBTWTweak.gpeItemLooseRock.itemID;
    if (world.rand.nextInt(512) == 0) id = Item.flint.itemID;
    dropBlockAsItem_do(world, x, y, z, new ItemStack(id, 1, 0));
  }
}
