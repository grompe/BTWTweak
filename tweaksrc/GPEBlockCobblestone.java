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
    GPEBTWTweak.setPicksEffective(this);
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    super.registerIcons(r);
    Block.cobblestone.registerIcons(r);
  }

  public void OnBlockDestroyedWithImproperTool(World world, EntityPlayer player, int x, int y, int z, int meta)
  {
    if (world.rand.nextInt(10) == 0) makeDrop(world, x, y, z);
  }

  public void onBlockDestroyedByExplosion(World world, int x, int y, int z, Explosion explosion)
  {
    float chance = 1.0F;
    if (explosion != null) chance = 1.0F / explosion.explosionSize;
    dropPiles(world, x, y, z, chance);
  }

  private void dropPiles(World world, int x, int y, int z, float chance)
  {
    if (world.rand.nextFloat() > chance) return;
    Item drop = FCBetterThanWolves.fcItemPileGravel;
    if (world.rand.nextInt(40) == 0) drop = GPEBTWTweak.gpeItemLooseRock;
    this.dropBlockAsItem_do(world, x, y, z, new ItemStack(drop));
  }

  public void harvestBlock(World world, EntityPlayer player, int x, int y, int z, int meta)
  {
    player.addStat(StatList.mineBlockStatArray[blockID], 1);
    player.addExhaustion(0.025F);

    if (canSilkHarvest(meta) && EnchantmentHelper.getSilkTouchModifier(player))
    {
      ItemStack stack = createStackedBlock(meta);

      if (stack != null)
      {
        dropBlockAsItem_do(world, x, y, z, stack);
      }
    }
    else
    {
      ItemStack tool = player.inventory.getCurrentItem();
      if (!world.isRemote && tool != null)
      {
        if (tool.itemID == FCBetterThanWolves.fcMattock.itemID || tool.itemID == FCBetterThanWolves.fcRefinedPickAxe.itemID)
        {
          dropBlockAsItem_do(world, x, y, z, new ItemStack(Block.cobblestone.blockID, 1, 0));
          return;
        }
      }
      int fortune = EnchantmentHelper.getFortuneModifier(player);
      dropBlockAsItem(world, x, y, z, meta, fortune);
    }
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
