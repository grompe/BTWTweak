// className, deobfName, side, method, checksums, description
tweak("FCBlockGourd", null, BOTH, "Explode(Laab;DDD)V", [0x20A72147, 0x55EA249F], "Exploding Jack-O-Lanterns with torches",
function(mn)
{
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
  return true;
});
tweak("FCBlockPumpkin", null, CLIENT, "a(Lly;)V", 0x28FF05C8, "Adding jack icon back",
function(mn)
{
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
      return true;
    }
  }
});
tweak("FCBlockPumpkin", null, BOTH, "<init>(IZ)V", 0x2C60197, "Inserting isLantern handling back",
function(mn)
{
  return CodeInserter(
    MethodInsnFinder("FCBlockGourd"),
    [
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 2),
      FieldInsnNode(PUTFIELD, "FCBlockPumpkin", "isLantern", "Z"),
    ]
  ).process(mn);
});
add("FCBlockPumpkin", null, BOTH, "Added isLantern field back",
function(cn)
{
  cn.fields.add(FieldNode(ACC_PRIVATE, "isLantern", "Z", null, null));
});
