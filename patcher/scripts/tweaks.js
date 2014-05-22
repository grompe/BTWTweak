/*

   Hey, FlowerChild, if you're looking at this file wondering how to break my
   patcher just to spite me, don't waste your time.
   I'm hooking on Minecraft 1.5.2 stuff, so only change of Minecraft version
   will really break it and force me to rewrite everything.

   Oh, and by the way, this file is Copyright (c) 2013 Grom PE and reading
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

*/

// called functions
var whatToDoWithClass;
var tweakClass;

// own constants
var INSERT_BEFORE = 1;

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
  return java.lang.Float(a);
}

function Double(a)
{
  return java.lang.Double(a);
}

function Integer(a)
{
  return java.lang.Integer(a);
}

function String(a)
{
  return java.lang.String(a);
}

function JavaArray(arrtype, arr)
{
  var j = java.lang.reflect.Array.newInstance(arrtype, arr.length);
  for (var i = 0; i < arr.length; i++) j[i] = arr[i];
  return j;
}

function ObjectArray(arr)
{
  return JavaArray(java.lang.Object, arr);
}

(function(){

  var failures = 0;

  // Common code

  function dropHeadCode(classname, index)
  {
    return [
      VarInsnNode(ALOAD, 0),
      TypeInsnNode(NEW, "wm"),
      InsnNode(DUP),
      FieldInsnNode(GETSTATIC, "wk", "bR", "Lwk;"),
      FieldInsnNode(GETFIELD, "wk", "cp", "I"),
      InsnNode(ICONST_1),
      IntInsnNode(BIPUSH, index),
      MethodInsnNode(INVOKESPECIAL, "wm", "<init>", "(III)V"),
      InsnNode(FCONST_0),
      MethodInsnNode(INVOKEVIRTUAL, classname, "a", "(Lwm;F)Lrh;"),
      InsnNode(POP),
      InsnNode(RETURN),
    ];
  }

  // Classes requiring patches
  var classesToTweak =
  {
    "acj": // AnvilChunkLoader
    {
      tweakMethods:
      {
        "a(Laab;IILbs;)Labw;": function(mn)
        {
          check(mn, 0x44552D12);
          CodeInserter(
            MethodInsnFinder("acj", +2),
            [
              VarInsnNode(ALOAD, 1),
              VarInsnNode(ALOAD, 5),
              MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "onLoadChunk", "(Laab;Labw;)V"),
            ],
            "\t* Inserting onLoadChunk() hook into "
          ).process(mn);
        },
        "a(Laab;Labw;)V": function(mn)
        {
          check(mn, 0xA7460B07);
          CodeInserter(
            MethodInsnFinder("acj"),
            [
              VarInsnNode(ALOAD, 1),
              VarInsnNode(ALOAD, 2),
              MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "onSaveChunk", "(Laab;Labw;)V"),
            ],
            "\t* Inserting onSaveChunk() hook into "
          ).process(mn);
        },
      },
    },
    "ajt": // SaveHandler
    {
      tweakMethods:
      {
        "LoadModSpecificData(Laab;)V": function(mn)
        {
          check(mn, 0xB5D20BBD);
          CodeInserter(
            BeginningFinder(),
            [
              VarInsnNode(ALOAD, 1),
              MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "loadWorldData", "(Laab;)V"),
            ],
            "\t* Inserting loadWorldData() hook into ",
            INSERT_BEFORE
          ).process(mn);
        },
        "SaveModSpecificData(Laab;)V": function(mn)
        {
          check(mn, 0x4F7810AB);
          CodeInserter(
            BeginningFinder(),
            [
              VarInsnNode(ALOAD, 1),
              MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "saveWorldData", "(Laab;)V"),
            ],
            "\t* Inserting saveWorldData() hook into ",
            INSERT_BEFORE
          ).process(mn);
        },
      }
    },
    "amn": // BlockFurnace
    {
      tweakClientMethods:
      {
        "a(II)Llx;": function(mn)
        {
          check(mn, 0x4C380826);

          var i;
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.FrameNode"))
            {
              mn.instructions.set(n, FrameNode(F_APPEND, 1, ["lx"], 0, null));
              break;
            }
          }
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && (n.name == "e"))
            {
              mn.instructions.remove(mn.instructions.get(i - 1));
              mn.instructions.set(n, VarInsnNode(ALOAD, 3));
              break;
            }
          }
          var label1 = LabelNode();
          var label2 = LabelNode();
          CodeInserter(
            BeginningFinder(),
            [
              VarInsnNode(ILOAD, 2),
              IntInsnNode(BIPUSH, 8),
              InsnNode(IAND),
              JumpInsnNode(IFEQ, label1),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "amn", "furnaceIconFrontStuff", "Llx;"),
              JumpInsnNode(GOTO, label2),
              label1,
              FrameNode(F_SAME, 0, null, 0, null),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "amn", "e", "Llx;"),
              label2,
              FrameNode(F_SAME1, 0, null, 1, ["lx"]),
              VarInsnNode(ASTORE, 3),
              VarInsnNode(ILOAD, 2),
              IntInsnNode(BIPUSH, 7),
              InsnNode(IAND),
              VarInsnNode(ISTORE, 2),
            ],
            "\t* Inserting new furnace icon getting into ",
            INSERT_BEFORE
          ).process(mn);
        },
        "a(Lly;)V": function(mn)
        {
          check(mn, 0x4B7207E7);
          var label1 = LabelNode();
          var label2 = LabelNode();
          CodeInserter(
            BeginningFinder(),
            [
              VarInsnNode(ALOAD, 0),
              VarInsnNode(ALOAD, 1),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "amn", "b", "Z"),
              JumpInsnNode(IFEQ, label1),
              LdcInsnNode("furnace_front_contents_lit"),
              JumpInsnNode(GOTO, label2),
              label1,
              FrameNode(F_FULL, 2, ["amn", "ly"], 2, ["amn", "ly"]),
              LdcInsnNode("furnace_front_contents"),
              label2,
              FrameNode(F_FULL, 2, ["amn", "ly"], 3, ["amn", "ly", "java/lang/String"]),
              MethodInsnNode(INVOKEINTERFACE, "ly", "a", "(Ljava/lang/String;)Llx;"),
              FieldInsnNode(PUTFIELD, "amn", "furnaceIconFrontStuff", "Llx;"),
            ],
            "\t* Inserting new furnace icon registering into ",
            INSERT_BEFORE
          ).process(mn);
        },
        "b(Laab;IIILjava/util/Random;)V": function(mn)
        {
          check(mn, 0xBDEF3089);
          CodeInserter(
            MethodInsnFinder("aab"),
            [
              IntInsnNode(BIPUSH, 7),
              InsnNode(IAND),
            ],
            "\t* Handling stuffed furnace metadata bit in "
          ).process(mn);
        },
      },
      tweakMethods:
      {
        "a(ZLaab;III)V": function(mn)
        {
          check(mn, 0x9BCA0FEA);
          CodeInserter(
            MethodInsnFinder("aab"),
            [
              IntInsnNode(BIPUSH, 7),
              InsnNode(IAND),
              VarInsnNode(ILOAD, 5),
              InsnNode(ICONST_3),
              InsnNode(ISHL),
              InsnNode(IOR),
            ],
            "\t* Hacking furnace even further in "
          ).process(mn);
          //mn.name = "updateFurnaceBlockState";
          mn.desc = "(ZLaab;IIIZ)V";
          log("\t% Transformed a(ZLaab;III)V to (ZLaab;IIIZ)V");
        }
      },
      add: function(cn)
      {
        cn.fields.add(FieldNode(ACC_PRIVATE, "furnaceIconFrontStuff", "Llx;", null, null));
        log("Class " + cn.name + ": \t+ Added private Icon furnaceIconFrontStuff");
      },
    },
    "awz": // GUISleepMP
    {
      tweakClientMethods:
      {
        "A_()V": function(mn)
        {
          check(mn, 0x80D809F4);
          log("\t* Moving 'leave bed' button from obscuring the view in " + mn.name + mn.desc, 1);
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 40))
            {
              n.operand = 80;
              log("");
              return;
            }
          }
          log(" ...failed!");
          recordFailure();
        }
      }
    },
    "anf": // BlockFlowing
    {
      tweakMethods:
      {
        "n(Laab;III)Z": function(mn)
        {
          check(mn, 0xAD981353);
          var label;
          var boundary = null;
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode"))
            {
              label = n.label;
              boundary = mn.instructions.get(i + 1);
              break;
            }
          }
          log("\t* Making lava more unstoppable in " + mn.name + mn.desc, 1);
          if (boundary != null)
          {
            mn.instructions.insert(boundary, toInsnList(
              [
                FieldInsnNode(GETSTATIC, "apa", "aM", "Lapa;"),
                FieldInsnNode(GETFIELD, "apa", "cz", "I"),
                JumpInsnNode(IF_ICMPEQ, label),
                VarInsnNode(ILOAD, 5),
              ]
            ));
            var label2 = LabelNode();
            mn.instructions.insert(mn.instructions.get(mn.instructions.size() - 4), toInsnList(
              [
                VarInsnNode(ALOAD, 0),
                FieldInsnNode(GETFIELD, "anf", "cO", "Laif;"),
                FieldInsnNode(GETSTATIC, "aif", "i", "Laif;"),
                JumpInsnNode(IF_ACMPNE, label2),
                VarInsnNode(ILOAD, 5),
                FieldInsnNode(GETSTATIC, "apa", "aP", "Lapa;"),
                FieldInsnNode(GETFIELD, "apa", "cz", "I"),
                JumpInsnNode(IF_ICMPEQ, label2),
                InsnNode(ICONST_0),
                InsnNode(IRETURN),
                label2,
                FrameNode(F_SAME, 0, null, 0, null),
              ]
            ));
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        },
      },
    },
    "aoo": // BlockSnowBlock
    {
      tweakMethods:
      {
      },
      add: function(cn)
      {
        var mn = MethodNode(ACC_STATIC, "<clinit>", "()V", null, null);
        mn.instructions.add(toInsnList(
          [
            TypeInsnNode(NEW, "GPEBTWTweak"),
            InsnNode(DUP),
            MethodInsnNode(INVOKESPECIAL, "GPEBTWTweak", "<init>", "()V"),
            InsnNode(POP),
            InsnNode(RETURN),
          ]
        ));
        cn.methods.add(mn);
        log("Class " + cn.name + ": \t+ Adding BTWTweak init hook in <clinit>()V");
      },
    },
    "aqg": // TileEntityFurnace
    {
      tweakMethods:
      {
        "<init>()V": function(mn)
        {
          check(mn, 0x2C370586);
          CodeInserter(
            BeginningFinder(),
            [
              VarInsnNode(ALOAD, 0),
              InsnNode(ICONST_0),
              FieldInsnNode(PUTFIELD, "aqg", "currentItemID", "I"),
              VarInsnNode(ALOAD, 0),
              InsnNode(ICONST_0),
              FieldInsnNode(PUTFIELD, "aqg", "emptyResultSlot", "Z"),
            ],
            "\t* Adding new vars init to furnace TE in ",
            INSERT_BEFORE
          ).process(mn);
        },
        "h()V": function(mn)
        {
          check(mn, 0x5533D5);
          log("\t* Updating furnace TE's updateEntity() in " + mn.name + mn.desc, 1);
          var changes = 0;
          var i;
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.name.equals("j"))
            {
              mn.instructions.insertBefore(n, toInsnList(
                [
                  MethodInsnNode(INVOKESPECIAL, "aqg", "checkForChange", "()Z"),
                  VarInsnNode(ISTORE, 3),
                  VarInsnNode(ALOAD, 0),
                ]
              ));
              changes++;
              break;
            }
          }
          for (i += 3; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.opcode == DUP))
            {
              var label = mn.instructions.get(i - 4).label; // fakeinst
              mn.instructions.insertBefore(n, toInsnList(
                [
                  FieldInsnNode(GETFIELD, "aqg", "g", "[Lwm;"),
                  InsnNode(ICONST_0),
                  InsnNode(AALOAD),
                  FieldInsnNode(GETFIELD, "wm", "c", "I"),
                  VarInsnNode(ALOAD, 0),
                  FieldInsnNode(GETFIELD, "aqg", "currentItemID", "I"),
                  JumpInsnNode(IF_ICMPNE, label),
                  VarInsnNode(ALOAD, 0),
                ]
              ));
              changes++;
              break;
            }
          }
          for (i += 8; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.FrameNode"))
            {
              mn.instructions.insertBefore(n, toInsnList(
                [
                  FrameNode(F_APPEND, 1, [INTEGER], 0, null),
                  VarInsnNode(ALOAD, 0),
                  MethodInsnNode(INVOKESPECIAL, "aqg", "setCurrentItemID", "()V"),
                ]
              ));
              mn.instructions.remove(n);
              changes++;
              break;
            }
          }
          for (i += 2; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode") && (n.opcode == IF_ICMPEQ))
            {
              var label1 = n.label;
              var label2 = LabelNode();
              mn.instructions.set(mn.instructions.get(i - 1),
                FrameNode(F_FULL, 4, ["aqg", INTEGER, INTEGER, INTEGER], 2, [INTEGER, INTEGER]));
              n.label = label2;
              mn.instructions.insert(mn.instructions.get(i + 4), toInsnList( // fakeinst
                [
                  InsnNode(ICONST_1),
                  VarInsnNode(ISTORE, 3),
                  label2,
                  FrameNode(F_SAME, 0, null, 0, null),
                  VarInsnNode(ILOAD, 3),
                  JumpInsnNode(IFEQ, label1),
                ]
              ));
              changes++;
              break;
            }
          }
          for (i += 6; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("amn"))
            {
              mn.instructions.set(mn.instructions.get(i + 2), FrameNode(F_CHOP, 1, null, 0, null));
              var label1 = LabelNode();
              var label2 = LabelNode();
              var label3 = LabelNode();
              mn.instructions.insertBefore(n, toInsnList(
                [
                  VarInsnNode(ALOAD, 0),
                  FieldInsnNode(GETFIELD, "aqg", "g", "[Lwm;"),
                  InsnNode(ICONST_0),
                  InsnNode(AALOAD),
                  JumpInsnNode(IFNONNULL, label1),
                  VarInsnNode(ALOAD, 0),
                  FieldInsnNode(GETFIELD, "aqg", "g", "[Lwm;"),
                  InsnNode(ICONST_2),
                  InsnNode(AALOAD),
                  JumpInsnNode(IFNULL, label2),
                  label1,
                  FrameNode(F_FULL, 4, ["aqg", INTEGER, INTEGER, INTEGER], 5, [INTEGER, "aab", INTEGER, INTEGER, INTEGER]),
                  InsnNode(ICONST_1),
                  JumpInsnNode(GOTO, label3),
                  label2,
                  FrameNode(F_FULL, 4, ["aqg", INTEGER, INTEGER, INTEGER], 5, [INTEGER, "aab", INTEGER, INTEGER, INTEGER]),
                  InsnNode(ICONST_0),
                  label3,
                  FrameNode(F_FULL, 4, ["aqg", INTEGER, INTEGER, INTEGER], 6, [INTEGER, "aab", INTEGER, INTEGER, INTEGER, INTEGER]),
                ]
              ));
              //n.name = "updateFurnaceBlockState";
              n.desc = "(ZLaab;IIIZ)V";
              changes++;
              break;
            }
          }
          if (changes == 5)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        },
      },
      add: function(cn)
      {
        cn.fields.add(FieldNode(ACC_PUBLIC, "currentItemID", "I", null, null));
        cn.fields.add(FieldNode(ACC_PUBLIC, "emptyResultSlot", "Z", null, null));

        var mn;
        var label1 = LabelNode();
        var label2 = LabelNode();
        var label3 = LabelNode();
        var label4 = LabelNode();
        var label5 = LabelNode();
        var label6 = LabelNode();
        var label7 = LabelNode();
        var label8 = LabelNode();
        var label9 = LabelNode();
        var label10 = LabelNode();
        mn = MethodNode(ACC_PRIVATE, "checkForChange", "()Z", null, null);
        mn.instructions.add(toInsnList(
          [
            InsnNode(ICONST_0),
            VarInsnNode(ISTORE, 1),
            VarInsnNode(ALOAD, 0),
            FieldInsnNode(GETFIELD, "aqg", "currentItemID", "I"),
            JumpInsnNode(IFNE, label1),
            InsnNode(ICONST_1),
            JumpInsnNode(GOTO, label2),
            label1,
            FrameNode(F_APPEND, 1, [INTEGER], 0, null),
            InsnNode(ICONST_0),
            label2,
            FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
            VarInsnNode(ALOAD, 0),
            FieldInsnNode(GETFIELD, "aqg", "g", "[Lwm;"),
            InsnNode(ICONST_0),
            InsnNode(AALOAD),
            JumpInsnNode(IFNONNULL, label3),
            InsnNode(ICONST_1),
            JumpInsnNode(GOTO, label4),
            label3,
            FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
            InsnNode(ICONST_0),
            label4,
            FrameNode(F_FULL, 2, ["aqg", INTEGER], 2, [INTEGER, INTEGER]),
            JumpInsnNode(IF_ICMPEQ, label5),
            InsnNode(ICONST_1),
            VarInsnNode(ISTORE, 1),
            VarInsnNode(ALOAD, 0),
            MethodInsnNode(INVOKESPECIAL, "aqg", "setCurrentItemID", "()V"),
            label5,
            FrameNode(F_SAME, 0, null, 0, null),
            VarInsnNode(ALOAD, 0),
            FieldInsnNode(GETFIELD, "aqg", "emptyResultSlot", "Z"),
            VarInsnNode(ALOAD, 0),
            FieldInsnNode(GETFIELD, "aqg", "g", "[Lwm;"),
            InsnNode(ICONST_2),
            InsnNode(AALOAD),
            JumpInsnNode(IFNONNULL, label6),
            InsnNode(ICONST_1),
            JumpInsnNode(GOTO, label7),
            label6,
            FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
            InsnNode(ICONST_0),
            label7,
            FrameNode(F_FULL, 2, ["aqg", INTEGER], 2, [INTEGER, INTEGER]),
            JumpInsnNode(IF_ICMPEQ, label8),
            InsnNode(ICONST_1),
            VarInsnNode(ISTORE, 1),
            VarInsnNode(ALOAD, 0),
            VarInsnNode(ALOAD, 0),
            FieldInsnNode(GETFIELD, "aqg", "g", "[Lwm;"),
            InsnNode(ICONST_2),
            InsnNode(AALOAD),
            JumpInsnNode(IFNONNULL, label9),
            InsnNode(ICONST_1),
            JumpInsnNode(GOTO, label10),
            label9,
            FrameNode(F_SAME1, 0, null, 1, ["aqg"]),
            InsnNode(ICONST_0),
            label10,
            FrameNode(F_FULL, 2, ["aqg", INTEGER], 2, ["aqg", INTEGER]),
            FieldInsnNode(PUTFIELD, "aqg", "emptyResultSlot", "Z"),
            label8,
            FrameNode(F_SAME, 0, null, 0, null),
            VarInsnNode(ILOAD, 1),
            InsnNode(IRETURN),
          ]
        ));
        cn.methods.add(mn);

        mn = MethodNode(ACC_PRIVATE, "setCurrentItemID", "()V", null, null);
        var label = LabelNode();
        mn.instructions.add(toInsnList(
          [
            VarInsnNode(ALOAD, 0),
            FieldInsnNode(GETFIELD, "aqg", "g", "[Lwm;"),
            InsnNode(ICONST_0),
            InsnNode(AALOAD),
            VarInsnNode(ASTORE, 1),
            InsnNode(ICONST_0),
            VarInsnNode(ISTORE, 2),
            VarInsnNode(ALOAD, 1),
            JumpInsnNode(IFNULL, label),
            VarInsnNode(ALOAD, 1),
            FieldInsnNode(GETFIELD, "wm", "c", "I"),
            VarInsnNode(ISTORE, 2),
            label,
            FrameNode(F_APPEND, 2, ["wm", INTEGER], 0, null),
            VarInsnNode(ALOAD, 0),
            VarInsnNode(ILOAD, 2),
            FieldInsnNode(PUTFIELD, "aqg", "currentItemID", "I"),
            InsnNode(RETURN),
          ]
        ));
        cn.methods.add(mn);
      },
    },
    "bdk": // NetClientHandler
    {
      tweakMethods:
      {
        "a(Lcn;)V": function(mn)
        {
          check(mn, 0x3B2FD94B);
          log("\t* Adding rock entity into NetClientHandler " + mn.name + mn.desc, 1);
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && (n.owner == "FCEntityRottenArrow"))
            {
              var label = mn.instructions.get(i + 1).label;
              var mylabel = LabelNode();
              mn.instructions.insertBefore(n, toInsnList(
                [
                  MethodInsnNode(INVOKESTATIC, "GPEEntityRock", "getVehicleSpawnPacketType", "()I"),
                  JumpInsnNode(IF_ICMPNE, mylabel),
                  TypeInsnNode(NEW, "GPEEntityRock"),
                  InsnNode(DUP),
                  VarInsnNode(ALOAD, 0),
                  FieldInsnNode(GETFIELD, "bdk", "i", "Lbds;"),
                  VarInsnNode(DLOAD, 2),
                  VarInsnNode(DLOAD, 4),
                  VarInsnNode(DLOAD, 6),
                  MethodInsnNode(INVOKESPECIAL, "GPEEntityRock", "<init>", "(Laab;DDD)V"),
                  VarInsnNode(ASTORE, 8),
                  JumpInsnNode(GOTO, label),
                  mylabel,
                  FrameNode(F_SAME, 0, null, 0, null),
                  VarInsnNode(ALOAD, 1),
                  FieldInsnNode(GETFIELD, "cn", "j", "I"),
                ]
              ));
              log("");
              return;
            }
          }
          log("...failure!");
        },
      },
    },
    "bjb": // TileEntitySkullRenderer
    {
      tweakMethods:
      {
        "a(FFFIFILjava/lang/String;)V": function(mn)
        {
          check(mn, 0x991332F);
          log("\t* Adding skulls to render in " + mn.name + mn.desc, 1);
          var changes = 0;
          var i;
          var label;
          var label1 = LabelNode();
          var label2 = LabelNode();
          var label3 = LabelNode();
          var label4 = LabelNode();
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.TableSwitchInsnNode"))
            {
              n.max = 8;
              n.labels.add(label1);
              n.labels.add(label2);
              n.labels.add(label3);
              n.labels.add(label4);
              changes++;
              break;
            }
          }
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && (n.owner.equals("org/lwjgl/opengl/GL11")))
            {
              label = mn.instructions.get(i - 2);
              mn.instructions.insertBefore(label, toInsnList(
                [
                  JumpInsnNode(GOTO, label),
                  label1,
                  FrameNode(F_SAME, 0, null, 0, null),
                  VarInsnNode(ALOAD, 0),
                  LdcInsnNode("/mob/spider_head.png"),
                  MethodInsnNode(INVOKEVIRTUAL, "bjb", "a", "(Ljava/lang/String;)V"),
                  JumpInsnNode(GOTO, label),
                  label2,
                  FrameNode(F_SAME, 0, null, 0, null),
                  VarInsnNode(ALOAD, 0),
                  LdcInsnNode("/mob/enderman_head.png"),
                  MethodInsnNode(INVOKEVIRTUAL, "bjb", "a", "(Ljava/lang/String;)V"),
                  JumpInsnNode(GOTO, label),
                  label3,
                  FrameNode(F_SAME, 0, null, 0, null),
                  VarInsnNode(ALOAD, 0),
                  LdcInsnNode("/mob/pigzombie_head.png"),
                  MethodInsnNode(INVOKEVIRTUAL, "bjb", "a", "(Ljava/lang/String;)V"),
                  JumpInsnNode(GOTO, label),
                  label4,
                  FrameNode(F_SAME, 0, null, 0, null),
                  VarInsnNode(ALOAD, 0),
                  LdcInsnNode("/mob/fire.png"),
                  MethodInsnNode(INVOKEVIRTUAL, "bjb", "a", "(Ljava/lang/String;)V"),
                ]
              ));
              changes++;
              break;
            }
          }
          
          if (changes == 2)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        },
      },
    },
    /* // Disabled until I find a better way to do textures and support texture packs
    "FCBlockAxle":
    {
      tweakClientMethods:
      {
        "a(Lly;)V": function(mn)
        {
          check(mn, 0x28FF05C8);
          CodeInserter(
            InsnFinder(RETURN),
            [
              // Override one of original texture so texture packs won't look too weird
              VarInsnNode(ALOAD, 0),
              VarInsnNode(ALOAD, 1),
              LdcInsnNode("fcBlockAxle_side_on1"),
              MethodInsnNode(INVOKEINTERFACE, "ly", "a", "(Ljava/lang/String;)Llx;"),
              FieldInsnNode(PUTFIELD, "FCBlockAxle", "m_IconSideOn", "Llx;"),
              
              VarInsnNode(ALOAD, 1),
              LdcInsnNode("fcBlockAxle_side_on2"),
              MethodInsnNode(INVOKEINTERFACE, "ly", "a", "(Ljava/lang/String;)Llx;"),
              VarInsnNode(ASTORE, 2),
              VarInsnNode(ALOAD, 1),
              LdcInsnNode("fcBlockAxle_side_on3"),
              MethodInsnNode(INVOKEINTERFACE, "ly", "a", "(Ljava/lang/String;)Llx;"),
              VarInsnNode(ASTORE, 3),
              VarInsnNode(ALOAD, 1),
              LdcInsnNode("fcBlockAxle_side_on4"),
              MethodInsnNode(INVOKEINTERFACE, "ly", "a", "(Ljava/lang/String;)Llx;"),
              VarInsnNode(ASTORE, 4),
              VarInsnNode(ALOAD, 1),
              LdcInsnNode("fcBlockAxle_side_on4f"),
              MethodInsnNode(INVOKEINTERFACE, "ly", "a", "(Ljava/lang/String;)Llx;"),
              VarInsnNode(ASTORE, 5),
              VarInsnNode(ALOAD, 0),
              IntInsnNode(BIPUSH, 10),
              TypeInsnNode(ANEWARRAY, "lx"),
              InsnNode(DUP),
              InsnNode(ICONST_0),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "FCBlockAxle", "m_IconSideOn", "Llx;"),
              InsnNode(AASTORE),
              InsnNode(DUP),
              InsnNode(ICONST_1),
              VarInsnNode(ALOAD, 3),
              InsnNode(AASTORE),
              InsnNode(DUP),
              InsnNode(ICONST_2),
              VarInsnNode(ALOAD, 2),
              InsnNode(AASTORE),
              InsnNode(DUP),
              InsnNode(ICONST_3),
              VarInsnNode(ALOAD, 4),
              InsnNode(AASTORE),
              InsnNode(DUP),
              InsnNode(ICONST_4),
              VarInsnNode(ALOAD, 4),
              InsnNode(AASTORE),
              InsnNode(DUP),
              InsnNode(ICONST_5),
              VarInsnNode(ALOAD, 2),
              InsnNode(AASTORE),
              InsnNode(DUP),
              IntInsnNode(BIPUSH, 6),
              VarInsnNode(ALOAD, 3),
              InsnNode(AASTORE),
              InsnNode(DUP),
              IntInsnNode(BIPUSH, 7),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "FCBlockAxle", "m_IconSideOn", "Llx;"),
              InsnNode(AASTORE),
              InsnNode(DUP),
              IntInsnNode(BIPUSH, 8),
              VarInsnNode(ALOAD, 5),
              InsnNode(AASTORE),
              InsnNode(DUP),
              IntInsnNode(BIPUSH, 9),
              VarInsnNode(ALOAD, 2),
              InsnNode(AASTORE),
              FieldInsnNode(PUTFIELD, "FCBlockAxle", "niceTexLookup", "[Llx;"),
            ],
            "\t* Adding icons registration in ",
            INSERT_BEFORE
          ).process(mn);
        },
        "b_(Laak;IIII)Llx;": function(mn)
        {
          check(mn, 0x150E13);
          log("\t* Injecting new texture getter in " + mn.name + mn.desc, 1);
          var changes = 0;
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.name.equals("GetAxleSideTextureForOnState"))
            {
              var additions;
              if (changes == 0)
              {
                additions =
                [
                  InsnNode(ICONST_4),
                  VarInsnNode(ILOAD, 5),
                  InsnNode(IADD),
                  MethodInsnNode(INVOKEVIRTUAL, "FCBlockAxle", "getNiceSideTexture", "(I)Llx;"),
                ];
              } else {
                additions = 
                [
                  VarInsnNode(ILOAD, 5),
                  MethodInsnNode(INVOKEVIRTUAL, "FCBlockAxle", "getNiceSideTexture", "(I)Llx;"),
                ];
              }
              mn.instructions.insert(n, toInsnList(additions));

              var removed = 0;
              while (1)
              {
                var tmp = n;
                n = n.getPrevious();
                while (n.getOpcode() == -1) n = n.getPrevious();
                mn.instructions.remove(tmp);
                removed++;
                if (removed == 3) break;
              }
              changes++;
              if (changes == 3) break;
            }
          }
          if (changes == 3)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        },
      },
      add: function(cn)
      {
        if (!onClient()) return;
        cn.fields.add(FieldNode(ACC_PRIVATE, "niceTexLookup", "[Llx;", null, null));
        log("Class " + cn.name + ": \t+ Added icons and lookup table");

        mn = MethodNode(ACC_PUBLIC, "getNiceSideTexture", "(I)Llx;", null, null);
        var label = LabelNode();
        mn.instructions.add(toInsnList(
          [
            VarInsnNode(ALOAD, 0),
            FieldInsnNode(GETFIELD, "FCBlockAxle", "m_bIsPowerOnForCurrentRender", "Z"),
            JumpInsnNode(IFNE, label),
            VarInsnNode(ALOAD, 0),
            FieldInsnNode(GETFIELD, "FCBlockAxle", "m_IconSide", "Llx;"),
            InsnNode(ARETURN),
            label,
            FrameNode(F_SAME, 0, null, 0, null),
            VarInsnNode(ALOAD, 0),
            FieldInsnNode(GETFIELD, "FCBlockAxle", "niceTexLookup", "[Llx;"),
            VarInsnNode(ILOAD, 1),
            InsnNode(AALOAD),
            InsnNode(ARETURN),
          ]
        ));
        cn.methods.add(mn);
        log("Class " + cn.name + ": \t+ Added getNiceSideTexture(I)Llx;");
      },
    },*/
  /*"FCBlockBellows":  // Let's leave FlowerChild's bugs to FlowerChild.
    {
      tweakMethods:
      {
      },
    },*/
    "FCBlockBed":
    {
      removeMethods:
      [
        "a(Laab;IIILsq;IFFF)Z"
      ],
    },
    "FCBlockBlockDispenser":
    {
      tweakMethods:
      {
        "DispenseBlockOrItem(Laab;IIILjava/util/Random;)V": function(mn)
        {
          if (isBTWVersionOrNewer("4.89666")) return;
          check(mn, 0xB78B99F2, 0x9DEF97A1);
          var label;
          var boundary = null;
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && (n.name == "fcUrn"))
            {
              label = mn.instructions.get(i - 6).label;
              boundary = n;
              break;
            }
          }
          log("\t* Handling loose rocks in " + mn.name + mn.desc, 1);
          if (boundary != null)
          {
            var label1 = LabelNode();
            var label2 = LabelNode();
            mn.instructions.insertBefore(boundary, toInsnList(
              [
                FieldInsnNode(GETSTATIC, "GPEBTWTweak", "gpeItemLooseRock", "Lwk;"),
                FieldInsnNode(GETFIELD, "wk", "cp", "I"),
                JumpInsnNode(IF_ICMPNE, label2),
                VarInsnNode(ALOAD, 16),
                VarInsnNode(ALOAD, 17),
                FieldInsnNode(GETFIELD, "wm", "c", "I"),
                IntInsnNode(SIPUSH, 32767),
                MethodInsnNode(INVOKESTATIC, "FCUtilsInventory", "CountItemsInInventory", "(Llt;II)I"),
                VarInsnNode(ISTORE, 31),
                VarInsnNode(ILOAD, 31),
                InsnNode(ICONST_3),
                JumpInsnNode(IF_ICMPLT, label1),
                VarInsnNode(ALOAD, 16),
                VarInsnNode(ALOAD, 17),
                FieldInsnNode(GETFIELD, "wm", "c", "I"),
                IntInsnNode(SIPUSH, 32767),
                InsnNode(ICONST_3),
                MethodInsnNode(INVOKESTATIC, "FCUtilsInventory", "ConsumeItemsInInventory", "(Llt;III)Z"),
                InsnNode(POP),
                FieldInsnNode(GETSTATIC, "apa", "A", "Lapa;"),
                VarInsnNode(ASTORE, 28),
                JumpInsnNode(GOTO, label),
                label1,
                FrameNode(F_APPEND, 2, [TOP, INTEGER], 0, null),
                InsnNode(ICONST_1),
                VarInsnNode(ISTORE, 12),
                JumpInsnNode(GOTO, label),
                label2,
                FrameNode(F_CHOP, 2, null, 0, null),
                VarInsnNode(ALOAD, 17),
                FieldInsnNode(GETFIELD, "wm", "c", "I"),
              ]
            ));
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        }
      },
    },
    "FCBlockDirtSlab":
    {
      tweakMethods:
      {
        "HasValidAnchorToFacing(Laab;IIII)Z": function(mn)
        {
          mn.access = ACC_PUBLIC;
          log("\t% Made HasValidAnchorToFacing(Laab;IIII)Z public");
        }
      },
    },
    "FCBlockGourd":
    {
      tweakMethods:
      {
        "Explode(Laab;DDD)V": function(mn)
        {
          check(mn, 0x20A72147);
          log("\t* Exploding Jack-O-Lanterns with torches in " + mn.name + mn.desc);
          var label1 = LabelNode();
          var label2 = LabelNode();
          mn.instructions.insertBefore(mn.instructions.get(mn.instructions.size() - 2), toInsnList(
            [
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "FCBlockGourd", "cz", "I"),
              IntInsnNode(BIPUSH, 91),
              JumpInsnNode(IF_ICMPNE, label1),
              VarInsnNode(DLOAD, 2),
              MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
              VarInsnNode(ISTORE, 9),
              VarInsnNode(DLOAD, 4),
              MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
              VarInsnNode(ISTORE, 10),
              VarInsnNode(DLOAD, 6),
              MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
              VarInsnNode(ISTORE, 11),
              VarInsnNode(ALOAD, 1),
              VarInsnNode(ILOAD, 9),
              VarInsnNode(ILOAD, 10),
              VarInsnNode(ILOAD, 11),
              MethodInsnNode(INVOKEVIRTUAL, "aab", "a", "(III)I"),
              JumpInsnNode(IFNE, label2),
              FieldInsnNode(GETSTATIC, "apa", "au", "Lapa;"),
              VarInsnNode(ALOAD, 1),
              VarInsnNode(ILOAD, 9),
              VarInsnNode(ILOAD, 10),
              VarInsnNode(ILOAD, 11),
              MethodInsnNode(INVOKEVIRTUAL, "apa", "c", "(Laab;III)Z"),
              JumpInsnNode(IFEQ, label2),
              VarInsnNode(ALOAD, 1),
              VarInsnNode(ILOAD, 9),
              VarInsnNode(ILOAD, 10),
              VarInsnNode(ILOAD, 11),
              FieldInsnNode(GETSTATIC, "apa", "au", "Lapa;"),
              FieldInsnNode(GETFIELD, "apa", "cz", "I"),
              MethodInsnNode(INVOKEVIRTUAL, "aab", "c", "(IIII)Z"),
              InsnNode(POP),
              JumpInsnNode(GOTO, label1),
              label2,
              FrameNode(F_APPEND, 3, [INTEGER, INTEGER, INTEGER], 0, null),
              VarInsnNode(ALOAD, 1),
              VarInsnNode(ILOAD, 9),
              InsnNode(I2D),
              VarInsnNode(ILOAD, 10),
              InsnNode(I2D),
              VarInsnNode(ILOAD, 11),
              InsnNode(I2D),
              TypeInsnNode(NEW, "wm"),
              InsnNode(DUP),
              FieldInsnNode(GETSTATIC, "apa", "au", "Lapa;"),
              InsnNode(ICONST_1),
              InsnNode(ICONST_0),
              MethodInsnNode(INVOKESPECIAL, "wm", "<init>", "(Lapa;II)V"),
              MethodInsnNode(INVOKESTATIC, "FCUtilsItem", "EjectStackWithRandomVelocity", "(Laab;DDDLwm;)V"),
              label1,
              FrameNode(F_CHOP,3, null, 0, null),
            ]
          ));
        },
      },
    },
    "FCBlockHandCrank":
    {
      tweakMethods:
      {
        "a(Laak;III)V": function(mn)
        {
          check(mn, 0x47E01C6);
          var counter = 0;
          log("\t* Lowering hand crank bounding box in " + mn.name + mn.desc, 1);
          for (var i = mn.instructions.size() - 1; i >= 0; i--)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == FCONST_1))
            {
              if (counter == 1)
              {
                mn.instructions.set(n, LdcInsnNode(Float("0.75")));
                log("");
                return;
              }
              counter++;
            }
          }
          log(" ...failed!");
          recordFailure();
        },
      },
    },
    "FCBlockHopper":
    {
      tweakMethods:
      {
        "OnEntityItemCollidedWithBlock(Laab;IIILrh;)V": function(mn)
        {
          check(mn, 0xE7F6250);
          log("\t* Adding new gravel handling in " + mn.name + mn.desc, 1);
          var label;
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode") && n.getOpcode() == IFLE)
            {
              label = n.label;
            }
            else if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.name.equals("e"))
            {
              var locvar = mn.maxLocals;
              mn.instructions.insert(n, toInsnList(
                [
                  LdcInsnNode(new Float("0.5")),
                  VarInsnNode(ILOAD, 16),
                  InsnNode(I2F),
                  LdcInsnNode(new Float("0.2")),
                  InsnNode(FMUL),
                  VarInsnNode(ALOAD, 1),
                  FieldInsnNode(GETFIELD, "aab", "s", "Ljava/util/Random;"),
                  MethodInsnNode(INVOKEVIRTUAL, "java/util/Random", "nextFloat", "()F"),
                  InsnNode(FMUL),
                  InsnNode(FADD),
                  InsnNode(F2I),
                  VarInsnNode(ISTORE, locvar),
                  VarInsnNode(ALOAD, 0),
                  VarInsnNode(ALOAD, 1),
                  VarInsnNode(ALOAD, 5),
                  FieldInsnNode(GETSTATIC, "GPEBTWTweak", "gpeItemLooseRock", "Lwk;"),
                  FieldInsnNode(GETFIELD, "wk", "cp", "I"),
                  VarInsnNode(ILOAD, 16),
                  VarInsnNode(ILOAD, locvar),
                  InsnNode(ISUB),
                  MethodInsnNode(INVOKESPECIAL, "FCBlockHopper", "handleNewGravelTop", "(Laab;Lrh;II)V"),
                  VarInsnNode(ALOAD, 0),
                  VarInsnNode(ALOAD, 1),
                  VarInsnNode(ALOAD, 5),
                  FieldInsnNode(GETSTATIC, "wk", "aq", "Lwk;"),
                  FieldInsnNode(GETFIELD, "wk", "cp", "I"),
                  VarInsnNode(ILOAD, locvar),
                  MethodInsnNode(INVOKESPECIAL, "FCBlockHopper", "handleNewGravelTop", "(Laab;Lrh;II)V"),
                  JumpInsnNode(GOTO, label),
                ]
              ));
              log("");
              return;
            }
          }
          log(" ...failed!");
          recordFailure();
        },
      },
      add: function(cn)
      {
        var label = LabelNode();
        var mn = MethodNode(ACC_PRIVATE, "handleNewGravelTop", "(Laab;Lrh;II)V", null, null);
        mn.instructions.add(toInsnList(
          [
            VarInsnNode(ILOAD, 4),
            JumpInsnNode(IFGT, label),
            InsnNode(RETURN),
            label,
            FrameNode(F_SAME, 0, null, 0, null),
            TypeInsnNode(NEW, "rh"),
            InsnNode(DUP),
            VarInsnNode(ALOAD, 1),
            VarInsnNode(ALOAD, 2),
            FieldInsnNode(GETFIELD, "rh", "u", "D"),
            VarInsnNode(ALOAD, 2),
            FieldInsnNode(GETFIELD, "rh", "v", "D"),
            VarInsnNode(ALOAD, 2),
            FieldInsnNode(GETFIELD, "rh", "w", "D"),
            TypeInsnNode(NEW, "wm"),
            InsnNode(DUP),
            VarInsnNode(ILOAD, 3),
            VarInsnNode(ILOAD, 4),
            InsnNode(ICONST_0),
            MethodInsnNode(INVOKESPECIAL, "wm", "<init>", "(III)V"),
            MethodInsnNode(INVOKESPECIAL, "rh", "<init>", "(Laab;DDDLwm;)V"),
            VarInsnNode(ASTORE, 5),
            VarInsnNode(ALOAD, 5),
            IntInsnNode(BIPUSH, 10),
            FieldInsnNode(PUTFIELD, "rh", "b", "I"),
            VarInsnNode(ALOAD, 1),
            VarInsnNode(ALOAD, 5),
            MethodInsnNode(INVOKEVIRTUAL, "aab", "d", "(Lmp;)Z"),
            InsnNode(POP),
            InsnNode(RETURN),
          ]
        ));
        cn.methods.add(mn);
        log("Class " + cn.name + ": \t+ Adding handleNewGravelTop(Laab;Lrh;II)V");
      },
    },
    "FCBlockPumpkin":
    {
      tweakClientMethods:
      {
        "a(Lly;)V": function(mn)
        {
          check(mn, 0x28FF05C8);
          log("\t* Adding jack icon back in " + mn.name + mn.desc, 1);
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.name.equals("m_IconFront"))
            {
              var label = LabelNode();
              mn.instructions.insert(mn.instructions.get(i - 2), toInsnList(
                [
                  VarInsnNode(ALOAD, 0),
                  FieldInsnNode(GETFIELD, "FCBlockPumpkin", "isLantern", "Z"),
                  JumpInsnNode(IFEQ, label),
                  InsnNode(POP),
                  LdcInsnNode("pumpkin_jack"),
                  label,
                ]
              ));
              log("");
              return;
            }
          }
          log(" ...failed!");
          recordFailure();
        }
      },
      tweakMethods:
      {
        "<init>(IZ)V": function(mn)
        {
          check(mn, 0x2C60197);
          CodeInserter(
            MethodInsnFinder("FCBlockGourd"),
            [
              VarInsnNode(ALOAD, 0),
              VarInsnNode(ILOAD, 2),
              FieldInsnNode(PUTFIELD, "FCBlockPumpkin", "isLantern", "Z"),
            ],
            "\t* Inserting isLantern handling back into "
          ).process(mn);
        }
      },
      add: function(cn)
      {
        cn.fields.add(FieldNode(ACC_PRIVATE, "isLantern", "Z", null, null));
        log("Class " + cn.name + ": \t+ Added isLantern back");

      },
    },
    "FCBlockSaw":
    {
      tweakMethods:
      {
        "HandleSawingExceptionCases(Laab;IIIIIIILjava/util/Random;)Z": function(mn)
        {
          check(mn, 0xB82C6297);
          log("\t* Inserting onBlockSawed() hook into " + mn.name + mn.desc, 1);
          var changes = 0;
          var i;
          var l_6;
          var l_my23 = LabelNode();
          var l26 = LabelNode();
          var l27 = LabelNode();
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.name.equals("ao"))
            {
              for (i += 1; i < mn.instructions.size(); i++)
              {
                n = mn.instructions.get(i);
                if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode"))
                {
                  l_6 = n.label;
                  n.label = l_my23;
                  changes++;
                  if (changes == 2) break;
                }
              }
              break;
            }
          }
          i = mn.instructions.indexOf(l_6);
          mn.instructions.insertBefore(l_6, JumpInsnNode(GOTO, l_6));
          mn.instructions.set(l_6, l_my23);
          var frame = mn.instructions.get(i + 3); // fakeinst
          if (isInstance(frame, "org.objectweb.asm.tree.FrameNode"))
          {
            mn.instructions.insert(frame, toInsnList(
              [
                VarInsnNode(ILOAD, 10),
                FieldInsnNode(GETSTATIC, "apa", "aO", "Lapa;"),
                FieldInsnNode(GETFIELD, "apa", "cz", "I"),
                JumpInsnNode(IF_ICMPEQ, l26),
                VarInsnNode(ILOAD, 10),
                FieldInsnNode(GETSTATIC, "apa", "aQ", "Lapa;"),
                FieldInsnNode(GETFIELD, "apa", "cz", "I"),
                JumpInsnNode(IF_ICMPNE, l27),
                l26,
                FrameNode(F_SAME, 0, null, 0, null),
                InsnNode(ICONST_1),
                InsnNode(IRETURN),
                l27,
                FrameNode(F_SAME, 0, null, 0, null),
                VarInsnNode(ALOAD, 1),
                VarInsnNode(ILOAD, 2),
                VarInsnNode(ILOAD, 3),
                VarInsnNode(ILOAD, 4),
                MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "onBlockSawed", "(Laab;III)Z"),
                VarInsnNode(ISTORE, 12),
                l_6,
                FrameNode(F_SAME, 0, null, 0, null),
              ]
            ));
            changes++;
          }
          if (changes == 3)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        }
      },
    },
    /* // Let's leave FlowerChild's bugs to FlowerChild.
    "FCBlockTurntable":
    {
      tweakMethods:
      {
      },
    },
    "FCBlockWoodMouldingAndDecorative":
    {
      tweakMethods:
      {
      },
    },
    "FCBlockWoodSidingAndCornerAndDecorative":
    {
      tweakMethods:
      {
      },
    },
    */
    "FCClientGuiCookingVessel":
    {
      tweakClientMethods:
      {
        "a(FII)V": function(mn)
        {
          check(mn, 0xA47A1391);
          log("\t* Adding GUI stoked indication and reducing slots to 9 in " + mn.name + mn.desc, 1);
          var changes = 0;
          var i;
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && (n.cst.toString() == "/btwmodtex/fccauldron.png"))
            {
              n.cst = String("/btwmodtex/fccauldron_small.png");
              changes++;
              break;
            }
          }
          for (i += 1; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && (n.name == "m_AssociatedTileEntity"))
            {
              var label1 = LabelNode();
              var label2 = LabelNode();
              var label3 = LabelNode();
              var label4 = LabelNode();
              //mn.localVariables.clear();
              //truncateInsnAfter(mn, n);
              mn.instructions.insert(n, toInsnList(
                [
                  FieldInsnNode(GETFIELD, "FCTileEntityCookingVessel", "m_iFireUnderType", "I"),
                  InsnNode(ICONST_2),
                  JumpInsnNode(IF_ICMPNE, label1),
                  InsnNode(ICONST_1),
                  JumpInsnNode(GOTO, label2),
                  label1,
                  FrameNode(F_APPEND, 2, [INTEGER, INTEGER], 0, null),
                  InsnNode(ICONST_0),
                  label2,
                  FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
                  VarInsnNode(ISTORE, 6),
                  VarInsnNode(ILOAD, 6),
                  InsnNode(ICONST_1),
                  JumpInsnNode(IF_ICMPNE, label3),
                  VarInsnNode(ALOAD, 0),
                  VarInsnNode(ILOAD, 4),
                  IntInsnNode(BIPUSH, 61),
                  InsnNode(IADD),
                  VarInsnNode(ILOAD, 5),
                  IntInsnNode(BIPUSH, 82),
                  InsnNode(IADD),
                  IntInsnNode(SIPUSH, 176),
                  IntInsnNode(BIPUSH, 14),
                  IntInsnNode(BIPUSH, 54),
                  IntInsnNode(BIPUSH, 14),
                  MethodInsnNode(INVOKEVIRTUAL, "FCClientGuiCookingVessel", "b", "(IIIIII)V"),
                  label3,
                  FrameNode(F_APPEND, 1, [INTEGER], 0, null),
                  VarInsnNode(ALOAD, 0),
                  FieldInsnNode(GETFIELD, "FCClientGuiCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
                  MethodInsnNode(INVOKEVIRTUAL, "FCTileEntityCookingVessel", "IsCooking", "()Z"),
                  JumpInsnNode(IFEQ, label4),
                  VarInsnNode(ALOAD, 0),
                  FieldInsnNode(GETFIELD, "FCClientGuiCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
                  IntInsnNode(BIPUSH, 12),
                  MethodInsnNode(INVOKEVIRTUAL, "FCTileEntityCookingVessel", "getCookProgressScaled", "(I)I"),
                  VarInsnNode(ISTORE, 7),
                  VarInsnNode(ALOAD, 0),
                  VarInsnNode(ILOAD, 4),
                  IntInsnNode(BIPUSH, 61),
                  InsnNode(IADD),
                  VarInsnNode(ILOAD, 5),
                  IntInsnNode(BIPUSH, 82),
                  InsnNode(IADD),
                  IntInsnNode(BIPUSH, 12),
                  InsnNode(IADD),
                  VarInsnNode(ILOAD, 7),
                  InsnNode(ISUB),
                  IntInsnNode(SIPUSH, 176),
                  VarInsnNode(ILOAD, 6),
                  IntInsnNode(BIPUSH, 28),
                  InsnNode(IMUL),
                  IntInsnNode(BIPUSH, 12),
                  InsnNode(IADD),
                  VarInsnNode(ILOAD, 7),
                  InsnNode(ISUB),
                  IntInsnNode(BIPUSH, 54),
                  VarInsnNode(ILOAD, 7),
                  InsnNode(ICONST_2),
                  InsnNode(IADD),
                  MethodInsnNode(INVOKEVIRTUAL, "FCClientGuiCookingVessel", "b", "(IIIIII)V"),
                  label4,
                  FrameNode(F_SAME, 0, null, 0, null),
                  InsnNode(RETURN),
                ]
              ));
              changes++;
              break;
            }
          }
          if (changes == 2)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        },
      },
    },
    "FCContainerCookingVessel":
    {
      tweakMethods:
      {
        "<init>(Llt;LFCTileEntityCookingVessel;)V": function(mn)
        {
          check(mn, 0xE7B32136);
          log("\t* (1/4) Adding stoked info handling and (1/2) reducing slots to 9 in " + mn.name + mn.desc, 1);
          var changes = 0;
          var i;
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode"))
            {
              mn.instructions.insert(n, toInsnList(
                [
                  VarInsnNode(ALOAD, 0),
                  InsnNode(ICONST_0),
                  FieldInsnNode(PUTFIELD, "FCContainerCookingVessel", "m_iLastFireUnderType", "I"),
                ]
              ));
              changes++;
              break;
            }
          }
          for (i += 1; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 9))
            {
              n.operand = 3;
              changes++;
              if (changes == 4) break;
            }
          }
          for (i += 1; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 8))
            {
              n.operand = 62;
              changes++;
              break;
            }
          }
          for (i += 1; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 43))
            {
              n.operand = 17;
              changes++;
              break;
            }
          }
          if (changes == 6)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        },
        "b(Lsq;I)Lwm;": function(mn)
        {
          check(mn, 0xE83F127D);
          log("\t* (2/2) Reducing slots to 9 in " + mn.name + mn.desc, 1);
          var changes = 0;
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 27))
            {
              n.operand = 9;
              changes++;
              if (changes == 3) break;
            }
          }
          if (changes == 3)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        },
        "a(Ltp;)V": function(mn)
        {
          check(mn, 0x119C040A);
          CodeInserter(
            MethodInsnFinder("tp"),
            [
              VarInsnNode(ALOAD, 1),
              VarInsnNode(ALOAD, 0),
              InsnNode(ICONST_1),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "FCContainerCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
              FieldInsnNode(GETFIELD, "FCTileEntityCookingVessel", "m_iFireUnderType", "I"),
              MethodInsnNode(INVOKEINTERFACE, "tp", "a", "(Ltj;II)V"),
            ],
            "\t* (2/4) Adding stoked info handling in "
          ).process(mn);
        },
        "b()V": function(mn)
        {
          check(mn, 0x3F10F73);
          log("\t* (3/4) Adding stoked info handling in " + mn.name + mn.desc, 1);
          var changes = 0;
          var i;
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.name.equals("a"))
            {
              for (i += 1; i < mn.instructions.size(); i++)
              {
                n = mn.instructions.get(i);
                if (isInstance(n, "org.objectweb.asm.tree.FrameNode") && (n.type == F_SAME))
                {
                  var label = LabelNode();
                  mn.instructions.insert(n, toInsnList(
                    [
                      FrameNode(F_APPEND, 1, ["tp"], 0, null),
                      VarInsnNode(ALOAD, 0),
                      FieldInsnNode(GETFIELD, "FCContainerCookingVessel", "m_iLastFireUnderType", "I"),
                      VarInsnNode(ALOAD, 0),
                      FieldInsnNode(GETFIELD, "FCContainerCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
                      FieldInsnNode(GETFIELD, "FCTileEntityCookingVessel", "m_iFireUnderType", "I"),
                      JumpInsnNode(IF_ICMPEQ, label),
                      VarInsnNode(ALOAD, 2),
                      VarInsnNode(ALOAD, 0),
                      InsnNode(ICONST_1),
                      VarInsnNode(ALOAD, 0),
                      FieldInsnNode(GETFIELD, "FCContainerCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
                      FieldInsnNode(GETFIELD, "FCTileEntityCookingVessel", "m_iFireUnderType", "I"),
                      MethodInsnNode(INVOKEINTERFACE, "tp", "a", "(Ltj;II)V"),
                      label,
                      FrameNode(F_CHOP, 1, null, 0, null),
                    ]
                  ));
                  mn.instructions.remove(n);
                  changes++;
                  break;
                }
              }
              break;
            }
          }
          for (i += 1; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == RETURN))
            {
              mn.instructions.insertBefore(n, toInsnList(
                [
                  VarInsnNode(ALOAD, 0),
                  VarInsnNode(ALOAD, 0),
                  FieldInsnNode(GETFIELD, "FCContainerCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
                  FieldInsnNode(GETFIELD, "FCTileEntityCookingVessel", "m_iFireUnderType", "I"),
                  FieldInsnNode(PUTFIELD, "FCContainerCookingVessel", "m_iLastFireUnderType", "I"),
                ]
              ));
              changes++;
              break;
            }
          }
          if (changes == 2)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        },
        "b(II)V": function(mn)
        {
          check(mn, 0x9DD02F8);
          var label = LabelNode();
          CodeInserter(
            BeginningFinder(),
            [
              VarInsnNode(ILOAD, 1),
              InsnNode(ICONST_1),
              JumpInsnNode(IF_ICMPNE, label),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "FCContainerCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
              VarInsnNode(ILOAD, 2),
              FieldInsnNode(PUTFIELD, "FCTileEntityCookingVessel", "m_iFireUnderType", "I"),
              label,
              FrameNode(F_SAME, 0, null, 0, null),
            ],
            "\t* (4/4) Adding stoked info handling in ",
            INSERT_BEFORE
          ).process(mn);
        },
      },
      add: function(cn)
      {
        cn.fields.add(FieldNode(ACC_PRIVATE, "m_iLastFireUnderType", "I", null, null));
        log("Class " + cn.name + ": \t+ Added private integer m_iLastFireUnderType");
      },
    },
    /* // Let's leave FlowerChild's bugs to FlowerChild.
    "FCContainerInfernalEnchanter":
    {
      tweakMethods:
      {
      },
    },
    "FCItemArcaneScroll":
    {
      tweakMethods:
      {
        "a(Lwm;Lsq;Ljava/util/List;Z)V": function(mn)
        {
          check(mn);

        },
      },
    },
    */
    "FCItemBlockDirtSlab":
    {
      tweakMethods:
      {
        "d(Lwm;)Ljava/lang/String;": function(mn)
        {
          check(mn, 0x55A80942);
          log("\t* (1/3) Adding dirt slab item types in " + mn.name + mn.desc, 1);
          var changes = 0;
          var i;
          var label_gravel = LabelNode();
          var label_sand = LabelNode();

          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.LookupSwitchInsnNode"))
            {
              n.keys.add(Integer(6));
              n.keys.add(Integer(7));
              n.labels.add(label_gravel);
              n.labels.add(label_sand);
              changes++;
              break;
            }
          }
          for (i += 1; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == ARETURN))
            {
              mn.instructions.insert(n, toInsnList(
                [
                  label_gravel,
                  FrameNode(F_SAME, 0, null, 0, null),
                  TypeInsnNode(NEW, "java/lang/StringBuilder"),
                  InsnNode(DUP),
                  MethodInsnNode(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V"),
                  VarInsnNode(ALOAD, 0),
                  MethodInsnNode(INVOKESPECIAL, "FCItemBlockSlab", "a", "()Ljava/lang/String;"),
                  MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
                  LdcInsnNode(".gravel"),
                  MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
                  MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;"),
                  InsnNode(ARETURN),
                  label_sand,
                  FrameNode(F_SAME, 0, null, 0, null),
                  TypeInsnNode(NEW, "java/lang/StringBuilder"),
                  InsnNode(DUP),
                  MethodInsnNode(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V"),
                  VarInsnNode(ALOAD, 0),
                  MethodInsnNode(INVOKESPECIAL, "FCItemBlockSlab", "a", "()Ljava/lang/String;"),
                  MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
                  LdcInsnNode(".sand"),
                  MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
                  MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;"),
                  InsnNode(ARETURN),
                ]
              ));
              changes++;
              break;
            }
          }
          if (changes == 2)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        },
        "canCombineWithBlock(Laab;IIII)Z": function(mn)
        {
          check(mn, 0xAE2D0A64);
          log("\t* (2/3) Adding dirt slab item types in " + mn.name + mn.desc, 1);
          var changes = 0;
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == ICONST_3))
            {
              n = n.getNext();
              var label = n.label;
              var new_opcode;
              if (n.getOpcode() == IF_ICMPEQ) new_opcode = IF_ICMPGE;
              if (n.getOpcode() == IF_ICMPNE) new_opcode = IF_ICMPLT;
              mn.instructions.set(n, JumpInsnNode(new_opcode, label));
              changes++;
              if (changes == 2) break;
            }
          }
          if (changes == 2)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        },
        "convertToFullBlock(Laab;III)Z": function(mn)
        {
          check(mn, 0x49FA1335);
          log("\t* (3/3) Adding dirt slab item types in " + mn.name + mn.desc, 1);
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode") && (n.getOpcode() == GOTO))
            {
              var label = n.label;
              var label3 = LabelNode();
              var label4 = LabelNode();
              mn.instructions.insert(mn.instructions.get(i + 3) /* fakeinst */, toInsnList(
                [
                  VarInsnNode(ILOAD, 8),
                  IntInsnNode(BIPUSH, 6),
                  JumpInsnNode(IF_ICMPNE, label3),
                  FieldInsnNode(GETSTATIC, "apa", "J", "Lapa;"),
                  FieldInsnNode(GETFIELD, "apa", "cz", "I"),
                  VarInsnNode(ISTORE, 9),
                  JumpInsnNode(GOTO, label),
                  label3,
                  FrameNode(F_SAME, 0, null, 0, null),
                  VarInsnNode(ILOAD, 8),
                  IntInsnNode(BIPUSH, 7),
                  JumpInsnNode(IF_ICMPNE, label4),
                  FieldInsnNode(GETSTATIC, "apa", "I", "Lapa;"),
                  FieldInsnNode(GETFIELD, "apa", "cz", "I"),
                  VarInsnNode(ISTORE, 9),
                  JumpInsnNode(GOTO, label),
                  label4,
                  FrameNode(F_SAME, 0, null, 0, null),
                ]
              ));
              log("");
              return;
            }
          }
          log(" ...failed!");
          recordFailure();
        },
      },
    },
    "FCTileEntityCauldron":
    {
      tweakMethods:
      {
        "GetUncookedItemInventoryIndex()I": function(mn)
        {
          check(mn, 0xB3C40CCC);
          log("\t* (1/3) Changing 27 slots to 9 in " + mn.name + mn.desc);
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 27))
            {
              n.operand = 9;
              break;
            }
          }
        },
        "ContainsNonFoulFood()Z": function(mn)
        {
          check(mn, 0x57AF11C4);
          log("\t* (2/3) Changing 27 slots to 9 in " + mn.name + mn.desc);
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 27))
            {
              n.operand = 9;
              break;
            }
          }
        },
        "TaintAllNonFoulFoodInInventory()Z": function(mn)
        {
          check(mn, 0x7E9A19E2);
          log("\t* (3/3) Changing 27 slots to 9 in " + mn.name + mn.desc);
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 27))
            {
              n.operand = 9;
              break;
            }
          }
        },
      },
    },
    "FCTileEntityCookingVessel":
    {
      tweakMethods:
      {
        "<init>()V": function(mn)
        {
          check(mn, 0xC37E1086);
          log("\t* (1/2) Changing 27 slots to 9 in " + mn.name + mn.desc);
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 27))
            {
              n.operand = 9;
              break;
            }
          }
        },
        "j_()I": function(mn)
        {
          check(mn, 0xCE00BD);
          log("\t* (2/2) Changing 27 slots to 9 in " + mn.name + mn.desc);
          for (var i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 27))
            {
              n.operand = 9;
              break;
            }
          }
        },
        "a(I)Lwm;": function(mn)
        {
          check(mn, 0x4A501C5);
          var label = LabelNode();
          CodeInserter(
            BeginningFinder(),
            [
              VarInsnNode(ILOAD, 1),
              IntInsnNode(BIPUSH, 9),
              JumpInsnNode(IF_ICMPLT, label),
              InsnNode(ACONST_NULL),
              InsnNode(ARETURN),
              label,
              FrameNode(F_SAME, 0, null, 0, null),
            ],
            "\t* (1/2) Including anti-crash safety measure in ",
            INSERT_BEFORE
          ).process(mn);
        },
        "a(ILwm;)V": function(mn)
        {
          check(mn, 0x414B078B);
          var label = LabelNode();
          CodeInserter(
            BeginningFinder(),
            [
              VarInsnNode(ILOAD, 1),
              IntInsnNode(BIPUSH, 9),
              JumpInsnNode(IF_ICMPLT, label),
              InsnNode(RETURN),
              label,
              FrameNode(F_SAME, 0, null, 0, null),
            ],
            "\t* (2/2) Including anti-crash safety measure in ",
            INSERT_BEFORE
          ).process(mn);
        },
      },
    },
    "FCTileEntityTurntable":
    {
      tweakMethods:
      {
        "RotateFurnace(IIIZ)V": function(mn)
        {
          check(mn, 0x8ADA0887);
          log("\t* Supporting new furnace state in " + mn.name + mn.desc, 1);
          var changes = 0;
          var i;
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && (n.name == "RotateFacingAroundJ"))
            {
              mn.instructions.insertBefore(mn.instructions.get(i - 1), toInsnList(
                [
                  IntInsnNode(BIPUSH, 7),
                  InsnNode(IAND),
                ]
              ));
              changes++;
              break;
            }
          }
          for (i += 1; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && (n.owner == "aab"))
            {
              mn.instructions.insertBefore(n, toInsnList(
                [
                  VarInsnNode(ILOAD, 5),
                  IntInsnNode(BIPUSH, 8),
                  InsnNode(IAND),
                  InsnNode(IOR),
                ]
              ));
              changes++;
              break;
            }
          }
          if (changes == 2)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        },
      },
    },
    "gu": // ServerConfigurationManager
    {
      tweakMethods:
      {
        "AssignNewHardcoreSpawnLocation(Laab;Ljc;)Z": function(mn)
        {
          check(mn, [0x21D136B5, 0x8CE23774, 0xE88A3F80]);
          CodeInserter(
            InsnFinder(DMUL),
            [
              InsnNode(POP2),
              FieldInsnNode(GETSTATIC, "GPEBTWTweak", "hcSpawnRadius", "I"),
              InsnNode(I2D),
            ],
            "\t* Making Hardcore Spawn radius configurable in ",
            INSERT_BEFORE
          ).process(mn);
        }
      },
    },
    "qi": // EntityChicken
    {
      tweakMethods:
      {
        "a(ZI)V": function(mn)
        {
          check(mn, [0x446910BC, 0xE82F1527]);
          CodeInserter(
            BeginningFinder(),
            [
              InsnNode(ICONST_1),
            ],
            "\t* Adding a chicken feather in ",
            INSERT_BEFORE
          ).process(mn);
          CodeInserter(
            MethodInsnFinder("java/util/Random"),
            [
              InsnNode(IADD),
            ],
            "\t* Preparing the chicken in "
          ).process(mn);
        },
      },
    },
    "rh": // EntityItem
    {
      tweakMethods:
      {
        "l_()V": function(mn)
        {
          check(mn, 0x73675C9C);
          log("\t* Boosting item stay delay in " + mn.name + mn.desc, 1);
          for (var i = mn.instructions.size() - 1; i >= 0; i--)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && n.operand == 6000)
            {
              mn.instructions.set(n, LdcInsnNode(Integer(36000)));
              log("");
              return;
            }
          }
          log(" ...failed!");
          recordFailure();
        },
      },
    },
    "rs": // EntityBlaze
    {
      tweakMethods:
      {
      },
      add: function(cn)
      {
        var mn = MethodNode(ACC_PROTECTED, "dropHead", "()V", null, null);
        mn.instructions.add(toInsnList(dropHeadCode("rs", 8)));
        cn.methods.add(mn);
        log("Class " + cn.name + ": \t+ Telling Blaze to drop head in dropHead()V");
      },
    },
    "ru": // EntityCreeper
    {
      tweakMethods:
      {
        "a_(Lsq;)Z": function(mn)
        {
          check(mn, [0xC74B29CB, 0xC58F29C5, 0xC7B729D7]);
          CodeInserter(
            MethodInsnFinder("ru", +1),
            [
              VarInsnNode(ALOAD, 0),
              VarInsnNode(ALOAD, 1),
              MethodInsnNode(INVOKESTATIC, "mg", "a", "(Lsq;)Lmg;"),
              InsnNode(ICONST_2),
              MethodInsnNode(INVOKEVIRTUAL, "ru", "a", "(Lmg;I)Z"),
              InsnNode(POP),
            ],
            "\t* Hurting Creeper when sheared in "
          ).process(mn);
        },
      },
    },
    "rv": // EntityEnderman
    {
      tweakMethods:
      {
      },
      add: function(cn)
      {
        var mn = MethodNode(ACC_PROTECTED, "dropHead", "()V", null, null);
        mn.instructions.add(toInsnList(dropHeadCode("rv", 6)));
        cn.methods.add(mn);
        log("Class " + cn.name + ": \t+ Telling Enderman to drop head in dropHead()V");
      },
    },
    "sc": // EntityPigZombie
    {
      tweakMethods:
      {
        "dropHead()V": function(mn)
        {
          // Function with only return statement. Hopefully double return is okay.
          check(mn, 0xB200B2);
          CodeInserter(
            BeginningFinder(),
            dropHeadCode("sc", 7),
            "\t* Telling PigZombie to drop head in ",
            INSERT_BEFORE
          ).process(mn);
        }
      },
    },
    "sh": // EntitySpider
    {
      tweakMethods:
      {
      },
      add: function(cn)
      {
        var mn = MethodNode(ACC_PROTECTED, "dropHead", "()V", null, null);
        mn.instructions.add(toInsnList(dropHeadCode("sh", 5)));
        cn.methods.add(mn);
        log("Class " + cn.name + ": \t+ Telling Spider to drop head in dropHead()V");
      },
    },
    "sq": // EntityPlayer
    {
      tweakMethods:
      {
        "g_()Z": function(mn)
        {
          check(mn, 0x9CFF11BB);
          var label = LabelNode();
          CodeInserter(
            BeginningFinder(),
            [
              VarInsnNode(ALOAD, 0),
              InsnNode(ICONST_4),
              MethodInsnNode(INVOKEVIRTUAL, "sq", "f", "(I)Z"),
              JumpInsnNode(IFEQ, label),
              InsnNode(ICONST_0),
              InsnNode(IRETURN),
              label,
              FrameNode(F_SAME, 0, null, 0, null),
            ],
            "\t* Dropping an eating player from the ladder in ",
            INSERT_BEFORE
          ).process(mn);
        },
        "GetLandMovementModifier()F": function(mn)
        {
          check(mn, 0x268017E);
          var label = LabelNode();
          CodeInserter(
            MethodInsnFinder("sq"),
            [
              VarInsnNode(FSTORE, 1),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "sq", "bK", "Lso;"),
              FieldInsnNode(GETFIELD, "so", "b", "[Lwm;"),
              InsnNode(ICONST_0),
              InsnNode(AALOAD),
              JumpInsnNode(IFNULL, label),
              VarInsnNode(FLOAD, 1),
              LdcInsnNode(Float("1.1")),
              InsnNode(FMUL),
              VarInsnNode(FSTORE, 1),
              label,
              FrameNode(F_APPEND, 1, [FLOAT], 0, null),
              VarInsnNode(FLOAD, 1),
              InsnNode(FCONST_1),
              VarInsnNode(ALOAD, 0),
              MethodInsnNode(INVOKEVIRTUAL, "sq", "GetWornArmorWeight", "()I"),
              InsnNode(I2F),
              LdcInsnNode(Float("220.0")),
              InsnNode(FDIV),
              InsnNode(FSUB),
              InsnNode(FMUL),
            ],
            "\t* Making a player slower with armor and faster with boots in "
          ).process(mn);
        },
        "a(III)Lsr;": function(mn)
        {
          check(mn, 0x2160163);
          var l0 = LabelNode(),
              l1 = LabelNode(),
              l2 = LabelNode(),
              l3 = LabelNode(),
              l4 = LabelNode(),
              l5 = LabelNode(),
              l6 = LabelNode(),
              l7 = LabelNode(),
              l8 = LabelNode(),
              l9 = LabelNode(),
              l10 = LabelNode();
          CodeInserter(
            BeginningFinder(),
            [
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "sq", "q", "Laab;"),
              FieldInsnNode(GETFIELD, "aab", "I", "Z"),
              JumpInsnNode(IFNE, l0),
              VarInsnNode(ALOAD, 0),
              MethodInsnNode(INVOKEVIRTUAL, "sq", "bz", "()Z"),
              JumpInsnNode(IFNE, l1),
              VarInsnNode(ALOAD, 0),
              MethodInsnNode(INVOKEVIRTUAL, "sq", "R", "()Z"),
              JumpInsnNode(IFNE, l2),
              l1,
              FrameNode(F_SAME, 0, null, 0, null),
              FieldInsnNode(GETSTATIC, "sr", "e", "Lsr;"),
              InsnNode(ARETURN),
              l2,
              FrameNode(F_SAME, 0, null, 0, null),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "sq", "u", "D"),
              VarInsnNode(ILOAD, 1),
              InsnNode(I2D),
              InsnNode(DSUB),
              MethodInsnNode(INVOKESTATIC, "java/lang/Math", "abs", "(D)D"),
              LdcInsnNode(Double("3.0")),
              InsnNode(DCMPL),
              JumpInsnNode(IFGT, l3),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "sq", "v", "D"),
              VarInsnNode(ILOAD, 2),
              InsnNode(I2D),
              InsnNode(DSUB),
              MethodInsnNode(INVOKESTATIC, "java/lang/Math", "abs", "(D)D"),
              LdcInsnNode(Double("2.0")),
              InsnNode(DCMPL),
              JumpInsnNode(IFGT, l3),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "sq", "w", "D"),
              VarInsnNode(ILOAD, 3),
              InsnNode(I2D),
              InsnNode(DSUB),
              MethodInsnNode(INVOKESTATIC, "java/lang/Math", "abs", "(D)D"),
              LdcInsnNode(Double("3.0")),
              InsnNode(DCMPL),
              JumpInsnNode(IFLE, l0),
              l3,
              FrameNode(F_SAME, 0, null, 0, null),
              FieldInsnNode(GETSTATIC, "sr", "d", "Lsr;"),
              InsnNode(ARETURN),
              l0,
              FrameNode(F_SAME, 0, null, 0, null),
              VarInsnNode(ALOAD, 0),
              LdcInsnNode(Float("0.2")),
              LdcInsnNode(Float("0.2")),
              MethodInsnNode(INVOKEVIRTUAL, "sq", "a", "(FF)V"),
              VarInsnNode(ALOAD, 0),
              LdcInsnNode(Float("0.2")),
              FieldInsnNode(PUTFIELD, "sq", "N", "F"),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "sq", "q", "Laab;"),
              VarInsnNode(ILOAD, 1),
              VarInsnNode(ILOAD, 2),
              VarInsnNode(ILOAD, 3),
              MethodInsnNode(INVOKEVIRTUAL, "aab", "f", "(III)Z"),
              JumpInsnNode(IFEQ, l4),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "sq", "q", "Laab;"),
              VarInsnNode(ILOAD, 1),
              VarInsnNode(ILOAD, 2),
              VarInsnNode(ILOAD, 3),
              MethodInsnNode(INVOKEVIRTUAL, "aab", "h", "(III)I"),
              VarInsnNode(ISTORE, 4),
              VarInsnNode(ILOAD, 4),
              MethodInsnNode(INVOKESTATIC, "ale", "j", "(I)I"),
              VarInsnNode(ISTORE, 5),
              LdcInsnNode(Float("0.5")),
              VarInsnNode(FSTORE, 6),
              LdcInsnNode(Float("0.5")),
              VarInsnNode(FSTORE, 7),
              VarInsnNode(ILOAD, 5),
              TableSwitchInsnNode(0, 3, l9, [l5, l6, l7, l8]),
              l5,
              FrameNode(F_FULL, 8, ["sq", INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, FLOAT, FLOAT], 0, []),
              LdcInsnNode(Float("0.9")),
              VarInsnNode(FSTORE, 7),
              JumpInsnNode(GOTO, l9),
              l6,
              FrameNode(F_SAME, 0, null, 0, null),
              LdcInsnNode(Float("0.1")),
              VarInsnNode(FSTORE, 6),
              JumpInsnNode(GOTO, l9),
              l7,
              FrameNode(F_SAME, 0, null, 0, null),
              LdcInsnNode(Float("0.1")),
              VarInsnNode(FSTORE, 7),
              JumpInsnNode(GOTO, l9),
              l8,
              FrameNode(F_SAME, 0, null, 0, null),
              LdcInsnNode(Float("0.9")),
              VarInsnNode(FSTORE, 6),
              l9,
              FrameNode(F_SAME, 0, null, 0, null),
              VarInsnNode(ALOAD, 0),
              VarInsnNode(ILOAD, 5),
              MethodInsnNode(INVOKESPECIAL, "sq", "x", "(I)V"),
              VarInsnNode(ALOAD, 0),
              VarInsnNode(ILOAD, 1),
              InsnNode(I2F),
              VarInsnNode(FLOAD, 6),
              InsnNode(FADD),
              InsnNode(F2D),
              VarInsnNode(ILOAD, 2),
              InsnNode(I2F),
              LdcInsnNode(Float("0.9375")),
              InsnNode(FADD),
              InsnNode(F2D),
              VarInsnNode(ILOAD, 3),
              InsnNode(I2F),
              VarInsnNode(FLOAD, 7),
              InsnNode(FADD),
              InsnNode(F2D),
              MethodInsnNode(INVOKEVIRTUAL, "sq", "b", "(DDD)V"),
              JumpInsnNode(GOTO, l10),
              l4,
              FrameNode(F_FULL, 4, ["sq", INTEGER, INTEGER, INTEGER], 0, []),
              VarInsnNode(ALOAD, 0),
              VarInsnNode(ILOAD, 1),
              InsnNode(I2F),
              LdcInsnNode(Float("0.5")),
              InsnNode(FADD),
              InsnNode(F2D),
              VarInsnNode(ILOAD, 2),
              InsnNode(I2F),
              LdcInsnNode(Float("0.9375")),
              InsnNode(FADD),
              InsnNode(F2D),
              VarInsnNode(ILOAD, 3),
              InsnNode(I2F),
              LdcInsnNode(Float("0.5")),
              InsnNode(FADD),
              InsnNode(F2D),
              MethodInsnNode(INVOKEVIRTUAL, "sq", "b", "(DDD)V"),
              l10,
              FrameNode(F_SAME, 0, null, 0, null),
              VarInsnNode(ALOAD, 0),
              InsnNode(ICONST_1),
              FieldInsnNode(PUTFIELD, "sq", "ca", "Z"),
              VarInsnNode(ALOAD, 0),
              InsnNode(ICONST_0),
              FieldInsnNode(PUTFIELD, "sq", "b", "I"),
              VarInsnNode(ALOAD, 0),
              TypeInsnNode(NEW, "t"),
              InsnNode(DUP),
              VarInsnNode(ILOAD, 1),
              VarInsnNode(ILOAD, 2),
              VarInsnNode(ILOAD, 3),
              MethodInsnNode(INVOKESPECIAL, "t", "<init>", "(III)V"),
              FieldInsnNode(PUTFIELD, "sq", "cb", "Lt;"),
              VarInsnNode(ALOAD, 0),
              VarInsnNode(ALOAD, 0),
              VarInsnNode(ALOAD, 0),
              InsnNode(DCONST_0),
              InsnNode(DUP2_X1),
              FieldInsnNode(PUTFIELD, "sq", "y", "D"),
              InsnNode(DUP2_X1),
              FieldInsnNode(PUTFIELD, "sq", "z", "D"),
              FieldInsnNode(PUTFIELD, "sq", "x", "D"),
              FieldInsnNode(GETSTATIC, "sr", "a", "Lsr;"),
              InsnNode(ARETURN),
            ],
            "\t* Returning player's ability to lie in bed in ",
            INSERT_BEFORE
          ).process(mn);
        },
        "ci()Z": function(mn)
        {
          check(mn, 0x1977043F);
          CodeInserter(
            BeginningFinder(),
            [
              InsnNode(ICONST_0),
              InsnNode(IRETURN),
            ],
            "\t* But player shouldn't fall asleep in ",
            INSERT_BEFORE
          ).process(mn);
        },
        "l_()V": function(mn)
        {
          check(mn, 0x99096FE7);
          log("\t* Player will want to nap at day in " + mn.name + mn.desc, 1);
          var i;
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("aab") && n.name.equals("v") && n.desc.equals("()Z"))
            {
              n = mn.instructions.get(i + 1);
              if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode"))
              {
                mn.instructions.insertBefore(n, InsnNode(POP));
                mn.instructions.set(n, JumpInsnNode(GOTO, n.label));
                log("");
                return;
              }
            }
          }
          log(" ...failed!");
          recordFailure();
        },
        "a(ZZZ)V": function(mn)
        {
          check(mn, 0xE2142C81);
          log("\t* Player will not set spawn chunk in " + mn.name + mn.desc, 1);
          var i;
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.VarInsnNode") && n.opcode == ILOAD && n["var"] == 3)
            {
              n = mn.instructions.get(i + 1);
              if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode"))
              {
                mn.instructions.insertBefore(n, InsnNode(POP));
                mn.instructions.set(n, JumpInsnNode(GOTO, n.label));
                log("");
                return;
              }
            }
          }
          log(" ...failed!");
          recordFailure();
        }
      },
    },
    "ti": // FoodStats
    {
      tweakMethods:
      {
        "a(Lsq;)V": function(mn)
        {
          check(mn, 0x8E182F50);
          log("\t* Adding regeneration bonus to sleeping in " + mn.name + mn.desc, 1);
          var changes = 0;
          var i;
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 30))
            {
              var label = LabelNode();
              mn.instructions.insert(n, toInsnList(
                [
                  InsnNode(ICONST_1),
                  VarInsnNode(ISTORE, 3),
                  VarInsnNode(ALOAD, 1),
                  MethodInsnNode(INVOKEVIRTUAL, "sq", "bz", "()Z"),
                  JumpInsnNode(IFEQ, label),
                  InsnNode(ICONST_2),
                  VarInsnNode(ISTORE, 3),
                  label,
                  FrameNode(F_APPEND,1, [INTEGER], 0, null),
                  VarInsnNode(ILOAD, 3),
                  InsnNode(IDIV),
                ]
              ));
              changes++;
              break;
            }
          }
          for (i += 1; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == SIPUSH) && (n.operand == 600))
            {
              mn.instructions.insert(n, toInsnList(
                [
                  VarInsnNode(ILOAD, 3),
                  InsnNode(IDIV),
                ]
              ));
              changes++;
              break;
            }
          }
          if (changes == 2)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        }
      }
    },
    "wu": // ItemPickaxe
    {
      tweakMethods:
      {
        "canHarvestBlock(Laab;Lapa;III)Z": function(mn)
        {
          check(mn, 0xFB743BEB);
          var label = new LabelNode();
          CodeInserter(
            JumpInsnFinder(IF_ACMPNE),
            [
              JumpInsnNode(IF_ACMPEQ, label),
              VarInsnNode(ALOAD, 2),
              FieldInsnNode(GETSTATIC, "GPEBTWTweak", "gpeBlockStone", "Lapa;"),
            ],
            "\t* Making Pickaxe handle overridden stone in ",
            INSERT_BEFORE
          ).process(mn);
          CodeInserter(
            JumpInsnFinder(IF_ACMPNE),
            [
              label,
              FrameNode(F_SAME, 0, null, 0, null),
            ],
            "\t* Making sure Pickaxes got it in "
          ).process(mn);
        },
      },
    },
    "xi": // ItemSkull
    {
      tweakMethods:
      {
        "<clinit>()V": function(mn)
        {
          check(mn, 0xFF830B40);
          log("\t* Adding skull item types in " + mn.name + mn.desc, 1);
          var changes = 0;
          var i;
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == ICONST_5))
            {
              mn.instructions.set(n, IntInsnNode(BIPUSH, 9));
              changes++;
              if (changes == 2) break;
            }
          }
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.name.equals("b"))
            {
              mn.instructions.insertBefore(n, toInsnList(
                [
                  InsnNode(DUP),
                  InsnNode(ICONST_5),
                  LdcInsnNode("spider"),
                  InsnNode(AASTORE),
                  InsnNode(DUP),
                  IntInsnNode(BIPUSH, 6),
                  LdcInsnNode("enderman"),
                  InsnNode(AASTORE),
                  InsnNode(DUP),
                  IntInsnNode(BIPUSH, 7),
                  LdcInsnNode("pigzombie"),
                  InsnNode(AASTORE),
                  InsnNode(DUP),
                  IntInsnNode(BIPUSH, 8),
                  LdcInsnNode("fire"),
                  InsnNode(AASTORE),
                ]
              ));
              changes++;
              break;
            }
          }
          for (i = 0; i < mn.instructions.size(); i++)
          {
            var n = mn.instructions.get(i);
            if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.name.equals("a"))
            {
              mn.instructions.insertBefore(n, toInsnList(
                [
                  InsnNode(DUP),
                  InsnNode(ICONST_5),
                  LdcInsnNode("skull_spider"),
                  InsnNode(AASTORE),
                  InsnNode(DUP),
                  IntInsnNode(BIPUSH, 6),
                  LdcInsnNode("skull_enderman"),
                  InsnNode(AASTORE),
                  InsnNode(DUP),
                  IntInsnNode(BIPUSH, 7),
                  LdcInsnNode("skull_pigzombie"),
                  InsnNode(AASTORE),
                  InsnNode(DUP),
                  IntInsnNode(BIPUSH, 8),
                  LdcInsnNode("skull_fire"),
                  InsnNode(AASTORE),
                ]
              ));
              changes++;
              break;
            }
          }
          if (changes == 4)
          {
            log("");
          } else {
            log(" ...failed!");
            recordFailure();
          }
        },
      },
    },
  };

  // Classes requiring removal of client-only methods on server side
  var classesToAdapt =
  [
    "GPEBlockCobblestone",
    "GPEBlockStone",
    "GPEBlockFurnace",
  ];

  // Check a method for a checksum or array of checksums
  function check(mn, checksum)
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
    if (typeof checksum == "undefined")
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

  function recordFailure()
  {
    failures += 1;
    Packages.BTWTweaker.failures += 1;
  }

  function CodeInserter(finder, code, message, before)
  {
    if (!(this instanceof CodeInserter)) return new CodeInserter(finder, code, message, before);
    this.finder = finder;
    this.code = code;
    this.message = message;
    this.before = before;
    this.process = function(mn)
    {
      if (!message) message = "\t* Inserting code into ";
      log(message + mn.name + mn.desc, 1);
      var boundary = finder.process(mn.instructions);
      if (boundary != null)
      {
        if (this.before)
        {
          mn.instructions.insertBefore(boundary, toInsnList(this.code));
        } else {
          mn.instructions.insert(boundary, toInsnList(this.code));
        }
        log("");
      } else {
        log(" ...failed!");
        recordFailure();
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
    this.offset = offset || 0;
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

  function InsnFinder(opcode, offset)
  {
    if (!(this instanceof InsnFinder)) return new InsnFinder(opcode, offset);
    this.opcode = opcode;
    this.offset = offset || 0;
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
    this.offset = offset || 0;
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

  // unused
  listTweakableClasses = function()
  {
    var s = [];
    for (i in classesToTweak) s.push(i);
    log(s.join("\n"));
  };

  function onClient()
  {
    return !Packages.BTWTweaker.onServer;
  }

  function isBTWVersionOrNewer(ver)
  {
    return Packages.BTWTweaker.btwVersion >= ver;
  }
  
  var ACTION_OVERWRITE = Integer(0);
  var ACTION_TWEAK = Integer(1);
  var ACTION_ADAPTSERVER = Integer(2);
  var ACTION_COPY = Integer(3);

  whatToDoWithClass = function(classname)
  {
    if (classname in classesToTweak) return ACTION_TWEAK;
    if (classesToAdapt.indexOf(classname) != -1) return ACTION_ADAPTSERVER;
    return ACTION_COPY;
  };

  tweakClass = function(cn)
  {
    var a = classesToTweak[cn.name];
    if (!a) return;

    var tmp;
    var count = 0;
    var total = length(a.tweakMethods);
    if (onClient()) total += length(a.tweakClientMethods);
    var toRemove = [];
    var mn;

    for (var i = 0; i < cn.methods.size(); i++)
    {
      mn = cn.methods.get(i);
      //log(mn.name);
      var tweakfunc;
      if (a.tweakMethods && (tweakfunc = a.tweakMethods[mn.name + mn.desc]))
      {
        log("Class " + cn.name + ": ", 1);
        tweakfunc(mn);
        count++;
      }
      if (onClient() && (tmp = a.tweakClientMethods))
      {
        tweakfunc = tmp[mn.name + mn.desc];
        if (tweakfunc)
        {
          log("Class " + cn.name + ": ", 1);
          tweakfunc(mn);
          count++;
        }
      }
      if (a.removeMethods && (a.removeMethods.indexOf(mn.name + mn.desc) != -1))
      {
        toRemove.push(mn);
      }
    }
    for (i = 0; i < toRemove.length; i++)
    {
      mn = toRemove[i];
      log("Class " + cn.name + ": Removing " + mn.name + mn.desc);
      cn.methods.remove(mn);
    }

    if (a.add) a.add(cn);
    if (count < total)
    {
      log("Warning: not all tweaks were made in " + cn.name + " (" + count + " of " + total + ")");
    }
    if (failures > 0)
    {
      log("Warning: failed in " + failures + " patches, take care!");
    }
    else if (count == total)
    {
      log(cn.name + " OK");
    }
    failures = 0;
  };

})();
