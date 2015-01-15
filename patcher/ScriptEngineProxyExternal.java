import java.io.*;

import javax.script.*;

class ScriptEngineProxyExternal extends ScriptEngineProxy
{
  private ScriptEngine engine;

  public ScriptEngineProxyExternal()
  {
    ScriptEngineManager manager = new ScriptEngineManager();
    engine = manager.getEngineByName("js");
  }

  private ScriptEngineProxyException convertException(ScriptException ex)
  {
    return new ScriptEngineProxyException(ex);
  }

  public Object execStream(Reader reader, String name) throws ScriptEngineProxyException
  {
    Object result = null;
    try
    {
      engine.put(engine.FILENAME, name);
      result = engine.eval(reader);
    }
    catch (ScriptException e)
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
      result = ((Invocable)engine).invokeFunction(name, param);
    }
    catch (ScriptException e)
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