import java.io.*;
import java.lang.reflect.*;
import java.util.*;
import java.util.zip.*;
//import javax.swing.JOptionPane;

public class CliPatcher
{
  public static void main(String[] args) throws Exception
  {
    if (System.console() == null)
    {
      String javaHome = System.getProperty("java.home");
      String selfPath = System.getProperty("java.class.path");
      File javaexe = new File(new File(new File(javaHome), "bin"), "java.exe");
      if (javaexe.exists())
      {
        String fullPath = new File(selfPath).getAbsoluteFile().getPath();
        //System.out.println(javaexe.getPath() + " -jar " + fullPath);
        //Process proc = (new ProcessBuilder("cmd", "/c start \"\" \"" + javaexe + "\" -jar \"" + fullPath + "\"")).start();

        // Running a console program from non-console program is completely
        // braindead in Java/Windows. Here we do insane stuff trying
        // to avoid console getting hidden or receiving no input.
        // And yes, there shouldn't be a matching quote in the end of fullPath.
        Process proc = (new ProcessBuilder("cmd", "/c start \"BTWTweak console\" \"" + javaexe + "\" -jar \"" + fullPath)).start();
        //JOptionPane.showMessageDialog(null, javaexe.getPath() + " -jar " + fullPath, "BTWTweak", JOptionPane.WARNING_MESSAGE);
      }
      System.exit(1);
    }

    if (args.length > 0)
    {
      BTWTweaker.main(args);
      return;
    }

    System.out.println("== Grom PE's BTWTweak patcher ==");
    System.out.println("Built on: 11 Sep 2013");
    System.out.println("Current directory: " + System.getProperty("user.dir"));

    ArrayList<String> btwVersions = new ArrayList<String>();
    
    /*
    File dir = new File(".");
    for (File child : dir.listFiles())
    {
      if (child.getName().startsWith("BTWMod4-"))
      {
        btwVersions.add(child);
      }
    }
    int numBtw = btwVersions.size();
    System.out.println("BTWMod4-*.zip: " + (numBtw == 0 ? "not found" : String.format("%s versions found", numBtw)));
    */

    String mcname = "minecraft.jar";
    String mcstatus = "not found";
    int mcbtwclient = BTWTweaker.STATUS_NOTFOUND;
    if ((new File(mcname)).exists())
    {
      mcbtwclient = BTWTweaker.checkClientServerBTWZip(mcname);
      mcstatus = "found in current directory with " + BTWTweaker.explainStatus(mcbtwclient);
    }

    if (mcbtwclient != BTWTweaker.STATUS_BTWCLIENT)
    {
      // TODO: look in appdata, etc.
    }

    System.out.println("minecraft.jar: " + mcstatus);

    String mcservername = "minecraft_server.jar";
    new File(mcservername);
    mcstatus = "not found";
    int mcbtwserver = BTWTweaker.STATUS_NOTFOUND;
    if ((new File(mcservername)).exists())
    {
      mcbtwserver = BTWTweaker.checkClientServerBTWZip(mcservername);
      mcstatus = "found in current directory with " + BTWTweaker.explainStatus(mcbtwserver);
    }
    
    System.out.println("minecraft_server.jar: " + mcstatus);

    if (/*numBtw == 0 && */!(mcbtwclient == BTWTweaker.STATUS_BTWCLIENT) && !(mcbtwserver == BTWTweaker.STATUS_BTWSERVER))
    {
      System.out.println("== No suitable patch targets ==\nPress Enter to quit.");
      input();
      System.exit(1);
    }
    
    System.out.println("== Modes of operation ==");

    int i = 0;
    for (String btw : btwVersions)
    {
      i++;
      System.out.println(String.format("(%d) Patch %s", i, btw));
    }
    if (mcbtwclient == BTWTweaker.STATUS_BTWCLIENT)
    {
      System.out.println("(c) Patch minecraft.jar which has BTW client installed");
    }
    if (mcbtwserver == BTWTweaker.STATUS_BTWSERVER)
    {
      System.out.println("(s) Patch minecraft_server.jar which has BTW server installed");
    }
    System.out.print("Input number of your choice and press Enter (blank=cancel): ");
    String choice = input().trim().toLowerCase();

    if (choice.equals(""))
    {
      System.out.println("Cancelled by user.");
      System.exit(2);
    } else if (choice.equals("c") && (mcbtwclient == BTWTweaker.STATUS_BTWCLIENT))
    {
      BTWTweaker.tweak(mcname, mcbtwclient);
    } else if (choice.equals("s") && (mcbtwserver == BTWTweaker.STATUS_BTWSERVER))
    {
      BTWTweaker.tweak(mcservername, mcbtwserver);
    } /* else {
      boolean valid;
      try
      {
        i = Integer.parseInt(choice);
        valid = i < btwVersions.size();
      }
      catch (NumberFormatException e)
      {
        valid = false;
      }
      if (valid)
      {
        BTWTweaker.tweak(btwVersions.get(i), BTWTweaker.STATUS_BTWPACKAGE);
      } else {
        System.out.println("Invalid input.");
        System.exit(1);
      }
    } */
  }

  private static String input()
  {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    try
    {
       return br.readLine();
    }
    catch (IOException e) {}
    return null;
  }
}