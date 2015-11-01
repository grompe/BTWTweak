// className, deobfName, side, method, checksums, description
tweak("FCBlockDirtSlab", null, BOTH, "HasValidAnchorToFacing(Laab;IIII)Z", CHECKSUM_IGNORE, "Make public",
function(mn)
{
  mn.access = ACC_PUBLIC;
  return true;
});
tweak("FCItemBlockDirtSlab", null, BOTH, "d(Lwm;)Ljava/lang/String;", 0x55A80942, "(1/3) Adding dirt slab item types",
function(mn)
{
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
  return changes == 2;
});
tweak("FCItemBlockDirtSlab", null, BOTH, "canCombineWithBlock(Laab;IIII)Z", 0xAE2D0A64, "(2/3) Adding dirt slab item types",
function(mn)
{
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
  return changes == 2;
});
tweak("FCItemBlockDirtSlab", null, BOTH, "convertToFullBlock(Laab;III)Z", 0x49FA1335, "(3/3) Adding dirt slab item types",
function(mn)
{
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
      return true;
    }
  }
});
