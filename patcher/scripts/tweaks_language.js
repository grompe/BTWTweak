// className, deobfName, side, method, checksums, description
tweak("awv", "FontRenderer", CLIENT, "a(C)I", 0x764812C2, "Fixing font render to allow wider characters",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 7))
    {
      n.operand = 16;
      return true;
    }
  }
});
tweak("axr", "GuiScreen", CLIENT, "n()V", 0xA56A0AD6, "Handling IME input",
function(mn)
{
  var label = LabelNode();
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode"))
    {
      mn.instructions.insert(n, toInsnList(
        [
          label,
          FrameNode(F_SAME, 0, null, 0, null),
        ]
      ));
      mn.instructions.insert(mn.instructions.get(0), toInsnList(
        [
          MethodInsnNode(INVOKESTATIC, "org/lwjgl/input/Keyboard", "getEventCharacter", "()C"),
          IntInsnNode(BIPUSH, 32),
          JumpInsnNode(IF_ICMPGE, label),
        ]
      ));
      return true;
    }
  }
});
tweak("azk", "GuiEditSign", CLIENT, "a(CI)V", 0x7C7F25A4, "Making sign accept unicode",
function(mn)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && (n.opcode == GETSTATIC) && n.owner.equals("azk") && n.name.equals("b"))
    {
      mn.instructions.remove(n);
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && (n.opcode == INVOKEVIRTUAL) && n.name.equals("indexOf"))
    {
      mn.instructions.set(n, MethodInsnNode(INVOKESTATIC, "v", "a", "(C)Z"));
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode") && n.opcode == IFLT)
    {
      n.opcode = IFEQ;
      changes++;
      break;
    }
  }
  return changes == 3;
});
tweak("jh", "NetServerHandler", BOTH, "a(Lfj;)V", 0x1C853116, "Allowing unicode characters in signs",
function(mn)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && (n.opcode == GETSTATIC) && n.owner.equals("v") && n.name.equals("a"))
    {
      mn.instructions.remove(n);
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && (n.opcode == INVOKEVIRTUAL) && n.name.equals("indexOf"))
    {
      mn.instructions.set(n, MethodInsnNode(INVOKESTATIC, "v", "a", "(C)Z"));
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode") && n.opcode == IFGE)
    {
      n.opcode = IFNE;
      changes++;
      break;
    }
  }
  return changes == 3;
});
