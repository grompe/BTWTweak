package net.minecraft.src;

import java.awt.Frame;
import java.util.*;
import java.io.*;
import java.lang.reflect.*;
import javax.imageio.ImageIO;
import org.lwjgl.opengl.GL11;

import net.minecraft.client.Minecraft;
import net.minecraft.server.MinecraftServer;

import org.lwjgl.input.Keyboard;
import org.lwjgl.opengl.Display;
import org.lwjgl.LWJGLException;

public class GPEBTWTweakProxyClient extends GPEBTWTweakProxy
{
  public KeyBinding sprintKey;
  public KeyBinding tellKey;
  private Map tileEntitySpecialRendererMap;

  public static String lastToldName = "";
  private int addedBrightness = 0;

  public File getConfigDir()
  {
    return Minecraft.getMinecraftDir();
  }

  public void addEntityRenderers()
  {
    RenderManager.AddEntityRenderer(GPEEntityRock.class, new RenderSnowball(GPEBTWTweak.gpeItemLooseRock));
    RenderManager.AddEntityRenderer(EntityItemFrame.class, new GPERenderItemFrame());
    RenderManager.AddEntityRenderer(EntityPlayer.class, new GPERenderPlayer());

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
    tellKey = addKeyBinding("key.tell", 19); // R
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
        }
      }
    }
    if (key == Keyboard.KEY_X) // for debugging!
    {
      Minecraft mc = Minecraft.getMinecraft();
      if (!mc.thePlayer.capabilities.isCreativeMode) return;
      World world = mc.thePlayer.worldObj;
      //int x = MathHelper.floor_double(mc.thePlayer.posX);
      //int y = MathHelper.floor_double(mc.thePlayer.posY) - 1;
      //int z = MathHelper.floor_double(mc.thePlayer.posZ);
      //int bl = world.getBlockLightValue(x, y, z);
      //mc.thePlayer.addChatMessage(String.format("(%d, %d, %d): blockLight %d", x, y, z, bl));
      //GPEBTWTweak.attemptToPlaceGravestone(world, x, y, z);
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
    if (key == Keyboard.KEY_F9)
    {
      try
      {
        if (addedBrightness == 0)
        {
          Display.setDisplayConfiguration(1.0F, 0.04F, 1.0F);
        }
        if (addedBrightness == 1)
        {
          Display.setDisplayConfiguration(1.0F, 0.06F, 1.0F);
        }
        if (addedBrightness == 2)
        {
          Display.setDisplayConfiguration(1.0F, 0.08F, 1.0F);
        }
        if (addedBrightness < 2) addedBrightness++;
      }
      catch (LWJGLException e)
      {
        e.printStackTrace();
      }
    }
    if (key == Keyboard.KEY_F10)
    {
      addedBrightness = 0;
      try
      {
        // inverse gamma, +brightness, contrast
        Display.setDisplayConfiguration(1.0F, 0.0F, 1.0F);
      }
      catch (LWJGLException e)
      {
        e.printStackTrace();
      }
    }
    if (sprintKey.pressed)
    {
      Minecraft mc = Minecraft.getMinecraft();
      if (!mc.thePlayer.isSprinting()) mc.thePlayer.setSprinting(true);
    }
    if (tellKey.pressed)
    {
      Minecraft mc = Minecraft.getMinecraft();
      mc.displayGuiScreen(new GuiChat("/tell " + lastToldName));
    }
  }

  private void cycleVertSlots(Minecraft mc, int slot)
  {
    // Inventory layout for thePlayer.inventory.mainInventory:
    //  9 10 11 12 13 14 15 16 17
    // 18 19 20 21 22 23 24 25 26
    // 27 28 29 30 31 32 33 34 35
    // --------------------------
    //  0  1  2  3  4  5  6  7  8
    
    // Inventory layout for window clicks:
    //  9 10 11 12 13 14 15 16 17
    // 18 19 20 21 22 23 24 25 26
    // 27 28 29 30 31 32 33 34 35
    // --------------------------
    // 36 37 38 39 40 41 42 43 44
    EntityClientPlayerMP player = mc.thePlayer;
    int windowId = mc.thePlayer.inventoryContainer.windowId;
    PlayerControllerMP controller = mc.playerController;
    ItemStack[] inv = mc.thePlayer.inventory.mainInventory;

    if (GPEBTWTweak.hotbarCycling == 5)
    {
      // Only fill empty slot
      if (inv[slot] != null) return;
      for (int i = 3; i > 0; i--)
      {
        if (inv[slot + 9 * i] != null)
        {
          controller.windowClick(windowId, slot + i * 9, 0, 0, player);
          controller.windowClick(windowId, slot + 36, 0, 0, player);
          return;
        }
      }
      return;
    }

    int lastRow = 4 - GPEBTWTweak.hotbarCycling;
    if (GPEBTWTweak.hotbarCycling == 1)
    {
      // Adaptive cycling
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
      boolean a = inv[slot + i * 9] != null;
      boolean b = inv[(slot + i * 9 + 9) % 36] != null;
      if (!a && !b) continue;
      if (a) controller.windowClick(windowId, slot + i * 9, 0, 0, player);
      controller.windowClick(windowId, slot + i * 9 + 9, 0, 0, player);
      if (b) controller.windowClick(windowId, slot + i * 9, 0, 0, player);
    }
  }

  public static void sendingChatMessage(String msg)
  {
    if (msg.startsWith("/tell "))
    {
      String[] s = msg.split(" ", 3);
      if (s.length >= 2)
      {
        lastToldName = s[1] + " ";
      }
    }
  }
  
  public static void drawMicroblockTarget(float ticks)
  {
    Minecraft mc = Minecraft.getMinecraft();
    MovingObjectPosition mop = mc.objectMouseOver;
    if (mop.typeOfHit != EnumMovingObjectType.TILE) return;
    EntityPlayer player = mc.thePlayer;
    ItemStack stack = player.inventory.getCurrentItem();
    if (stack == null) return;
    int id = stack.itemID;
    if (id > 4096) return;
    Block block = Block.blocksList[id];
    if (block == null) return;
    int meta = stack.getItemDamage();
    boolean isSiding = id == FCBetterThanWolves.fcBlockWoodSidingItemStubID
      || (id != FCBetterThanWolves.fcBlockWoodCornerItemStubID
       && id != FCBetterThanWolves.fcBlockWoodSidingDecorativeItemStubID
       && meta == 0 && block instanceof FCBlockSidingAndCorner);
    boolean isMoulding = id == FCBetterThanWolves.fcBlockWoodMouldingItemStubID
      || (id != FCBetterThanWolves.fcBlockWoodMouldingDecorativeItemStubID
       && meta == 0 && block instanceof FCBlockMoulding);
    boolean isCorner = id == FCBetterThanWolves.fcBlockWoodCornerItemStubID
      || (id != FCBetterThanWolves.fcBlockWoodSidingItemStubID
       && id != FCBetterThanWolves.fcBlockWoodSidingDecorativeItemStubID
       && meta == 1 && block instanceof FCBlockSidingAndCorner);
    if (isSiding || isMoulding || isCorner)
    {
      World world = player.worldObj;
      int x = mop.blockX;
      int y = mop.blockY;
      int z = mop.blockZ;
      float hitX = (float)mop.hitVec.xCoord - (float)mop.blockX;
      float hitY = (float)mop.hitVec.yCoord - (float)mop.blockY;
      float hitZ = (float)mop.hitVec.zCoord - (float)mop.blockZ;
      boolean combine = false;
      boolean direct = false;
      int side = mop.sideHit;
      GPEItemBlockMicro mi = stack.getItem() instanceof GPEItemBlockMicro ? (GPEItemBlockMicro)stack.getItem() : null;
      if (mi != null && mi.attemptToCombineWithBlock(stack, world, x, y, z, side, hitX, hitY, hitZ, false, true))
      {
        combine = true;
        direct = true;
      } else {
        if (world.getBlockId(x, y, z) == Block.snow.blockID)
        {
          side = 1;
        }
        if (!world.getBlockMaterial(x, y, z).isReplaceable())
        {
          x += Facing.offsetsXForSide[side];
          y += Facing.offsetsYForSide[side];
          z += Facing.offsetsZForSide[side];
        }
        if (mi != null && mi.attemptToCombineWithBlock(stack, world, x, y, z, side, hitX, hitY, hitZ, true, true))
        {
          combine = true;
        } else {
          if (!world.getBlockMaterial(x, y, z).isReplaceable()) return;
        }
      }
      double dd = direct ? 0.5 : 0;
      if (isSiding)
      {
        switch(side)
        {
          case 0: drawPlacementBox(world, x, y - dd + 0.5, z, 1, 0.5, 1, player, ticks, combine); break;
          case 1: drawPlacementBox(world, x, y + dd      , z, 1, 0.5, 1, player, ticks, combine); break;
          case 2: drawPlacementBox(world, x, y, z - dd + 0.5, 1, 1, 0.5, player, ticks, combine); break;
          case 3: drawPlacementBox(world, x, y, z + dd      , 1, 1, 0.5, player, ticks, combine); break;
          case 4: drawPlacementBox(world, x - dd + 0.5, y, z, 0.5, 1, 1, player, ticks, combine); break;
          case 5: drawPlacementBox(world, x + dd      , y, z, 0.5, 1, 1, player, ticks, combine); break;
        }
      }
      else if (isMoulding)
      {
        boolean xz = Math.abs(hitX - 0.5) > Math.abs(hitZ - 0.5);
        boolean xy = Math.abs(hitX - 0.5) > Math.abs(hitY - 0.5);
        boolean yz = Math.abs(hitY - 0.5) > Math.abs(hitZ - 0.5);
        double ax = x + (hitX > 0.5 ? 0.5 : 0);
        double ay = y + (hitY > 0.5 ? 0.5 : 0);
        double az = z + (hitZ > 0.5 ? 0.5 : 0);
        switch(side)
        {
          case 0: drawPlacementBox(world, xz ? ax : x , y - dd + 0.5, xz ? z : az , xz ? 0.5 : 1, 0.5, xz ? 1 : 0.5, player, ticks, combine); break;
          case 1: drawPlacementBox(world, xz ? ax : x , y + dd      , xz ? z : az , xz ? 0.5 : 1, 0.5, xz ? 1 : 0.5, player, ticks, combine); break;
          case 2: drawPlacementBox(world, xy ? ax : x , xy ? y : ay , z - dd + 0.5, xy ? 0.5 : 1, xy ? 1 : 0.5, 0.5, player, ticks, combine); break;
          case 3: drawPlacementBox(world, xy ? ax : x , xy ? y : ay , z + dd      , xy ? 0.5 : 1, xy ? 1 : 0.5, 0.5, player, ticks, combine); break;
          case 4: drawPlacementBox(world, x - dd + 0.5, yz ? ay : y , yz ? z : az , 0.5, yz ? 0.5 : 1, yz ? 1 : 0.5, player, ticks, combine); break;
          case 5: drawPlacementBox(world, x + dd      , yz ? ay : y , yz ? z : az , 0.5, yz ? 0.5 : 1, yz ? 1 : 0.5, player, ticks, combine); break;
        }
      }
      else if (isCorner)
      {
        double ax = x + (hitX > 0.5 ? 0.5 : 0);
        double ay = y + (hitY > 0.5 ? 0.5 : 0);
        double az = z + (hitZ > 0.5 ? 0.5 : 0);
        switch(side)
        {
          case 0: drawPlacementBox(world, ax, y - dd + 0.5, az, 0.5, 0.5, 0.5, player, ticks, combine); break;
          case 1: drawPlacementBox(world, ax, y + dd      , az, 0.5, 0.5, 0.5, player, ticks, combine); break;
          case 2: drawPlacementBox(world, ax, ay, z - dd + 0.5, 0.5, 0.5, 0.5, player, ticks, combine); break;
          case 3: drawPlacementBox(world, ax, ay, z + dd      , 0.5, 0.5, 0.5, player, ticks, combine); break;
          case 4: drawPlacementBox(world, x - dd + 0.5, ay, az, 0.5, 0.5, 0.5, player, ticks, combine); break;
          case 5: drawPlacementBox(world, x + dd      , ay, az, 0.5, 0.5, 0.5, player, ticks, combine); break;
        }
      }
    }
  }

  private static void drawPlacementBox(World world, double x, double y, double z, double xx, double yy, double zz, EntityPlayer player, float ticks, boolean altcolor)
  {
    AxisAlignedBB rbb = AxisAlignedBB.getBoundingBox(x, y, z, x + xx, y + yy, z + zz);
    if (!world.checkNoEntityCollision(rbb)) return;

    GL11.glEnable(GL11.GL_BLEND);
    GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);
    if (altcolor)
    {
      GL11.glColor4f(0.8F, 0.8F, 0.6F, 0.8F);
    } else {
      GL11.glColor4f(0.3F, 0.8F, 0.6F, 0.8F);
    }
    GL11.glLineWidth(2.0F);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glDepthMask(false);
      
    double bev = 0.002;
    double ox = player.lastTickPosX + (player.posX - player.lastTickPosX) * (double)ticks;
    double oy = player.lastTickPosY + (player.posY - player.lastTickPosY) * (double)ticks;
    double oz = player.lastTickPosZ + (player.posZ - player.lastTickPosZ) * (double)ticks;
    AxisAlignedBB a = rbb.expand(bev, bev, bev).getOffsetBoundingBox(-ox, -oy, -oz);
    
    Tessellator t = Tessellator.instance;
    t.startDrawing(3);
    t.addVertex(a.minX, a.minY, a.minZ);
    t.addVertex(a.maxX, a.minY, a.minZ);
    t.addVertex(a.maxX, a.minY, a.maxZ);
    t.addVertex(a.minX, a.minY, a.maxZ);
    t.addVertex(a.minX, a.minY, a.minZ);
    t.draw();
    t.startDrawing(3);
    t.addVertex(a.minX, a.maxY, a.minZ);
    t.addVertex(a.maxX, a.maxY, a.minZ);
    t.addVertex(a.maxX, a.maxY, a.maxZ);
    t.addVertex(a.minX, a.maxY, a.maxZ);
    t.addVertex(a.minX, a.maxY, a.minZ);
    t.draw();
    t.startDrawing(1);
    t.addVertex(a.minX, a.minY, a.minZ);
    t.addVertex(a.minX, a.maxY, a.minZ);
    t.addVertex(a.maxX, a.minY, a.minZ);
    t.addVertex(a.maxX, a.maxY, a.minZ);
    t.addVertex(a.maxX, a.minY, a.maxZ);
    t.addVertex(a.maxX, a.maxY, a.maxZ);
    t.addVertex(a.minX, a.minY, a.maxZ);
    t.addVertex(a.minX, a.maxY, a.maxZ);
    t.draw();

    GL11.glDepthMask(true);
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    GL11.glDisable(GL11.GL_BLEND);
  }

  // showing efficiency & harvestability in the crosshair; also see "/gui/icons.png"
  public static void drawCrosshairCustom(GuiIngame gui, int dx, int dy)
  {
    if (!GPEBTWTweak.hasAdaptiveCrosshair)
    {
      gui.drawTexturedModalRect(dx, dy, 0, 0, 16, 16);
      return;
    }
    Minecraft mc = Minecraft.getMinecraft();
    if (mc.objectMouseOver != null)
    {
      if (mc.objectMouseOver.typeOfHit == EnumMovingObjectType.TILE)
      {
        boolean efficient = false;
        boolean canHarvest = false;
        int x = mc.objectMouseOver.blockX;
        int y = mc.objectMouseOver.blockY;
        int z = mc.objectMouseOver.blockZ;
        int id = mc.theWorld.getBlockId(x, y, z);
        Block block = Block.blocksList[id];

        if (block != null)
        { 
          ItemStack stack = mc.thePlayer.inventory.getCurrentItem();
          if (GPEBTWTweak.btwFiniteTorches && stack != null)
          {
            Item item = stack.getItem();
            if ((item instanceof FCItemFireStarter || item instanceof FCItemBlockTorchBurning))
            {
              if (id == 1023) // Idle brick oven, when clicking at a lower part only
              {
                float yOffset = (float)mc.objectMouseOver.hitVec.yCoord - y;
                if (yOffset <= 3/8F)
                {
                  gui.drawTexturedModalRect(dx, dy, 64, 96, 16, 16);
                  return;
                }
              } 
              else if (id == 1013) // Idle campfire, non-burnt
              {
                int meta = mc.theWorld.getBlockMetadata(x, y, z);
                if ((meta & 4) == 0)
                {
                  gui.drawTexturedModalRect(dx, dy, 64, 96, 16, 16);
                  return;
                }
              }
              else if (id == 1025) // Idle finite torch, non-burnt
              {
                int meta = mc.theWorld.getBlockMetadata(x, y, z);
                if ((meta & 8) == 0)
                {
                  gui.drawTexturedModalRect(dx, dy, 64, 96, 16, 16);
                  return;
                }
              }
              else if (id == 1033) // Idle torch
              {
                gui.drawTexturedModalRect(dx, dy, 64, 96, 16, 16);
                return;
              }
            }
            else if (item instanceof FCItemBlockTorchIdle)
            {
              if (((FCItemBlockTorchIdle)item).IsPlayerClickingOnIgniter(stack, mc.theWorld, mc.thePlayer))
              {
                gui.drawTexturedModalRect(dx, dy, 64, 96, 16, 16);
                return;
              }
            }
          }
          if (mc.thePlayer.IsCurrentToolEffectiveOnBlock(block, x, y, z))
          {
            efficient = true;
            // Exception: bedrock, end portal frame
            if (id == 7 || id == 120)
            {
              efficient = false;
            }
          }
          if (mc.thePlayer.canHarvestBlock(block, x, y, z) && block.getBlockHardness(mc.theWorld, x, y, z) >= 0)
          {
            canHarvest = true;
            // Exception: cannot harvest crafting table, glass, glass pane, ice, mob spawner, furnace, brick oven
            if (id == 58 || id == 1034 || id == 20 || id == 102 || id == 79 || id == 52 || id == 61 || id == 62 || id == 1023 || id == 1024)
            {
              canHarvest = false;
            }
            // Exception for blocks harvestable with shears only
            if (
                id == 32 // dead bush
                || id == 18 // leaves
                || id == 211 // bloodwood leaves
                || id == 31 // tall grass
                || id == 106 // vine
              )
            {
              if (stack == null || stack.getItem().itemID != Item.shears.itemID)
              {
                canHarvest = false;
              }
            }
            // Exception: can only harvest axle with an axe
            if (id == GPEBTWTweak.compatAxleBlock.blockID)
            {
              if (!efficient)
              {
                canHarvest = false;
              }
            }
          } else {
            // Exception: show chisels good on stumps to hint at workbench creation
            if (id == 17)
            {
              int meta = mc.theWorld.getBlockMetadata(x, y, z);
              if ((meta & 12) == 12)
              {
                if (stack != null && (stack.getItem().itemID == 22317+256 || stack.getItem().itemID == GPEBTWTweak.gpeItemChiselRefined.itemID))
                {
                  canHarvest = true;
                }
              }
            }
            // Exception: can always harvest loose stone and bricks
            else if (id == 1019 || id == 1020 || id == 1021 || id == 1022)
            {
              canHarvest = true;
            }
          }
          // Exception: can only harvest webs with chisels or shears
          if (id == 30 || id == 1037)
          {
            if (stack == null)
            {
              canHarvest = false;
            } else {
              int iid = stack.getItem().itemID;
              canHarvest =
                iid == Item.shears.itemID
                || iid == 22311+256 // stone chisel (sharp stone)
                || iid == 22317+256 // iron chisel
                || iid == GPEBTWTweak.gpeItemChiselRefined.itemID;
            }
          }
        }
        gui.drawTexturedModalRect(dx, dy, (!canHarvest && efficient) ? 16 : 0, canHarvest ? 0 : 96, 16, 16);
        return;
      } else {
        // entity
        if (mc.objectMouseOver.entityHit instanceof EntityLiving)
        {
          EntityLiving el = (EntityLiving)mc.objectMouseOver.entityHit;
          boolean hasKnockback = mc.thePlayer.inventory.getDamageVsEntity(el) > 2;
          boolean notResistant = el.hurtResistantTime <= 10;
          boolean alive = el.deathTime == 0;
          boolean closeEnough = true; // Doesn't hit an entity closer than sq 36.0 anyway
          if (!mc.thePlayer.canEntityBeSeen(el))
          {
            double xx = mc.thePlayer.posX - el.posX;
            // Client player entity is 1.62 blocks above the server one
            double yy = mc.thePlayer.posY - 1.62 - el.posY;
            double zz = mc.thePlayer.posZ - el.posZ;
            closeEnough = xx * xx + yy * yy + zz * zz < 9.0;
          }
          gui.drawTexturedModalRect(dx, dy, (hasKnockback && notResistant && alive && closeEnough) ? 32 : 0, 96, 16, 16);
          return;
        }
      }
    } else {
      ItemStack stack = mc.thePlayer.inventory.getCurrentItem();
      if (stack != null && stack.getItem().itemID == FCBetterThanWolves.fcItemFishingRodBaited.itemID)
      {
        if (mc.thePlayer.fishEntity == null)
        {
          MovingObjectPosition mop = FCUtilsMisc.GetMovingObjectPositionFromPlayerHitWaterAndLava(mc.theWorld, mc.thePlayer, true);
          if (mop != null && mop.typeOfHit == EnumMovingObjectType.TILE)
          {
            if (goodFishingSpot(mop.blockX, mop.blockY, mop.blockZ))
            {
              gui.drawTexturedModalRect(dx, dy, 48, 96, 16, 16);
              return;
            }
          }
        } else {
          int x = MathHelper.floor_double(mc.thePlayer.fishEntity.posX);
          int y = MathHelper.floor_double(mc.thePlayer.fishEntity.posY);
          int z = MathHelper.floor_double(mc.thePlayer.fishEntity.posZ);
          if (goodFishingSpot(x, y, z))
          {
            gui.drawTexturedModalRect(dx, dy, 48, 96, 16, 16);
            return;
          }
        }
      }
    }
    // idle crosshair
    gui.drawTexturedModalRect(dx, dy, 0, 96, 16, 16);
  }

  private static boolean goodFishingSpot(int dx, int dy, int dz)
  {
    Minecraft mc = Minecraft.getMinecraft();
    Material mat = mc.theWorld.getBlockMaterial(dx, dy, dz);
    if (mat != Material.water) return false;
    for (int x = dx - 2; x <= dx + 2; x++)
    {
      for (int y = dy - 3; y < dy; y++)
      {
        for (int z = dz - 2; z <= dz + 2; z++)
        {
          mat = mc.theWorld.getBlockMaterial(x, y, z);
          if (mat != Material.water)
          {
            return false;
          }
        }
      }
    }
    return true;
  }

  public static void safeRenderItemAndEffectIntoGUI(RenderItem ri, FontRenderer fr, RenderEngine re, ItemStack stack, int par4, int par5)
  {
    int id = stack.itemID;
    if (id == Item.compass.itemID)
    {
      TextureCompass.compassTexture.UpdateInert();
      ri.renderItemAndEffectIntoGUI(fr, re, stack, par4, par5);
      TextureCompass.compassTexture.updateAnimation();
    }
    else if (id == Item.pocketSundial.itemID)
    {
      TextureClock.m_clockTexture.UpdateInert();
      ri.renderItemAndEffectIntoGUI(fr, re, stack, par4, par5);
      TextureClock.m_clockTexture.updateAnimation();
    }
    else
    {
      ri.renderItemAndEffectIntoGUI(fr, re, stack, par4, par5);
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

  public void playEntitySound(String sound, Entity entity, float volume, float pitch, boolean priority)
  {
    SoundManager sm = Minecraft.getMinecraft().sndManager;
    if (sm.isEntitySoundPlaying(entity))
    {
      sm.stopEntitySound(entity);
    }
    sm.playEntitySound(sound, entity, volume, pitch, priority);
  }

  public void playEntitySoundOnce(String sound, Entity entity, float volume, float pitch, boolean priority)
  {
    SoundManager sm = Minecraft.getMinecraft().sndManager;
    if (sm.isEntitySoundPlaying(entity))
    {
      sm.stopEntitySound(entity);
    }
    sm.playEntitySoundOnce(sound, entity, volume, pitch, priority);
  }

  public void stopEntitySound(Entity entity)
  {
    SoundManager sm = Minecraft.getMinecraft().sndManager;
    sm.stopEntitySound(entity);
  }
}
