// className, deobfName, side, method, checksums, description
tweak("ale", "BlockBed", BOTH, "a(Laab;IIILsq;IFFF)Z", 0xCBD14ADD, "Stopping bed from exploding in other dimensions",
function(mn)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("acn") && n.name.equals("e"))
    {
      n = n.getNext()
      if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode"))
      {
        mn.instructions.set(n, InsnNode(POP));
        changes++;
        break;
      }
    }
  }
  if (changes != 1) return;
  for (i += 3; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode"))
    {
      n.opcode = GOTO;
      mn.instructions.insertBefore(n, InsnNode(POP2));
      changes++;
      break;
    }
  }
  return (changes == 2);
});
tweak("awz", "GuiSleepMP", CLIENT, "A_()V", 0x80D809F4, "Moving 'leave bed' button from obscuring the view",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 40))
    {
      n.operand = 80;
      return true;
    }
  }
});
add("FCBlockBed", "FCBlockBed", BOTH, "Allowing sleep",
function(cn)
{
  for (var i = 0; i < cn.methods.size(); i++)
  {
    mn = cn.methods.get(i);
    if (mn.name + mn.desc == "a(Laab;IIILsq;IFFF)Z")
    {
      cn.methods.remove(mn);
      return;
    }
  }
});
tweak("jc", "EntityPlayerMP", BOTH, "UpdateExhaustionWithTime()V", 0x617108F1, "Making resting in bed less exhausting",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && n.operand == 600)
    {
      var label = LabelNode();
      mn.instructions.insert(n, toInsnList(
        [
          InsnNode(ICONST_1),
          VarInsnNode(ISTORE, 1),
          VarInsnNode(ALOAD, 0),
          MethodInsnNode(INVOKEVIRTUAL, "jc", "bz", "()Z"),
          JumpInsnNode(IFEQ, label),
          InsnNode(ICONST_2),
          VarInsnNode(ISTORE, 1),
          label,
          FrameNode(F_APPEND,1, [INTEGER], 0, null),
          VarInsnNode(ILOAD, 1),
          InsnNode(IMUL),
        ]
      ));
      return true;
    }
  }
});
tweak("sq", "EntityPlayer", BOTH, "a(III)Lsr;", 0x2160163, "Returning player's ability to lie in bed",
function(mn)
{
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
  return CodeInserter(
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
    INSERT_BEFORE
  ).process(mn);
});
tweak("sq", "EntityPlayer", BOTH, "ci()Z", 0x1977043F, "But player shouldn't completely fall asleep",
function(mn)
{
  return CodeInserter(
    BeginningFinder(),
    [
      InsnNode(ICONST_0),
      InsnNode(IRETURN),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("sq", "EntityPlayer", BOTH, "l_()V", [0xB4066F18, 0x99096FE7], "Player won't mind napping at day",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("aab") && n.name.equals("v") && n.desc.equals("()Z"))
    {
      n = mn.instructions.get(i + 1);
      if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode"))
      {
        mn.instructions.insertBefore(n, InsnNode(POP));
        mn.instructions.set(n, JumpInsnNode(GOTO, n.label));
        return true;
      }
    }
  }
});
tweak("sq", "EntityPlayer", BOTH, "a(ZZZ)V", 0xE2142C81, "Napping won't set spawn chunk",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.VarInsnNode") && n.opcode == ILOAD && n["var"] == 3)
    {
      n = mn.instructions.get(i + 1);
      if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode"))
      {
        mn.instructions.insertBefore(n, InsnNode(POP));
        mn.instructions.set(n, JumpInsnNode(GOTO, n.label));
        return true;
      }
    }
  }
});
tweak("ti", "FoodStats", BOTH, "a(Lsq;)V", 0x8E182F50, "Adding regeneration bonus to sleeping",
function(mn)
{
  var changes = 0;
  var i;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 30 || n.operand == 24))
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
  return changes == 2;
});
