/*

   Hey, FlowerChild, if you're looking at this file wondering how to break my
   patcher just to spite me, don't waste your time.
   I'm hooking on Minecraft 1.5.2 stuff, so only change of Minecraft version
   will really break it and force me to rewrite everything.

   Oh, and by the way, this file is Copyright (c) 2015 Grom PE and reading
   further than this comment section is strictly forbidden without an
   advance written permission.
   To anyone who is not a Better Than Wolves mod developer, permission is
   granted to read, edit, and do anything with the contents of this file,
   keeping this comment section intact.

   COMMENT SECTION END -- DO NOT PROCEED IF YOU ARE FLOWERCHILD

*/

/*

   Dear user, feel free to change this file to your wishes, if you know how.
   If you're not going to ask totally noobish questions, feel free to ask me
   how stuff works here and there.

   http://chat.grompe.org.ru/#mcmoddev

*/

// called functions
var whatToDoWithClass;
var tweakClass;

// own constants
var INSERT_BEFORE = 1;
var BOTH = 0;
var CLIENT = 1;
var SERVER = 2;

var CHECKSUM_IGNORE = "ignore";

function log(s, no_newline)
{
  java.lang.System.out.print(s + (no_newline ? "" : "\n"));
}

function length(obj)
{
  var l = 0;
  for (var k in obj)
  {
    if (obj.hasOwnProperty(k)) l++;
  }
  return l;
}

function isInstance(a, b)
{
  return a.getClass().getName() == b;
}

function toHex(n)
{
  if (n < 0) n += 0xFFFFFFFF + 1;
  return n.toString(16).toUpperCase();
}

function Float(a)
{
  return new java.lang.Float(a);
}

function Double(a)
{
  return new java.lang.Double(a);
}

function Integer(a)
{
  return new java.lang.Integer(a);
}

function String(a)
{
  return new java.lang.String(a);
}

function JavaArray(arrtype, arr)
{
  // Work around Nashorn stupidity:
  // It fails to unwrap class when passing it as a parameter
  if (arrtype instanceof Packages.jdk.internal.dynalink.beans.StaticClass)
  {
    arrtype = arrtype["class"];
  }
  var j = java.lang.reflect.Array.newInstance(arrtype, arr.length);
  for (var i = 0; i < arr.length; i++) j[i] = arr[i];
  return j;
}

function ObjectArray(arr)
{
  return JavaArray(java.lang.Object, arr);
}

// Work around another Nashorn stupidity:
// It shadows object's "type" property by something else.
// Not even obj["type"] works, so have to use reflection
function getObjProperty(n, propname)
{
  return n["class"].getField(propname).get(n);
}

// Polyfill for Java 6's JS engine
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(searchElement, fromIndex)
  {
    var k;
    if (this == null) throw new TypeError('"this" is null or not defined');
    var o = Object(this);
    var len = o.length >>> 0;
    if (len === 0) return -1;
    var n = fromIndex | 0;
    if (n >= len) return -1;
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
    while (k < len)
    {
      if (k in o && o[k] === searchElement) return k;
      k++;
    }
    return -1;
  };
}

// Common tweak code

function calcMethodChecksum(mn)
{
  var a = 1;
  var b = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    var op = n.getOpcode();
    if (op != -1)
    {
      a = (a + op) % 65521;
      b = (b + a) % 65521;
    }  
  }
  var sum = b << 16 | a;
  if (sum < 0) sum += 0xFFFFFFFF + 1;
  return sum;
}

function CodeInserter(finder, code, before)
{
  if (!(this instanceof CodeInserter)) return new CodeInserter(finder, code, before);
  this.finder = finder;
  this.code = code;
  this.before = before;
  this.process = function(mn)
  {
    var boundary = finder.process(mn.instructions);
    if (boundary != null)
    {
      if (this.before)
      {
        mn.instructions.insertBefore(boundary, toInsnList(this.code));
      } else {
        mn.instructions.insert(boundary, toInsnList(this.code));
      }
      return true;
    }
  };
}

function BeginningFinder()
{
  if (!(this instanceof BeginningFinder)) return new BeginningFinder();
  this.process = function(instructions)
  {
    return instructions.get(0);
  }
}

function MethodInsnFinder(owner, offset)
{
  if (!(this instanceof MethodInsnFinder)) return new MethodInsnFinder(owner, offset);
  this.owner = owner;
  this.offset = offset ? offset : 0;
  this.process = function(instructions)
  {
    for (var i = 0; i < instructions.size(); i++)
    {
      var n = instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals(this.owner))
      {
        return instructions.get(i + this.offset);
      }
    }
    return null;
  };
}

function CustomFinder(checkfunc, offset)
{
  if (!(this instanceof CustomFinder)) return new CustomFinder(checkfunc, offset);
  this.checkfunc = checkfunc;
  this.offset = offset ? offset : 0;
  this.process = function(instructions)
  {
    for (var i = 0; i < instructions.size(); i++)
    {
      var n = instructions.get(i);
      if (this.checkfunc(n))
      {
        return instructions.get(i + this.offset);
      }
    }
    return null;
  };
}

function InsnFinder(opcode, offset)
{
  if (!(this instanceof InsnFinder)) return new InsnFinder(opcode, offset);
  this.opcode = opcode;
  this.offset = offset ? offset : 0;
  this.process = function(instructions)
  {
    for (var i = 0; i < instructions.size(); i++)
    {
      var n = instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == this.opcode))
      {
        return instructions.get(i + this.offset);
      }
    }
    return null;
  };
}

function JumpInsnFinder(opcode, offset)
{
  if (!(this instanceof JumpInsnFinder)) return new JumpInsnFinder(opcode, offset);
  this.opcode = opcode;
  this.offset = offset ? offset : 0;
  this.process = function(instructions)
  {
    for (var i = 0; i < instructions.size(); i++)
    {
      var n = instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode") && (n.getOpcode() == this.opcode))
      {
        return instructions.get(i + this.offset);
      }
    }
    return null;
  };
}

function toInsnList(code)
{
  var newins = new asm.tree.InsnList();
  for (var i = 0; i < code.length; i++)
  {
    newins.add(code[i]);
  }
  return newins;
}

function truncateInsnAfter(mn, node)
{
  var n = node.getNext();
  while (1)
  {
    var tmp = n;
    n = n.getNext();
    mn.instructions.remove(tmp);
    if (!n) break;
  }
}

function replaceAllMethodCalls(mn, def1, def2)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") &&
      (n.opcode == def1[0]) && n.owner.equals(def1[1]) && n.name.equals(def1[2]) && n.desc.equals(def1[3]))
    {
      n.opcode = def2[0];
      n.owner = def2[1];
      n.name = def2[2];
      n.desc = def2[3];
    }
  }
  return true;
}

function replaceFirstString(mn, source, destination)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && (n.cst.toString() == source))
    {
      n.cst = String(destination);
      return true;
    }
  }
}

function removeClientOnlyMethods(cn)
{
  if (onClient())
  {
    log("Warning: tried to remove client-only methods while on client for class " + cn.name);
    return;
  }
  for (var i = 0; i < cn.methods.size(); i++)
  {
    mn = cn.methods.get(i);
    if (mn.visibleAnnotations != null)
    {
      for (var j = 0; j < mn.visibleAnnotations.size(); j++)
      {
        var an = mn.visibleAnnotations.get(j);
        if (an.desc.equals("LClientOnly;"))
        {
          cn.methods.remove(mn);
          log("Removed client-only method " + mn.name + mn.desc);
          break;
        }
      }
    }
  }
}

function cloneMethod(mn, access, name, desc, signature, exceptions)
{
  var mn2 = MethodNode(access, name, desc, signature, exceptions);
  var lmap = new java.util.HashMap();
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.LabelNode"))
    {
      lmap.put(n, LabelNode());
    }
  }
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    mn2.instructions.add(n.clone(lmap));
  }
  return mn2;
}

function InsnNode(opcode)
{
  return new asm.tree.InsnNode(opcode);
}

function VarInsnNode(opcode, par2)
{
  return new asm.tree.VarInsnNode(opcode, par2);
}

function MethodInsnNode(opcode, par2, par3, par4)
{
  return new asm.tree.MethodInsnNode(opcode, par2, par3, par4);
}

function TypeInsnNode(opcode, par2)
{
  return new asm.tree.TypeInsnNode(opcode, par2);
}

function FieldInsnNode(opcode, par2, par3, par4)
{
  return new asm.tree.FieldInsnNode(opcode, par2, par3, par4);
}

function IntInsnNode(opcode, par2)
{
  return new asm.tree.IntInsnNode(opcode, par2);
}

function JumpInsnNode(opcode, par2)
{
  return new asm.tree.JumpInsnNode(opcode, par2);
}

function IincInsnNode(par1, par2)
{
  return new asm.tree.IincInsnNode(par1, par2);
}

function LdcInsnNode(par1)
{
  return new asm.tree.LdcInsnNode(par1);
}

function FieldNode(par1, par2, par3, par4, par5)
{
  return new asm.tree.FieldNode(par1, par2, par3, par4, par5);
}

function MethodNode(par1, par2, par3, par4, par5)
{
  return new asm.tree.MethodNode(par1, par2, par3, par4, par5);
}

function FrameNode(par1, par2, localvar, par4, stack)
{
  if (localvar instanceof Array) localvar = ObjectArray(localvar);
  if (stack instanceof Array) stack = ObjectArray(stack);
  return new asm.tree.FrameNode(par1, par2, localvar, par4, stack);
}

function TableSwitchInsnNode(par1, par2, par3, labels)
{
  if (labels instanceof Array) labels = JavaArray(asm.tree.LabelNode, labels);
  return new asm.tree.TableSwitchInsnNode(par1, par2, par3, labels);
}

function LabelNode(label)
{
  if (typeof label != "undefined")
  {
    return new asm.tree.LabelNode(label);
  } else {
    return new asm.tree.LabelNode();
  }
}

function onClient()
{
  return !Packages.BTWTweaker.onServer;
}

function isBTWVersionOrNewer(ver)
{
  return Packages.BTWTweaker.btwVersion >= ver;
}

function hasResource(name)
{
  return Packages.BTWTweaker.hasResource(name);
}

function execJS(name)
{
  return Packages.BTWTweaker.execResource("scripts/" + name);
}

var classesToTweak = {};
var deobfNames = {};

function addDeobfName(className, deobfName)
{
  if (deobfName == null) return;
  if (!deobfNames[className])
  {
    deobfNames[className] = deobfName
  } else {
    if (deobfNames[className] != deobfName)
    {
      log("Warning: overwriting deobfuscated class name: was '" + deobfNames[className] + "', now '" + deobfName + "'");
      deobfNames[className] = deobfName;
    }
  }
}

function tweak(className, deobfName, side, method, checksums, description, process)
{
  if ((side == CLIENT) && !onClient()) return;
  if ((side == SERVER) && onClient()) return;
  addDeobfName(className, deobfName);
  if (!classesToTweak[className]) classesToTweak[className] = {tweakMethods: {}, add: []};
  if (!classesToTweak[className].tweakMethods[method]) classesToTweak[className].tweakMethods[method] = [];
  classesToTweak[className].tweakMethods[method].push({
    checksums: checksums, description: description, process: process});
}

function add(className, deobfName, side, description, process)
{
  if ((side == CLIENT) && !onClient()) return;
  if ((side == SERVER) && onClient()) return;
  addDeobfName(className, deobfName);
  if (!classesToTweak[className]) classesToTweak[className] = {tweakMethods: {}, add: []};
  classesToTweak[className].add.push({
    description: description, process: process});
}

(function(){

  var filesToOverwrite =
  [
    "font/glyph_00.png",
    "font/glyph_04.png",
    "font/glyph_sizes.bin",
    "gui/icons.png",
  ];

  // unused
  listTweakableClasses = function()
  {
    var s = [];
    for (i in classesToTweak) s.push(i);
    log(s.join("\n"));
  };

  
  var ACTION_OVERWRITE = Integer(0);
  var ACTION_TWEAK = Integer(1);
  var ACTION_ADAPTSERVER = Integer(2);
  var ACTION_COPY = Integer(3);

  whatToDoWithClass = function(classname)
  {
    if (classname in classesToTweak) return ACTION_TWEAK;
    var s = classname + "";
    if (s.toString().startsWith("GPE")) return ACTION_ADAPTSERVER;
    return ACTION_COPY;
  };

  whatToDoWithFile = function(name)
  {
    if (filesToOverwrite.indexOf(name) != -1) return ACTION_OVERWRITE;
    return ACTION_COPY;
  };

  tweakClass = function(cn)
  {
    var a = classesToTweak[cn.name];
    if (!a) return;

    var failures = 0;
    var tmp;
    var count = 0;
    var total = length(a.tweakMethods);
    var mn;
    var name = cn.name;
    if (deobfNames[name])
    {
      name += " [" + deobfNames[name] + "]";
    }
    log("Class " + name + ": ");
    for (var i = 0; i < cn.methods.size(); i++)
    {
      mn = cn.methods.get(i);
      //log(mn.name);
      var tweaks;
      if (a.tweakMethods && (tweaks = a.tweakMethods[mn.name + mn.desc]))
      {
        var sum = calcMethodChecksum(mn);
        for (var i2 = 0; i2 < tweaks.length; i2++)
        {
          if (tweaks[i2].checksums != CHECKSUM_IGNORE)
          {
            var checksum = tweaks[i2].checksums;
            if (typeof tweaks[i2].checksums == "undefined")
            {
              log("Debug: Checksum for " + mn.name + mn.desc + " is 0x" + toHex(sum));
            } else {
              if (!(checksum instanceof Array)) checksum = [checksum];
              if (checksum.indexOf(sum) == -1)
              {
                log("Warning: Mismatched checksum for " + mn.name + mn.desc + " (0x" + toHex(sum) + "), things may not work well");
              }
            }
          }
          log("\t* " + tweaks[i2].description + " in " + mn.name + mn.desc + " - ", 1);
          if (tweaks[i2].process(mn))
          {
            log("ok");
          } else {
            log("FAILED!")
            Packages.BTWTweaker.failures += 1;
            failures += 1;
          }
        }
        count++;
      }
    }
    if (a.add)
    {
      for (var i = 0; i < a.add.length; i++)
      {
        log("\t* " + a.add[i].description);
        a.add[i].process(cn);
      }
    }

    if (count < total)
    {
      log("Warning: not all tweaks were made in " + cn.name + " (" + count + " of " + total + ")");
    }
    if (failures > 0)
    {
      log("Warning: failed in " + failures + " patches, take care!");
    }
    failures = 0;
  };

})();

execJS("tweaks_bed.js");
execJS("tweaks_cauldron.js");
execJS("tweaks_creative.js");
execJS("tweaks_fixes.js");
execJS("tweaks_furnace.js");
execJS("tweaks_gamelogic.js");
execJS("tweaks_heads.js");
execJS("tweaks_hooks.js");
execJS("tweaks_language.js");
execJS("tweaks_moreslabs.js");
execJS("tweaks_old.js");
execJS("tweaks_rocks.js");
execJS("tweaks_sound.js");
execJS("tweaks_tradedata.js");
execJS("tweaks_vercompat.js");
execJS("tweaks_visual.js");
execJS("tweaks_worldgen.js");
if (hasResource("scripts/custom.js")) execJS("custom.js");
