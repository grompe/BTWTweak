// className, deobfName, side, method, checksums, description
tweak("aen", "ComponentMineshaftCorridor", BOTH, "a(Laab;Ljava/util/Random;Laek;)Z", [0x97797998, 0xAC7F79B2], "Making rails rusted in mineshafts",
function(mn)
{
  var i, changes = 0;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.name.equals("aK"))
    {
      n.owner = "GPEBTWTweak";
      n.name = "gpeBlockRustedRail";
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("aen") && n.name.equals("c") && n.desc.equals("(II)I"))
    {
      mn.instructions.insert(n, toInsnList(
        [
          InsnNode(POP),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "aen", "f", "I"),
          InsnNode(ICONST_1),
          InsnNode(IAND),
        ]
      ));
      changes++;
      break;
    }
  }
  return changes == 2;
});
