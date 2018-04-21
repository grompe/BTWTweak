add("aoo", "BlockSnowBlock", BOTH, "Adding BTWTweak init hook in <clinit>()V",
function(cn)
{
  var mn = MethodNode(ACC_STATIC, "<clinit>", "()V", null, null);
  mn.instructions.add(toInsnList(
    [
      TypeInsnNode(NEW, "GPEBTWTweak"),
      InsnNode(DUP),
      MethodInsnNode(INVOKESPECIAL, "GPEBTWTweak", "<init>", "()V"),
      InsnNode(POP),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
});
tweak("FCBetterThanWolves", null, BOTH, "ServerPlayerConnectionInitialized(Ljh;Ljc;)V", CHECKSUM_IGNORE, "Adding BTWTweak to server announcement on connecting",
function(mn)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && (
        (n.cst.toString() == " connected to Better Than Wolves server V") ||
        (n.cst.toString() == "BTW V")
      ))
    {
      n2 = mn.instructions.get(i + 3);
      mn.instructions.insert(n2, toInsnList(
        [
          LdcInsnNode(" + BTWTweak v"),
          MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
          FieldInsnNode(GETSTATIC, "GPEBTWTweak", "tweakVersion", "Ljava/lang/String;"),
          MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
        ]
      ));
      changes++;
      if (changes == 2) return true;
    }
  }
});
// className, deobfName, side, method, checksums, description
tweak("net/minecraft/client/Minecraft", null, CLIENT, "main([Ljava/lang/String;)V", 0x4F527386, "Adding app icons",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && (n.cst.toString() == "Minecraft"))
    {
      var v = n.getPrevious();
      if (isInstance(v, "org.objectweb.asm.tree.VarInsnNode") && v.opcode == ALOAD)
      {
        mn.instructions.insert(n.getNext(), toInsnList(
          [
            VarInsnNode(ALOAD, v["var"]),
            MethodInsnNode(INVOKESTATIC, "GPEBTWTweakProxyClient", "setAppIcon", "(Ljava/awt/Frame;)V"),
          ]
        ));
        return true;
      }
      break;
    }
  }
});
tweak("net/minecraft/client/Minecraft", null, CLIENT, "a()V", [0xA79A9DCF, 0x5E5FA51F, 0xD413A5A5, 0x3267ACF5], "Adding readyForInput hook",
function(mn)
{
  for (var i = mn.instructions.size() - 1; i >= 0; i--)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == RETURN))
    {
      mn.instructions.insertBefore(n, MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "readyForInput", "()V"));
      return true;
    }
  }
});
tweak("net/minecraft/client/Minecraft", null, CLIENT, "l()V", 0x6F5697A8, "Adding keyboard hook",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("net/minecraft/client/Minecraft") && n.name.equals("j"))
    {
      while (n.getOpcode() != INVOKESTATIC) n = n.getPrevious();
      mn.instructions.insertBefore(n, toInsnList(
        [
          MethodInsnNode(INVOKESTATIC, "org/lwjgl/input/Keyboard", "getEventKey", "()I"),
          MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "onKeyPress", "(I)V"),
        ]
      ));
      return true;
    }
  }
});
tweak("acj", "AnvilChunkLoader", BOTH, "a(Laab;IILbs;)Labw;", 0x44552D12, "Inserting onLoadChunk() hook",
function(mn)
{
  return CodeInserter(
    MethodInsnFinder("acj", +2),
    [
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ALOAD, 5),
      MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "onLoadChunk", "(Laab;Labw;)V"),
    ]
  ).process(mn);
});
tweak("acj", "AnvilChunkLoader", BOTH, "a(Laab;Labw;)V", 0xA7460B07, "Inserting onSaveChunk() hook",
function(mn)
{
  return CodeInserter(
    MethodInsnFinder("acj"),
    [
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ALOAD, 2),
      MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "onSaveChunk", "(Laab;Labw;)V"),
    ]
  ).process(mn);
});
tweak("ajt", "SaveHandler", BOTH, "LoadModSpecificData(Laab;)V", 0xB5D20BBD, "Inserting loadWorldData() hook",
function(mn)
{
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 1),
      MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "loadWorldData", "(Laab;)V"),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("ajt", "SaveHandler", BOTH, "SaveModSpecificData(Laab;)V", 0x4F7810AB, "Inserting saveWorldData() hook",
function(mn)
{
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 1),
      MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "saveWorldData", "(Laab;)V"),
    ],
    INSERT_BEFORE
  ).process(mn);
});
if (isBTWVersionOrNewer("4.89666"))
{
  tweak("aqw", "TileEntityPiston", BOTH, "IsPackableItem(Lwm;)Z", 0x5BD024B, "Hooked piston's IsPackableItem()",
  function(mn)
  {
    mn.instructions.clear();
    var label = LabelNode();
    mn.instructions.add(toInsnList(
      [
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "isPistonPackable", "(Lwm;)Z"),
        JumpInsnNode(IFEQ, label),
        InsnNode(ICONST_1),
        InsnNode(IRETURN),
        label,
        FrameNode(F_SAME, 0, null, 0, null),
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKEVIRTUAL, "wm", "b", "()Lwk;"),
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKEVIRTUAL, "wk", "IsPistonPackable", "(Lwm;)Z"),
        InsnNode(IRETURN),
      ]
    ));
    return true;
  });
  tweak("aqw", "TileEntityPiston", BOTH, "GetItemCountToPack(Lwm;)I", 0x5BD024B, "Hooked piston's GetItemCountToPack()",
  function(mn)
  {
    mn.instructions.clear();
    var label = LabelNode();
    mn.instructions.add(toInsnList(
      [
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "isPistonPackable", "(Lwm;)Z"),
        JumpInsnNode(IFEQ, label),
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "getRequiredItemCountToPistonPack", "(Lwm;)I"),
        InsnNode(IRETURN),
        label,
        FrameNode(F_SAME, 0, null, 0, null),
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKEVIRTUAL, "wm", "b", "()Lwk;"),
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKEVIRTUAL, "wk", "GetRequiredItemCountToPistonPack", "(Lwm;)I"),
        InsnNode(IRETURN),
      ]
    ));
    return true;
  });
  tweak("aqw", "TileEntityPiston", BOTH, "CreateBlockOfTypeAtLocation(Lwm;III)V", 0x7ECF0885, "Hooked piston's CreateBlockOfTypeAtLocation()",
  function(mn)
  {
    mn.instructions.clear();
    var label0 = LabelNode();
    var label1 = LabelNode();
    mn.instructions.add(toInsnList(
      [
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "isPistonPackable", "(Lwm;)Z"),
        JumpInsnNode(IFEQ, label0),
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "getResultingBlockIDOnPistonPack", "(Lwm;)I"),
        VarInsnNode(ISTORE, 5),
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "getResultingBlockMetadataOnPistonPack", "(Lwm;)I"),
        VarInsnNode(ISTORE, 6),
        JumpInsnNode(GOTO, label1),
        label0,
        FrameNode(F_SAME, 0, null, 0, null),
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKEVIRTUAL, "wm", "b", "()Lwk;"),
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKEVIRTUAL, "wk", "GetResultingBlockIDOnPistonPack", "(Lwm;)I"),
        VarInsnNode(ISTORE, 5),
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKEVIRTUAL, "wm", "b", "()Lwk;"),
        VarInsnNode(ALOAD, 1),
        MethodInsnNode(INVOKEVIRTUAL, "wk", "GetResultingBlockMetadataOnPistonPack", "(Lwm;)I"),
        VarInsnNode(ISTORE, 6),
        label1,
        FrameNode(F_APPEND, 2, [INTEGER, INTEGER], 0, null),
        VarInsnNode(ALOAD, 0),
        FieldInsnNode(GETFIELD, "aqw", "k", "Laab;"),
        VarInsnNode(ILOAD, 2),
        VarInsnNode(ILOAD, 3),
        VarInsnNode(ILOAD, 4),
        VarInsnNode(ILOAD, 5),
        VarInsnNode(ILOAD, 6),
        MethodInsnNode(INVOKEVIRTUAL, "aab", "setBlockAndMetadataWithNotify", "(IIIII)Z"),
        InsnNode(POP),
        VarInsnNode(ALOAD, 0),
        FieldInsnNode(GETFIELD, "aqw", "k", "Laab;"),
        IntInsnNode(SIPUSH, 2236),
        VarInsnNode(ILOAD, 2),
        VarInsnNode(ILOAD, 3),
        VarInsnNode(ILOAD, 4),
        VarInsnNode(ILOAD, 5),
        MethodInsnNode(INVOKEVIRTUAL, "aab", "e", "(IIIII)V"),
        InsnNode(RETURN),
      ]
    ));
    return true;
  });
}
tweak("bdr", "PlayerControllerMP", CLIENT, "a(Lsq;Laab;Lwm;IIIILarc;)Z", 0x5A6E2C5E, "Hooking block placing decision",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("xn") && n.name.equals("a") && n.desc.equals("(Laab;IIIILsq;Lwm;)Z"))
    {
      mn.instructions.insert(n, toInsnList(
        [
          VarInsnNode(FLOAD, 9),
          VarInsnNode(FLOAD, 10),
          VarInsnNode(FLOAD, 11),
          MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "canPlaceItemBlock", "(Lxn;Laab;IIIILsq;Lwm;FFF)Z"),
        ]
      ));
      mn.instructions.remove(n);
      return true;
    }
  }
});
tweak('bdv', "EntityClientPlayerMP", CLIENT, "d(Ljava/lang/String;)V", 0x10810419, "Adding chat message check hook",
function(mn)
{
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 1),
      MethodInsnNode(INVOKESTATIC, "GPEBTWTweakProxyClient", "sendingChatMessage", "(Ljava/lang/String;)V"),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("bfq", "EntityRenderer", CLIENT, "a(FJ)V", [0x13FCF28A, 0x48CAF8B5], "Adding microblock preview hook",
function(mn)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("bfy") && n.name.equals("b"))
    {
      mn.instructions.insert(n, toInsnList(
        [
          VarInsnNode(FLOAD, 1),
          MethodInsnNode(INVOKESTATIC, "GPEBTWTweakProxyClient", "drawMicroblockTarget", "(F)V"),
        ]
      ));
      changes += 1;
    }
  }
  return changes == 2;
});
tweak("FCBlockSaw", null, BOTH, "HandleSawingExceptionCases(Laab;IIIIIIILjava/util/Random;)Z", [0xB82C6297, 0x73165BA4], "Inserting onBlockSawed() hook",
function(mn)
{
  var changes = 0;
  var i;
  var l_6;
  var l_my23 = LabelNode();
  var l26 = LabelNode();
  var l27 = LabelNode();
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.name.equals("ao"))
    {
      for (i += 1; i < mn.instructions.size(); i++)
      {
        n = mn.instructions.get(i);
        if (isInstance(n, "org.objectweb.asm.tree.JumpInsnNode"))
        {
          l_6 = n.label;
          n.label = l_my23;
          changes++;
          if (changes == 2) break;
        }
      }
      break;
    }
  }
  i = mn.instructions.indexOf(l_6);
  mn.instructions.insertBefore(l_6, JumpInsnNode(GOTO, l_6));
  mn.instructions.set(l_6, l_my23);
  var frame = mn.instructions.get(i + 3); // fakeinst
  if (isInstance(frame, "org.objectweb.asm.tree.FrameNode"))
  {
    mn.instructions.insert(frame, toInsnList(
      [
        VarInsnNode(ILOAD, 10),
        FieldInsnNode(GETSTATIC, "apa", "aO", "Lapa;"),
        FieldInsnNode(GETFIELD, "apa", "cz", "I"),
        JumpInsnNode(IF_ICMPEQ, l26),
        VarInsnNode(ILOAD, 10),
        FieldInsnNode(GETSTATIC, "apa", "aQ", "Lapa;"),
        FieldInsnNode(GETFIELD, "apa", "cz", "I"),
        JumpInsnNode(IF_ICMPNE, l27),
        l26,
        FrameNode(F_SAME, 0, null, 0, null),
        InsnNode(ICONST_1),
        InsnNode(IRETURN),
        l27,
        FrameNode(F_SAME, 0, null, 0, null),
        VarInsnNode(ALOAD, 1),
        VarInsnNode(ILOAD, 2),
        VarInsnNode(ILOAD, 3),
        VarInsnNode(ILOAD, 4),
        MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "onBlockSawed", "(Laab;III)Z"),
        VarInsnNode(ISTORE, 12),
        l_6,
        FrameNode(F_SAME, 0, null, 0, null),
      ]
    ));
    changes++;
  }
  return changes == 3;
});

tweak("FCUtilsInventory", null, BOTH, "AddItemStackToChest(Lapy;Lwm;)Z", [0xBBAB1C34, 0x65011E99], "Replacing hopper to chest deposit function",
function(mn)
{
  mn.instructions.clear();
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 1),
      MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "addItemStackToChest", "(Lapy;Lwm;)Z"),
      InsnNode(IRETURN),
    ]
  ));
  return true;
});
tweak("FCUtilsInventory", null, BOTH, "AddItemStackToDoubleInventory(Llt;Llt;Lwm;)Z", CHECKSUM_IGNORE, "Make access public",
function(mn)
{
  mn.access = ACC_PUBLIC | ACC_STATIC;
  return true;
});
function constants2configHCS(mn)
{
  var changed = false;
  if (isBTWVersionOrNewer("4.A9 Pustules Lancing"))
  {
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode"))
      {
        if ((n.cst >= 1000.0) && (n.cst <= 3000.0))
        {
          var scale = n.cst / 2000.0;
          changed = true;
          mn.instructions.set(n, FieldInsnNode(GETSTATIC, "GPEBTWTweak", "hcSpawnRadius", "I"));
          mn.instructions.insert(mn.instructions.get(i), toInsnList(
            [
              InsnNode(I2D),
              LdcInsnNode(Double(scale)),
              InsnNode(DMUL),
            ]
          ));
        }
        else if (n.cst == 6250000.0) // pumpkins
        {
          changed = true;
          mn.instructions.set(n, FieldInsnNode(GETSTATIC, "GPEBTWTweak", "hcSpawnRadiusAdjPSq", "I"));
          mn.instructions.insert(mn.instructions.get(i), toInsnList(
            [
              InsnNode(I2D),
            ]
          ));
        }
      }
    }
  }
  else if (isBTWVersionOrNewer("4.A7 Squid A Swimming"))
  {
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode"))
      {
        if (n.cst == 5062500.0)
        {
          changed = true;
          mn.instructions.set(n, FieldInsnNode(GETSTATIC, "GPEBTWTweak", "hcSpawnRadiusAdjSq", "I"));
          mn.instructions.insert(mn.instructions.get(i), toInsnList(
            [
              InsnNode(I2D),
            ]
          ));
        }
        else if (n.cst == 9000000.0)
        {
          changed = true;
          mn.instructions.set(n, FieldInsnNode(GETSTATIC, "GPEBTWTweak", "hcSpawnRadiusAdj2Sq", "I"));
          mn.instructions.insert(mn.instructions.get(i), toInsnList(
            [
              InsnNode(I2D),
            ]
          ));
        }
        else if (n.cst == 6250000.0)
        {
          changed = true;
          mn.instructions.set(n, FieldInsnNode(GETSTATIC, "GPEBTWTweak", "hcSpawnRadiusAdjPSq", "I"));
          mn.instructions.insert(mn.instructions.get(i), toInsnList(
            [
              InsnNode(I2D),
            ]
          ));
        }
      }
    }
  } else {
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode"))
      {
        if (n.cst == 5062500)
        {
          changed = true;
          mn.instructions.set(n, FieldInsnNode(GETSTATIC, "GPEBTWTweak", "hcSpawnRadiusAdjSq", "I"));
        }
        else if ((n.cst == 7562500) || (n.cst == 9000000))
        {
          changed = true;
          mn.instructions.set(n, FieldInsnNode(GETSTATIC, "GPEBTWTweak", "hcSpawnRadiusAdj2Sq", "I"));
        }
      }
    }
  }
  return changed;
}
if (isBTWVersionOrNewer("4.A9 Pustules Lancing"))
{
  tweak("FCUtilsHardcoreSpawn", null, BOTH, "GetPlayerSpawnRadius()D", 0x9630308, "(1/2) Making Hardcore Spawn radius configurable", constants2configHCS);
  tweak("FCUtilsHardcoreSpawn", null, BOTH, "GetPlayerSpawnExclusionRadius()D", 0x9630308, "(2/2) Making Hardcore Spawn radius configurable", constants2configHCS);
  tweak("FCUtilsHardcoreSpawn", null, BOTH, "GetAbandonedVillageRadius()D", 0x3F901E5, "(1/2) Making configurable Hardcore Spawn radius affect villages", constants2configHCS);
  tweak("FCUtilsHardcoreSpawn", null, BOTH, "GetPartiallyAbandonedVillageRadius()D", 0x3F901E5, "(2/2) Making configurable Hardcore Spawn radius affect villages", constants2configHCS);
  tweak("FCUtilsHardcoreSpawn", null, BOTH, "GetLootedTempleRadius()D", 0x3F901E5, "Making configurable Hardcore Spawn radius affect temples", constants2configHCS);
} else {
  tweak("gu", "ServerConfigurationManager", BOTH, "AssignNewHardcoreSpawnLocation(Laab;Ljc;)Z", [0x21D136B5, 0x8CE23774, 0xE88A3F80], "Making Hardcore Spawn radius configurable",
  function(mn)
  {
    return CodeInserter(
      InsnFinder(DMUL),
      [
        InsnNode(POP2),
        FieldInsnNode(GETSTATIC, "GPEBTWTweak", "hcSpawnRadius", "I"),
        InsnNode(I2D),
      ],
      INSERT_BEFORE
    ).process(mn);
  });
  tweak("afq", "ComponentScatteredFeatureDesertPyramid", BOTH, "a(Laab;Ljava/util/Random;Laek;)Z", [0x5E6D1DDD, 0xBAE32112, 0x99E322D3], "Making Hardcore Spawn radius affect desert temples", constants2configHCS);
  tweak("afr", "ComponentScatteredFeatureJunglePyramid", BOTH, "CheckIfLooted(Laab;Laek;)Z", [0xE0440AE6, 0x10E90CA7], "Making Hardcore Spawn radius affect jungle temples", constants2configHCS);
  tweak("ahm", "ComponentVillageStartPiece", BOTH, "InitializeModSpecificData(Laab;)V", [0x87D022CC, 0x3A242522], "Making Hardcore Spawn radius affect villages", constants2configHCS);
}
if (isBTWVersionOrNewer("4.A7 Squid A Swimming"))
{
  tweak("adx", "WorldGenPumpkin", BOTH, "CheckIfFresh(Laab;II)Z", 0xC0270A9E, "Making Hardcore Spawn radius affect pumpkins", constants2configHCS);
}

tweak("jc", "EntityPlayerMP", BOTH, "DropMysteryMeat(I)V", [0x7CBE1553, 0x5B1D190E], "Adding player hardcore death hook",
function(mn)
{
  return CodeInserter(
    CustomFinder(function(n)
    {
      return isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.name.equals("fcItemRawMysteryMeat");
    }),
    [
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "onPlayerHardcoreDeath", "(Lsq;)V"),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("jh", "NetServerHandler", BOTH, "a(Ldk;)V", 0x69CDA531, "Adding client->server custom packets hook",
function(mn)
{
  for (var i = mn.instructions.size() - 1; i >= 0; i--)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == RETURN))
    {
      mn.instructions.insertBefore(n, toInsnList(
        [
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "jh", "c", "Ljc;"),
          VarInsnNode(ALOAD, 1),
          MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "serverCustomPacketReceived", "(Ljc;Ldk;)Z"),
          InsnNode(POP),
        ]
      ));
      return true;
    }
  }
});
tweak("mp", "Entity", BOTH, "C()V", 0x3DAD20F8, "Adding entity->block collision hook",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner == "apa")
    {
      mn.instructions.insertBefore(n, toInsnList(
        [
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "mp", "q", "Laab;"),
          VarInsnNode(ILOAD, 7),
          VarInsnNode(ILOAD, 8),
          VarInsnNode(ILOAD, 9),
          VarInsnNode(ALOAD, 0),
          MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "onEntityCollidedWithBlock", "(Laab;IIILmp;)V"),
        ]
      ));
      return true;
    }
  }
});
tweak("rh", "EntityItem", BOTH, "C()V", 0x3EF520FC, "Adding item->block collision hook",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner == "apa")
    {
      mn.instructions.insertBefore(n, toInsnList(
        [
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "rh", "q", "Laab;"),
          VarInsnNode(ILOAD, 7),
          VarInsnNode(ILOAD, 8),
          VarInsnNode(ILOAD, 9),
          VarInsnNode(ALOAD, 0),
          MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "onEntityCollidedWithBlock", "(Laab;IIILmp;)V"),
        ]
      ));
      return true;
    }
  }
});
add("ng", "EntityLiving", BOTH, "Enabling living entities to be set persistent",
function(cn)
{
  var mn = MethodNode(ACC_PUBLIC, "setPersistent", "()V", null, null);
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ALOAD, 0),
      InsnNode(ICONST_1),
      FieldInsnNode(PUTFIELD, "ng", "bW", "Z"),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
});
tweak("bge", "RenderEngine", CLIENT, "c()V", [0x329B3AF8, 0x48303D3B], "Adding textures refreshed hook",
function(mn)
{
  for (var i = mn.instructions.size() - 1; i >= 0; i--)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == RETURN))
    {
      mn.instructions.insertBefore(n, MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "texturesRefreshed", "()V"));
      return true;
    }
  }
});
