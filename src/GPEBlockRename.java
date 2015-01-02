package net.minecraft.src;

import java.io.*;

public class GPEBlockRename extends Block
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

      playerMP.openContainer = new GPEContainerRename(playerMP.inventory, world);
      playerMP.openContainer.windowId = windowId;
      playerMP.openContainer.addCraftingToCrafters(playerMP);
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
    return true;
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
