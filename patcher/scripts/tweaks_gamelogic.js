// className, deobfName, side, method, checksums, description
tweak("anf", "BlockFlowing", BOTH, "n(Laab;III)Z", 0xAD981353, "Making lava more unstoppable",
function(mn)
{
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
tweak("qi", "EntityChicken", BOTH, "a(ZI)V", [0x446910BC, 0xE82F1527], "Adding a feather to chicken",
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
tweak("qo", "EntitySheep", BOTH, "aK()V", 0x63E1B55, "Letting sheep heal from eating grass",
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
tweak("ru", "EntityCreeper", BOTH, "a_(Lsq;)Z", [0xC74B29CB, 0xC58F29C5, 0xC7B729D7, 0xC5FB29D1], "Hurting Creeper when sheared",
function(mn)
{
  return CodeInserter(
    MethodInsnFinder("ru", +1),
    [
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 1),
      MethodInsnNode(INVOKESTATIC, "mg", "a", "(Lsq;)Lmg;"),
      InsnNode(ICONST_2),
      MethodInsnNode(INVOKEVIRTUAL, "ru", "a", "(Lmg;I)Z"),
      InsnNode(POP),
    ]
  ).process(mn);
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
tweak("zr", "MerchantRecipeList", BOTH, "a(Lzq;)V", 0xAEAB0BC0, "Putting new villager offers at the beginning rather than the end",
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


