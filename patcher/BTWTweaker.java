import java.io.*;
import java.util.*;
import java.util.zip.*;

import org.objectweb.asm.*;
import org.objectweb.asm.tree.*;

import static org.objectweb.asm.Opcodes.ALOAD;
import static org.objectweb.asm.Opcodes.INVOKESTATIC;
import static org.objectweb.asm.Opcodes.RETURN;
import static org.objectweb.asm.Opcodes.ACC_PUBLIC;

public class BTWTweaker
{
  private static final Class MAIN_CLASS = BTWTweaker.class;

  private static final int ACTION_OVERWRITE = 0;
  private static final int ACTION_TWEAK = 1;
  private static final int ACTION_ADAPTSERVER = 2;
  private static final int ACTION_COPY = 3;

  public static final int STATUS_NOBTW = 0;
  public static final int STATUS_BTWCLIENT = 1;
  public static final int STATUS_BTWSERVER = 2;
  public static final int STATUS_BTWPACKAGE = 3;
  public static final int STATUS_TWEAKED = 4;
  public static final int STATUS_NOTFOUND = 5;

  protected static ScriptEngineProxy scriptProxy;

  public static boolean onServer = false;
  public static int failures = 0;

  public static String btwVersion = "unknown";

  public static void log(String s)
  {
    System.out.println("[BTWTweak] " + s);
  }

  public static void log(String s, Object... fmt)
  {
    log(String.format(s, fmt));
  }

  public static boolean hasResource(String name)
  {
    InputStream s = MAIN_CLASS.getResourceAsStream(name);
    if (s == null) return false;
    try
    {
      s.close();
    }
    catch(IOException e){}
    return true;
  }

  public static String stream2String(InputStream stream) throws IOException
  {
    int len;
    byte[] buffer = new byte[2048];
    StringWriter sw = new StringWriter();
    while ((len = stream.read(buffer, 0, 2048)) > 0)
    {
      sw.write(new String(buffer).toCharArray(), 0, len);
    }
    return sw.toString();
  }

  public static void main(final String args[]) throws Exception
  {
    if (args.length == 0 || args.length == 1 && args[0].equals("--help"))
    {
      log("BTWTweak by Grom PE for Better Than Wolves mod for Minecraft 1.5.2");
      //log("Usage: btwtweak minecraft.jar|minecraft_server.jar|BTWMod4-*.zip");
      log("Usage: btwtweak minecraft.jar|minecraft_server.jar");
      return;
    }
    String jarname = args[0];

    //if (jarname.indexOf("server") != -1) onServer = true;
    int jartype = checkClientServerBTWZip(jarname);
    log(jarname + ": "+explainStatus(jartype));
    if (jartype == STATUS_NOBTW)
    {
      log("Please install Better Than Wolves mod inside the file and run me again.");
      return;
    }
    if (jartype == STATUS_TWEAKED)
    {
      log("Please reinstall on fresh Better Than Wolves mod from scratch.");
      return;
    }
    if (jartype == STATUS_BTWPACKAGE)
    {
      log("Tweaking BTW package is not yet implemented.\nPlease install on minecraft(_server).jar with BTW inside.");
      return;
    }
    onServer = (jartype == STATUS_BTWSERVER);

    tweak(jarname, jartype);
  }

  public static String explainStatus(int status)
  {
    if (status == STATUS_NOBTW) return "no BTW";
    String s = " with BTW version " + btwVersion;
    if (status == STATUS_BTWCLIENT) return "BTW client" + s;
    if (status == STATUS_BTWSERVER) return "BTW server" + s;
    if (status == STATUS_BTWPACKAGE) return "BTW package" + s;
    if (status == STATUS_TWEAKED) return "BTWTweak already installed";
    return "Unknown";
  }

  public static int checkClientServerBTWZip(String jarname) throws Exception
  {
    int status;
    ZipFile zip = new ZipFile(new File(jarname));
    ZipEntry btwentry = zip.getEntry("FCBetterThanWolves.class");
    if (btwentry == null)
    {
      status = STATUS_BTWPACKAGE;
      btwentry = zip.getEntry("MINECRAFT-JAR/FCBetterThanWolves.class");
      if (btwentry == null) status = STATUS_NOBTW;
    } else {
      ZipEntry entry = zip.getEntry("net/minecraft/client/Minecraft.class");
      status = (entry == null) ? STATUS_BTWSERVER : STATUS_BTWCLIENT;
    }
    if (zip.getEntry(status == STATUS_BTWPACKAGE ? "MINECRAFT-JAR/GPEBTWTweak.class" : "GPEBTWTweak.class") != null)
      status = STATUS_TWEAKED;
    if (btwentry != null && status != STATUS_TWEAKED)
    {
      InputStream stream = zip.getInputStream(btwentry);
      String s = stream2String(stream);
      // Possible todo: use ASM for more reliable version detection
      stream.close();
      int p = s.indexOf("4.");
      if (p != -1)
      {
        btwVersion = s.substring(p, p + (byte)s.charAt(p-1));
      }
    }
    zip.close();
    return status;
  }

  public static void tweak(String jarname, int jartype) throws Exception
  {
    try
    {
      Class.forName("sun.org.mozilla.javascript.internal.Context");
      scriptProxy = new ScriptEngineProxyInternal();
      log("Using internal Rhino Engine for JavaScript");
    }
    catch(ClassNotFoundException e)
    {
      log("Trying to use any available JavaScript engine");
      scriptProxy = new ScriptEngineProxyExternal();
    }
    if (!scriptProxy.isInitialized())
    {
      throw new IllegalArgumentException("No JavaScript engine is available");
    }

    scriptProxy.execResource("scripts/opcodes.js");
    scriptProxy.execResource("scripts/tweaks.js");

    File jar = new File(jarname);
    String outputname = jarname.replaceFirst("\\.([^.]+)$", "_tweak.$1");
    if (outputname.equals(jarname)) outputname = outputname + ".tweak.zip";
    int pass = 0;
    ZipInputStream zis;
    ZipOutputStream zos = new ZipOutputStream(new BufferedOutputStream(new FileOutputStream(outputname)));
    ZipEntry entry = null;
    byte[] buf = new byte[4096];
    int len;
    InputStream instream;
    while (pass <= 1)
    {
      if (pass == 0)
      {
        log("Reading " + jarname + "...");
        instream = new FileInputStream(jar);
      } else {
        log("Reading GPEBTWTweak_files.zip...");
        instream = MAIN_CLASS.getResourceAsStream("GPEBTWTweak_files.zip");
      }
      zis = new ZipInputStream(instream);

      while ((entry = zis.getNextEntry()) != null)
      {
        String name = entry.getName();
        String classname = "";
        int action = ACTION_COPY;
        if (name.endsWith(".class"))
        {
          classname = name.substring(0, name.length() - 6);
          action = (Integer)scriptProxy.invokeFunction("whatToDoWithClass", classname);
        }
        if (name.startsWith("btwmodtex") || name.startsWith("mob") || name.startsWith("textures"))
        {
          if (onServer || entry.isDirectory()) continue;
        }
        switch (action)
        {
        case ACTION_TWEAK:
        case ACTION_ADAPTSERVER:
          zos.putNextEntry(new ZipEntry(name));
          ByteArrayOutputStream b = new ByteArrayOutputStream();
          while ((len = zis.read(buf)) > 0)
          {
            b.write(buf, 0, len);
          }

          ClassReader cr = new ClassReader(b.toByteArray());
          ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);
          ClassNode cn = new ClassNode();
          cr.accept(cn, 0);

          if (action == ACTION_TWEAK)
          {
            scriptProxy.invokeFunction("tweakClass", cn);
          }
          else if (action == ACTION_ADAPTSERVER)
          {
            Iterator<MethodNode> methods = cn.methods.iterator();
            while(methods.hasNext())
            {
              MethodNode mn = methods.next();
              if (onServer && mn.visibleAnnotations != null)
              {
                for (Object obj2 : mn.visibleAnnotations)
                {
                  AnnotationNode an = (AnnotationNode)obj2;
                  if (an.desc.equals("LClientOnly;"))
                  {
                    methods.remove();
                    log("Class %s: Removed client-only method %s", classname, mn.name + mn.desc);
                    continue;
                  }
                }
              }
            }
          }
          cn.accept(cw);

          zos.write(cw.toByteArray());
          zos.closeEntry();

          break;
        case ACTION_OVERWRITE:
        case ACTION_COPY:
          if ((action == ACTION_COPY) || (action == ACTION_OVERWRITE) && (pass == 1))
          {
            zos.putNextEntry(new ZipEntry(name));
            while ((len = zis.read(buf)) > 0)
            {
              zos.write(buf, 0, len);
            }
            zos.closeEntry();
          }
          break;
        }
      }
      zis.close();
      pass++;
    }
    zos.close();
    log("Wrote " + outputname);
    if (failures == 0)
    {
      log("All OK!");
    } else {
      log("%d ERRORS during the patching - review the log, test and take care!", failures);
    }
  }

}
