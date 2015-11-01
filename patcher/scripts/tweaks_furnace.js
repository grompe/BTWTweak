// className, deobfName, side, method, checksums, description
tweak("amn", "BlockFurnace", CLIENT, "a(II)Llx;", 0x4C380826, "Inserting new furnace icon getting",
function(mn)
{
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
  return CodeInserter(
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
    INSERT_BEFORE
  ).process(mn);
});
tweak("amn", "BlockFurnace", CLIENT, "a(Lly;)V", 0x4B7207E7, "Inserting new furnace icon registering",
function(mn)
{
  var label1 = LabelNode();
  var label2 = LabelNode();
  return CodeInserter(
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
    INSERT_BEFORE
  ).process(mn);
});
tweak("amn", "BlockFurnace", CLIENT, "b(Laab;IIILjava/util/Random;)V", 0xBDEF3089, "Handling stuffed furnace metadata bit",
function(mn)
{
  return CodeInserter(
    MethodInsnFinder("aab"),
    [
      IntInsnNode(BIPUSH, 7),
      InsnNode(IAND),
    ]
  ).process(mn);
});
tweak("amn", "BlockFurnace", BOTH, "a(ZLaab;III)V", 0x9BCA0FEA, "Adding a parameter in furnace state",
function(mn)
{
  var result = CodeInserter(
    MethodInsnFinder("aab"),
    [
      IntInsnNode(BIPUSH, 7),
      InsnNode(IAND),
      VarInsnNode(ILOAD, 5),
      InsnNode(ICONST_3),
      InsnNode(ISHL),
      InsnNode(IOR),
    ]
  ).process(mn);
  //mn.name = "updateFurnaceBlockState";
  mn.desc = "(ZLaab;IIIZ)V";
  return result;
});
add("amn", "BlockFurnace", CLIENT, "Added private Icon furnaceIconFrontStuff",
function(cn)
{
  cn.fields.add(FieldNode(ACC_PRIVATE, "furnaceIconFrontStuff", "Llx;", null, null));
});
tweak("aqg", "TileEntityFurnace", BOTH, "<init>()V", 0x2C370586, "Adding new vars init to furnace TE",
function(mn)
{
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 0),
      InsnNode(ICONST_0),
      FieldInsnNode(PUTFIELD, "aqg", "currentItemID", "I"),
      VarInsnNode(ALOAD, 0),
      InsnNode(ICONST_0),
      FieldInsnNode(PUTFIELD, "aqg", "emptyResultSlot", "Z"),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("aqg", "TileEntityFurnace", BOTH, "h()V", 0x5533D5, "Updating furnace TE's updateEntity()",
function(mn)
{
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
      var labelx = LabelNode();
      var nextlabel = mn.instructions.get(i + 4);
      mn.instructions.insertBefore(n, toInsnList(
        [
          FrameNode(F_APPEND, 1, [INTEGER], 0, null),
          VarInsnNode(ALOAD, 0),
          MethodInsnNode(INVOKESPECIAL, "aqg", "u", "()Z"),
          JumpInsnNode(IFEQ, labelx),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "aqg", "g", "[Lwm;"),
          InsnNode(ICONST_0),
          InsnNode(AALOAD),
          FieldInsnNode(GETFIELD, "wm", "c", "I"),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "aqg", "currentItemID", "I"),
          JumpInsnNode(IF_ICMPNE, labelx),
          VarInsnNode(ALOAD, 0),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "aqg", "c", "I"),
          IntInsnNode(BIPUSH, 1),
          InsnNode(ISUB),
          InsnNode(ICONST_0),
          MethodInsnNode(INVOKESTATIC, "java/lang/Math", "max", "(II)I"),
          FieldInsnNode(PUTFIELD, "aqg", "c", "I"),
          JumpInsnNode(GOTO, nextlabel),
          labelx,
          FrameNode(F_SAME, 0, null, 0, null),
          VarInsnNode(ALOAD, 0),
          MethodInsnNode(INVOKESPECIAL, "aqg", "setCurrentItemID", "()V"),
        ]
      ));
      mn.instructions.remove(n);
      changes++;
      break;
    }
  }
  for (i += 24; i < mn.instructions.size(); i++)
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
  return changes == 5;
});
add("aqg", "TileEntityFurnace", BOTH, "Adjusting furnace logic",
function(cn)
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
});
tweak("FCTileEntityTurntable", "FCTileEntityTurntable", BOTH, "RotateFurnace(IIIZ)V", 0x8ADA0887, "Supporting new furnace state",
function(mn)
{
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
  return changes == 2;
});
