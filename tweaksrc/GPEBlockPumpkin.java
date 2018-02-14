package net.minecraft.src;

import java.util.Iterator;
import java.util.List;
import java.util.Random;

public class GPEBlockPumpkin extends BlockSand
{
  private Icon iconTop;
  private Icon iconFront;
  private boolean isLit;

  public GPEBlockPumpkin(int id, boolean lit)
  {
    super(id);
    setHardness(1.0F);
    setStepSound(soundWoodFootstep);
    isLit = lit;
    if (lit)
    {
      setUnlocalizedName("litpumpkin");
      setLightValue(1.0F);
    } else {
      setUnlocalizedName("pumpkin");
    }
    ItemAxe.SetAllAxesToBeEffectiveVsBlock(this);
  }

  public void onBlockPlacedBy(World world, int x, int y, int z, EntityLiving entity, ItemStack stack)
  {
    int side = MathHelper.floor_double((double)(entity.rotationYaw * 4.0F / 360.0F) + 2.5D) & 3;
    if (isLit) side = side | 8;
    world.setBlockMetadataWithNotify(x, y, z, side, 2);
  }

  public void onBlockAdded(World world, int x, int y, int z)
  {
    int meta = world.getBlockMetadata(x, y, z) | 8;
    world.setBlockMetadataWithNotify(x, y, z, meta, 2);
    world.scheduleBlockUpdate(x, y, z, blockID, tickRate(world));
  }

  public void updateTick(World world, int x, int y, int z, Random random)
  {
    super.updateTick(world, x, y, z, random);
    if (isLit)
    {
      int meta = world.getBlockMetadata(x, y, z);
      if ((meta & 8) != 0)
      {
        int dir = meta & 3;
        if (world.getBlockMaterial(x + Direction.offsetX[dir], y, z + Direction.offsetZ[dir]) == Material.water)
        {
          world.setBlockAndMetadataWithNotify(x, y, z, Block.pumpkin.blockID, dir);
          FCUtilsItem.DropSingleItemAsIfBlockHarvested(world, x, y, z, Block.torchWood.blockID, 0);
          world.playAuxSFX(2227, x, y, z, 0);
        }
      }
    }
  }

  public boolean OnFinishedFalling(EntityFallingSand fs, float fallDist)
  {
    if (!fs.worldObj.isRemote)
    {
      int x = MathHelper.floor_double(fs.posX);
      int y = MathHelper.floor_double(fs.posY);
      int z = MathHelper.floor_double(fs.posZ);
      int h = MathHelper.ceiling_float_int(fallDist) - 6;
      if (h >= 0)
      {
        List l = fs.worldObj.getEntitiesWithinAABBExcludingEntity(fs, fs.boundingBox);
        Iterator li = l.iterator();
        while (li.hasNext())
        {
          ((Entity)li.next()).attackEntityFrom(FCDamageSourceCustom.m_DamageSourcePumpkin, 1);
        }
        if (!Material.water.equals(fs.worldObj.getBlockMaterial(x, y, z)) && h > fs.rand.nextInt(10))
        {
          fs.worldObj.playAuxSFX(2250, x, y, z, 0);
          if (isLit)
          {
            if ((fs.worldObj.getBlockId(x, y, z) == 0) && Block.torchWood.canPlaceBlockAt(fs.worldObj, x, y, z))
            {
              fs.worldObj.setBlock(x, y, z, Block.torchWood.blockID);
            }
            else
            {
              FCUtilsItem.EjectStackWithRandomVelocity(fs.worldObj, x, y, z, new ItemStack(Block.torchWood, 1, 0));
            }
          }
          return false;
        }
      }
      fs.worldObj.playAuxSFX(2251, x, y, z, 0);
    }
    return true;
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    blockIcon = r.registerIcon("pumpkin_side");
    iconTop = r.registerIcon("pumpkin_top");
    iconFront = r.registerIcon(isLit ? "pumpkin_jack" : "pumpkin_face");
  }

  @ClientOnly
  public Icon getIcon(int side, int meta)
  {
    if (side == 1 || side == 0) return iconTop;
    meta = meta & 3;
    if (meta == 0 && side == 3) return iconFront;
    if (meta == 1 && side == 4) return iconFront;
    if (meta == 2 && side == 2) return iconFront;
    if (meta == 3 && side == 5) return iconFront;
    return blockIcon;
  }
}
