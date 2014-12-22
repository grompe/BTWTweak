package net.minecraft.src;

public class GPEBlockLog extends FCBlockLog
{
  protected GPEBlockLog(int id)
  {
    super(id);
    setStepSound(soundWoodFootstep);
    setUnlocalizedName("log");
    ItemAxe.SetAllAxesToBeEffectiveVsBlock(this);
    SetCanBeCookedByKiln(true);
    SetItemIndexDroppedWhenCookedByKiln(Item.coal.itemID);
    SetItemDamageDroppedWhenCookedByKiln(1);
  }

  public void OnDestroyedByFire(World world, int x, int y, int z)
  {
    if (!world.isRemote)
    {
      dropBlockAsItem_do(world, x, y, z, new ItemStack(GPEBTWTweak.gpeItemAsh.itemID, 1, 0));
    }
  }

  public float getBlockHardness(World world, int x, int y, int z)
  {
    float multiplier = 1;
    // If dirt is below vertical log, consider it a hard stump
    int meta = world.getBlockMetadata(x, y, z);
    if (world.getBlockId(x, y - 1, z) == 3 && (meta & 12) == 0)
    {
      multiplier = 10;
    }
    // Make jungle wood somewhat softer, pine a bit softer
    if ((meta & 3) == 1) return 1.3F * multiplier;
    if ((meta & 3) == 3) return 1.0F * multiplier;
    return 1.5F * multiplier;
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    super.registerIcons(r);
    Block.wood.registerIcons(r);
  }
}
