// className, deobfName, side, method, checksums, description
tweak("FCBlockBlockDispenser", "FCBlockBlockDispenser", BOTH, "DispenseBlockOrItem(Laab;IIILjava/util/Random;)V", [0xB78B99F2, 0x9DEF97A1], "Handling loose rocks (if old version)",
function(mn)
{
  if (isBTWVersionOrNewer("4.89666")) return true;
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
  if (boundary == null) return;
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
  return true;
});
tweak("rh", "EntityItem", BOTH, "l_()V", 0x73675C9C, "Boosting item stay delay (if old version)",
function(mn)
{
  if (isBTWVersionOrNewer("4.99999A0D Marsupial??!!")) return true;
  for (var i = mn.instructions.size() - 1; i >= 0; i--)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && n.operand == 6000)
    {
      mn.instructions.set(n, LdcInsnNode(Integer(36000)));
      return true;
    }
  }
});
