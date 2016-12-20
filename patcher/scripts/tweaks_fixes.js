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
tweak("rf", "EntityBoat", BOTH, "l_()V", 0x8C1045A2, "Making boat safe from falling damage bug",
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
tweak("sf", "EntitySkeleton", BOTH, "c()V", 0x30572525, "Fixing mob not burning on slabs",
function(mn)
{
  return fixMobToBurnOnSlabs(mn);
});
tweak("sj", "EntityZombie", BOTH, "c()V", 0x4F1922DE, "Fixing mob not burning on slabs",
function(mn)
{
  return fixMobToBurnOnSlabs(mn);
});
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
if (isBTWVersionOrNewer("4.A2 Timing Rodent"))
{
  tweak("wi", "ItemAxe", BOTH, "getStrVsBlock(Lwm;Laab;Lapa;III)F", 0xF8E30EFB, "(1/3) Making axe check for tree stump block ID rather than block", fixAxeCheckingForStump);
  tweak("wi", "ItemAxe", BOTH, "canHarvestBlock(Laab;Lapa;III)Z", 0xB5DB0C08, "(2/3) Making axe check for tree stump block ID rather than block", fixAxeCheckingForStump);
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
tweak("rh", "EntityItem", BOTH, "b_(Lsq;)V", 0x780F22BB, "(2/4) Making achievements achievable",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
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
        return true;
      }
      return;
    }
  }
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
tweak("ok", "EntityAIFollowOwner", BOTH, "c()V", 0x2E4906C6, "Preventing wolves from teleporting to player on growing up",
function(mn)
{
  return CodeInserter(
    CustomFinder(function(n)
    {
      return isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("ok") && n.name.equals("h") && n.desc.equals("I");
    }),
    [
      InsnNode(POP),
      IntInsnNode(BIPUSH, 10),
    ],
    INSERT_BEFORE
  ).process(mn);
});

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
