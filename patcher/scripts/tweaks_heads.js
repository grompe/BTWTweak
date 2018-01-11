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
tweak("bjb", "TileEntitySkullRenderer", CLIENT, "a(FFFIFILjava/lang/String;)V", [0x991332F, 0x6EAA383B], "Adding skulls to render",
function(mn)
{
  var changes = 0;
  var i;
  var label;
  var label1 = LabelNode();
  var label2 = LabelNode();
  var label3 = LabelNode();
  var label4 = LabelNode();
  var adjustment = 0;
  var heads = ["/mob/spider_head.png", "/mob/enderman_head.png", "/mob/pigzombie_head.png", "/mob/fire.png"];
  if (isBTWVersionOrNewer("4.A3 Headed Beastie"))
  {
    adjustment = 1;
    heads.push(heads.shift()); // Reorder so only spider heads will morph when updating BTW+BTWTweak
  }
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.TableSwitchInsnNode"))
    {
      n.max = 8 + adjustment;
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
      label = mn.instructions.get(i - 2 - adjustment);
      mn.instructions.insertBefore(label, toInsnList(
        [
          JumpInsnNode(GOTO, label),
          label1,
          FrameNode(F_SAME, 0, null, 0, null),
          VarInsnNode(ALOAD, 0),
          LdcInsnNode(heads[0]),
          MethodInsnNode(INVOKEVIRTUAL, "bjb", "a", "(Ljava/lang/String;)V"),
          JumpInsnNode(GOTO, label),
          label2,
          FrameNode(F_SAME, 0, null, 0, null),
          VarInsnNode(ALOAD, 0),
          LdcInsnNode(heads[1]),
          MethodInsnNode(INVOKEVIRTUAL, "bjb", "a", "(Ljava/lang/String;)V"),
          JumpInsnNode(GOTO, label),
          label3,
          FrameNode(F_SAME, 0, null, 0, null),
          VarInsnNode(ALOAD, 0),
          LdcInsnNode(heads[2]),
          MethodInsnNode(INVOKEVIRTUAL, "bjb", "a", "(Ljava/lang/String;)V"),
          JumpInsnNode(GOTO, label),
          label4,
          FrameNode(F_SAME, 0, null, 0, null),
          VarInsnNode(ALOAD, 0),
          LdcInsnNode(heads[3]),
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
  if (isBTWVersionOrNewer("4.A3 Headed Beastie"))
  {
    spiderheadid = 9;
  } else {
    spiderheadid = 5;
  }
  mn.instructions.add(dropHeadCode("sh", spiderheadid));
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
tweak("xi", "ItemSkull", BOTH, "<clinit>()V", [0xFF830B40, 0x57CE0CDC], "Adding skull item types",
function(mn)
{
  var changes = 0;
  var adjustment = 0;
  var heads1 = ["spider", "enderman", "pigzombie", "fire"];
  var heads2 = ["skull_spider", "skull_enderman", "skull_pigzombie", "skull_fire"];
  if (isBTWVersionOrNewer("4.A3 Headed Beastie"))
  {
    adjustment = 1;
    // Reorder so only spider heads will morph when updating BTW+BTWTweak
    heads1.push(heads1.shift());
    heads2.push(heads2.shift());
  }
  var i;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.TypeInsnNode") && (n.getOpcode() == ANEWARRAY))
    {
      n = mn.instructions.get(i - 1);
      mn.instructions.set(n, IntInsnNode(BIPUSH, 9 + adjustment));
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
          IntInsnNode(BIPUSH, 5 + adjustment),
          LdcInsnNode(heads1[0]),
          InsnNode(AASTORE),
          InsnNode(DUP),
          IntInsnNode(BIPUSH, 6 + adjustment),
          LdcInsnNode(heads1[1]),
          InsnNode(AASTORE),
          InsnNode(DUP),
          IntInsnNode(BIPUSH, 7 + adjustment),
          LdcInsnNode(heads1[2]),
          InsnNode(AASTORE),
          InsnNode(DUP),
          IntInsnNode(BIPUSH, 8 + adjustment),
          LdcInsnNode(heads1[3]),
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
          IntInsnNode(BIPUSH, 5 + adjustment),
          LdcInsnNode(heads2[0]),
          InsnNode(AASTORE),
          InsnNode(DUP),
          IntInsnNode(BIPUSH, 6 + adjustment),
          LdcInsnNode(heads2[1]),
          InsnNode(AASTORE),
          InsnNode(DUP),
          IntInsnNode(BIPUSH, 7 + adjustment),
          LdcInsnNode(heads2[2]),
          InsnNode(AASTORE),
          InsnNode(DUP),
          IntInsnNode(BIPUSH, 8 + adjustment),
          LdcInsnNode(heads2[3]),
          InsnNode(AASTORE),
        ]
      ));
      changes++;
      break;
    }
  }
  return changes == 4;
});
