package net.minecraft.src;

import java.util.Random;
import net.minecraft.client.Minecraft;

public class GPEBlockDirtSlab extends FCBlockDirtSlab
{
  private static final int packedEarth = 3;
  private static final int gravel = 6;
  private static final int sand = 7;
  private Icon gravelIcon;
  private Icon sandIcon;

  public GPEBlockDirtSlab(int id)
  {
    super(id);
    ItemSpade.SetAllShovelsToBeEffectiveVsBlock(this);
  }

  public int damageDropped(int meta)
  {
    int subtype = meta >> 1;
    return subtype < 3 ? 0 : subtype;
  }

  public float GetMovementModifier(World world, int x, int y, int z)
  {
    switch (GetSubtype(world, x, y, z))
    {
      case packedEarth:
      case gravel: return 1.2F;
      case sand: return 0.8F;
      default: return 1.0F;
    }
  }

  public StepSound GetStepSound(World world, int x, int y, int z)
  {
    int subtype = GetSubtype(world, x, y, z);
    if (subtype == sand) return soundSandFootstep;
    return subtype == 1 || subtype == 2 ? stepSound : soundGravelFootstep;
  }

  public boolean canPlaceBlockOnSide(World world, int x, int y, int z, int side, ItemStack stack)
  {
    int meta = stack.getItemDamage();
    if (meta == gravel || meta == sand)
    {
      if (!HasValidAnchorToFacing(world, x, y, z, 0)) return false;
    }
    return canPlaceBlockOnSide(world, x, y, z, side);
  }

  public int onBlockPlaced(World world, int x, int y, int z, int side, float var6, float var7, float var8, int var9)
  {
    int subtype = GetSubtypeFromMetadata(var9);
    if (subtype == gravel || subtype == sand) return SetIsUpsideDownInMetadata(var9, false);
    return super.onBlockPlaced(world, x, y, z, side, var6, var7, var8, var9);
  }

  private void DropAsPiles(World world, int x, int y, int z, int meta, float chance)
  {
    Item item = FCBetterThanWolves.fcItemPileDirt;
    int subtype = GetSubtypeFromMetadata(meta);
    int num = (subtype == packedEarth) ? 3 : 1;
    if (subtype == gravel)
    {
      item = FCBetterThanWolves.fcItemPileGravel;
    }
    else if (subtype == sand)
    {
      item = FCBetterThanWolves.fcItemPileSand;
    }
    for (int i = 0; i < num; i++)
    {
      if (world.rand.nextFloat() <= chance)
      {
        dropBlockAsItem_do(world, x, y, z, new ItemStack(item));
      }
    }
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    super.registerIcons(r);
    gravelIcon = r.registerIcon("gravel");
    sandIcon = r.registerIcon("sand");
  }

  @ClientOnly
  public Icon getIcon(int side, int meta)
  {
    int subtype = GetSubtypeFromMetadata(meta);
    if (subtype == gravel) return this.gravelIcon;
    if (subtype == sand) return this.sandIcon;
    return super.getIcon(side, meta);
  }
}
