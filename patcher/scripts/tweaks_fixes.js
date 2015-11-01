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

// =======================================================================
// Fix mods! Now with this mod you can fix mods for the mod for Minecraft.
// =======================================================================
    
tweak("CraftGuide_Vanilla", "CraftGuide_Vanilla", CLIENT, "checkKeybind()V", 0x226D2A8D, "Making CraftGuide work in inventory screens too",
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
tweak("uristqwerty/CraftGuide/client/ui/GuiRenderer", "GuiRenderer", CLIENT, "drawItemStack(Lwm;IIZ)V", 0x61225517, "Stopping CraftGuide visible compass/clock exploit",
function(mn)
{
  return replaceAllMethodCalls(mn,
    [INVOKEVIRTUAL, "bhi", "b", "(Lawv;Lbge;Lwm;II)V"],
    [INVOKESTATIC, "GPEBTWTweakProxyClient", "safeRenderItemAndEffectIntoGUI", "(Lbhi;Lawv;Lbge;Lwm;II)V"]);
});

// Fix Deco add-on
tweak("Ginger", "Ginger", BOTH, "MakeBlocks()V", 0x7B7F833B, "Fixing Deco add-on calling an outdated beacon method name",
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
tweak("Ginger$FCItemDye_ColorPlus", "Ginger$FCItemDye_ColorPlus", CLIENT, "a(Lly;)V", 0x66B909E1, "Fixing Deco add-on using wrong dye texture name",
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
tweak("Ginger$Util", "Ginger$Util", BOTH, "CheatBlockIDs()V", 0x35CE5784, "Fixing Deco add-on extending block IDs of FCTileEntityBeacon",
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
