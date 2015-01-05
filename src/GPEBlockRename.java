package net.minecraft.src;

import java.io.*;

public class GPEBlockRename extends BlockContainer
{
  private Icon iconTop;
  private Icon iconSide;

  protected GPEBlockRename(int id)
  {
    super(id, Material.wood);
    setHardness(2.0F);
    setStepSound(soundWoodFootstep);
    setUnlocalizedName("gpeBlockRename");
    ItemAxe.SetAllAxesToBeEffectiveVsBlock(this);
  }

  public boolean onBlockActivated(World world, int x, int y, int z, EntityPlayer player, int var6, float var7, float var8, float var9)
  {
    if (world.isRemote) return true;
    if (world.isBlockNormalCube(x, y + 1, z)) return true;

    GPETileEntityRename tile = (GPETileEntityRename)world.getBlockTileEntity(x, y, z);
    if (tile == null) return true;
    try
    {
      ByteArrayOutputStream bs = new ByteArrayOutputStream();
      DataOutputStream ds = new DataOutputStream(bs);
      EntityPlayerMP playerMP = (EntityPlayerMP)player;
      int windowId = playerMP.IncrementAndGetWindowID();
      ds.writeInt(windowId);
      ds.writeInt(1); // containerId
      Packet250CustomPayload packet = new Packet250CustomPayload("GPE|OI", bs.toByteArray());
      playerMP.playerNetServerHandler.sendPacketToPlayer(packet);

      playerMP.openContainer = new GPEContainerRename(playerMP.inventory, world, tile);
      playerMP.openContainer.windowId = windowId;
      playerMP.openContainer.addCraftingToCrafters(playerMP);
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
    return true;
  }

  public TileEntity createNewTileEntity(World world)
  {
    return new GPETileEntityRename();
  }

  public void onBlockPlacedBy(World world, int x, int y, int z, EntityLiving entity, ItemStack stack)
  {
    if (stack.hasDisplayName())
    {
      ((GPETileEntityRename)world.getBlockTileEntity(x, y, z)).setCustomName(stack.getDisplayName());
    }
  }

  public void breakBlock(World world, int x, int y, int z, int par5, int par6)
  {
    GPETileEntityRename tile = (GPETileEntityRename)world.getBlockTileEntity(x, y, z);
    if (tile != null)
    {
      for (int i = 0; i < tile.getSizeInventory(); ++i)
      {
        ItemStack stack = tile.getStackInSlot(i);
        if (stack != null)
        {
          FCUtilsItem.EjectStackWithRandomOffset(world, x, y, z, stack);
        }
      }
    }
    super.breakBlock(world, x, y, z, par5, par6);
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    iconTop = r.registerIcon("gpeBlockRename_top");
    iconSide = r.registerIcon("gpeBlockRename_side");
  }

  @ClientOnly
  public Icon getIcon(int side, int meta)
  {
    if (side == 0) return Block.planks.getIcon(side, meta);
    if (side == 1) return iconTop;
    return iconSide;
  }
}
