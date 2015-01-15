// The only reason this class and the whole mEScriptEngine thing are needed is
// that so we can see the script stack trace when an error occurs in the script
// under Java 6/7. Otherwise it gets hidden.

import java.io.*;

import sun.org.mozilla.javascript.internal.*; // If you cannot compile this, add rt.jar of Java 6 or 7 to classpath
import mEScriptEngine.*;

class ScriptEngineProxyInternal extends ScriptEngineProxy
{
  private RhinoScriptEngine engine;

  public ScriptEngineProxyInternal()
  {
    engine = new RhinoScriptEngine();
  }

  private ScriptEngineProxyException convertException(RhinoException ex)
  {
    CharArrayWriter ca = new CharArrayWriter();
    ex.printStackTrace(new PrintWriter(ca));
    String boring = "sun\\.org\\.mozilla\\.javascript\\.internal\\.";
    String msg = ca.toString().replaceAll("\tat "+boring+"[^\n]+\n", "").replaceFirst(boring, "");
    return new ScriptEngineProxyException(msg);
  }

  public Object execStream(Reader reader, String name) throws ScriptEngineProxyException
  {
    Object result = null;
    try
    {
      engine.put("javax.script.filename", name);
      result = engine.eval(reader);
    }
    catch (RhinoException e)
    {
      throw convertException(e);
    }
    return result;
  }

  public Object invokeFunction(String name, Object ... param) throws ScriptEngineProxyException, NoSuchMethodException
  {
    Object result = null;
    try
    {
      result = engine.invokeFunction(name, param);
    }
    catch (RhinoException e)
    {
      throw convertException(e);
    }
    return result;
  }

  public boolean isInitialized()
  {
    return engine != null;
  }
}