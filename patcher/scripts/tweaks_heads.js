function dropHeadCode(classname, index)
{
  return toInsnList([
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
  ]);
}

// className, deobfName, side, method, checksums, description
tweak("bjb", "TileEntitySkullRenderer", CLIENT, "a(FFFIFILjava/lang/String;)V", 0x991332F, "Adding skulls to render",
function(mn)
{
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
  return changes == 2;
});
add("rs", "EntityBlaze", BOTH, "Telling Blaze to drop head",
function(cn)
{
  var mn = MethodNode(ACC_PROTECTED, "dropHead", "()V", null, null);
  mn.instructions.add(dropHeadCode("rs", 8));
  cn.methods.add(mn);
});
add("rv", "EntityEnderman", BOTH, "Telling Enderman to drop head",
function(cn)
{
  var mn = MethodNode(ACC_PROTECTED, "dropHead", "()V", null, null);
  mn.instructions.add(dropHeadCode("rv", 6));
  cn.methods.add(mn);
});
tweak("sc", "EntityPigZombie", BOTH, "dropHead()V", 0xB200B2, "Telling PigZombie to drop head",
function(mn)
{
  mn.instructions.clear();
  mn.instructions.add(dropHeadCode("sc", 7));
  return true;
});
add("sh", "EntitySpider", BOTH, "Telling Spider to drop head",
function(cn)
{
  var mn = MethodNode(ACC_PROTECTED, "dropHead", "()V", null, null);
  mn.instructions.add(dropHeadCode("sh", 5));
  cn.methods.add(mn);
});
add("rt", "EntityCaveSpider", BOTH, "Cave spider is too small to drop head",
function(cn)
{
  var mn = MethodNode(ACC_PROTECTED, "dropHead", "()V", null, null);
  mn.instructions.add(toInsnList(
    [
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
});
add("FCEntityJungleSpider", null, BOTH, "Jungle spider is too small to drop head",
function(cn)
{
  var mn = MethodNode(ACC_PROTECTED, "dropHead", "()V", null, null);
  mn.instructions.add(toInsnList(
    [
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
});
tweak("xi", "ItemSkull", BOTH, "<clinit>()V", 0xFF830B40, "Adding skull item types",
function(mn)
{
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
  return changes == 4;
});
