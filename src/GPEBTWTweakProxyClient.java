package net.minecraft.src;

import java.awt.Frame;
import java.util.*;
import java.io.*;
import java.lang.reflect.*;
import javax.imageio.ImageIO;

import net.minecraft.client.Minecraft;
import net.minecraft.server.MinecraftServer;

import org.lwjgl.input.Keyboard;

public class GPEBTWTweakProxyClient extends GPEBTWTweakProxy
{
  public KeyBinding sprintKey;
  private Map tileEntitySpecialRendererMap;

  public File getConfigDir()
  {
    return Minecraft.getMinecraftDir();
  }

  public void addEntityRenderers()
  {
    RenderManager.AddEntityRenderer(GPEEntityRock.class, new RenderSnowball(GPEBTWTweak.gpeItemLooseRock));
    RenderManager.AddEntityRenderer(EntityItemFrame.class, new GPERenderItemFrame());

    try
    {
      Field f;
      try
      {
        f = TileEntityRenderer.class.getDeclaredField("specialRendererMap");
      }
      catch(NoSuchFieldException e)
      {
        f = TileEntityRenderer.class.getDeclaredField("m");
      }
      f.setAccessible(true);
      tileEntitySpecialRendererMap = (Map)f.get(TileEntityRenderer.instance);
      FCAddOnHandler.LogMessage("Adding to tile entity special renderer map");
    }
    catch (Exception e)
    {
      FCAddOnHandler.LogMessage("Error while retrieving tile entity special renderer map");
      tileEntitySpecialRendererMap = null;
    }
    addTileEntitySpecialRenderer(new GPETileEntityChestRenderer());
  }

  private void addTileEntitySpecialRenderer(TileEntitySpecialRenderer r)
  {
    if (tileEntitySpecialRendererMap != null)
    {
      tileEntitySpecialRendererMap.put(GPETileEntityChest.class, r);
      r.setTileEntityRenderer(TileEntityRenderer.instance);
    }
  }

  public void addKeyBindings()
  {
    sprintKey = addKeyBinding("key.sprint", Keyboard.KEY_LCONTROL);
  }

  public KeyBinding addKeyBinding(String name, int key)
  {
    GameSettings settings = Minecraft.getMinecraft().gameSettings;
    if (settings == null) throw new IllegalArgumentException("addKeyBinding() was called too early, gameSettings is null!");
    KeyBinding keyBinding = new KeyBinding(name, key);
    KeyBinding[] keyBindings = settings.keyBindings;
    keyBindings = Arrays.copyOf(keyBindings, keyBindings.length + 1);
    keyBindings[keyBindings.length - 1] = keyBinding;
    settings.keyBindings = keyBindings;
    return keyBinding;
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
      /*
      int x = MathHelper.floor_double(mc.thePlayer.posX);
      int y = MathHelper.floor_double(mc.thePlayer.posY) - 1;
      int z = MathHelper.floor_double(mc.thePlayer.posZ);
      GPEBTWTweak.attemptToPlaceGravestone(world, x, y, z);
      */
      if (mc.objectMouseOver != null)
      {
        if (mc.objectMouseOver.typeOfHit == EnumMovingObjectType.TILE)
        {
          int x = mc.objectMouseOver.blockX;
          int y = mc.objectMouseOver.blockY;
          int z = mc.objectMouseOver.blockZ;
          int id = world.getBlockId(x, y, z);
          int meta = world.getBlockMetadata(x, y, z);
          mc.thePlayer.addChatMessage(String.format("Looking at block %d:%d (%d, %d, %d)", id, meta, x, y, z));
        }
      }
    }
    if (sprintKey.pressed)
    {
      Minecraft mc = Minecraft.getMinecraft();
      if (!mc.thePlayer.isSprinting()) mc.thePlayer.setSprinting(true);
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
