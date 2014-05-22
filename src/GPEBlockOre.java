package net.minecraft.src;

public class GPEBlockOre extends FCBlockOre
{
  public GPEBlockOre(int id)
  {
    super(id);
    setHardness(3.0F);
    setResistance(5.0F);
    setStepSound(soundStoneFootstep);
    ItemPickaxe.SetAllPicksToBeEffectiveVsBlock(this);
    SetCanBeCookedByKiln(true);
  }

  public void OnCookedByKiln(World world, int x, int y, int z)
  {
    int id = 0;
    if (this.blockID == Block.oreIron.blockID) id = FCBetterThanWolves.fcItemNuggetIron.itemID;
    if (this.blockID == Block.oreGold.blockID) id = Item.goldNugget.itemID;
    if (id > 0)
    {
      world.setBlockToAir(x, y, z);
      FCUtilsItem.EjectSingleItemWithRandomOffset(world, x, y, z, id, 0);
      FCUtilsItem.EjectSingleItemWithRandomOffset(world, x, y, z, id, 0);
    }
  }
}
