package net.minecraft.src;

import java.util.Random;

public class GPEBlockGravestone extends Block
{
  private Icon iconFront;
  private Icon iconFrontBlank;
  private Icon iconSide;

  protected GPEBlockGravestone(int id)
  {
    super(id, Material.rock);
    setUnlocalizedName("gpeBlockGravestone");
    setHardness(3.5F);
    setResistance(10.0F);
    setStepSound(soundStoneFootstep);
    ItemPickaxe.SetAllPicksToBeEffectiveVsBlock(this);
    setCreativeTab(CreativeTabs.tabDecorations);
  }

  public boolean renderAsNormalBlock()
  {
    return false;
  }

  public boolean isOpaqueCube()
  {
    return false;
  }

  @ClientOnly
  public boolean shouldSideBeRendered(IBlockAccess b, int x, int y, int z, int side)
  {
    return true;
  }

  protected boolean canSilkHarvest()
  {
    return true;
  }

  public int idDropped(int meta, Random random, int fortune)
  {
    return GPEBTWTweak.gpeItemLooseRock.itemID;
  }

  public boolean canPlaceBlockAt(World world, int x, int y, int z)
  {
    return super.canPlaceBlockAt(world, x, y, z) && world.doesBlockHaveSolidTopSurface(x, y - 1, z);
  }

  public void onBlockPlacedBy(World world, int x, int y, int z, EntityLiving entity, ItemStack stack)
  {
    int side = MathHelper.floor_double((double)(entity.rotationYaw * 4.0F / 360.0F) + 2.5D) & 3;
    world.setBlockMetadataWithNotify(x, y, z, side, 2);
  }

  public int onBlockPlaced(World world, int x, int y, int z, int side, float hitX, float hitY, float hitZ, int metadata)
  {
    return side < 2 ? 2 : Direction.facingToDirection[side];
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    iconFront = r.registerIcon("gpeBlockGravestone_front");
    iconFrontBlank = r.registerIcon("gpeBlockGravestone_front_blank");
    iconSide = r.registerIcon("gpeBlockGravestone_side");
  }

  @ClientOnly
  public Icon getIcon(int side, int meta)
  {
    // Bottom (0), Top (1), North (2), South (3), West (4), East (5)
    int orientation = meta & 3;
    boolean blank = meta > 3;
    Icon tmpFrontIcon = blank ? iconFrontBlank : iconFront;
    if (side == 3 && orientation == 0) return tmpFrontIcon;
    if (side == 4 && orientation == 1) return tmpFrontIcon;
    if (side == 2 && orientation == 2) return tmpFrontIcon;
    if (side == 5 && orientation == 3) return tmpFrontIcon;
    return iconSide;
  }

  public AxisAlignedBB getCollisionBoundingBoxFromPool(World world, int x, int y, int z)
  {
    int meta = world.getBlockMetadata(x, y, z) & 3;
    AABBPool pool = AxisAlignedBB.getAABBPool();
    switch (meta)
    {
      case 0:  return pool.getAABB(x +  0/16F, y, z +  0/16F, x + 16/16F, y + 14/16F, z +  5/16F);
      case 1:  return pool.getAABB(x + 11/16F, y, z +  0/16F, x + 16/16F, y + 14/16F, z + 16/16F);
      case 2:  return pool.getAABB(x +  0/16F, y, z + 11/16F, x + 16/16F, y + 14/16F, z + 16/16F);
      default: return pool.getAABB(x +  0/16F, y, z +  0/16F, x +  5/16F, y + 14/16F, z + 16/16F);
    }
  }

  public void setBlockBoundsBasedOnState(IBlockAccess a, int x, int y, int z)
  {
    int meta = a.getBlockMetadata(x, y, z) & 3;
    switch (meta)
    { //                       x      y       z       x2      y2      z2
      // south (+z)
      case 0:  setBlockBounds( 0/16F, 0/16F,  0/16F, 16/16F, 14/16F,  5/16F); break;
      // west  (-x)
      case 1:  setBlockBounds(11/16F, 0/16F,  0/16F, 16/16F, 14/16F, 16/16F); break;
      // north (-z)
      case 2:  setBlockBounds( 0/16F, 0/16F, 11/16F, 16/16F, 14/16F, 16/16F); break;
      // east  (+x)
      default: setBlockBounds( 0/16F, 0/16F,  0/16F,  5/16F, 14/16F, 16/16F);
    }
  }

  public void setBlockBoundsForItemRender()
  {
    setBlockBounds(0/16F, 0/16F, 0/16F, 16/16F, 14/16F, 5/16F);
  }

  @ClientOnly
  public boolean RenderBlock(RenderBlocks r, int x, int y, int z)
  {
    int meta = r.blockAccess.getBlockMetadata(x, y, z) & 3;
    if ((meta & 1) != 0) r.SetUvRotateTop(2);
    switch (meta)
    {
      case 0:
        r.setRenderBounds(0/16F,  0/16F, 0/16F, 16/16F, 12/16F,  5/16F);
        r.renderStandardBlock(this, x, y, z);
        r.setRenderBounds(1/16F, 12/16F, 0/16F, 15/16F, 13/16F,  5/16F);
        r.renderStandardBlock(this, x, y, z);
        r.setRenderBounds(3/16F, 13/16F, 1/16F, 13/16F, 14/16F,  5/16F);
        r.renderStandardBlock(this, x, y, z);
        break;
      case 1:
        r.setRenderBounds(11/16F,  0/16F, 0/16F, 16/16F, 12/16F, 16/16F);
        r.renderStandardBlock(this, x, y, z);
        r.setRenderBounds(11/16F, 12/16F, 1/16F, 16/16F, 13/16F, 15/16F);
        r.renderStandardBlock(this, x, y, z);
        r.setRenderBounds(11/16F, 13/16F, 3/16F, 15/16F, 14/16F, 13/16F);
        r.renderStandardBlock(this, x, y, z);
        break;
      case 2:
        r.setRenderBounds(0/16F,  0/16F, 11/16F, 16/16F, 12/16F, 16/16F);
        r.renderStandardBlock(this, x, y, z);
        r.setRenderBounds(1/16F, 12/16F, 11/16F, 15/16F, 13/16F, 16/16F);
        r.renderStandardBlock(this, x, y, z);
        r.setRenderBounds(3/16F, 13/16F, 11/16F, 13/16F, 14/16F, 15/16F);
        r.renderStandardBlock(this, x, y, z);
        break;
      default:
        r.setRenderBounds(0/16F,  0/16F,  0/16F, 5/16F, 12/16F, 16/16F);
        r.renderStandardBlock(this, x, y, z);
        r.setRenderBounds(0/16F, 12/16F,  1/16F, 5/16F, 13/16F, 15/16F);
        r.renderStandardBlock(this, x, y, z);
        r.setRenderBounds(1/16F, 13/16F,  3/16F, 5/16F, 14/16F, 13/16F);
        r.renderStandardBlock(this, x, y, z);
    }
    r.ClearUvRotation();
    return true;
  }

  @ClientOnly
  public void RenderBlockAsItem(RenderBlocks r, int meta, float unk)
  {
    setBlockBoundsForItemRender();
    r.setRenderBoundsFromBlock(this);
    FCClientUtilsRender.RenderInvBlockWithMetadata(r, this, -0.5F, -0.5F, -0.15625F, 0);
  }
}
