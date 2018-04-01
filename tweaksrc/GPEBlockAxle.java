package net.minecraft.src;

import java.util.Random;
import net.minecraft.client.Minecraft;
import org.lwjgl.opengl.GL11;

public class GPEBlockAxle extends FCBlockAxle
{
  protected GPEBlockAxle(int id)
  {
    super(id);
    this.setCreativeTab(CreativeTabs.tabRedstone);
    GPEBTWTweak.setAxesEffective(this);
  }

  @ClientOnly
  public void randomDisplayTick(World world, int x, int y, int z, Random random)
  {
    if (this.ClientCheckIfPowered(world, x, y, z))
    {
      world.markBlockForRenderUpdate(x, y, z);
      if (random.nextInt(200) == 0)
      {
        world.playSound((double)x + 0.5D, (double)y + 0.5D, (double)z + 0.5D, "random.chestopen", 0.075F, random.nextFloat() * 0.1F + 0.5F);
      }
    }
  }

  @ClientOnly
  public boolean RenderBlock(RenderBlocks r, int x, int y, int z)
  {
    IBlockAccess b = r.blockAccess;
    int orientation = GetAxisAlignment(b, x, y, z);

    if (ClientCheckIfPowered(b, x, y, z))
    {
      Tessellator tesselator = Tessellator.instance;
      double ticks = (double)(Minecraft.getMinecraft().renderViewEntity.ticksExisted) / 30D;

      float color = getBlockBrightness(b, x, y, z);
      tesselator.setColorOpaque_F(color, color, color);
      tesselator.setBrightness(getMixedBrightnessForBlock(b, x, y, z));

      double thickness = 0.17677669529664D;

      double x0 = 0.5D + Math.cos(ticks + (Math.PI * 0.75)) * thickness; // 135 deg
      double z0 = 0.5D + Math.sin(ticks + (Math.PI * 0.75)) * thickness;
      double x1 = 0.5D + Math.cos(ticks + (Math.PI * 0.25)) * thickness; // 45 deg
      double z1 = 0.5D + Math.sin(ticks + (Math.PI * 0.25)) * thickness;
      double x2 = 0.5D + Math.cos(ticks + (Math.PI * 1.25)) * thickness; // 225 deg
      double z2 = 0.5D + Math.sin(ticks + (Math.PI * 1.25)) * thickness;
      double x3 = 0.5D + Math.cos(ticks + (Math.PI * 1.75)) * thickness; // 315 deg
      double z3 = 0.5D + Math.sin(ticks + (Math.PI * 1.75)) * thickness;

      double u0 = m_IconSide.getInterpolatedU(0);
      double u1 = m_IconSide.getInterpolatedU(16);
      double v0 = m_IconSide.getInterpolatedV(0);
      double v1 = m_IconSide.getInterpolatedV(4);
      double v2 = m_IconSide.getInterpolatedV(8);
      double v3 = m_IconSide.getInterpolatedV(12);
      double v4 = m_IconSide.getInterpolatedV(16);
      double cap_u0 = blockIcon.getInterpolatedU(6);
      double cap_u1 = blockIcon.getInterpolatedU(10);
      double cap_v0 = blockIcon.getInterpolatedV(6);
      double cap_v1 = blockIcon.getInterpolatedV(10);

      if (orientation == 0)
      {
        // Sides
        tesselator.addVertexWithUV(x + x0, y + 1, z + z0, u0, v1);
        tesselator.addVertexWithUV(x + x0, y    , z + z0, u1, v1);
        tesselator.addVertexWithUV(x + x1, y    , z + z1, u1, v0);
        tesselator.addVertexWithUV(x + x1, y + 1, z + z1, u0, v0);

        tesselator.addVertexWithUV(x + x3, y + 1, z + z3, u0, v2);
        tesselator.addVertexWithUV(x + x3, y    , z + z3, u1, v2);
        tesselator.addVertexWithUV(x + x2, y    , z + z2, u1, v1);
        tesselator.addVertexWithUV(x + x2, y + 1, z + z2, u0, v1);

        tesselator.addVertexWithUV(x + x1, y + 1, z + z1, u0, v3);
        tesselator.addVertexWithUV(x + x1, y    , z + z1, u1, v3);
        tesselator.addVertexWithUV(x + x3, y    , z + z3, u1, v2);
        tesselator.addVertexWithUV(x + x3, y + 1, z + z3, u0, v2);

        tesselator.addVertexWithUV(x + x2, y + 1, z + z2, u0, v4);
        tesselator.addVertexWithUV(x + x2, y    , z + z2, u1, v4);
        tesselator.addVertexWithUV(x + x0, y    , z + z0, u1, v3);
        tesselator.addVertexWithUV(x + x0, y + 1, z + z0, u0, v3);
        // Caps
        tesselator.addVertexWithUV(x + x1, y, z + z1, cap_u0, cap_v1);
        tesselator.addVertexWithUV(x + x0, y, z + z0, cap_u1, cap_v1);
        tesselator.addVertexWithUV(x + x2, y, z + z2, cap_u1, cap_v0);
        tesselator.addVertexWithUV(x + x3, y, z + z3, cap_u0, cap_v0);

        tesselator.addVertexWithUV(x + x3, y + 1, z + z3, cap_u0, cap_v0);
        tesselator.addVertexWithUV(x + x2, y + 1, z + z2, cap_u1, cap_v0);
        tesselator.addVertexWithUV(x + x0, y + 1, z + z0, cap_u1, cap_v1);
        tesselator.addVertexWithUV(x + x1, y + 1, z + z1, cap_u0, cap_v1);
      }
      else if (orientation == 1)
      {
        // Sides
        tesselator.addVertexWithUV(x + z0, y + x0, z + 1, u0, v1);
        tesselator.addVertexWithUV(x + z0, y + x0, z    , u1, v1);
        tesselator.addVertexWithUV(x + z1, y + x1, z    , u1, v0);
        tesselator.addVertexWithUV(x + z1, y + x1, z + 1, u0, v0);

        tesselator.addVertexWithUV(x + z3, y + x3, z + 1, u0, v2);
        tesselator.addVertexWithUV(x + z3, y + x3, z    , u1, v2);
        tesselator.addVertexWithUV(x + z2, y + x2, z    , u1, v1);
        tesselator.addVertexWithUV(x + z2, y + x2, z + 1, u0, v1);

        tesselator.addVertexWithUV(x + z1, y + x1, z + 1, u0, v3);
        tesselator.addVertexWithUV(x + z1, y + x1, z    , u1, v3);
        tesselator.addVertexWithUV(x + z3, y + x3, z    , u1, v2);
        tesselator.addVertexWithUV(x + z3, y + x3, z + 1, u0, v2);

        tesselator.addVertexWithUV(x + z2, y + x2, z + 1, u0, v4);
        tesselator.addVertexWithUV(x + z2, y + x2, z    , u1, v4);
        tesselator.addVertexWithUV(x + z0, y + x0, z    , u1, v3);
        tesselator.addVertexWithUV(x + z0, y + x0, z + 1, u0, v3);
        // Caps
        tesselator.addVertexWithUV(x + z1, y + x1, z, cap_u0, cap_v1);
        tesselator.addVertexWithUV(x + z0, y + x0, z, cap_u1, cap_v1);
        tesselator.addVertexWithUV(x + z2, y + x2, z, cap_u1, cap_v0);
        tesselator.addVertexWithUV(x + z3, y + x3, z, cap_u0, cap_v0);

        tesselator.addVertexWithUV(x + z3, y + x3, z + 1, cap_u0, cap_v0);
        tesselator.addVertexWithUV(x + z2, y + x2, z + 1, cap_u1, cap_v0);
        tesselator.addVertexWithUV(x + z0, y + x0, z + 1, cap_u1, cap_v1);
        tesselator.addVertexWithUV(x + z1, y + x1, z + 1, cap_u0, cap_v1);
      } else {
        // Sides
        tesselator.addVertexWithUV(x + 1, y + z0, z + x0, u0, v1);
        tesselator.addVertexWithUV(x    , y + z0, z + x0, u1, v1);
        tesselator.addVertexWithUV(x    , y + z1, z + x1, u1, v0);
        tesselator.addVertexWithUV(x + 1, y + z1, z + x1, u0, v0);

        tesselator.addVertexWithUV(x + 1, y + z3, z + x3, u0, v2);
        tesselator.addVertexWithUV(x    , y + z3, z + x3, u1, v2);
        tesselator.addVertexWithUV(x    , y + z2, z + x2, u1, v1);
        tesselator.addVertexWithUV(x + 1, y + z2, z + x2, u0, v1);

        tesselator.addVertexWithUV(x + 1, y + z1, z + x1, u0, v3);
        tesselator.addVertexWithUV(x    , y + z1, z + x1, u1, v3);
        tesselator.addVertexWithUV(x    , y + z3, z + x3, u1, v2);
        tesselator.addVertexWithUV(x + 1, y + z3, z + x3, u0, v2);

        tesselator.addVertexWithUV(x + 1, y + z2, z + x2, u0, v4);
        tesselator.addVertexWithUV(x    , y + z2, z + x2, u1, v4);
        tesselator.addVertexWithUV(x    , y + z0, z + x0, u1, v3);
        tesselator.addVertexWithUV(x + 1, y + z0, z + x0, u0, v3);
        // Caps
        tesselator.addVertexWithUV(x, y + z1, z + x1, cap_u0, cap_v1);
        tesselator.addVertexWithUV(x, y + z0, z + x0, cap_u1, cap_v1);
        tesselator.addVertexWithUV(x, y + z2, z + x2, cap_u1, cap_v0);
        tesselator.addVertexWithUV(x, y + z3, z + x3, cap_u0, cap_v0);

        tesselator.addVertexWithUV(x + 1, y + z3, z + x3, cap_u0, cap_v0);
        tesselator.addVertexWithUV(x + 1, y + z2, z + x2, cap_u1, cap_v0);
        tesselator.addVertexWithUV(x + 1, y + z0, z + x0, cap_u1, cap_v1);
        tesselator.addVertexWithUV(x + 1, y + z1, z + x1, cap_u0, cap_v1);
      }
    } else {
      if (orientation == 0)
      {
        r.SetUvRotateEast(1);
        r.SetUvRotateWest(1);
        r.SetUvRotateSouth(1);
        r.SetUvRotateNorth(1);
        r.SetUvRotateTop(0);
        r.SetUvRotateBottom(0);
      }
      else if (orientation == 1)
      {
        r.SetUvRotateEast(0);
        r.SetUvRotateWest(0);
        r.SetUvRotateSouth(0);
        r.SetUvRotateNorth(3);
        r.SetUvRotateTop(2);
        r.SetUvRotateBottom(2);
      } else {
        r.SetUvRotateEast(0);
        r.SetUvRotateWest(3);
        r.SetUvRotateSouth(0);
        r.SetUvRotateNorth(0);
        r.SetUvRotateTop(3);
        r.SetUvRotateBottom(0);
      }
      setBlockBoundsBasedOnState(b, x, y, z);
      r.setRenderBoundsFromBlock(this);
      r.renderStandardBlock(this, x, y, z);
      r.ClearUvRotation();
    }
    return true;
  }
}
