package net.minecraft.src;

import java.util.*;
import java.io.*;

import net.minecraft.client.Minecraft;
import net.minecraft.server.MinecraftServer;

public class GPEBTWTweakProxyClient extends GPEBTWTweakProxy
{
  public File getConfigDir()
  {
    return Minecraft.getMinecraftDir();
  }

  public void addEntityRenderers()
  {
    RenderManager.AddEntityRenderer(GPEEntityRock.class, new RenderSnowball(GPEBTWTweak.gpeItemLooseRock));
  }

  public void onKeyPress(int key)
  {
    // Selecting already selected hotbar slot cycles items in that inventory column
    if (key >= 2 && key <= 10)
    {
      Minecraft mc = Minecraft.getMinecraft();
      int slot = key - 2;
      if (mc.thePlayer.inventory.currentItem == slot)
      {
        cycleVertSlots(mc, slot);
      };
    }
    if (key == 45) // "X", for debugging!
    {
      Minecraft mc = Minecraft.getMinecraft();
      if (!mc.thePlayer.capabilities.isCreativeMode) return;
      World world = mc.thePlayer.worldObj;
      int x = MathHelper.floor_double(mc.thePlayer.posX);
      int y = MathHelper.floor_double(mc.thePlayer.posY) - 1;
      int z = MathHelper.floor_double(mc.thePlayer.posZ);
      GPEBTWTweak.attemptToPlaceGravestone(world, x, y, z);
    }
  }

  private void cycleVertSlots(Minecraft mc, int slot)
  {
    EntityClientPlayerMP player = mc.thePlayer;
    int windowId = mc.thePlayer.inventoryContainer.windowId;
    PlayerControllerMP controller = mc.playerController;

    for (int i = 3; i > 0; i--)
    {
      controller.windowClick(windowId, slot + i * 9, 0, 0, player);
      controller.windowClick(windowId, slot + i * 9 + 9, 0, 0, player);
      controller.windowClick(windowId, slot + i * 9, 0, 0, player);
    }
  }
}
