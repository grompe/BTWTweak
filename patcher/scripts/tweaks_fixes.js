function fixMobToBurnOnSlabs(mn)
{
  var count = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("kx") && n.name.equals("c") && n.desc.equals("(D)I"))
    {
      count++;
      if (count == 2)
      {
        mn.instructions.insert(n, toInsnList(
          [
            InsnNode(ICONST_1),
            InsnNode(IADD),
          ]
        ));
        return true;
      }
    }
  }
}
function fixAxeCheckingForStump(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("apa") && n.name.equals("N") && n.desc.equals("Lapa;"))
    {
      var n2 = n.getNext();
      if (isInstance(n2, "org.objectweb.asm.tree.JumpInsnNode") && (n2.opcode == IF_ACMPNE))
      {
        n2.opcode = IF_ICMPNE;
      } else {
        return false;
      }
      mn.instructions.insert(n, toInsnList(
        [
          FieldInsnNode(GETFIELD, "apa", "cz", "I"),
        ]
      ));
      mn.instructions.insertBefore(n, toInsnList(
        [
          FieldInsnNode(GETFIELD, "apa", "cz", "I"),
        ]
      ));
      return true;
    }
  }
}

// className, deobfName, side, method, checksums, description
if (!isBTWVersionOrNewer("4.A7 Squid A Swimming"))
{
  tweak("rf", "EntityBoat", BOTH, "l_()V", [0x2775423C, 0x8C1045A2, 0x20734BFD, 0xDE72592A], "Making boat safe from falling damage bug",
  function(mn)
  {
    var label = LabelNode();
    return CodeInserter(
      InsnFinder(RETURN),
      [
        VarInsnNode(ALOAD, 0),
        FieldInsnNode(GETFIELD, "rf", "y", "D"),
        InsnNode(DCONST_0),
        InsnNode(DCMPL),
        JumpInsnNode(IFLE, label),
        VarInsnNode(ALOAD, 0),
        InsnNode(FCONST_0),
        FieldInsnNode(PUTFIELD, "rf", "T", "F"),
        label,
        FrameNode(F_SAME, 0, null, 0, null),
      ],
      INSERT_BEFORE
    ).process(mn);
  });
}
if (!isBTWVersionOrNewer("4.AB4 Bonnets"))
{
  tweak("sf", "EntitySkeleton", BOTH, "c()V", 0x30572525, "Fixing mob not burning on slabs", fixMobToBurnOnSlabs);
  tweak("sj", "EntityZombie", BOTH, "c()V", [0x4F1922DE, 0x45652A3D, 0xB4E223AF, 0xE11E214E], "Fixing mob not burning on slabs", fixMobToBurnOnSlabs);
}
if (!isBTWVersionOrNewer("4.A4 Kiloblock Boon"))
{
  tweak("wo", "ItemMap", BOTH, "a(Laab;Lmp;Lajl;)V", 0x420DA13F, "Extending BlockIDs for ItemMap",
  function(mn)
  {
    var changes = 0;
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == SIPUSH) && (n.operand == 256))
      {
        n.operand = 4096;
        changes++;
        if (changes == 2) break;
      }
    }
    return changes == 2;
  });
}
tweak("zs", "MobSpawnerBaseLogic", BOTH, "g()V", 0x72426C61, "Fixing mob spawner offset",
function(mn)
{
  return CodeInserter(
    CustomFinder(function(n)
    {
      return isInstance(n, "org.objectweb.asm.tree.VarInsnNode") && (n["var"] == 11);
    }),
    [
      VarInsnNode(DLOAD, 1),
      LdcInsnNode(Double("0.5")),
      InsnNode(DADD),
      VarInsnNode(DSTORE, 1),
      VarInsnNode(DLOAD, 9),
      LdcInsnNode(Double("0.5")),
      InsnNode(DADD),
      VarInsnNode(DSTORE, 9),
    ]
  ).process(mn);
});
tweak("zu", "ChunkCoordIntPair", BOTH, "hashCode()I", 0x3ADF0615, "Replacing chunk coordinates hash by optimized version",
function(mn)
{
  mn.instructions.clear();
  mn.instructions.add(toInsnList([
    LdcInsnNode(Integer(1664525)),           // stack: int

    VarInsnNode(ALOAD, 0),
    FieldInsnNode(GETFIELD, "zu", "a", "I"), // stack: int, int(chunkXPos)

    InsnNode(IMUL),                          // stack: int

    LdcInsnNode(Integer(1013904223)),        // stack: int, int
    InsnNode(IADD),                          // stack: int(xTransform)

    LdcInsnNode(Integer(1664525)),           // stack: int(xTransform), int

    VarInsnNode(ALOAD, 0),
    FieldInsnNode(GETFIELD, "zu", "b", "I"), // stack: int(xTransform), int, int(chunkZPos)
    LdcInsnNode(Integer(-559038737)),        // stack: int(xTransform), int, int(chunkZPos), int
    InsnNode(IXOR),                          // stack: int(xTransform), int, int

    InsnNode(IMUL),                          // stack: int(xTransform), int

    LdcInsnNode(Integer(1013904223)),        // stack: int(xTransform), int, int
    InsnNode(IADD),                          // stack: int(xTransform), int(zTransform)
    InsnNode(IXOR),                          // stack: int
    InsnNode(IRETURN),
  ]));
  return true;
});
if (isBTWVersionOrNewer("4.A2 Timing Rodent") && !isBTWVersionOrNewer("4.AAAAAAAAAAHHHH"))
{
  tweak("wi", "ItemAxe", BOTH, "getStrVsBlock(Lwm;Laab;Lapa;III)F", 0xF8E30EFB, "(1/3) Making axe check for tree stump block ID rather than block", fixAxeCheckingForStump);
  tweak("wi", "ItemAxe", BOTH, "canHarvestBlock(Laab;Lapa;III)Z", [0xB5DB0C08, 0x76F4089E], "(2/3) Making axe check for tree stump block ID rather than block",
  function(mn)
  {
    if (isBTWVersionOrNewer("4.A7 Squid A Swimming") && !isBTWVersionOrNewer("4.A9 Pustules Lancing"))
    {
      var changes = 0;
      for (var i = 0; i < mn.instructions.size(); i++)
      {
        var n = mn.instructions.get(i);
        if (isInstance(n, "org.objectweb.asm.tree.FrameNode"))
        {
          var label = LabelNode();
          mn.instructions.insert(n, toInsnList(
            [
              VarInsnNode(ALOAD, 2),
              MethodInsnNode(INVOKEVIRTUAL, "apa", "AreAxesEffectiveOn", "()Z"),
              JumpInsnNode(IFEQ, label),
              InsnNode(ICONST_1),
              InsnNode(IRETURN),
              label,
              FrameNode(F_SAME, 0, null, 0, null),
            ]
          ));
          changes++;
          break;
        }
      }
      if (changes != 1) return false;
    }
    return fixAxeCheckingForStump(mn);
  });
  tweak("wi", "ItemAxe", BOTH, "IsEffecientVsBlock(Laab;Lapa;III)Z", 0x84A511D2, "(3/3) Making axe check for tree stump block ID rather than block", fixAxeCheckingForStump);
}
// Fix logging in and out repeatedly to abuse initial invulnerability to avoid dying
add("jh", "NetServerHandler", BOTH, "Added private integer ticksToQuit",
function(cn)
{
  cn.fields.add(FieldNode(ACC_PRIVATE, "ticksToQuit", "I", null, null));
});
tweak("jh", "NetServerHandler", BOTH, "<init>(Lnet/minecraft/server/MinecraftServer;Lcg;Ljc;)V", 0xC9D80BE7, "Initializing ticksToQuit",
function(mn)
{
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 0),
      InsnNode(ICONST_0),
      FieldInsnNode(PUTFIELD, "jh", "ticksToQuit", "I"),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("jh", "NetServerHandler", BOTH, "d()V", 0x55B72340, "(1/2) Making players stay for 60 ticks after disconnecting",
function(mn)
{
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKESPECIAL, "jh", "checkPendingQuit", "()V"),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("jh", "NetServerHandler", BOTH, "a(Ljava/lang/String;[Ljava/lang/Object;)V", 0x72E72243, "(2/2) Making players stay for 60 ticks after disconnecting",
function(mn)
{
  mn.instructions.clear();
  var label = LabelNode();
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "ticksToQuit", "I"),
      JumpInsnNode(IFNE, label),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "d", "Lnet/minecraft/server/MinecraftServer;"),
      MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/server/MinecraftServer", "al", "()Lku;"),
      TypeInsnNode(NEW, "java/lang/StringBuilder"),
      InsnNode(DUP),
      MethodInsnNode(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "c", "Ljc;"),
      FieldInsnNode(GETFIELD, "jc", "bS", "Ljava/lang/String;"),
      MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
      LdcInsnNode(" lost connection: "),
      MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
      VarInsnNode(ALOAD, 1),
      MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
      MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;"),
      MethodInsnNode(INVOKEINTERFACE, "ku", "a", "(Ljava/lang/String;)V"),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "e", "I"),
      IntInsnNode(BIPUSH, 60),
      InsnNode(IADD),
      FieldInsnNode(PUTFIELD, "jh", "ticksToQuit", "I"),
      label,
      FrameNode(F_SAME, 0, null, 0, null),
      InsnNode(RETURN),
    ]
  ));
  return true;
});
add("jh", "NetServerHandler", BOTH, "Adding checkPendingQuit",
function(cn)
{
  var mn = MethodNode(ACC_PRIVATE, "checkPendingQuit", "()V", null, null);
  var label = LabelNode();
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "b", "Z"),
      JumpInsnNode(IFNE, label),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "ticksToQuit", "I"),
      JumpInsnNode(IFEQ, label),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "e", "I"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "ticksToQuit", "I"),
      JumpInsnNode(IF_ICMPLT, label),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "d", "Lnet/minecraft/server/MinecraftServer;"),
      MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/server/MinecraftServer", "ad", "()Lgu;"),
      TypeInsnNode(NEW, "cw"),
      InsnNode(DUP),
      TypeInsnNode(NEW, "java/lang/StringBuilder"),
      InsnNode(DUP),
      MethodInsnNode(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V"),
      FieldInsnNode(GETSTATIC, "a", "o", "La;"),
      MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/Object;)Ljava/lang/StringBuilder;"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "c", "Ljc;"),
      MethodInsnNode(INVOKEVIRTUAL, "jc", "ax", "()Ljava/lang/String;"),
      MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
      LdcInsnNode(" left the game."),
      MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
      MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;"),
      MethodInsnNode(INVOKESPECIAL, "cw", "<init>", "(Ljava/lang/String;)V"),
      MethodInsnNode(INVOKEVIRTUAL, "gu", "a", "(Lei;)V"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "d", "Lnet/minecraft/server/MinecraftServer;"),
      MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/server/MinecraftServer", "ad", "()Lgu;"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "c", "Ljc;"),
      MethodInsnNode(INVOKEVIRTUAL, "gu", "e", "(Ljc;)V"),
      VarInsnNode(ALOAD, 0),
      InsnNode(ICONST_1),
      FieldInsnNode(PUTFIELD, "jh", "b", "Z"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "d", "Lnet/minecraft/server/MinecraftServer;"),
      MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/server/MinecraftServer", "I", "()Z"),
      JumpInsnNode(IFEQ, label),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "c", "Ljc;"),
      FieldInsnNode(GETFIELD, "jc", "bS", "Ljava/lang/String;"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "d", "Lnet/minecraft/server/MinecraftServer;"),
      MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/server/MinecraftServer", "H", "()Ljava/lang/String;"),
      MethodInsnNode(INVOKEVIRTUAL, "java/lang/String", "equals", "(Ljava/lang/Object;)Z"),
      JumpInsnNode(IFEQ, label),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "d", "Lnet/minecraft/server/MinecraftServer;"),
      MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/server/MinecraftServer", "al", "()Lku;"),
      LdcInsnNode("Stopping singleplayer server as player logged out"),
      MethodInsnNode(INVOKEINTERFACE, "ku", "a", "(Ljava/lang/String;)V"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "jh", "d", "Lnet/minecraft/server/MinecraftServer;"),
      MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/server/MinecraftServer", "n", "()V"),
      label,
      FrameNode(F_SAME, 0, null, 0, null),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
});
if (isBTWVersionOrNewer("4.A7 Squid A Swimming"))
{
  tweak("sq", "EntityPlayer", BOTH, "AddExhaustionForJump()V", 0x18F5047D, "Not exhausting player for climbing on ladder",
  function(mn)
  {
    var label = LabelNode();
    return CodeInserter(
      BeginningFinder(),
      [
        VarInsnNode(ALOAD, 0),
        MethodInsnNode(INVOKEVIRTUAL, "sq", "g_", "()Z"),
        JumpInsnNode(IFEQ, label),
        InsnNode(RETURN),
        label,
        FrameNode(F_SAME, 0, null, 0, null),
      ],
      INSERT_BEFORE
    ).process(mn);
  });
} else {
  tweak("jh", "NetServerHandler", BOTH, "a(Lee;)V", 0x338E4716, "Adding a server-side jump() call for the player",
  function(mn)
  {
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("jc") && n.name.equals("j") && n.desc.equals("(F)V"))
      {
        var n2 = n.getPrevious(); // LdcInsnNode(Float("0.2"))
        mn.instructions.remove(n2);
        n.name = "bl"; // jump
        n.desc = "()V";
        return true;
      }
    }
  });
  tweak("sq", "EntityPlayer", BOTH, "bl()V", 0x3A2D06D8, "Making player's jump() public and handling server-side calls",
  function(mn)
  {
    var label_new1 = LabelNode();
    var label_new2 = LabelNode();
    mn.access = ACC_PUBLIC;
    var beginning = mn.instructions.get(0);
    mn.instructions.insertBefore(beginning, toInsnList(
      [
        VarInsnNode(ALOAD, 0),
        FieldInsnNode(GETFIELD, "sq", "q", "Laab;"),
        FieldInsnNode(GETFIELD, "aab", "I", "Z"),
        JumpInsnNode(IFEQ, label_new1),
      ]
    ));
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("sq") && n.name.equals("a") && n.desc.equals("(Lka;I)V"))
      {
        mn.instructions.insert(n, toInsnList(
          [
            label_new1,
            FrameNode(F_SAME, 0, null, 0, null),
            VarInsnNode(ALOAD, 0),
            MethodInsnNode(INVOKEVIRTUAL, "sq", "g_", "()Z"),
            JumpInsnNode(IFEQ, label_new2),
            InsnNode(RETURN),
            label_new2,
            FrameNode(F_SAME, 0, null, 0, null),
          ]
        ));
        return true;
      }
    }
  });
}
// Fix achievements to be achievable
tweak("jv", "AchievementList", BOTH, "<clinit>()V", 0x562B905E, "(1/4) Making achievements achievable",
function(mn)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("wk") && n.desc.equals("Lwk;"))
    {
      if (n.name.equals("O"))
      {
        n.name = "Q";
        changes++;
      }
      if (n.name.equals("s"))
      {
        n.name = "z";
        changes++;
      }
      if (changes == 2) return true;
    }
  }
});
tweak("rh", "EntityItem", BOTH, "b_(Lsq;)V", 0x780F22BB, "(2/4) Making achievements achievable; (1/2) removing zero-stack glitch items",
function(mn)
{
  var changes = 0;
  var i;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("wm") && n.name.equals("a") && n.desc.equals("I"))
    {
      var n2 = mn.instructions.get(i + 2);
      var label1 = LabelNode();
      mn.instructions.insert(n2, toInsnList(
        [
          VarInsnNode(ILOAD, 3),
          JumpInsnNode(IFGT, label1),
          VarInsnNode(ALOAD, 0),
          MethodInsnNode(INVOKEVIRTUAL, "rh", "w", "()V"),
          InsnNode(RETURN),
          label1,
          FrameNode(F_APPEND, 2, ["wm", INTEGER], 0, null),
        ]
      ));
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("sq") && n.name.equals("a") && n.desc.equals("(Lka;)V"))
    {
      var frame = mn.instructions.get(i + 3); // fakeinst
      if (isInstance(frame, "org.objectweb.asm.tree.FrameNode"))
      {
        var label = LabelNode();
        mn.instructions.insert(frame, toInsnList(
          [
            VarInsnNode(ALOAD, 2),
            FieldInsnNode(GETFIELD, "wm", "c", "I"),
            FieldInsnNode(GETSTATIC, "apa", "bI", "Lapa;"),
            FieldInsnNode(GETFIELD, "apa", "cz", "I"),
            JumpInsnNode(IF_ICMPNE, label),
            VarInsnNode(ALOAD, 1),
            FieldInsnNode(GETSTATIC, "jv", "D", "Lju;"),
            MethodInsnNode(INVOKEVIRTUAL, "sq", "a", "(Lka;)V"),
            label,
            FrameNode(F_SAME, 0, null, 0, null),
          ]
        ));
        return changes == 1;
      }
      return;
    }
  }
});
tweak("FCUtilsInventory", null, BOTH, "AddItemStackToInventoryInSlotRange(Llt;Lwm;II)Z", 0x2FCD0587, "(2/2) removing zero-stack glitch items",
function(mn)
{
  var label = LabelNode();
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 1),
      FieldInsnNode(GETFIELD, "wm", "a", "I"),
      JumpInsnNode(IFGT, label),
      InsnNode(ICONST_1),
      InsnNode(IRETURN),
      label,
      FrameNode(F_SAME, 0, null, 0, null),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("tx", "SlotFurnace", BOTH, "b(Lwm;)V", 0x5094290D, "(3/4) Making achievements achievable",
function(mn)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("wk") && n.name.equals("p") && n.desc.equals("Lwk;"))
    {
      n.name = "ba";
      changes++;
    }
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("jv") && n.name.equals("k") && n.desc.equals("Lju;"))
    {
      n.name = "n";
      changes++;
    }
    if (changes == 2) return true;
  }
});
tweak("uk", "SlotCrafting", BOTH, "b(Lwm;)V", 0x79C03DC4, "(4/4) Making achievements achievable",
function(mn)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode") && n.opcode == GOTO)
    {
      var label = LabelNode();
      var ret = n.label;
      var frame = mn.instructions.get(i + 3); // fakeinst
      if (isInstance(frame, "org.objectweb.asm.tree.FrameNode"))
      {
        mn.instructions.insert(frame, toInsnList(
          [
            VarInsnNode(ALOAD, 1),
            FieldInsnNode(GETFIELD, "wm", "c", "I"),
            FieldInsnNode(GETSTATIC, "wk", "p", "Lwk;"),
            FieldInsnNode(GETFIELD, "wk", "cp", "I"),
            JumpInsnNode(IF_ICMPNE, label),
            VarInsnNode(ALOAD, 0),
            FieldInsnNode(GETFIELD, "uk", "b", "Lsq;"),
            FieldInsnNode(GETSTATIC, "jv", "k", "Lju;"),
            InsnNode(ICONST_1),
            MethodInsnNode(INVOKEVIRTUAL, "sq", "a", "(Lka;I)V"),
            JumpInsnNode(GOTO, ret),
            label,
            FrameNode(F_SAME, 0, null, 0, null),
          ]
        ));
        changes++;
        break;
      }
      return;
    }
  }
  if (changes != 1) return;
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("wk") && n.desc.equals("Lwk;"))
    {
      if (n.name.equals("O"))
      {
        n.name = "Q";
        changes++;
      }
      if (n.name.equals("s"))
      {
        n.name = "z";
        changes++;
      }
      if (changes == 3) return true;
    }
  }
});
if (!isBTWVersionOrNewer("4.A7 Squid A Swimming"))
{
  tweak("pk", "EntityAISit", BOTH, "a()Z", 0xC59E0D23, "Preventing wolves/cats from teleporting to player on growing up",
  function(mn)
  {
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("nu") && n.name.equals("F") && n.desc.equals("Z"))
      {
        var n2 = n.getNext();
        if (isInstance(n2, "org.objectweb.asm.tree.JumpInsnNode") && (n2.opcode == IFNE))
        {
          n2.opcode = IFLE;
          mn.instructions.insert(n, toInsnList(
            [
              FieldInsnNode(GETFIELD, "nu", "T", "F"),
              LdcInsnNode(Float("0.5")),
              InsnNode(FCMPL),
            ]
          ));
          mn.instructions.remove(n);
          return true;
        }
      }
    }
  });
}
tweak("mp", "Entity", BOTH, "x()V", 0x1C8882FF, "Kill players that went through the roof of the Nether",
function(mn)
{
  var found = false;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && isInstance(n.cst, "java.lang.Double") && (n.cst == "-64.0"))
    {
      found = true;
      break;
    }
  }
  if (!found) return;
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FrameNode"))
    {
      var label = LabelNode();
      mn.instructions.insert(n, toInsnList(
        [
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "mp", "v", "D"),
          LdcInsnNode(Double("127.5")),
          InsnNode(DCMPL),
          JumpInsnNode(IFLE, label),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "mp", "q", "Laab;"),
          FieldInsnNode(GETFIELD, "aab", "t", "Lacn;"),
          FieldInsnNode(GETFIELD, "acn", "h", "I"),
          InsnNode(ICONST_M1),
          JumpInsnNode(IF_ICMPNE, label),
          VarInsnNode(ALOAD, 0),
          MethodInsnNode(INVOKEVIRTUAL, "mp", "B", "()V"),
          label,
          FrameNode(F_SAME, 0, null, 0, null),
        ]
      ));
      return true;
    }
  }
});
tweak("su", "EntityFireball", BOTH, "l_()V", 0x8AA2DC62, "Remove stuck glitched ghost fireballs",
function(mn)
{
  for (var i = mn.instructions.size() - 1; i >= 0; i--)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("su") && n.name.equals("b") && n.desc.equals("(DDD)V"))
    {
      var label = LabelNode();
      var label_skip = LabelNode();
      mn.instructions.insert(n, toInsnList(
        [
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "su", "u", "D"),
          MethodInsnNode(INVOKESTATIC, "java/lang/Double", "isNaN", "(D)Z"),
          JumpInsnNode(IFNE, label),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "su", "x", "D"),
          MethodInsnNode(INVOKESTATIC, "java/lang/Double", "isNaN", "(D)Z"),
          JumpInsnNode(IFEQ, label_skip),
          label,
          FrameNode(F_SAME, 0, null, 0, null),
          VarInsnNode(ALOAD, 0),
          MethodInsnNode(INVOKEVIRTUAL, "su", "w", "()V"),
          label_skip,
        ]
      ));
      return true;
    }
  }
});
tweak("bp", "StringTranslate", CLIENT, "a(Ljava/util/Properties;Ljava/lang/String;)V", 0xF2A01ED4, "Fix crash on unknown language",
function(mn)
{
  // Not required since BTW 4.A5, but is a cleaner bugfix; no harm in leaving it
  var label = LabelNode();
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.name.equals("getResourceAsStream"))
    {
      mn.instructions.insert(n, toInsnList(
        [
          InsnNode(DUP),
          JumpInsnNode(IFNONNULL, label),
          TypeInsnNode(NEW, "java/io/IOException"),
          InsnNode(DUP),
          LdcInsnNode("Invalid language"),
          MethodInsnNode(INVOKESPECIAL, "java/io/IOException", "<init>", "(Ljava/lang/String;)V"),
          InsnNode(ATHROW),
          label,
          FrameNode(F_SAME, 0, null, 0, null),
        ]
      ));
      return true;
    }
  }
});
tweak("bir", "TextureMap", CLIENT, "b()V", [0x5F28A3A3, 0x4084A6F9, 0xCB479DDD], "Making writing debug textures optional",
function(mn)
{
  var changes = 0;
  var label = LabelNode();
  var i;
  for (i = mn.instructions.size() - 1; i >= 0; i--)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("bio") && n.name.equals("b") && n.desc.equals("(Ljava/lang/String;)V"))
    {
      mn.instructions.insert(n, toInsnList(
        [
          label,
          FrameNode(F_SAME, 0, null, 0, null),
        ]
      ));
      changes++;
      break;
    }
  }
  for (i -= 1; i >= 0; i--)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FrameNode") || isInstance(n, "org.objectweb.asm.tree.LabelNode"))
    {
      mn.instructions.insert(n, toInsnList(
        [
          FieldInsnNode(GETSTATIC, "GPEBTWTweak", "writeDebugTextures", "Z"),
          JumpInsnNode(IFEQ, label),
        ]
      ));
      return changes == 1;
    }
  }
});
function fixNewGenChests(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("aln") && n.name.equals("cz") && n.desc.equals("I"))
    {
      var n2 = n.getNext();
      if (isInstance(n2, "org.objectweb.asm.tree.InsnNode") && (n2.getOpcode() == ICONST_0))
      {
        mn.instructions.set(n2, InsnNode(ICONST_2));
        return true;
      }
    }
    // BTW 4.AABABABA+
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("FCBetterThanWolves") && n.name.equals("fcBlockChest") && n.desc.equals("Lapa;"))
    {
      var n2 = n.getNext().getNext();
      if (isInstance(n2, "org.objectweb.asm.tree.InsnNode") && (n2.getOpcode() == ICONST_0))
      {
        mn.instructions.set(n2, InsnNode(ICONST_2));
        return true;
      }
    }
  }
}
tweak("add", "WorldGeneratorBonusChest", BOTH, "a(Laab;Ljava/util/Random;III)Z", [0xC02B2446, 0xB7FE3FD8], "(1/3) Fix generated chests' collision", fixNewGenChests);
tweak("adu", "WorldGenDungeons", BOTH, "a(Laab;Ljava/util/Random;III)Z", 0x565B870A, "(2/3) Fix generated chests' collision", fixNewGenChests);
tweak("agw", "StructureComponent", BOTH, "a(Laab;Laek;Ljava/util/Random;III[Llp;I)Z", 0xB59E1064, "(3/3) Fix generated chests' collision", fixNewGenChests);

// =======================================================================
// Fix mods! Now with this mod you can fix mods for the mod for Minecraft.
// =======================================================================
    
tweak("CraftGuide_Vanilla", null, CLIENT, "checkKeybind()V", 0x226D2A8D, "Making CraftGuide work in inventory screens too",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("ava") && n.name.equals("e") && n.desc.equals("Z"))
    {
      mn.instructions.insert(n, toInsnList(
        [
          FieldInsnNode(GETFIELD, "ava", "d", "I"),
          MethodInsnNode(INVOKESTATIC, "org/lwjgl/input/Keyboard", "isKeyDown", "(I)Z"),
        ]
      ));
      mn.instructions.remove(n);
      return true;
    }
  }
});
tweak("uristqwerty/CraftGuide/client/ui/GuiRenderer", null, CLIENT, "drawItemStack(Lwm;IIZ)V", 0x61225517, "Stopping CraftGuide visible compass/clock exploit",
function(mn)
{
  return replaceAllMethodCalls(mn,
    [INVOKEVIRTUAL, "bhi", "b", "(Lawv;Lbge;Lwm;II)V"],
    [INVOKESTATIC, "GPEBTWTweakProxyClient", "safeRenderItemAndEffectIntoGUI", "(Lbhi;Lawv;Lbge;Lwm;II)V"]);
});
if (isBTWVersionOrNewer("4.AAAAAAAAAAHHHH"))
{
  tweak("uristqwerty/CraftGuide/recipes/BTWRecipes", null, CLIENT, "generateRecipes(Luristqwerty/CraftGuide/api/RecipeGenerator;)V", 0xC06E9E3D, "(1/2) Fixing CraftGuide compatibility with BTW 4.AAAAAAAAAAHHHH+",
  function(mn)
  {
    return replaceFirstString(mn, "fcSawDust", "fcItemSawDust");
  });
  tweak("uristqwerty/CraftGuide/recipes/BTWRecipes", null, CLIENT, "addHopperRecipes(Luristqwerty/CraftGuide/api/RecipeGenerator;Lwm;)V", 0x136F3F6C, "(2/2) Fixing CraftGuide compatibility with BTW 4.AAAAAAAAAAHHHH+",
  function(mn)
  {
    return replaceFirstString(mn, "fcWicker", "fcItemWickerPane");
  });
  tweak("uristqwerty/CraftGuide/recipes/BTWRecipes", null, CLIENT, "addKilnRecipe(Luristqwerty/CraftGuide/api/RecipeGenerator;Luristqwerty/CraftGuide/api/RecipeTemplate;Lwm;Lapa;)V", 0xF48A3C24, "Prevent CraftGuide from crashing from introspecting kiln recipes",
  function(mn)
  {
    if (isBTWVersionOrNewer("4.8942"))
    {
      if (!replaceFirstString(mn, "fcItemBrimstone", "fcItemEnderSlag")) return false;
    }
    var i;
    var label_end;
    for (i = mn.instructions.size() - 2; i >= 0; i--)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.LabelNode"))
      {
        label_end = n;
        break;
      }
    }
    for (i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && (n.cst.toString() == "m_iItemIndexDroppedWhenCookedByKiln"))
      {
        var n2 = mn.instructions.get(i + 4);
        if (isInstance(n2, "org.objectweb.asm.tree.VarInsnNode") && n2.opcode == ISTORE)
        {
          mn.instructions.insert(n2, toInsnList(
            [
              IntInsnNode(ILOAD, n2["var"]),
              InsnNode(ICONST_M1),
              JumpInsnNode(IF_ICMPEQ, label_end),
            ]
          ));
          return true;
        }
      }
    }
  });
}
// Fix Deco add-on
tweak("Ginger", null, BOTH, "MakeBlocks()V", 0x7B7F833B, "Fixing Deco add-on calling an outdated beacon method name",
function(mn)
{
  if (!isBTWVersionOrNewer("4.99999A0E")) return;
  // Since Deco doesn't provide a version string, have to rely on checksum only
  if (calcMethodChecksum(mn) != 0x7B7F833B)
  {
    log("Different Deco add-on version detected, skipping the fix.");
    return true;
  }
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.name.equals("SetEffectByBlockType"))
    {
      n.name = "AddBeaconEffect";
      return true;
    }
  }
});
tweak("Ginger$FCItemDye_ColorPlus", null, CLIENT, "a(Lly;)V", 0x66B909E1, "Fixing Deco add-on using wrong dye texture name",
function(mn)
{
  // Since Deco doesn't provide a version string, have to rely on checksum only
  if (calcMethodChecksum(mn) != 0x66B909E1)
  {
    log("Different Deco add-on version detected, skipping the fix.");
    return true;
  }
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && (n.cst.toString() == "ginger_dyepowder_"))
    {
      n.cst = String("ginger_dyePowder_");
      return true;
    }
  }
});
tweak("Ginger$Util", null, BOTH, "CheatBlockIDs()V", 0x35CE5784, "Fixing Deco add-on extending block IDs of FCTileEntityBeacon",
function(mn)
{
  // Since Deco doesn't provide a version string, have to rely on checksum only
  if (calcMethodChecksum(mn) != 0x35CE5784)
  {
    log("Different Deco add-on version detected, skipping the fix.");
    return true;
  }
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.VarInsnNode") && (n.opcode == ASTORE) && (n["var"] == 7))
    {
      n = n.getPrevious();
      mn.instructions.set(n, TypeInsnNode(ANEWARRAY, "java/util/ArrayList"));
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FrameNode"))
    {
      mn.instructions.set(n,
        FrameNode(F_FULL, 11, [INTEGER, "[Z", "[Lka;", "[I", "[I", "[Ljava/lang/reflect/Field;", "java/lang/reflect/Field", "java/lang/reflect/Field", "[Ljava/util/ArrayList;", "[I", INTEGER], 0, [])
      );
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.opcode == ICONST_0))
    {
      var n2 = n.getNext();
      mn.instructions.insert(n2, toInsnList(
        [
          TypeInsnNode(NEW, "java/util/ArrayList"),
          InsnNode(DUP),
          MethodInsnNode(INVOKESPECIAL, "java/util/ArrayList", "<init>", "()V"),
          InsnNode(AASTORE),
        ]
      ));
      mn.instructions.remove(n);
      mn.instructions.remove(n2);
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.VarInsnNode") && (n.opcode == ALOAD) && (n["var"] == 6))
    {
      var n2 = n.getNext();
      var n3 = n2.getNext();
      var n4 = n3.getNext();
      mn.instructions.remove(n);
      mn.instructions.remove(n2);
      mn.instructions.remove(n3);
      mn.instructions.remove(n4);
      changes++;
      break;
    }
  }
  return changes == 4;
});
