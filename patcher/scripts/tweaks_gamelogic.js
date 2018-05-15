function bipush2sipush(mn, orig, replacement, count)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == orig))
    {
      mn.instructions.set(n, IntInsnNode(SIPUSH, replacement));
      changes++;
      if (changes == count) return true;
    }
  }
}
function replaceButtonInit(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("ali") && n.name.equals("<init>") && n.desc.equals("(IZ)V"))
    {
      n.owner = "GPEBlockButton";
      return true;
    }
  }
}
function takeMicroblockOwnership(className, checksum)
{
  tweak(className, null, BOTH, "<init>(I)V", checksum, "(1/2) Making microblock inherit from GPEItemBlockMicro",
  function(mn)
  {
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.name.equals("<init>") && n.desc.equals("(I)V"))
      {
        if (n.owner.equals("FCItemBlockCustom") || n.owner.equals("xn"))
        {
          n.owner = "GPEItemBlockMicro";
          return true;
        }
      }
    }
  });
  add(className, null, BOTH, "(2/2) Making microblock inherit from GPEItemBlockMicro",
  function(cn)
  {
    cn.superName = "GPEItemBlockMicro";
  });
}
// className, deobfName, side, method, checksums, description
tweak("anf", "BlockFlowing", BOTH, "n(Laab;III)Z", [0xAD981353, 0x2B8E161E], "Making lava more unstoppable",
function(mn)
{
  // Mess of code, also broken in BTW 4.AABABABA+
  /*
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
  if (boundary == null) return false;
  mn.instructions.insert(boundary, toInsnList(
    [
      FieldInsnNode(GETSTATIC, "apa", "aM", "Lapa;"),
      FieldInsnNode(GETFIELD, "apa", "cz", "I"),
      JumpInsnNode(IF_ICMPEQ, label),
      VarInsnNode(ILOAD, 5),
    ]
  ));
  */
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
  return true;
});
tweak("jc", "EntityPlayerMP", BOTH, "CustomModDrops(Lmg;)V", 0x7B4C08F5, "Making gloom consume player's meat",
function(mn)
{
  var label = LabelNode();
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 1),
      FieldInsnNode(GETSTATIC, "FCDamageSourceCustom", "m_DamageSourceGloom", "Lmg;"),
      JumpInsnNode(IF_ACMPNE, label),
      InsnNode(RETURN),
      label,
      FrameNode(F_SAME, 0, null, 0, null),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("qi", "EntityChicken", BOTH, "a(ZI)V", [0x446910BC, 0xE82F1527, 0x8FEB12D5], "Adding a feather to chicken",
function(mn)
{
  var result = CodeInserter(
    BeginningFinder(),
    [
      InsnNode(ICONST_1),
    ],
    INSERT_BEFORE
  ).process(mn);
  if (!result) return;
  return CodeInserter(
    MethodInsnFinder("java/util/Random"),
    [
      InsnNode(IADD),
    ]
  ).process(mn);
});
tweak("qj", "EntityCow", BOTH, "OnGrazeBlock(III)V", 0x3E6B1B99, "Letting cows heal from eating grass",
function(mn)
{
  return CodeInserter(
    CustomFinder(function(n)
    {
      return isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.name.equals("CheckForGrazeSideEffects");
    }),
    [
      VarInsnNode(ALOAD, 0),
      InsnNode(ICONST_1),
      MethodInsnNode(INVOKEVIRTUAL, "qj", "j", "(I)V"),
    ]
  ).process(mn);
});
tweak("qo", "EntitySheep", BOTH, "aK()V", [0xE2B00C9A, 0x63E1B55], "Letting sheep heal from eating grass",
function(mn)
{
  for (var i = mn.instructions.size() - 1; i >= 0; i--)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == RETURN))
    {
      var label = LabelNode();
      mn.instructions.insertBefore(n, toInsnList(
        [
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "qo", "q", "Laab;"),
          FieldInsnNode(GETFIELD, "aab", "I", "Z"),
          JumpInsnNode(IFNE, label),
          VarInsnNode(ALOAD, 0),
          InsnNode(ICONST_1),
          MethodInsnNode(INVOKEVIRTUAL, "qo", "j", "(I)V"),
          label,
          FrameNode(F_SAME, 0, null, 0, null),
        ]
      ));
      return true;
    }
  }
});
add("qm", "EntityOcelot", BOTH, "Adding arcane scroll drop to ocelots",
function(cn)
{
  var mn = MethodNode(ACC_PUBLIC, "CheckForScrollDrop", "()V", null, null);
  var label = LabelNode();
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKEVIRTUAL, "qm", "m", "()Z"),
      JumpInsnNode(IFNE, label),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qm", "ab", "Ljava/util/Random;"),
      IntInsnNode(SIPUSH, 1000),
      MethodInsnNode(INVOKEVIRTUAL, "java/util/Random", "nextInt", "(I)I"),
      JumpInsnNode(IFNE, label),
      VarInsnNode(ALOAD, 0),
      TypeInsnNode(NEW, "wm"),
      InsnNode(DUP),
      FieldInsnNode(GETSTATIC, "FCBetterThanWolves", "fcArcaneScroll", "Lwk;"),
      InsnNode(ICONST_1),
      FieldInsnNode(GETSTATIC, "GPEBTWTweak", "gpeEnchantmentHaste", "I"),
      MethodInsnNode(INVOKESPECIAL, "wm", "<init>", "(Lwk;II)V"),
      InsnNode(FCONST_0),
      MethodInsnNode(INVOKEVIRTUAL, "qm", "a", "(Lwm;F)Lrh;"),
      InsnNode(POP),
      label,
      FrameNode(F_SAME, 0, null, 0, null),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
});
tweak("qu", "EntityWolf", BOTH, "bm()Z", 0xB400B0, "Making wild wolves despawn in forest biome",
function(mn)
{
  mn.instructions.clear();
  var label0 = LabelNode();
  var label1 = LabelNode();
  var label2 = LabelNode();
  mn.instructions.add(toInsnList(
    [
      FieldInsnNode(GETSTATIC, "GPEBTWTweak", "spawnWolvesInForests", "Z"),
      JumpInsnNode(IFNE, label0),
      InsnNode(ICONST_0),
      InsnNode(IRETURN),
      label0,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKEVIRTUAL, "qu", "m", "()Z"),
      JumpInsnNode(IFEQ, label1),
      InsnNode(ICONST_0),
      InsnNode(IRETURN),
      label1,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "u", "D"),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 1),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "w", "D"),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 2),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "q", "Laab;"),
      VarInsnNode(ILOAD, 1),
      VarInsnNode(ILOAD, 2),
      MethodInsnNode(INVOKEVIRTUAL, "aab", "a", "(II)Laav;"),
      FieldInsnNode(GETSTATIC, "aav", "f", "Laav;"),
      JumpInsnNode(IF_ACMPNE, label2),
      InsnNode(ICONST_1),
      InsnNode(IRETURN),
      label2,
      FrameNode(F_APPEND, 2, [INTEGER, INTEGER], 0, null),
      InsnNode(ICONST_0),
      InsnNode(IRETURN),
    ]
  ));
  return true;
});
add("qu", "EntityWolf", BOTH, "Making wild wolves respawn in forest biome",
function(cn)
{
  var mn = MethodNode(ACC_PUBLIC, "bv", "()Z", null, null);
  var label0 = LabelNode();
  var label1 = LabelNode();
  var label2 = LabelNode();
  var label3 = LabelNode();
  mn.instructions.add(toInsnList(
    [
      FieldInsnNode(GETSTATIC, "GPEBTWTweak", "spawnWolvesInForests", "Z"),
      JumpInsnNode(IFNE, label0),
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKESPECIAL, "nu", "bv", "()Z"),
      InsnNode(IRETURN),
      label0,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "u", "D"),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 1),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "E", "Laqx;"),
      FieldInsnNode(GETFIELD, "aqx", "b", "D"),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 2),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "w", "D"),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 3),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "q", "Laab;"),
      VarInsnNode(ILOAD, 1),
      VarInsnNode(ILOAD, 3),
      MethodInsnNode(INVOKEVIRTUAL, "aab", "a", "(II)Laav;"),
      FieldInsnNode(GETSTATIC, "aav", "f", "Laav;"),
      JumpInsnNode(IF_ACMPNE, label1),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "q", "Laab;"),
      VarInsnNode(ILOAD, 1),
      VarInsnNode(ILOAD, 2),
      VarInsnNode(ILOAD, 3),
      MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "canWildWolfSpawnHere", "(Laab;III)Z"),
      JumpInsnNode(IFEQ, label2),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "q", "Laab;"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "E", "Laqx;"),
      MethodInsnNode(INVOKEVIRTUAL, "aab", "b", "(Laqx;)Z"),
      JumpInsnNode(IFEQ, label2),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "q", "Laab;"),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "E", "Laqx;"),
      MethodInsnNode(INVOKEVIRTUAL, "aab", "a", "(Lmp;Laqx;)Ljava/util/List;"),
      MethodInsnNode(INVOKEINTERFACE, "java/util/List", "isEmpty", "()Z"),
      JumpInsnNode(IFEQ, label2),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "q", "Laab;"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "qu", "E", "Laqx;"),
      MethodInsnNode(INVOKEVIRTUAL, "aab", "d", "(Laqx;)Z"),
      JumpInsnNode(IFNE, label2),
      InsnNode(ICONST_1),
      JumpInsnNode(GOTO, label3),
      label2,
      FrameNode(F_APPEND, 3, [INTEGER, INTEGER, INTEGER], 0, null),
      InsnNode(ICONST_0),
      label3,
      FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
      InsnNode(IRETURN),
      label1,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKESPECIAL, "nu", "bv", "()Z"),
      InsnNode(IRETURN),
    ]
  ));
  cn.methods.add(mn);
});
tweak("sf", "EntitySkeleton", BOTH, "a(ZI)V", 0xEDE5138A, "Making wither skeletons drop ash",
function(mn)
{
  var label1 = LabelNode();
  var label2 = LabelNode();
  return CodeInserter(
    InsnFinder(RETURN),
    [
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKEVIRTUAL, "sf", "o", "()I"),
      InsnNode(ICONST_1),
      JumpInsnNode(IF_ICMPNE, label1),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "sf", "ab", "Ljava/util/Random;"),
      InsnNode(ICONST_3),
      VarInsnNode(ILOAD, 2),
      InsnNode(IADD),
      MethodInsnNode(INVOKEVIRTUAL, "java/util/Random", "nextInt", "(I)I"),
      InsnNode(ICONST_1),
      InsnNode(ISUB),
      VarInsnNode(ISTORE, 3),
      InsnNode(ICONST_0),
      VarInsnNode(ISTORE, 4),
      label2,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ILOAD, 4),
      VarInsnNode(ILOAD, 3),
      JumpInsnNode(IF_ICMPGE, label1),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETSTATIC, "GPEBTWTweak", "gpeItemAsh", "Lwk;"),
      FieldInsnNode(GETFIELD, "wk", "cp", "I"),
      InsnNode(ICONST_1),
      MethodInsnNode(INVOKEVIRTUAL, "sf", "b", "(II)Lrh;"),
      InsnNode(POP),
      IincInsnNode(4, 1),
      JumpInsnNode(GOTO, label2),
      label1,
      FrameNode(F_SAME, 0, null, 0, null),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("sq", "EntityPlayer", BOTH, "g_()Z", 0x9CFF11BB, "Dropping an eating player from the ladder",
function(mn)
{
  var label = LabelNode();
  return CodeInserter(
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
    INSERT_BEFORE
  ).process(mn);
});
tweak("sq", "EntityPlayer", BOTH, "GetLandMovementModifier()F", 0x268017E, "Making a player slower with armor and faster with boots",
function(mn)
{
  var label = LabelNode();
  return CodeInserter(
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
      LdcInsnNode(Float("0.1")),
      FieldInsnNode(GETSTATIC, "GPEBTWTweak", "gpeEnchantmentHaste", "I"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "sq", "bK", "Lso;"),
      FieldInsnNode(GETFIELD, "so", "b", "[Lwm;"),
      InsnNode(ICONST_0),
      InsnNode(AALOAD),
      MethodInsnNode(INVOKESTATIC, "zb", "a", "(ILwm;)I"),
      InsnNode(I2F),
      InsnNode(FMUL),
      InsnNode(FADD),
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
    ]
  ).process(mn);
});
if (!isBTWVersionOrNewer("4.A4 Kiloblock Boon"))
{
  tweak("zr", "MerchantRecipeList", BOTH, "a(Lzq;)V", [0xAEAB0BC0, 0x5CD408EB], "Putting new villager offers at the beginning rather than the end",
  function(mn)
  {
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("zr") && n.name.equals("add") && n.desc.equals("(Ljava/lang/Object;)Z"))
      {
        var n2 = n;
        n = n.getNext();
        if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.opcode == POP))
        {
          mn.instructions.remove(n2);
          mn.instructions.insert(n, toInsnList(
            [
              InsnNode(ICONST_0),
              VarInsnNode(ALOAD, 1),
              MethodInsnNode(INVOKEVIRTUAL, "zr", "add", "(ILjava/lang/Object;)V"),
            ]
          ));
          return true;
        }
      }
    }
  });
}
if (isBTWVersionOrNewer("4.89113"))
{
  tweak("iz", "WorldServer", BOTH, "b()V", [0xD2243D2B, 0x1AD73BA8], "Re-allowing easy difficulty and normal - on hardcore",
  function(mn)
  {
    var changes = 0;
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode") && (n.opcode == IF_ICMPGE))
      {
        n.opcode = IF_ICMPLE;
        changes++;
        break;
      }
    }
    for (i += 1; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.opcode == ICONST_2))
      {
        mn.instructions.set(n, InsnNode(ICONST_1));
        changes++;
        if (changes == 3) return true;
      }
    }
  });
  tweak("avy", "GameSettings", CLIENT, "a(Lawa;I)V", 0xA47E6FD8, "Re-allowing easy difficulty",
  function(mn)
  {
    var found = false;
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && (n.opcode == PUTFIELD) && n.owner.equals("avy") && n.name.equals("Y") && n.desc.equals("I"))
      {
        found = true;
        break;
      }
    }
    if (!found) return false;
    var changes = 0;
    for (i += 1; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.opcode == ICONST_2))
      {
        mn.instructions.set(n, MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "getMinimumDifficulty", "()I"));
        changes++;
        if (changes == 2) return true;
      }
    }
  });
  tweak("net/minecraft/server/MinecraftServer", null, BOTH, "c(I)V", 0x4461421, "Allowing normal difficulty on hardcore",
  function(mn)
  {
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.opcode == ICONST_3))
      {
        mn.instructions.insert(n, toInsnList(
          [
            VarInsnNode(ILOAD, 1),
            MethodInsnNode(INVOKESTATIC, "java/lang/Math", "max", "(II)I"),
          ]
        ));
        mn.instructions.set(n, InsnNode(ICONST_2));
        return true;
      }
    }
  });
}
tweak("awh", "GuiNewChat", CLIENT, "a(Ljava/lang/String;IIZ)V", 0x5E152CD1, "(1/2, client) Extending chat line to 256 characters",
function(mn)
{
  return bipush2sipush(mn, 100, 256, 2);
});
tweak("awj", "GuiChat", CLIENT, "A_()V", 0xF83F144E, "(2/2, client) Extending chat line to 256 characters",
function(mn)
{
  return bipush2sipush(mn, 100, 256, 1);
});
tweak("cw", "Packet3Chat", BOTH, "<clinit>()V", 0x24A0175, "(2/2, server) Extending chat line to 256 characters",
function(mn)
{
  return bipush2sipush(mn, 119, 275, 1);
});
tweak("jh", "NetServerHandler", BOTH, "a(Lcw;)V", 0xAE3E3152, "(1/2, server) Extending chat line to 256 characters",
function(mn)
{
  return bipush2sipush(mn, 100, 256, 1);
});
tweak("mp", "Entity", BOTH, "d(DDD)V", [0x8DFC67A0, 0xA3EB6600], "Making it impossible to fall from a rope while sneaking",
function(mn)
{
  var label_new1 = LabelNode();
  var label_new2 = LabelNode();
  return CodeInserter(
    CustomFinder(function(n)
    {
      return isInstance(n, "org.objectweb.asm.tree.FrameNode") && (getObjProperty(n, "type") == F_CHOP);
    }),
    [
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "mp", "F", "Z"),
      JumpInsnNode(IFNE, label_new1),
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKEVIRTUAL, "mp", "ag", "()Z"),
      JumpInsnNode(IFEQ, label_new1),
      VarInsnNode(ALOAD, 0),
      TypeInsnNode(INSTANCEOF, "sq"),
      JumpInsnNode(IFEQ, label_new1),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "mp", "u", "D"),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 21),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "mp", "E", "Laqx;"),
      FieldInsnNode(GETFIELD, "aqx", "b", "D"),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 22),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "mp", "w", "D"),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 23),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "mp", "q", "Laab;"),
      VarInsnNode(ILOAD, 21),
      VarInsnNode(ILOAD, 22),
      VarInsnNode(ILOAD, 23),
      MethodInsnNode(INVOKEVIRTUAL, "aab", "a", "(III)I"),
      VarInsnNode(ISTORE, 24),
      VarInsnNode(ILOAD, 24),
      FieldInsnNode(GETSTATIC, "FCBetterThanWolves", "fcRopeBlock", "Lapa;"),
      FieldInsnNode(GETFIELD, "apa", "cz", "I"),
      JumpInsnNode(IF_ICMPNE, label_new1),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "mp", "u", "D"),
      VarInsnNode(DLOAD, 1),
      InsnNode(DADD),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 25),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "mp", "w", "D"),
      VarInsnNode(DLOAD, 5),
      InsnNode(DADD),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 26),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "mp", "q", "Laab;"),
      VarInsnNode(ILOAD, 25),
      VarInsnNode(ILOAD, 22),
      VarInsnNode(ILOAD, 23),
      MethodInsnNode(INVOKEVIRTUAL, "aab", "a", "(III)I"),
      JumpInsnNode(IFNE, label_new2),
      InsnNode(DCONST_0),
      VarInsnNode(DSTORE, 1),
      InsnNode(DCONST_0),
      VarInsnNode(DSTORE, 13),
      label_new2,
      FrameNode(F_FULL, 18, ["mp", DOUBLE, DOUBLE, DOUBLE, DOUBLE, DOUBLE, DOUBLE, DOUBLE, DOUBLE, DOUBLE, "aqx", INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER], 0, []),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "mp", "q", "Laab;"),
      VarInsnNode(ILOAD, 21),
      VarInsnNode(ILOAD, 22),
      VarInsnNode(ILOAD, 26),
      MethodInsnNode(INVOKEVIRTUAL, "aab", "a", "(III)I"),
      JumpInsnNode(IFNE, label_new1),
      InsnNode(DCONST_0),
      VarInsnNode(DSTORE, 5),
      InsnNode(DCONST_0),
      VarInsnNode(DSTORE, 17),
      label_new1,
      FrameNode(F_FULL, 12, ["mp", DOUBLE, DOUBLE, DOUBLE, DOUBLE, DOUBLE, DOUBLE, DOUBLE, DOUBLE, DOUBLE, "aqx", INTEGER], 0, []),
    ]
  ).process(mn);
});
add('bdv', "EntityClientPlayerMP", CLIENT, "Adding sentDismount field",
function(cn)
{
  cn.fields.add(FieldNode(ACC_PRIVATE, "sentDismount", "Z", null, null));
});
tweak('bdv', "EntityClientPlayerMP", CLIENT, "<init>(Lnet/minecraft/client/Minecraft;Laab;Lawf;Lbdk;)V", 0x488C06CC, "(1/2) Adding ability to jump out of vehicles",
function(mn)
{
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 0),
      InsnNode(ICONST_0),
      FieldInsnNode(PUTFIELD, "bdv", "sentDismount", "Z"),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak('bdv', "EntityClientPlayerMP", CLIENT, "d()V", 0x1AE86900, "(2/2) Adding ability to jump out of vehicles",
function(mn)
{
  var label_new1 = LabelNode();
  var label_new2 = LabelNode();
  var label_new3 = LabelNode();
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "bdv", "bG", "Z"),
      JumpInsnNode(IFEQ, label_new1),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "bdv", "o", "Lmp;"),
      JumpInsnNode(IFNONNULL, label_new2),
      label_new1,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 0),
      InsnNode(ICONST_0),
      FieldInsnNode(PUTFIELD, "bdv", "sentDismount", "Z"),
      JumpInsnNode(GOTO, label_new3),
      label_new2,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "bdv", "bG", "Z"),
      JumpInsnNode(IFEQ, label_new3),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "bdv", "o", "Lmp;"),
      JumpInsnNode(IFNULL, label_new3),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "bdv", "sentDismount", "Z"),
      JumpInsnNode(IFNE, label_new3),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "bdv", "o", "Lmp;"),
      MethodInsnNode(INVOKEVIRTUAL, "bdv", "e", "(Lmp;)D"),
      InsnNode(DCONST_1),
      InsnNode(DCMPG),
      JumpInsnNode(IFGE, label_new3),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "bdv", "o", "Lmp;"),
      InsnNode(ACONST_NULL),
      FieldInsnNode(PUTFIELD, "mp", "n", "Lmp;"),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "bdv", "o", "Lmp;"),
      FieldInsnNode(GETFIELD, "mp", "x", "D"),
      FieldInsnNode(PUTFIELD, "bdv", "x", "D"),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "bdv", "o", "Lmp;"),
      FieldInsnNode(GETFIELD, "mp", "z", "D"),
      FieldInsnNode(PUTFIELD, "bdv", "z", "D"),
      VarInsnNode(ALOAD, 0),
      InsnNode(ACONST_NULL),
      FieldInsnNode(PUTFIELD, "bdv", "o", "Lmp;"),
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKEVIRTUAL, "bdv", "bl", "()V"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "bdv", "a", "Lbdk;"),
      TypeInsnNode(NEW, "dk"),
      InsnNode(DUP),
      LdcInsnNode("GPE|Dismount"),
      InsnNode(ACONST_NULL),
      MethodInsnNode(INVOKESPECIAL, "dk", "<init>", "(Ljava/lang/String;[B)V"),
      MethodInsnNode(INVOKEVIRTUAL, "bdk", "c", "(Lei;)V"),
      VarInsnNode(ALOAD, 0),
      InsnNode(ICONST_1),
      FieldInsnNode(PUTFIELD, "bdv", "sentDismount", "Z"),
      label_new3,
      FrameNode(F_SAME, 0, null, 0, null),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("aps", "BlockButtonWood", BOTH, "<init>(I)V", 0x301019B, "(1/2) Making wooden button inherit from GPEBlockButton",
replaceButtonInit);
add("aps", "BlockButtonWood", BOTH, "(2/2) Making wooden button inherit from GPEBlockButton",
function(cn)
{
  cn.superName = "GPEBlockButton";
});
tweak("aos", "BlockButtonStone", BOTH, "<init>(I)V", 0x2FE019A, "(1/2) Making stone button inherit from GPEBlockButton",
replaceButtonInit);
add("aos", "BlockButtonStone", BOTH, "(2/2) Making stone button inherit from GPEBlockButton",
function(cn)
{
  cn.superName = "GPEBlockButton";
});
takeMicroblockOwnership("FCItemBlockMoulding", 0x411E0779);
takeMicroblockOwnership("FCItemBlockSidingAndCorner", 0x411E0779);
takeMicroblockOwnership("FCItemBlockWoodCornerStub", 0x2C60197);
takeMicroblockOwnership("FCItemBlockWoodMouldingStub", 0x2C60197);
takeMicroblockOwnership("FCItemBlockWoodSidingStub", 0x2C60197);
add("Addon_Glass$BlockStainedGlass", null, BOTH, "Making Deco stained glass inherit from GPEBlockGlass",
function(cn)
{
  cn.superName = "GPEBlockGlass";
});
tweak("Addon_Glass$BlockStainedGlass", null, BOTH, "<init>(I)V", 0xBC392253, "Making Deco stained glass break like BTWTweak glass",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("FCBlockGlass") && n.name.equals("<init>") && n.desc.equals("(ILaif;Z)V"))
    {
      var n2 = n.getPrevious();
      var n3 = n2.getPrevious();
      n.owner = "GPEBlockGlass";
      n.desc = "(I)V";
      mn.instructions.remove(n2);
      mn.instructions.remove(n3);
      return true;
    }
  }
});
add("aoq", "BlockStairs", BOTH, "Adding ability to place torches, ladders, buttons on all flat stair surfaces",
function(cn)
{
  var mn = MethodNode(ACC_PUBLIC, "HasLargeCenterHardPointToFacing", "(Laak;IIII)Z", null, null);
  var l0 = LabelNode();
  var l1 = LabelNode();
  var l2 = LabelNode();
  var l3 = LabelNode();
  var l4 = LabelNode();
  var l5 = LabelNode();
  var l6 = LabelNode();
  var l7 = LabelNode();
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ILOAD, 2),
      VarInsnNode(ILOAD, 3),
      VarInsnNode(ILOAD, 4),
      MethodInsnNode(INVOKEINTERFACE, "aak", "h", "(III)I"),
      VarInsnNode(ISTORE, 6),
      VarInsnNode(ILOAD, 6),
      InsnNode(ICONST_4),
      InsnNode(IAND),
      InsnNode(ICONST_4),
      JumpInsnNode(IF_ICMPNE, l0),
      InsnNode(ICONST_1),
      JumpInsnNode(GOTO, l1),
      l0,
      FrameNode(F_APPEND, 1, [INTEGER], 0, null),
      InsnNode(ICONST_0),
      l1,
      FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
      VarInsnNode(ISTORE, 7),
      VarInsnNode(ILOAD, 6),
      InsnNode(ICONST_3),
      InsnNode(IAND),
      VarInsnNode(ISTORE, 8),
      VarInsnNode(ILOAD, 7),
      JumpInsnNode(IFNE, l2),
      VarInsnNode(ILOAD, 5),
      JumpInsnNode(IFNE, l2),
      InsnNode(ICONST_1),
      InsnNode(IRETURN),
      l2,
      FrameNode(F_APPEND,2, [INTEGER, INTEGER], 0, null),
      VarInsnNode(ILOAD, 7),
      JumpInsnNode(IFEQ, l3),
      VarInsnNode(ILOAD, 5),
      InsnNode(ICONST_1),
      JumpInsnNode(IF_ICMPNE, l3),
      InsnNode(ICONST_1),
      InsnNode(IRETURN),
      l3,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ILOAD, 8),
      InsnNode(ICONST_3),
      JumpInsnNode(IF_ICMPNE, l4),
      VarInsnNode(ILOAD, 5),
      InsnNode(ICONST_2),
      JumpInsnNode(IF_ICMPNE, l4),
      InsnNode(ICONST_1),
      InsnNode(IRETURN),
      l4,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ILOAD, 8),
      InsnNode(ICONST_2),
      JumpInsnNode(IF_ICMPNE, l5),
      VarInsnNode(ILOAD, 5),
      InsnNode(ICONST_3),
      JumpInsnNode(IF_ICMPNE, l5),
      InsnNode(ICONST_1),
      InsnNode(IRETURN),
      l5,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ILOAD, 8),
      InsnNode(ICONST_1),
      JumpInsnNode(IF_ICMPNE, l6),
      VarInsnNode(ILOAD, 5),
      InsnNode(ICONST_4),
      JumpInsnNode(IF_ICMPNE, l6),
      InsnNode(ICONST_1),
      InsnNode(IRETURN),
      l6,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ILOAD, 8),
      JumpInsnNode(IFNE, l7),
      VarInsnNode(ILOAD, 5),
      InsnNode(ICONST_5),
      JumpInsnNode(IF_ICMPNE, l7),
      InsnNode(ICONST_1),
      InsnNode(IRETURN),
      l7,
      FrameNode(F_SAME, 0, null, 0, null),
      InsnNode(ICONST_0),
      InsnNode(IRETURN),
    ]
  ));
  cn.methods.add(mn);
});
if (!isBTWVersionOrNewer("4.AAAAAAAAAAHHHH"))
{
  tweak("sj", "EntityZombie", BOTH, "bH()V", 0x14C20F2F, "Very rarely giving axes to zombies",
  function(mn)
  {
    for (var i = mn.instructions.size() - 1; i >= 0; i--)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == RETURN))
      {
        var label = LabelNode();
        mn.instructions.insertBefore(n, toInsnList(
          [
            VarInsnNode(ALOAD, 0),
            FieldInsnNode(GETFIELD, "sj", "ab", "Ljava/util/Random;"),
            MethodInsnNode(INVOKEVIRTUAL, "java/util/Random", "nextFloat", "()F"),
            LdcInsnNode(Float("0.005")),
            InsnNode(FCMPG),
            JumpInsnNode(IFGE, label),
            VarInsnNode(ALOAD, 0),
            InsnNode(ICONST_0),
            TypeInsnNode(NEW, "wm"),
            InsnNode(DUP),
            FieldInsnNode(GETSTATIC, "wk", "i", "Lwk;"),
            MethodInsnNode(INVOKESPECIAL, "wm", "<init>", "(Lwk;)V"),
            MethodInsnNode(INVOKEVIRTUAL, "sj", "c", "(ILwm;)V"),
            VarInsnNode(ALOAD, 0),
            FieldInsnNode(GETFIELD, "sj", "bq", "[F"),
            InsnNode(ICONST_0),
            LdcInsnNode(Float("0.99")),
            InsnNode(FASTORE),
            label,
            FrameNode(F_SAME, 0, null, 0, null),
          ]
        ));
        return true;
      }
    }
  });
}
tweak("FCEntityAIZombieBreakBarricades", null, BOTH, "e()V", [0x7353560, 0x7C7D38E6], "Very quickly breaking doors by axe-wielding zombies",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && (n.opcode == PUTFIELD)
      && n.owner.equals("FCEntityAIZombieBreakBarricades") && n.name.equals("breakingTime") && n.desc.equals("I"))
    {
      var label = LabelNode();
      mn.instructions.insert(n, toInsnList(
        [
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "FCEntityAIZombieBreakBarricades", "m_AssociatedEntity", "Lng;"),
          MethodInsnNode(INVOKEVIRTUAL, "ng", "bG", "()Lwm;"),
          JumpInsnNode(IFNULL, label),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "FCEntityAIZombieBreakBarricades", "m_AssociatedEntity", "Lng;"),
          MethodInsnNode(INVOKEVIRTUAL, "ng", "bG", "()Lwm;"),
          MethodInsnNode(INVOKEVIRTUAL, "wm", "b", "()Lwk;"),
          FieldInsnNode(GETFIELD, "wk", "cp", "I"),
          FieldInsnNode(GETSTATIC, "wk", "i", "Lwk;"),
          FieldInsnNode(GETFIELD, "wk", "cp", "I"),
          JumpInsnNode(IF_ICMPNE, label),
          VarInsnNode(ALOAD, 0),
          IntInsnNode(SIPUSH, 240),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "FCEntityAIZombieBreakBarricades", "breakingTime", "I"),
          IntInsnNode(BIPUSH, 9),
          InsnNode(IADD),
          MethodInsnNode(INVOKESTATIC, "java/lang/Math", "min", "(II)I"),
          FieldInsnNode(PUTFIELD, "FCEntityAIZombieBreakBarricades", "breakingTime", "I"),
          label,
          FrameNode(F_SAME, 0, null, 0, null),
        ]
      ));
      return true;
    }
  }
});
tweak("ng", "EntityLiving", BOTH, "bE()F", [0x2F3E47DF, 0xB84C4738], "Restoring the effect of swiftness potions",
function(mn)
{
  var label = LabelNode();
  var changes = 0;
  var saven;
  var i;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.VarInsnNode") && (n.opcode == ALOAD) && (n["var"] == 0))
    {
      saven = n;
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FrameNode"))
    {
      mn.instructions.set(n, FrameNode(F_SAME, 0, null, 0, null));
      changes++;
      break;
    }
  }
  if (saven)
  {
    mn.instructions.insert(saven, toInsnList(
      [
        VarInsnNode(ALOAD, 0),
        FieldInsnNode(GETSTATIC, "mk", "c", "Lmk;"),
        MethodInsnNode(INVOKEVIRTUAL, "ng", "a", "(Lmk;)Z"),
        JumpInsnNode(IFEQ, label),
        VarInsnNode(FLOAD, 1),
        InsnNode(FCONST_1),
        LdcInsnNode(Float("0.2")),
        VarInsnNode(ALOAD, 0),
        FieldInsnNode(GETSTATIC, "mk", "c", "Lmk;"),
        MethodInsnNode(INVOKEVIRTUAL, "ng", "b", "(Lmk;)Lml;"),
        MethodInsnNode(INVOKEVIRTUAL, "ml", "c", "()I"),
        InsnNode(ICONST_1),
        InsnNode(IADD),
        InsnNode(I2F),
        InsnNode(FMUL),
        InsnNode(FADD),
        InsnNode(FMUL),
        VarInsnNode(FSTORE, 1),
        label,
        FrameNode(F_APPEND, 1, [FLOAT], 0, null),
      ]
    ));
  }
  return changes == 2;
});
add("FCBlockVase", null, BOTH, "Adding vase chain explosions",
function(cn)
{
  var mn = MethodNode(ACC_PUBLIC, "a", "(Laab;IIILzw;)V", null, null);
  var label = LabelNode();
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ALOAD, 1),
      FieldInsnNode(GETFIELD, "aab", "I", "Z"),
      JumpInsnNode(IFNE, label),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ILOAD, 2),
      VarInsnNode(ILOAD, 3),
      VarInsnNode(ILOAD, 4),
      MethodInsnNode(INVOKESPECIAL, "FCBlockVase", "CheckForExplosion", "(Laab;III)Z"),
      InsnNode(POP),
      label,
      FrameNode(F_SAME, 0, null, 0, null),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
});
tweak("sw", "EntityFishHook", BOTH, "l_()V", 0xDE67A24A, "Allowing to hook items by a fishing rod",
function(mn)
{
  var changes = 0;
  var i;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("mp") && n.name.equals("K") && n.desc.equals("()Z"))
    {
      mn.instructions.insertBefore(n, toInsnList(
        [
          InsnNode(DUP),
        ]
      ));
      mn.instructions.insert(n, toInsnList(
        [
          InsnNode(SWAP),
          TypeInsnNode(INSTANCEOF, "rh"),
          InsnNode(IOR),
        ]
      ));
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("mp") && n.name.equals("a") && n.desc.equals("(Lmg;I)Z"))
    {
      mn.instructions.insert(n, toInsnList(
        [
          InsnNode(POP),
          InsnNode(ICONST_1),
        ]
      ));
      changes++;
      break;
    }
  }
  return (changes == 2);
});
tweak("ayl", "GuiContainer", CLIENT, "a(CI)V", 0x80F11C55, "Adding a hook for taking all slots to containers",
function(mn)
{
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 2),
      MethodInsnNode(INVOKEVIRTUAL, "ayl", "checkLootAll", "(I)V"),
    ],
    INSERT_BEFORE
  ).process(mn);
});
add("ayl", "GuiContainer", CLIENT, "Adding a key for taking all slots to containers",
function(cn)
{
  var l0 = LabelNode();
  var l1 = LabelNode();
  var l2 = LabelNode();
  var l3 = LabelNode();
  var l4 = LabelNode();
  var l5 = LabelNode();
  var mn = MethodNode(ACC_PROTECTED, "checkLootAll", "(I)V", null, null);
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ILOAD, 1),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "ayl", "g", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "z", "Lavy;"),
      FieldInsnNode(GETFIELD, "avy", "M", "Lava;"),
      FieldInsnNode(GETFIELD, "ava", "d", "I"),
      JumpInsnNode(IF_ICMPNE, l0),
      InsnNode(ICONST_0),
      VarInsnNode(ISTORE, 2),
      l1,
      FrameNode(F_APPEND, 1, [INTEGER], 0, null),
      VarInsnNode(ILOAD, 2),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "ayl", "d", "Ltj;"),
      FieldInsnNode(GETFIELD, "tj", "c", "Ljava/util/List;"),
      MethodInsnNode(INVOKEINTERFACE, "java/util/List", "size", "()I"),
      IntInsnNode(BIPUSH, 36),
      InsnNode(ISUB),
      JumpInsnNode(IF_ICMPGE, l0),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "ayl", "d", "Ltj;"),
      FieldInsnNode(GETFIELD, "tj", "c", "Ljava/util/List;"),
      VarInsnNode(ILOAD, 2),
      MethodInsnNode(INVOKEINTERFACE, "java/util/List", "get", "(I)Ljava/lang/Object;"),
      TypeInsnNode(CHECKCAST, "ul"),
      VarInsnNode(ASTORE, 3),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "ayl", "d", "Ltj;"),
      TypeInsnNode(INSTANCEOF, "FCContainerHopper"),
      JumpInsnNode(IFEQ, l2),
      VarInsnNode(ALOAD, 3),
      FieldInsnNode(GETFIELD, "ul", "g", "I"),
      IntInsnNode(BIPUSH, 18),
      JumpInsnNode(IF_ICMPNE, l2),
      JumpInsnNode(GOTO, l3),
      l2,
      FrameNode(F_APPEND, 1, ["ul"], 0, null),
      VarInsnNode(ALOAD, 3),
      MethodInsnNode(INVOKEVIRTUAL, "java/lang/Object", "getClass", "()Ljava/lang/Class;"),
      LdcInsnNode(asm.Type.getType("Lul;")),
      MethodInsnNode(INVOKEVIRTUAL, "java/lang/Object", "equals", "(Ljava/lang/Object;)Z"),
      VarInsnNode(ISTORE, 4),
      VarInsnNode(ALOAD, 3),
      FieldInsnNode(GETFIELD, "ul", "f", "Llt;"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "ayl", "g", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "bK", "Lso;"),
      JumpInsnNode(IF_ACMPNE, l4),
      InsnNode(ICONST_1),
      JumpInsnNode(GOTO, l5),
      l4,
      FrameNode(F_APPEND, 1, [INTEGER], 0, null),
      InsnNode(ICONST_0),
      l5,
      FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
      VarInsnNode(ISTORE, 5),
      VarInsnNode(ALOAD, 3),
      MethodInsnNode(INVOKEVIRTUAL, "ul", "d", "()Z"),
      JumpInsnNode(IFEQ, l3),
      VarInsnNode(ILOAD, 4),
      JumpInsnNode(IFEQ, l3),
      VarInsnNode(ILOAD, 5),
      JumpInsnNode(IFNE, l3),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 3),
      VarInsnNode(ALOAD, 3),
      FieldInsnNode(GETFIELD, "ul", "g", "I"),
      InsnNode(ICONST_0),
      InsnNode(ICONST_1),
      MethodInsnNode(INVOKEVIRTUAL, "ayl", "a", "(Lul;III)V"),
      l3,
      FrameNode(F_CHOP, 2, null, 0, null),
      IincInsnNode(2, 1),
      JumpInsnNode(GOTO, l1),
      l0,
      FrameNode(F_CHOP, 1, null, 0, null),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
});
if (isBTWVersionOrNewer("4.AAAAAAAAAAHHHH b"))
{
  tweak("aln", "BlockChest", BOTH, "<init>(II)V", 0x7B0608D1, "Changing chest to a material that requires a tool to harvest",
  function(mn)
  {
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("aif") && n.name.equals("d") && n.desc.equals("Laif;"))
      {
        n.owner = "FCBetterThanWolves";
        n.name = "fcMaterialPlanks";
        return true;
      }
    }
  });
}
if (isBTWVersionOrNewer("4.AAAAAAAAAAHHHH"))
{
  tweak("FCTileEntityMobSpawner", null, BOTH, "h()V", 0x12532440, "Letting mob spawner spread moss to loose cobble",
  function(mn)
  {
    return CodeInserter(
      CustomFinder(function(n)
      {
        return isInstance(n, "org.objectweb.asm.tree.JumpInsnNode") && n.opcode == IF_ICMPNE;
      }),
      [
        // stack: current_id, cobble_id ->
        InsnNode(SWAP),
        InsnNode(DUP_X1),
        // stack: current_id, cobble_id, current_id ->
        InsnNode(ISUB),
        // stack: current_id, eq_cobble_id ->
        InsnNode(SWAP),
        // stack: eq_cobble_id, current_id ->
        FieldInsnNode(GETSTATIC, "FCBetterThanWolves", "fcBlockCobblestoneLoose", "Lapa;"),
        FieldInsnNode(GETFIELD, "apa", "cz", "I"),
        // stack: eq_cobble_id, current_id, loose_id ->
        InsnNode(ISUB),
        // stack: eq_cobble_id, eq_loose_id ->
        InsnNode(IMUL),
        InsnNode(ICONST_0),
      ],
      INSERT_BEFORE
    ).process(mn);
  });
  tweak("ann", "BlockMycelium", BOTH, "a(Laab;IIILjava/util/Random;)V", 0xE1CD1FF7, "Letting mycelium spread to loose dirt",
  function(mn)
  {
    return CodeInserter(
      CustomFinder(function(n)
      {
        return isInstance(n, "org.objectweb.asm.tree.JumpInsnNode") && n.opcode == IF_ICMPNE;
      }),
      [
        InsnNode(SWAP),
        InsnNode(DUP_X1),
        InsnNode(ISUB),
        InsnNode(SWAP),
        FieldInsnNode(GETSTATIC, "FCBetterThanWolves", "fcBlockDirtLoose", "Lapa;"),
        FieldInsnNode(GETFIELD, "apa", "cz", "I"),
        InsnNode(ISUB),
        InsnNode(IMUL),
        InsnNode(ICONST_0),
      ],
      INSERT_BEFORE
    ).process(mn);
  });
  tweak("FCBlockStone", null, BOTH, "ConvertBlock(Lwm;Laab;IIII)Z", [0x2F441B20, 0xFB23261D], "Making stone retain strata when harvested with a chisel",
  function(mn)
  {
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("wm") && n.name.equals("<init>") && n.desc.equals("(Lapa;I)V"))
      {
        n.desc = "(Lapa;II)V";
        mn.instructions.insertBefore(n, toInsnList(
          [
            VarInsnNode(ALOAD, 0),
            VarInsnNode(ALOAD, 2),
            VarInsnNode(ILOAD, 3),
            VarInsnNode(ILOAD, 4),
            VarInsnNode(ILOAD, 5),
            MethodInsnNode(INVOKEVIRTUAL, "FCBlockStone", "GetStrata", "(Laak;III)I"),
          ]
        ));
        return true;
      }
    }
  });
}
