package net.minecraft.src;

import org.lwjgl.opengl.GL11;

public class GPERenderPlayer extends RenderPlayer
{
  private ModelRenderer tail;
  private ModelRenderer tail2;
  private ModelRenderer tail3;
  private ModelRenderer bipedBody;
  
  public GPERenderPlayer()
  {
    super();
    bipedBody = ((ModelBiped)mainModel).bipedBody;
    
    tail = new ModelRenderer(mainModel, 24, 0);
    tail.addBox(-1.5F, 0F, -1.5F, 3, 5, 3);
    tail.setRotationPoint(0F, 10.5F, 0.5F);
    tail.rotateAngleX = 0.3927F;
    bipedBody.addChild(tail);

    tail2 = new ModelRenderer(mainModel, 24, 0);
    tail2.addBox(-1.5F, 0F, -1.5F, 3, 5, 3, -0.1F);
    tail2.setRotationPoint(0, 4.5F, 0F);
    tail2.rotateAngleX = 0.3927F;
    tail.addChild(tail2);

    tail3 = new ModelRenderer(mainModel, 24, 0);
    tail3.addBox(-1.5F, 0F, -1.5F, 3, 5, 3, -0.2F);
    tail3.setRotationPoint(0, 4.5F, 0F);
    tail3.rotateAngleX = 0.3927F;
    tail2.addChild(tail3);
  }

  public void renderPlayer(EntityPlayer e, double x, double y, double z, float yaw, float partialTicks)
  {
    float walkTime = e.limbSwing - e.limbYaw * (1.0F - partialTicks);
    float swingMax = e.prevLimbYaw + (e.limbYaw - e.prevLimbYaw) * partialTicks;

    tail.rotateAngleZ = MathHelper.cos(walkTime * 0.6662F) * -0.4F * swingMax;
    tail2.rotateAngleZ = MathHelper.cos(walkTime * 0.6662F) * -0.3F * swingMax;
    tail3.rotateAngleZ = MathHelper.cos(walkTime * 0.6662F) * -0.2F * swingMax;

    super.renderPlayer(e, x, y, z, yaw, partialTicks);
  }
}
