package net.minecraft.src;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.IOException;
import java.net.URL;
import net.minecraft.client.Minecraft;

public class GPEThreadDownloadResources extends ThreadDownloadResources
{
  public File resourcesFolder;
  public File assetsLegacyFolder;

  private Minecraft mc;

  private boolean closing = false;
  private static final String RES_LOCATION = "http://resources.download.minecraft.net/";

  public GPEThreadDownloadResources(File mcDir, Minecraft minecraft)
  {
    super(mcDir, minecraft);
    mc = minecraft;
    setName("Resource download thread");
    setDaemon(true);
    resourcesFolder = new File(mcDir, "resources/");
    assetsLegacyFolder = new File(mcDir, "assets/virtual/legacy/");

    if (!resourcesFolder.exists() && !resourcesFolder.mkdirs())
    {
      throw new RuntimeException("The working directory could not be created: " + resourcesFolder);
    }
  }

  public void run()
  {
    try
    {
      BufferedReader r = new BufferedReader(new InputStreamReader(GPEThreadDownloadResources.class.getResourceAsStream("/resources.txt"), "UTF-8"));
      String line = "";
      while ((line = r.readLine()) != null)
      {
        if (line.startsWith("#")) continue;
        String[] data = line.split(":");
        int fileSize = Integer.parseInt(data[2]);
        if (fileSize > 0)
        {
          downloadAndInstallResource(data[1], data[0], fileSize); 
        }
        if (closing) return;
      }
      r.close();
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
    reloadResources();
  }

  public void reloadResources()
  {
    loadResourceFromLauncherPath(assetsLegacyFolder, "");
    loadResource(resourcesFolder, "");
  }

  private void loadResource(File baseDirectory, String subDir)
  {
    File[] files = baseDirectory.listFiles();
    if (files == null) return;

    for (int i = 0; i < files.length; i++)
    {
      if (files[i].isDirectory())
      {
        loadResource(files[i], subDir + files[i].getName() + "/");
      }
      else
      {
        try
        {
          mc.installResource(subDir + files[i].getName(), files[i]);
        }
        catch (Exception e)
        {
          mc.getLogAgent().logWarning("Failed to add " + subDir + files[i].getName() + " in resources");
        }
      }
    }
  }

  private void loadResourceFromLauncherPath(File baseDirectory, String subDir)
  {
    File[] files = baseDirectory.listFiles();
    if (files == null) return;

    for (int i = 0; i < files.length; i++)
    {
      if (files[i].isDirectory())
      {
        loadResourceFromLauncherPath(files[i], subDir + files[i].getName() + "/");
      }
      else
      {
        try
        {
          String compatDir = subDir.replace("sound/", "sound3/").replace("records/", "streaming/");
          mc.installResource(compatDir + files[i].getName(), files[i]);
        }
        catch (Exception e)
        {
          mc.getLogAgent().logWarning("Failed to add " + subDir + files[i].getName() + " in resources");
        }
      }
    }
  }

  private void downloadAndInstallResource(String hash, String path, long fileSize)
  {
    try
    {
      File file = new File(resourcesFolder, path);
      File fileInLauncher = new File(assetsLegacyFolder, path.replace("sound3/", "sound/").replace("streaming/", "records/").replace("newmusic/", "music/"));

      if (file.exists() && file.length() == fileSize)
      {
        mc.installResource(path, file);
      }
      else if (fileInLauncher.exists() && fileInLauncher.length() == fileSize)
      {
        mc.installResource(path, fileInLauncher);
      }
      else
      {
        file.getParentFile().mkdirs();
        downloadResource(new URL(RES_LOCATION + hash.substring(0, 2) + "/" + hash), file);
        if (closing) return;
        mc.installResource(path, file);
      }
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }

  private void downloadResource(URL url, File file) throws IOException
  {
    byte[] buffer = new byte[4096];
    DataInputStream ins = new DataInputStream(url.openStream());
    DataOutputStream outs = new DataOutputStream(new FileOutputStream(file));
    do
    {
      int bytesRead = ins.read(buffer);
      if (bytesRead < 0)
      {
        ins.close();
        outs.close();
        return;
      }
      outs.write(buffer, 0, bytesRead);
    }
    while (!closing);
  }

  public void closeMinecraft()
  {
    closing = true;
  }
}
