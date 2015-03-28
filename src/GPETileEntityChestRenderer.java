package net.minecraft.src;

import java.util.Calendar;
import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL12;

public class GPETileEntityChestRenderer extends TileEntitySpecialRenderer
{
  private ModelChest chestModel = new ModelChest();
  private ModelChest largeChestModel = new ModelLargeChest();

  private boolean isChristmas;

  public GPETileEntityChestRenderer()
  {
    Calendar calendar = Calendar.getInstance();
    if (calendar.get(2) + 1 == 12 && calendar.get(5) >= 24 && calendar.get(5) <= 26)
    {
      isChristmas = true;
    }
  }

  public void renderTileEntityChestAt(TileEntityChest t, double x, double y, double z, float partialTicks)
  {
    // If the world is just loading, render default small chest
    int meta = t.func_70309_m() ? t.getBlockMetadata() : 0;
    // Here +x and +z parts of double chests are ignored
    if (meta <= 9)
    {
      ModelChest model;
      if (meta <= 5)
      {
        model = chestModel;
        bindTextureByName(isChristmas ? "/item/xmaschest.png" : "/item/chest.png");
      }
      else
      {
        model = largeChestModel;
        bindTextureByName(isChristmas ? "/item/largexmaschest.png" : "/item/largechest.png");
      }
      GL11.glPushMatrix();
      GL11.glEnable(GL12.GL_RESCALE_NORMAL);
      GL11.glColor4f(1.0F, 1.0F, 1.0F, 1.0F);
      GL11.glTranslatef((float)x, (float)y + 1.0F, (float)z + 1.0F);
      GL11.glScalef(1.0F, -1.0F, -1.0F);
      GL11.glTranslatef(0.5F, 0.5F, 0.5F);
      short rotation = 0;
      if (meta == 2 || meta == 6) rotation = 180;
      //if (meta == 3 || meta == 7) rotation = 0;
      if (meta == 4 || meta == 8) rotation = 90;
      if (meta == 5 || meta == 9) rotation = -90;
      if (meta == 6) GL11.glTranslatef(1.0F, 0.0F, 0.0F);
      if (meta == 9) GL11.glTranslatef(0.0F, 0.0F, -1.0F);
      GL11.glRotatef(rotation, 0.0F, 1.0F, 0.0F);
      GL11.glTranslatef(-0.5F, -0.5F, -0.5F);
      float openFactor = t.prevLidAngle + (t.lidAngle - t.prevLidAngle) * partialTicks;
      openFactor = 1.0F - openFactor;
      openFactor = 1.0F - openFactor * openFactor * openFactor;
      model.chestLid.rotateAngleX = -(openFactor * (float)Math.PI / 2.0F);
      model.renderAll();
      GL11.glDisable(GL12.GL_RESCALE_NORMAL);
      GL11.glPopMatrix();
      GL11.glColor4f(1.0F, 1.0F, 1.0F, 1.0F);
    }
  }

  public void renderTileEntityAt(TileEntity t, double x, double y, double z, float partialTicks)
  {
    renderTileEntityChestAt((TileEntityChest)t, x, y, z, partialTicks);
  }
}
