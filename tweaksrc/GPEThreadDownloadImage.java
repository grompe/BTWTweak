package net.minecraft.src;

import argo.jdom.*;
import java.io.*;
import java.lang.reflect.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import javax.imageio.ImageIO;
import net.minecraft.client.Minecraft;

class GPEThreadDownloadImage extends Thread
{
  private final String url;
  private final IImageBuffer buffer;
  private final ThreadDownloadImageData imageData;
  private final File mcDataDir;
  private final String skinUrl;
  private final String capeUrl;

  private static Map<String, String> username2uuidMap = Collections.synchronizedMap(new HashMap());
  private static Map<String, String> uuid2skinMap = Collections.synchronizedMap(new HashMap());
  private static Map<String, String> uuid2capeMap = Collections.synchronizedMap(new HashMap());
  private static Map<String, Boolean> uuidCheckedMap = Collections.synchronizedMap(new HashMap());

  GPEThreadDownloadImage(ThreadDownloadImageData tid, String theUrl, IImageBuffer imageBuffer)
  {
    imageData = tid;
    url = theUrl;
    buffer = imageBuffer;
    mcDataDir = Minecraft.getMinecraft().mcDataDir;
    skinUrl = "http://skins.minecraft.net/MinecraftSkins/";
    capeUrl = "http://skins.minecraft.net/MinecraftCloaks/";
  }

  public void run()
  {
    try
    {
      File file;
      String storePath;
      String username = null;
      boolean gettingSkin = false;

      if (url.startsWith(skinUrl))
      {
        storePath = "skins/";
        file = new File(mcDataDir, url.replace(skinUrl, storePath));
        username = url.replace(skinUrl, "").replace(".png", "");
        gettingSkin = true;
      }
      else if (url.startsWith(capeUrl))
      {
        storePath = "capes/";
        file = new File(mcDataDir, url.replace(capeUrl, storePath));
        username = url.replace(capeUrl, "").replace(".png", "");
      } else {
        storePath = "skins-other/";
        String path = new URL(url).getPath();
        file = new File(mcDataDir, storePath + path);
      }
      long ts = (new Date()).getTime();
      if (file.exists() && (!file.canWrite() || ts - file.lastModified() < 1000*60*60))
      {
        pushStreamToBuffer(new FileInputStream(file));
        return;
      }
      HttpURLConnection conn = null;
      try
      {
        URL textureUrl;
        if (username != null)
        {
          String tex = obtainTexture(username, gettingSkin);
          if (tex == null) return;
          textureUrl = new URL(tex);
        } else {
          textureUrl = new URL(url);
        }
        conn = (HttpURLConnection)textureUrl.openConnection();
        conn.setDoInput(true);
        conn.setDoOutput(false);
        conn.connect();
        if (conn.getResponseCode() / 100 != 4)
        {
          file.getParentFile().mkdirs();
          saveStreamToFile(conn.getInputStream(), file);
        }
      }
      finally
      {
        if (file.exists()) pushStreamToBuffer(new FileInputStream(file));
        if (conn != null) conn.disconnect();
      }
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }

  private static synchronized String obtainTexture(String username, boolean gettingSkin) throws Exception
  {
    String uuid = username2uuidMap.get(username);
    if (uuid == null)
    {
      String api = readUrlToString("https://api.mojang.com/users/profiles/minecraft/" + username);
      if ("".equals(api)) return null;
      uuid = (new JdomParser()).parse(api).getStringValue("id");
      username2uuidMap.put(username, uuid);
    }
    String tex = gettingSkin
      ? uuid2skinMap.get(uuid)
      : uuid2capeMap.get(uuid);
    if (tex == null && uuidCheckedMap.get(uuid) == null)
    {
      String api = readUrlToString("https://sessionserver.mojang.com/session/minecraft/profile/" + uuid);
      List<JsonNode> properties = (new JdomParser()).parse(api).getArrayNode("properties");
      String b64 = null;
      for (int i = 0; i < properties.size(); i++)
      {
        JsonNode node = properties.get(i);
        if ("textures".equals(node.getStringValue("name")))
        {
          b64 = node.getStringValue("value");
          break;
        }
      }
      if (b64 == null) throw new IllegalStateException(String.format("No texture data for user %s", username));
      String subapi = decodeBase64(b64);
      JsonNode texturesNode = getJsonObject((new JdomParser()).parse(subapi), "textures");
      JsonNode tmp;

      tmp = getJsonObject(texturesNode, "SKIN");
      String skinTex = tmp != null ? tmp.getStringValue("url") : null;

      tmp = getJsonObject(texturesNode, "CAPE");
      String capeTex = tmp != null ? tmp.getStringValue("url") : null;

      uuid2skinMap.put(uuid, skinTex);
      uuid2capeMap.put(uuid, capeTex);
      uuidCheckedMap.put(uuid, true);
      tex = gettingSkin ? skinTex : capeTex;
    }
    return tex;
  }

  private void pushStreamToBuffer(InputStream stream) throws IOException
  {
    if (buffer == null)
    {
      imageData.image = ImageIO.read(stream);
    } else {
      imageData.image = buffer.parseUserSkin(ImageIO.read(stream));
    }
  }

  private void saveStreamToFile(InputStream stream, File file) throws IOException
  {
    byte[] buffer = new byte[4096];
    DataInputStream ins = new DataInputStream(stream);
    DataOutputStream outs = new DataOutputStream(new FileOutputStream(file));
    int bytesRead;
    while ((bytesRead = ins.read(buffer)) >= 0)
    {
      outs.write(buffer, 0, bytesRead);
    }
    ins.close();
    outs.close();
  }

  private static String readUrlToString(String url) throws IOException
  {
    BufferedReader br = new BufferedReader(new InputStreamReader(new URL(url).openStream()));
    StringBuilder res = new StringBuilder();
    String line;
    while ((line = br.readLine()) != null) res.append(line);
    br.close();
    return res.toString();
  }

  private static JsonNode getJsonObject(JsonNode node, String key)
  {
    return (JsonNode)node.getFields().get(JsonNodeFactories.aJsonString(key));
  }

  private static String decodeBase64(String b64) throws UnsupportedEncodingException
  {
    try
    {
      Class base64 = Class.forName("java.util.Base64");
      Method getDecoder = base64.getMethod("getDecoder", new Class[0]);
      Object decoder = getDecoder.invoke(null);
      Class decoder_class = decoder.getClass();
      Method decode = decoder_class.getMethod("decode", new Class[] {String.class});

      byte[] decoded = (byte[])decode.invoke(decoder, b64);
      return new String(decoded, "UTF-8");
    }
    catch (ClassNotFoundException e)
    {
    }
    catch (NoSuchMethodException e)
    {
    }
    catch (IllegalAccessException e)
    {
    }
    catch (InvocationTargetException e)
    {
    }
    return new String(javax.xml.bind.DatatypeConverter.parseBase64Binary(b64), "UTF-8");
  }
}
