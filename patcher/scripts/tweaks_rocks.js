// className, deobfName, side, method, checksums, description
tweak("bdk", "NetClientHandler", BOTH, "a(Lcn;)V", 0x3B2FD94B, "Adding rock entity into NetClientHandler",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && (n.owner == "FCEntityRottenArrow"))
    {
      var label = mn.instructions.get(i + 1).label;
      var mylabel = LabelNode();
      mn.instructions.insertBefore(n, toInsnList(
        [
          MethodInsnNode(INVOKESTATIC, "GPEEntityRock", "getVehicleSpawnPacketType", "()I"),
          JumpInsnNode(IF_ICMPNE, mylabel),
          TypeInsnNode(NEW, "GPEEntityRock"),
          InsnNode(DUP),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "bdk", "i", "Lbds;"),
          VarInsnNode(DLOAD, 2),
          VarInsnNode(DLOAD, 4),
          VarInsnNode(DLOAD, 6),
          MethodInsnNode(INVOKESPECIAL, "GPEEntityRock", "<init>", "(Laab;DDD)V"),
          VarInsnNode(ASTORE, 8),
          JumpInsnNode(GOTO, label),
          mylabel,
          FrameNode(F_SAME, 0, null, 0, null),
          VarInsnNode(ALOAD, 1),
          FieldInsnNode(GETFIELD, "cn", "j", "I"),
        ]
      ));
      return true;
    }
  }
});
if (!isBTWVersionOrNewer("4.AAAAAAAAAAHHHH"))
{
  tweak("FCBlockHopper", null, BOTH, "OnEntityItemCollidedWithBlock(Laab;IIILrh;)V", [0xE7F6250, 0x63F75060], "Calling new gravel handling",
  function(mn)
  {
    var label;
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode") && n.getOpcode() == IFLE)
      {
        label = n.label;
      }
      else if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.name.equals("e"))
      {
        var locvar = mn.maxLocals;
        mn.instructions.insert(n, toInsnList(
          [
            LdcInsnNode(Float("0.5")),
            VarInsnNode(ILOAD, locvar - 3), // was 16
            InsnNode(I2F),
            LdcInsnNode(Float("0.3")),
            InsnNode(FMUL),
            VarInsnNode(ALOAD, 1),
            FieldInsnNode(GETFIELD, "aab", "s", "Ljava/util/Random;"),
            MethodInsnNode(INVOKEVIRTUAL, "java/util/Random", "nextFloat", "()F"),
            InsnNode(FMUL),
            InsnNode(FADD),
            InsnNode(F2I),
            VarInsnNode(ISTORE, locvar),
            VarInsnNode(ALOAD, 0),
            VarInsnNode(ALOAD, 1),
            VarInsnNode(ALOAD, 5),
            FieldInsnNode(GETSTATIC, "GPEBTWTweak", "gpeItemLooseRock", "Lwk;"),
            FieldInsnNode(GETFIELD, "wk", "cp", "I"),
            VarInsnNode(ILOAD, locvar - 3), // was 16
            VarInsnNode(ILOAD, locvar),
            InsnNode(ISUB),
            MethodInsnNode(INVOKESPECIAL, "FCBlockHopper", "handleNewGravelTop", "(Laab;Lrh;II)V"),
            VarInsnNode(ALOAD, 0),
            VarInsnNode(ALOAD, 1),
            VarInsnNode(ALOAD, 5),
            FieldInsnNode(GETSTATIC, "wk", "aq", "Lwk;"),
            FieldInsnNode(GETFIELD, "wk", "cp", "I"),
            VarInsnNode(ILOAD, locvar),
            MethodInsnNode(INVOKESPECIAL, "FCBlockHopper", "handleNewGravelTop", "(Laab;Lrh;II)V"),
            JumpInsnNode(GOTO, label),
          ]
        ));
        return true;
      }
    }
  });
  add("FCBlockHopper", null, BOTH, "Adding new gravel handling",
  function(cn)
  {
    var label = LabelNode();
    var mn = MethodNode(ACC_PRIVATE, "handleNewGravelTop", "(Laab;Lrh;II)V", null, null);
    mn.instructions.add(toInsnList(
      [
        VarInsnNode(ILOAD, 4),
        JumpInsnNode(IFGT, label),
        InsnNode(RETURN),
        label,
        FrameNode(F_SAME, 0, null, 0, null),
        TypeInsnNode(NEW, "rh"),
        InsnNode(DUP),
        VarInsnNode(ALOAD, 1),
        VarInsnNode(ALOAD, 2),
        FieldInsnNode(GETFIELD, "rh", "u", "D"),
        VarInsnNode(ALOAD, 2),
        FieldInsnNode(GETFIELD, "rh", "v", "D"),
        VarInsnNode(ALOAD, 2),
        FieldInsnNode(GETFIELD, "rh", "w", "D"),
        TypeInsnNode(NEW, "wm"),
        InsnNode(DUP),
        VarInsnNode(ILOAD, 3),
        VarInsnNode(ILOAD, 4),
        InsnNode(ICONST_0),
        MethodInsnNode(INVOKESPECIAL, "wm", "<init>", "(III)V"),
        MethodInsnNode(INVOKESPECIAL, "rh", "<init>", "(Laab;DDDLwm;)V"),
        VarInsnNode(ASTORE, 5),
        VarInsnNode(ALOAD, 5),
        IntInsnNode(BIPUSH, 10),
        FieldInsnNode(PUTFIELD, "rh", "b", "I"),
        VarInsnNode(ALOAD, 1),
        VarInsnNode(ALOAD, 5),
        MethodInsnNode(INVOKEVIRTUAL, "aab", "d", "(Lmp;)Z"),
        InsnNode(POP),
        InsnNode(RETURN),
      ]
    ));
    cn.methods.add(mn);
  });
  function handleOverriddenStone(locvar)
  {
    return function (mn)
    {
      var label = new LabelNode();
      var result = CodeInserter(
        JumpInsnFinder(IF_ACMPNE),
        [
          JumpInsnNode(IF_ACMPEQ, label),
          VarInsnNode(ALOAD, locvar),
          FieldInsnNode(GETSTATIC, "GPEBTWTweak", "gpeBlockStone", "Lapa;"),
        ],
        INSERT_BEFORE
      ).process(mn);
      if (!result) return;
      return CodeInserter(
        JumpInsnFinder(IF_ACMPNE),
        [
          label,
          FrameNode(F_SAME, 0, null, 0, null),
        ]
      ).process(mn);
    };
  }
  tweak("wu", "ItemPickaxe", BOTH, "canHarvestBlock(Laab;Lapa;III)Z", 0xFB743BEB, "(1/3) Making Pickaxe handle overridden stone", handleOverriddenStone(2));
  tweak("wu", "ItemPickaxe", BOTH, "getStrVsBlock(Lwm;Laab;Lapa;III)F", 0x1C970FF0, "(2/3) Making Pickaxe handle overridden stone", handleOverriddenStone(3));
  tweak("wu", "ItemPickaxe", BOTH, "IsEffecientVsBlock(Laab;Lapa;III)Z", 0x331C054B, "(3/3) Making Pickaxe handle overridden stone", handleOverriddenStone(2));
}
