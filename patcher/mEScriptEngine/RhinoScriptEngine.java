package mEScriptEngine;

import java.io.*;
import java.util.*;
import javax.script.*;
import java.lang.reflect.*;
import sun.org.mozilla.javascript.internal.*;
import com.sun.script.util.InterfaceImplementor;

public final class RhinoScriptEngine implements Invocable
{
   private static final boolean DEBUG = false;
   private ImporterTopLevel topLevel;
   private Map<Object, Object> indexedProps;
   private InterfaceImplementor implementor;
   protected ScriptContext context;

   public RhinoScriptEngine()
   {
      this.context = new SimpleScriptContext();
      Context context = enterContext();
      try
      {
         this.topLevel = new ImporterTopLevel(context);
         try
         {
            JavaAdapter javaAdapter = new JavaAdapter(this);
            javaAdapter.setParentScope(this.topLevel);
            javaAdapter.setPrototype(javaAdapter.getFunctionPrototype(this.topLevel));
            javaAdapter.putProperty(topLevel, "JavaAdapter", javaAdapter);
         }
         catch(Exception e) { e.printStackTrace(); }
      } finally {
         Context.exit();
      }
      this.indexedProps = new HashMap<Object, Object>();
      this.implementor = new InterfaceImplementor(this)
      {
         protected Object convertResult(Method method, Object obj) throws ScriptException
         {
            Class class1 = method.getReturnType();
            if(class1 == Void.TYPE) return null;
            else return Context.jsToJava(obj, class1);
         }
      };
   }

   public Object eval(Reader var1, ScriptContext var2) throws RhinoException
   {
      Context var4 = enterContext();

      Object var3;
      try
      {
         Scriptable var5 = this.getRuntimeScope(var2);
         String var14 = (String)this.get("javax.script.filename");
         var14 = var14 == null?"<Unknown source>":var14;
         var3 = var4.evaluateReader(var5, var1, var14, 1, (Object)null);
      }
      catch (IOException e)
      {
         throw new WrappedException(e);
      }
      finally
      {
         Context.exit();
      }

      return this.unwrapReturnValue(var3);
   }

   public Object eval(String var1, ScriptContext var2) throws RhinoException
   {
      if(var1 == null)
      {
         throw new NullPointerException("null script");
      } else {
         return this.eval((Reader)(new StringReader(var1)), var2);
      }
   }

   public Object eval(Reader reader) throws RhinoException
   {
       return eval(reader, context);
   }

   public Object eval(String s) throws RhinoException
   {
       return eval(s, context);
   }

   public Bindings createBindings()
   {
      return new SimpleBindings();
   }

   public Object invokeFunction(String var1, Object ... var2) throws RhinoException, NoSuchMethodException
   {
      return this.invoke((Object)null, var1, var2);
   }

   public Object invokeMethod(Object var1, String var2, Object ... var3) throws RhinoException, NoSuchMethodException
   {
      if(var1 == null)
      {
         throw new IllegalArgumentException("script object can not be null");
      } else {
         return this.invoke(var1, var2, var3);
      }
   }

   private Object invoke(Object thisparam, String name, Object ... args) throws RhinoException, NoSuchMethodException
   {
      Context context = enterContext();

      Object obj11;
      try
      {
         if(name == null)
         {
            throw new NullPointerException("method name is null");
         }

         if(thisparam != null && !(thisparam instanceof Scriptable))
         {
            thisparam = Context.toObject(thisparam, this.topLevel);
         }

         Scriptable scriptable5 = this.getRuntimeScope(this.context);
         Scriptable scriptable17 = thisparam != null?(Scriptable)thisparam:scriptable5;
         Object var7 = ScriptableObject.getProperty(scriptable17, name);
         if(!(var7 instanceof Function))
         {
            throw new NoSuchMethodException("no such method: " + name);
         }

         Function var8 = (Function)var7;
         Scriptable var9 = var8.getParentScope();
         if(var9 == null)
         {
            var9 = scriptable5;
         }

         Object var10 = var8.call(context, var9, scriptable17, this.wrapArguments(args));
         obj11 = this.unwrapReturnValue(var10);
      }
      finally
      {
         Context.exit();
      }

      return obj11;
   }

   public <T> T getInterface(Class<T> var1)
   {
      try
      {
         return this.implementor.getInterface((Object)null, var1);
      }
      catch (ScriptException var3)
      {
         return null;
      }
   }

   public <T> T getInterface(Object var1, Class<T> var2)
   {
      if(var1 == null)
      {
         throw new IllegalArgumentException("script object can not be null");
      } else {
         try
         {
            return this.implementor.getInterface(var1, var2);
         }
         catch (ScriptException var4)
         {
            return null;
         }
      }
   }

   Scriptable getRuntimeScope(ScriptContext var1)
   {
      if(var1 == null)
      {
         throw new NullPointerException("null script context");
      } else {
         ExternalScriptable var2 = new ExternalScriptable(var1, this.indexedProps);
         var2.setPrototype(this.topLevel);
         return var2;
      }
   }

   static Context enterContext()
   {
      return Context.enter();
   }

   Object[] wrapArguments(Object[] var1)
   {
      if(var1 == null)
      {
         return Context.emptyArgs;
      } else {
         Object[] var2 = new Object[var1.length];

         for(int var3 = 0; var3 < var2.length; ++var3)
         {
            var2[var3] = Context.javaToJS(var1[var3], this.topLevel);
         }

         return var2;
      }
   }

   Object unwrapReturnValue(Object var1)
   {
      if(var1 instanceof Wrapper)
      {
         var1 = ((Wrapper)var1).unwrap();
      }

      return var1 instanceof Undefined?null:var1;
   }

   public void put(String s, Object obj)
   {
      Bindings bindings = context.getBindings(100);
      if(bindings != null)
         bindings.put(s, obj);
   }

   public Object get(String s)
   {
      Bindings bindings = context.getBindings(100);
      if(bindings != null)
         return bindings.get(s);
      else
         return null;
   }
}
