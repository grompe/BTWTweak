package net.minecraft.src;

import java.util.*;
import java.io.*;

public class GPEBTWTweakProxy
{
  public File getConfigDir()
  {
    return new File(".");
  }

  public void addEntityRenderers() {}

  public void addKeyBindings() {}

  public void onKeyPress(int key) {}

  public void playEntitySound(String sound, Entity entity, float volume, float pitch, boolean priority) {}

  public void playEntitySoundOnce(String sound, Entity entity, float volume, float pitch, boolean priority) {}

  public void stopEntitySound(Entity entity) {}
}
