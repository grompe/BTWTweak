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
}
