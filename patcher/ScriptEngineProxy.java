import java.io.*;

abstract class ScriptEngineProxy
{
  public Object execResource(String str) throws ScriptEngineProxyException
  {
    InputStream s = BTWTweaker.class.getResourceAsStream(str);
    if (s == null)
    {
      BTWTweaker.log("Error: unable to find '%s' to include", str);
      return null;
    }
    return execStream(new InputStreamReader(s), str);
  }

  public abstract Object execStream(Reader reader, String name) throws ScriptEngineProxyException;
  public abstract Object invokeFunction(String name, Object ... param) throws ScriptEngineProxyException, NoSuchMethodException;
  public abstract boolean isInitialized();
}