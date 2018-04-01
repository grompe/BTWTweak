package net.minecraft.src;

public class GPEBlockOre extends FCBlockOre
{
  public GPEBlockOre(int id)
  {
    super(id);
    setHardness(3.0F);
    setResistance(5.0F);
    setStepSound(soundStoneFootstep);
    GPEBTWTweak.setPicksEffective(this);
    SetCanBeCookedByKiln(true);

    // CraftGuide compatibility / crash workaround
    int itemid = 0;
    if (id == Block.oreIron.blockID) itemid = FCBetterThanWolves.fcItemNuggetIron.itemID;
    if (id == Block.oreGold.blockID) itemid = Item.goldNugget.itemID;
    SetItemIndexDroppedWhenCookedByKiln(itemid);
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

  // Work around GuiAchievements crash
  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    super.registerIcons(r);
    if (this.blockID == Block.oreIron.blockID) Block.oreIron.registerIcons(r);
    if (this.blockID == Block.oreGold.blockID) Block.oreGold.registerIcons(r);
  }
}
