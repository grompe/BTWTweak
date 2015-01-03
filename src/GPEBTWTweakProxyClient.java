package net.minecraft.src;

import java.awt.Frame;
import java.util.*;
import java.io.*;
import javax.imageio.ImageIO;

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
    if (GPEBTWTweak.hotbarCycling != 0)
    {
      if (key >= 2 && key <= 10)
      {
        Minecraft mc = Minecraft.getMinecraft();
        int slot = key - 2;
        if (mc.thePlayer.inventory.currentItem == slot)
        {
          cycleVertSlots(mc, slot);
        };
      }
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
    int lastRow = 4 - GPEBTWTweak.hotbarCycling;
    if (GPEBTWTweak.hotbarCycling == 1)
    {
      // Adaptive cycling
      ItemStack[] inv = mc.thePlayer.inventory.mainInventory;
      lastRow = 0;
      if (inv[slot + 9] == null)
      {
        lastRow = 1;
        if (inv[slot + 9 * 2] == null)
        {
          lastRow = 2;
          if (inv[slot + 9 * 3] == null)
          {
            return;
          }
        }
      }
    }
    for (int i = 3; i > lastRow; i--)
    {
      controller.windowClick(windowId, slot + i * 9, 0, 0, player);
      controller.windowClick(windowId, slot + i * 9 + 9, 0, 0, player);
      controller.windowClick(windowId, slot + i * 9, 0, 0, player);
    }
  }

  public static void setAppIcon(Frame frame)
  {
    try
    {
      List images = new ArrayList();
      images.add(ImageIO.read(FCAddOn.class.getResourceAsStream("/btwmodtex/icon16.png")));
      images.add(ImageIO.read(FCAddOn.class.getResourceAsStream("/btwmodtex/icon32.png")));
      frame.setIconImages(images);
    }
    catch(IOException e) {}
  }
}
