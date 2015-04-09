package net.minecraft.src;

import net.minecraft.client.Minecraft;
import org.lwjgl.opengl.GL11;

public class GPERenderItemFrame extends RenderItemFrame
{
  private final RenderBlocks renderBlocksInstance = new RenderBlocks();
  private Icon frameIcon;

  public void updateIcons(IconRegister r)
  {
    frameIcon = r.registerIcon("itemframe_back");
  }

  public void doRender(Entity par1Entity, double x, double y, double z, float par8, float par9)
  {
    func_82404_a((EntityItemFrame)par1Entity, x, y, z, par8, par9);
  }

  public void func_82404_a(EntityItemFrame itemFrame, double x, double y, double z, float par8, float par9)
  {
    boolean hasMap = false;
    ItemStack stack = itemFrame.getDisplayedItem();
    if (stack != null && stack.itemID == Item.map.itemID)
    {
      hasMap = true;
    }
    GL11.glPushMatrix();
    double xx = x + 0.5 + itemFrame.xPosition + Direction.offsetX[itemFrame.hangingDirection] - itemFrame.posX;
    double yy = y + 0.5 + itemFrame.yPosition - itemFrame.posY;
    double zz = z + 0.5 + itemFrame.zPosition + Direction.offsetZ[itemFrame.hangingDirection] - itemFrame.posZ;
    GL11.glTranslatef((float)xx, (float)yy, (float)zz);
    renderFrame(itemFrame, hasMap);
    renderContents(itemFrame, hasMap);
    renderLabel(itemFrame);
    GL11.glPopMatrix();
  }

  private void renderFrame(EntityItemFrame itemFrame, boolean hasMap)
  {
    GL11.glPushMatrix();
    renderManager.renderEngine.bindTexture("/terrain.png");
    GL11.glRotatef(itemFrame.rotationYaw, 0F, 1F, 0F);
    Block planks = Block.planks;
    float border = 1/16F;
    float size = hasMap ? 1.0F : 0.75F;
    float var5 = size / 2F;
    float shifted = var5 - 1/16F;

    GL11.glPushMatrix();
    renderBlocksInstance.overrideBlockBounds(0D, 0.5F - shifted, 0.5F - shifted, border * 0.5F, 0.5F + shifted, 0.5F + shifted);
    renderBlocksInstance.setOverrideBlockTexture(frameIcon);
    renderBlocksInstance.renderBlockAsItem(planks, 0, 1.0F);
    renderBlocksInstance.clearOverrideBlockTexture();
    renderBlocksInstance.unlockBlockBounds();
    GL11.glPopMatrix();
    renderBlocksInstance.setOverrideBlockTexture(Block.planks.getIcon(1, 2));
    GL11.glPushMatrix();
    renderBlocksInstance.overrideBlockBounds(0D, (0.5F - var5), (0.5F - var5), (border + 1.0E-4F), (border + 0.5F - var5), (0.5F + var5));
    renderBlocksInstance.renderBlockAsItem(planks, 0, 1.0F);
    GL11.glPopMatrix();
    GL11.glPushMatrix();
    renderBlocksInstance.overrideBlockBounds(0D, (0.5F + var5 - border), (0.5F - var5), (border + 1.0E-4F), (0.5F + var5), (0.5F + var5));
    renderBlocksInstance.renderBlockAsItem(planks, 0, 1.0F);
    GL11.glPopMatrix();
    GL11.glPushMatrix();
    renderBlocksInstance.overrideBlockBounds(0D, (0.5F - var5), (0.5F - var5), border, (0.5F + var5), (border + 0.5F - var5));
    renderBlocksInstance.renderBlockAsItem(planks, 0, 1.0F);
    GL11.glPopMatrix();
    GL11.glPushMatrix();
    renderBlocksInstance.overrideBlockBounds(0D, (0.5F - var5), (0.5F + var5 - border), border, (0.5F + var5), (0.5F + var5));
    renderBlocksInstance.renderBlockAsItem(planks, 0, 1.0F);
    GL11.glPopMatrix();
    renderBlocksInstance.unlockBlockBounds();
    renderBlocksInstance.clearOverrideBlockTexture();
    GL11.glPopMatrix();
  }

  private void renderContents(EntityItemFrame itemFrame, boolean hasMap)
  {
    ItemStack stack = itemFrame.getDisplayedItem();
    if (stack == null) return;
    boolean isBlock = stack.getItemSpriteNumber() == 0 && Block.blocksList[stack.itemID] != null
      && Block.blocksList[stack.itemID].DoesItemRenderAsBlock(stack.getItemDamage());
    float shift = hasMap ? 0F : (isBlock ? -0.162F : -0.202F);
    
    EntityItem item = new EntityItem(itemFrame.worldObj, 0.0D, 0.0D, 0.0D, stack);
    item.getEntityItem().stackSize = 1;
    item.hoverStart = 0F;
    GL11.glPushMatrix();
    GL11.glTranslatef(-29/64F * (float)Direction.offsetX[itemFrame.hangingDirection],
      shift, -29/64F * (float)Direction.offsetZ[itemFrame.hangingDirection]);
    GL11.glRotatef(180F + itemFrame.rotationYaw, 0F, 1F, 0F);
    GL11.glRotatef((float)(-90 * itemFrame.getRotation()), 0F, 0F, 1F);

    switch (itemFrame.getRotation())
    {
      case 1: GL11.glTranslatef(shift, shift, 0F); break;
      case 2: GL11.glTranslatef(0F, shift * 2, 0F); break;
      case 3: GL11.glTranslatef(-shift, shift, 0F);
    }

    if (hasMap)
    {
      renderManager.renderEngine.bindTexture("/misc/mapbg.png");
      Tessellator t = Tessellator.instance;

      GL11.glRotatef(180F, 0F, 1F, 0F);
      GL11.glRotatef(180F, 0F, 0F, 1F);
      GL11.glTranslatef(-0.5F, -0.5F, -0.016F);
      GL11.glScalef(1/128F, 1/128F, 1/128F);

      GL11.glNormal3f(0F, 0F, -1F);
      t.startDrawingQuads();
      t.addVertexWithUV(0, 128, 0, 0, 1);
      t.addVertexWithUV(128, 128, 0, 1, 1);
      t.addVertexWithUV(128, 0, 0, 1, 0);
      t.addVertexWithUV(0, 0, 0, 0, 0);
      t.draw();
      MapData mapData = Item.map.getMapData(itemFrame.getDisplayedItem(), itemFrame.worldObj);
      if (mapData != null)
      {
        renderManager.itemRenderer.mapItemRenderer.renderMap((EntityPlayer)null, renderManager.renderEngine, mapData);
      }
    } else {
      TextureCompass texCompass;

      if (stack.itemID == Item.compass.itemID)
      {
        texCompass = TextureCompass.compassTexture;
        double savedAngle = texCompass.currentAngle;
        double savedDelta = texCompass.angleDelta;
        texCompass.currentAngle = 0;
        texCompass.angleDelta = 0;
        texCompass.updateCompass(itemFrame.worldObj, itemFrame.posX, itemFrame.posZ, MathHelper.wrapAngleTo180_float(180 + itemFrame.hangingDirection * 90), false, true);
        texCompass.currentAngle = savedAngle;
        texCompass.angleDelta = savedDelta;
      }

      RenderItem.renderInFrame = true;
      if (!isBlock) GL11.glDisable(GL11.GL_LIGHTING);
      //RenderManager.instance.renderEntityWithPosYaw(item, 0, 0, 0, 0F, 0F);
      renderManager.renderEntityWithPosYaw(item, 0, 0, 0, 0F, 0F);
      if (!isBlock) GL11.glEnable(GL11.GL_LIGHTING);
      RenderItem.renderInFrame = false;

      if (stack.itemID == Item.compass.itemID)
      {
        texCompass = TextureCompass.compassTexture;
        texCompass.updateAnimation();
      }
    }
    GL11.glPopMatrix();
  }

  private void renderLabel(EntityItemFrame itemFrame)
  {
    Minecraft mc = Minecraft.getMinecraft();
    if (mc.objectMouseOver == null || mc.objectMouseOver.entityHit != itemFrame || mc.gameSettings.hideGUI) return;
    ItemStack stack = itemFrame.getDisplayedItem();
    if (stack == null || !stack.hasDisplayName()) return;
    if (itemFrame.getDistanceSqToEntity(renderManager.livingPlayer) > 4096) return;

    String name = stack.getDisplayName();

    FontRenderer fontRenderer = getFontRendererFromRenderManager();
    GL11.glPushMatrix();
    GL11.glTranslatef(0F, itemFrame.height + 0.2F, 0F);
    GL11.glNormal3f(0F, 1F, 0F);
    GL11.glRotatef(-renderManager.playerViewY, 0F, 1F, 0F);
    GL11.glRotatef(renderManager.playerViewX, 1F, 0F, 0F);
    float scale = 2/75F;
    GL11.glScalef(-scale, -scale, scale);
    GL11.glDisable(GL11.GL_LIGHTING);
    GL11.glDepthMask(false);
    GL11.glDisable(GL11.GL_DEPTH_TEST);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);
    Tessellator t = Tessellator.instance;
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    t.startDrawingQuads();
    int halfWidth = fontRenderer.getStringWidth(name) / 2;
    t.setColorRGBA_F(0F, 0F, 0F, 0.25F);
    t.addVertex(-halfWidth - 1, -1, 0);
    t.addVertex(-halfWidth - 1, 8, 0);
    t.addVertex(halfWidth + 1, 8, 0);
    t.addVertex(halfWidth + 1, -1, 0);
    t.draw();
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    fontRenderer.drawString(name, -halfWidth, 0, 0x20ffffff);
    GL11.glEnable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(true);
    fontRenderer.drawString(name, -halfWidth, 0, 0xffffffff);
    GL11.glEnable(GL11.GL_LIGHTING);
    GL11.glDisable(GL11.GL_BLEND);
    GL11.glColor4f(1F, 1F, 1F, 1F);
    GL11.glPopMatrix();
  }
}
