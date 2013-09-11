package mEScriptEngine;

import java.util.*;
import javax.script.*;
import sun.org.mozilla.javascript.internal.*;

final class ExternalScriptable implements Scriptable {

   private ScriptContext context;
   private Map<Object, Object> indexedProps;
   private Scriptable prototype;
   private Scriptable parent;


   ExternalScriptable(ScriptContext var1) {
      this(var1, new HashMap<Object, Object>());
   }

   ExternalScriptable(ScriptContext var1, Map<Object, Object> var2) {
      if(var1 == null) {
         throw new NullPointerException("context is null");
      } else {
         this.context = var1;
         this.indexedProps = var2;
      }
   }

   ScriptContext getContext() {
      return this.context;
   }

   private boolean isEmpty(String var1) {
      return var1.equals("");
   }

   public String getClassName() {
      return "Global";
   }

   public synchronized Object get(String var1, Scriptable var2) {
      if(this.isEmpty(var1)) {
         return this.indexedProps.containsKey(var1)?this.indexedProps.get(var1):NOT_FOUND;
      } else {
         ScriptContext var3 = this.context;
         synchronized(this.context) {
            int var4 = this.context.getAttributesScope(var1);
            if(var4 != -1) {
               Object var5 = this.context.getAttribute(var1, var4);
               return Context.javaToJS(var5, this);
            } else {
               return NOT_FOUND;
            }
         }
      }
   }

   public synchronized Object get(int var1, Scriptable var2) {
      Integer var3 = new Integer(var1);
      return this.indexedProps.containsKey(Integer.valueOf(var1))?this.indexedProps.get(var3):NOT_FOUND;
   }

   public synchronized boolean has(String var1, Scriptable var2) {
      if(this.isEmpty(var1)) {
         return this.indexedProps.containsKey(var1);
      } else {
         ScriptContext var3 = this.context;
         synchronized(this.context) {
            return this.context.getAttributesScope(var1) != -1;
         }
      }
   }

   public synchronized boolean has(int var1, Scriptable var2) {
      Integer var3 = new Integer(var1);
      return this.indexedProps.containsKey(var3);
   }

   public void put(String var1, Scriptable var2, Object var3) {
      if(var2 == this) {
         synchronized(this) {
            if(this.isEmpty(var1)) {
               this.indexedProps.put(var1, var3);
            } else {
               ScriptContext var5 = this.context;
               synchronized(this.context) {
                  int var6 = this.context.getAttributesScope(var1);
                  if(var6 == -1) {
                     var6 = 100;
                  }

                  this.context.setAttribute(var1, this.jsToJava(var3), var6);
               }
            }
         }
      } else {
         var2.put(var1, var2, var3);
      }

   }

   public void put(int var1, Scriptable var2, Object var3) {
      if(var2 == this) {
         synchronized(this) {
            this.indexedProps.put(new Integer(var1), var3);
         }
      } else {
         var2.put(var1, var2, var3);
      }

   }

   public synchronized void delete(String var1) {
      if(this.isEmpty(var1)) {
         this.indexedProps.remove(var1);
      } else {
         ScriptContext var2 = this.context;
         synchronized(this.context) {
            int var3 = this.context.getAttributesScope(var1);
            if(var3 != -1) {
               this.context.removeAttribute(var1, var3);
            }
         }
      }

   }

   public void delete(int var1) {
      this.indexedProps.remove(new Integer(var1));
   }

   public Scriptable getPrototype() {
      return this.prototype;
   }

   public void setPrototype(Scriptable var1) {
      this.prototype = var1;
   }

   public Scriptable getParentScope() {
      return this.parent;
   }

   public void setParentScope(Scriptable var1) {
      this.parent = var1;
   }

   public synchronized Object[] getIds() {
      String[] var1 = this.getAllKeys();
      int var2 = var1.length + this.indexedProps.size();
      Object[] var3 = new Object[var2];
      System.arraycopy(var1, 0, var3, 0, var1.length);
      int var4 = var1.length;

      Object var6;
      for(Iterator var5 = this.indexedProps.keySet().iterator(); var5.hasNext(); var3[var4++] = var6) {
         var6 = var5.next();
      }

      return var3;
   }

   public Object getDefaultValue(Class var1) {
      for(int var2 = 0; var2 < 2; ++var2) {
         boolean var3;
         if(var1 == ScriptRuntime.StringClass) {
            var3 = var2 == 0;
         } else {
            var3 = var2 == 1;
         }

         String var4;
         Object[] var5;
         if(var3) {
            var4 = "toString";
            var5 = ScriptRuntime.emptyArgs;
         } else {
            var4 = "valueOf";
            var5 = new Object[1];
            String var6;
            if(var1 == null) {
               var6 = "undefined";
            } else if(var1 == ScriptRuntime.StringClass) {
               var6 = "string";
            } else if(var1 == ScriptRuntime.ScriptableClass) {
               var6 = "object";
            } else if(var1 == ScriptRuntime.FunctionClass) {
               var6 = "function";
            } else if(var1 != ScriptRuntime.BooleanClass && var1 != Boolean.TYPE) {
               if(var1 != ScriptRuntime.NumberClass && var1 != ScriptRuntime.ByteClass && var1 != Byte.TYPE && var1 != ScriptRuntime.ShortClass && var1 != Short.TYPE && var1 != ScriptRuntime.IntegerClass && var1 != Integer.TYPE && var1 != ScriptRuntime.FloatClass && var1 != Float.TYPE && var1 != ScriptRuntime.DoubleClass && var1 != Double.TYPE) {
                  throw Context.reportRuntimeError("Invalid JavaScript value of type " + var1.toString());
               }

               var6 = "number";
            } else {
               var6 = "boolean";
            }

            var5[0] = var6;
         }

         Object var13 = ScriptableObject.getProperty(this, var4);
         if(var13 instanceof Function) {
            Function var7 = (Function)var13;
            Context var8 = RhinoScriptEngine.enterContext();

            try {
               var13 = var7.call(var8, var7.getParentScope(), this, var5);
            } finally {
               Context.exit();
            }

            if(var13 != null) {
               if(!(var13 instanceof Scriptable)) {
                  return var13;
               }

               if(var1 == ScriptRuntime.ScriptableClass || var1 == ScriptRuntime.FunctionClass) {
                  return var13;
               }

               if(var3 && var13 instanceof Wrapper) {
                  Object var9 = ((Wrapper)var13).unwrap();
                  if(var9 instanceof String) {
                     return var9;
                  }
               }
            }
         }
      }

      String var12 = var1 == null?"undefined":var1.getName();
      throw Context.reportRuntimeError("Cannot find default value for object " + var12);
   }

   public boolean hasInstance(Scriptable var1) {
      for(Scriptable var2 = var1.getPrototype(); var2 != null; var2 = var2.getPrototype()) {
         if(var2.equals(this)) {
            return true;
         }
      }

      return false;
   }

   private String[] getAllKeys() {
      ArrayList<String> var1 = new ArrayList<String>();
      ScriptContext var2 = this.context;
      synchronized(this.context) {
         Iterator var3 = this.context.getScopes().iterator();

         while(var3.hasNext()) {
            int var4 = ((Integer)var3.next()).intValue();
            Bindings var5 = this.context.getBindings(var4);
            if(var5 != null) {
               var1.ensureCapacity(var5.size());
               Iterator var6 = var5.keySet().iterator();

               while(var6.hasNext()) {
                  String var7 = (String)var6.next();
                  var1.add(var7);
               }
            }
         }
      }

      String[] var10 = new String[var1.size()];
      var1.toArray(var10);
      return var10;
   }

   private Object jsToJava(Object var1) {
      if(var1 instanceof Wrapper) {
         Wrapper var2 = (Wrapper)var1;
         if(var2 instanceof NativeJavaClass) {
            return var2;
         } else {
            Object var3 = var2.unwrap();
            return !(var3 instanceof Number) && !(var3 instanceof String) && !(var3 instanceof Boolean) && !(var3 instanceof Character)?var3:var2;
         }
      } else {
         return var1;
      }
   }
}
