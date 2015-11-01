function addRenderBlockDamageEffectMethod(cn)
{
  var mn = MethodNode(ACC_PUBLIC, "RenderBlockDamageEffect", "(Lbgf;IIILlx;)V", null, null);
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ALOAD, 5),
      MethodInsnNode(INVOKEVIRTUAL, "bgf", "a", "(Llx;)V"),
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKEVIRTUAL, "bgf", "a", "(Lapa;)V"),
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 2),
      VarInsnNode(ILOAD, 3),
      VarInsnNode(ILOAD, 4),
      MethodInsnNode(INVOKEVIRTUAL, "bgf", "p", "(Lapa;III)Z"),
      InsnNode(POP),
      VarInsnNode(ALOAD, 1),
      MethodInsnNode(INVOKEVIRTUAL, "bgf", "a", "()V"),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
}

// className, deobfName, side, method, checksums, description
tweak("aaq", "ChunkCache", CLIENT, "a(Laam;III)I", 0xA85525A4, "Fixing upside-down slabs brightness",
function(mn)
{
  var count = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.opcode == IRETURN))
    {
      count++;
      if (count == 2)
      {
        n = n.getPrevious();
        if (isInstance(n, "org.objectweb.asm.tree.VarInsnNode") && (n.opcode == ILOAD))
        {
          var label = LabelNode();
          mn.instructions.insertBefore(n, toInsnList(
            [
              VarInsnNode(ALOAD, 0),
              VarInsnNode(ALOAD, 1),
              VarInsnNode(ILOAD, 2),
              VarInsnNode(ILOAD, 3),
              InsnNode(ICONST_1),
              InsnNode(ISUB),
              VarInsnNode(ILOAD, 4),
              MethodInsnNode(INVOKEVIRTUAL, "aaq", "b", "(Laam;III)I"),
              VarInsnNode(ISTORE, 10),
              VarInsnNode(ILOAD, 10),
              VarInsnNode(ILOAD, 5),
              JumpInsnNode(IF_ICMPLE, label),
              VarInsnNode(ILOAD, 10),
              VarInsnNode(ISTORE, 5),
              label,
              FrameNode(F_APPEND, 1, [INTEGER], 0, null),
            ]
          ));
          return true;
        }
      }
    }
  }
});
tweak("aww", "GuiIngame", CLIENT, "<init>(Lnet/minecraft/client/Minecraft;)V", 0x23BA0E5C, "Adding new vars init to ingame GUI",
function(mn)
{
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 0),
      InsnNode(ICONST_0),
      FieldInsnNode(PUTFIELD, "aww", "gloomCounter", "I"),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("aww", "GuiIngame", CLIENT, "a(FZII)V", 0x995D1671, "Inserting checkForGloomRender()",
function(mn)
{
  return CodeInserter(
    MethodInsnFinder("so", +1),
    [
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 6),
      VarInsnNode(ILOAD, 7),
      MethodInsnNode(INVOKESPECIAL, "aww", "checkForGloomRender", "(II)V"),
    ]
  ).process(mn);
});
add("aww", "GuiIngame", CLIENT, "Adding gloom render to ingame GUI",
function(cn)
{
  cn.fields.add(FieldNode(ACC_PRIVATE, "gloomCounter", "I", null, null));

  var mn = MethodNode(ACC_PRIVATE, "checkForGloomRender", "(II)V", null, null);
  var l0 = LabelNode();
  var l1 = LabelNode();
  var l2 = LabelNode();
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "o", "Z"),
      JumpInsnNode(IFNE, l0),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      MethodInsnNode(INVOKEVIRTUAL, "bdv", "GetGloomLevel", "()I"),
      VarInsnNode(ISTORE, 3),
      VarInsnNode(ILOAD, 3),
      JumpInsnNode(IFLE, l1),
      VarInsnNode(ALOAD, 0),
      InsnNode(DUP),
      FieldInsnNode(GETFIELD, "aww", "gloomCounter", "I"),
      InsnNode(ICONST_1),
      InsnNode(IADD),
      FieldInsnNode(PUTFIELD, "aww", "gloomCounter", "I"),
      l1,
      FrameNode(F_APPEND, 1, [INTEGER], 0, null),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "gloomCounter", "I"),
      JumpInsnNode(IFLE, l0),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "z", "Lavy;"),
      FieldInsnNode(GETFIELD, "avy", "aa", "I"),
      JumpInsnNode(IFNE, l2),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 1),
      VarInsnNode(ILOAD, 2),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "gloomCounter", "I"),
      MethodInsnNode(INVOKESPECIAL, "aww", "renderGloomBlur", "(III)V"),
      l2,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ILOAD, 3),
      JumpInsnNode(IFGT, l0),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "gloomCounter", "I"),
      InsnNode(ICONST_2),
      InsnNode(ISUB),
      IntInsnNode(SIPUSH, 140),
      MethodInsnNode(INVOKESTATIC, "java/lang/Math", "min", "(II)I"),
      FieldInsnNode(PUTFIELD, "aww", "gloomCounter", "I"),
      l0,
      FrameNode(F_CHOP, 1, null, 0, null),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
  mn = MethodNode(ACC_PRIVATE, "renderGloomBlur", "(III)V", null, null);
  var l3 = LabelNode();
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ILOAD, 3),
      InsnNode(I2F),
      LdcInsnNode(Float("100.0")),
      InsnNode(FDIV),
      VarInsnNode(FSTORE, 4),
      VarInsnNode(FLOAD, 4),
      InsnNode(FCONST_1),
      InsnNode(FCMPL),
      JumpInsnNode(IFLE, l3),
      InsnNode(FCONST_1),
      VarInsnNode(FSTORE, 4),
      l3,
      FrameNode(F_APPEND, 1, [FLOAT], 0, null),
      IntInsnNode(SIPUSH, 2929),
      MethodInsnNode(INVOKESTATIC, "org/lwjgl/opengl/GL11", "glDisable", "(I)V"),
      InsnNode(ICONST_0),
      MethodInsnNode(INVOKESTATIC, "org/lwjgl/opengl/GL11", "glDepthMask", "(Z)V"),
      IntInsnNode(SIPUSH, 770),
      IntInsnNode(SIPUSH, 771),
      MethodInsnNode(INVOKESTATIC, "org/lwjgl/opengl/GL11", "glBlendFunc", "(II)V"),
      InsnNode(FCONST_1),
      InsnNode(FCONST_1),
      InsnNode(FCONST_1),
      VarInsnNode(FLOAD, 4),
      MethodInsnNode(INVOKESTATIC, "org/lwjgl/opengl/GL11", "glColor4f", "(FFFF)V"),
      IntInsnNode(SIPUSH, 3008),
      MethodInsnNode(INVOKESTATIC, "org/lwjgl/opengl/GL11", "glDisable", "(I)V"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "p", "Lbge;"),
      LdcInsnNode("%blur%/btwmodtex/gloomblur.png"),
      MethodInsnNode(INVOKEVIRTUAL, "bge", "b", "(Ljava/lang/String;)V"),
      FieldInsnNode(GETSTATIC, "bgd", "a", "Lbgd;"),
      VarInsnNode(ASTORE, 5),
      VarInsnNode(ALOAD, 5),
      MethodInsnNode(INVOKEVIRTUAL, "bgd", "b", "()V"),
      VarInsnNode(ALOAD, 5),
      InsnNode(DCONST_0),
      VarInsnNode(ILOAD, 2),
      InsnNode(I2D),
      LdcInsnNode(Double("-90.0")),
      InsnNode(DCONST_0),
      InsnNode(DCONST_1),
      MethodInsnNode(INVOKEVIRTUAL, "bgd", "a", "(DDDDD)V"),
      VarInsnNode(ALOAD, 5),
      VarInsnNode(ILOAD, 1),
      InsnNode(I2D),
      VarInsnNode(ILOAD, 2),
      InsnNode(I2D),
      LdcInsnNode(Double("-90.0")),
      InsnNode(DCONST_1),
      InsnNode(DCONST_1),
      MethodInsnNode(INVOKEVIRTUAL, "bgd", "a", "(DDDDD)V"),
      VarInsnNode(ALOAD, 5),
      VarInsnNode(ILOAD, 1),
      InsnNode(I2D),
      InsnNode(DCONST_0),
      LdcInsnNode(Double("-90.0")),
      InsnNode(DCONST_1),
      InsnNode(DCONST_0),
      MethodInsnNode(INVOKEVIRTUAL, "bgd", "a", "(DDDDD)V"),
      VarInsnNode(ALOAD, 5),
      InsnNode(DCONST_0),
      InsnNode(DCONST_0),
      LdcInsnNode(Double("-90.0")),
      InsnNode(DCONST_0),
      InsnNode(DCONST_0),
      MethodInsnNode(INVOKEVIRTUAL, "bgd", "a", "(DDDDD)V"),
      VarInsnNode(ALOAD, 5),
      MethodInsnNode(INVOKEVIRTUAL, "bgd", "a", "()I"),
      InsnNode(POP),
      InsnNode(ICONST_1),
      MethodInsnNode(INVOKESTATIC, "org/lwjgl/opengl/GL11", "glDepthMask", "(Z)V"),
      IntInsnNode(SIPUSH, 2929),
      MethodInsnNode(INVOKESTATIC, "org/lwjgl/opengl/GL11", "glEnable", "(I)V"),
      IntInsnNode(SIPUSH, 3008),
      MethodInsnNode(INVOKESTATIC, "org/lwjgl/opengl/GL11", "glEnable", "(I)V"),
      InsnNode(FCONST_1),
      InsnNode(FCONST_1),
      InsnNode(FCONST_1),
      InsnNode(FCONST_1),
      MethodInsnNode(INVOKESTATIC, "org/lwjgl/opengl/GL11", "glColor4f", "(FFFF)V"),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
});
tweak("bbw", "ModelCreeper", CLIENT, "<init>(F)V", 0x75A3347C, "Fixing floating creeper model",
function(mn)
{
  return CodeInserter(
    InsnFinder(ICONST_4),
    [
      InsnNode(POP),
      IntInsnNode(BIPUSH, 6),
    ]
  ).process(mn);
});
tweak("bfq", "EntityRenderer", CLIENT, "a(FI)V", 0xBD92524D, "Limiting minimum fog distance in EntityRenderer",
function(mn)
{
  return CodeInserter(
    InsnFinder(ISHR),
    [
      FieldInsnNode(GETSTATIC, "GPEBTWTweak", "minFogDistance", "I"),
      MethodInsnNode(INVOKESTATIC, "java/lang/Math", "max", "(II)I"),
    ]
  ).process(mn);
});
tweak("bfq", "EntityRenderer", CLIENT, "a(FJ)V", [0x13FCF28A, 0x48CAF8B5], "Ensuring sky is visible",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("avy") && n.name.equals("e"))
    {
      n = n.getNext();
      if (n.getOpcode() == ICONST_2)
      {
        mn.instructions.set(n, InsnNode(ICONST_4));
        return true;
      }
    }
  }
});
tweak("bgf", "RenderBlocks", CLIENT, "c(Lapa;DDDLlx;)V", 0x161179F6, "Fixing north (-z) face rendering texture alignment",
function(mn)
{
  var changes = 0;
  var i;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("bgf") && n.name.equals("g"))
    {
      n.name = "h";
      mn.instructions.insertBefore(n.getPrevious(), toInsnList([LdcInsnNode(Double("16.0"))]));
      mn.instructions.insert(n.getNext().getNext(), toInsnList([InsnNode(DSUB)]));
      changes++;
      break;
    }
  }
  for (i += 3; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("bgf") && n.name.equals("h"))
    {
      n.name = "g";
      mn.instructions.insertBefore(n.getPrevious(), toInsnList([LdcInsnNode(Double("16.0"))]));
      mn.instructions.insert(n.getNext().getNext(), toInsnList([InsnNode(DSUB)]));
      changes++;
      break;
    }
  }
  return changes == 2;
});
tweak("bgf", "RenderBlocks", CLIENT, "f(Lapa;DDDLlx;)V", 0x161179F6, "Fixing east (+x) face rendering texture alignment",
function(mn)
{
  var changes = 0;
  var i;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("bgf") && n.name.equals("k"))
    {
      n.name = "l";
      mn.instructions.insertBefore(n.getPrevious(), toInsnList([LdcInsnNode(Double("16.0"))]));
      mn.instructions.insert(n.getNext().getNext(), toInsnList([InsnNode(DSUB)]));
      changes++;
      break;
    }
  }
  for (i += 3; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("bgf") && n.name.equals("l"))
    {
      n.name = "k";
      mn.instructions.insertBefore(n.getPrevious(), toInsnList([LdcInsnNode(Double("16.0"))]));
      mn.instructions.insert(n.getNext().getNext(), toInsnList([InsnNode(DSUB)]));
      changes++;
      break;
    }
  }
  return changes == 2;
});
add("FCBlockBed", "FCBlockBed", CLIENT, "Fixed cracks on bed",
function(cn)
{
  addRenderBlockDamageEffectMethod(cn);
});
add("FCBlockEnderChest", "FCBlockEnderChest", CLIENT, "Fixed cracks on ender chest",
function(cn)
{
  addRenderBlockDamageEffectMethod(cn);
});
add("FCBlockBeacon", "FCBlockBeacon", CLIENT, "Fixed cracks on beacon",
function(cn)
{
  addRenderBlockDamageEffectMethod(cn);
});
add("FCBlockCocoa", "FCBlockCocoa", CLIENT, "Fixed cracks on cocoa beans",
function(cn)
{
  addRenderBlockDamageEffectMethod(cn);
});
add("FCBlockSign", "FCBlockSign", CLIENT, "Fixed cracks on wall sign",
function(cn)
{
  var label = LabelNode();
  var mn = MethodNode(ACC_PUBLIC, "RenderBlockDamageEffect", "(Lbgf;IIILlx;)V", null, null);
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCBlockSign", "cz", "I"),
      IntInsnNode(BIPUSH, 68),
      JumpInsnNode(IF_ICMPEQ, label),
      InsnNode(RETURN),
      label,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ALOAD, 5),
      MethodInsnNode(INVOKEVIRTUAL, "bgf", "a", "(Llx;)V"),
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKEVIRTUAL, "bgf", "a", "(Lapa;)V"),
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 2),
      VarInsnNode(ILOAD, 3),
      VarInsnNode(ILOAD, 4),
      MethodInsnNode(INVOKEVIRTUAL, "bgf", "p", "(Lapa;III)Z"),
      InsnNode(POP),
      VarInsnNode(ALOAD, 1),
      MethodInsnNode(INVOKEVIRTUAL, "bgf", "a", "()V"),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
});
tweak("FCBlockTurntable", "FCBlockTurntable", CLIENT, "RenderBlock(Lbgf;III)Z", 0xBBB81AF0, "Using visual spin",
function(mn)
{
  var label = LabelNode();
  var result = CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ILOAD, 2),
      VarInsnNode(ILOAD, 3),
      VarInsnNode(ILOAD, 4),
      MethodInsnNode(INVOKEVIRTUAL, "FCBlockTurntable", "getVisualSpin", "(Lbgf;III)I"),
      MethodInsnNode(INVOKEVIRTUAL, "bgf", "SetUvRotateTop", "(I)V"),
    ],
    INSERT_BEFORE
  ).process(mn);
  if (!result) return;
  return CodeInserter(
    InsnFinder(POP),
    [
      VarInsnNode(ALOAD, 1),
      InsnNode(ICONST_0),
      MethodInsnNode(INVOKEVIRTUAL, "bgf", "SetUvRotateTop", "(I)V"),
    ]
  ).process(mn);
});
add("FCBlockTurntable", "FCBlockTurntable", CLIENT, "Adding visual spin function",
function(cn)
{
  var mn = MethodNode(ACC_PUBLIC, "getVisualSpin", "(Lbgf;III)I", null, null);
  var label = LabelNode();
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ALOAD, 1),
      FieldInsnNode(GETFIELD, "bgf", "a", "Laak;"),
      VarInsnNode(ILOAD, 2),
      VarInsnNode(ILOAD, 3),
      VarInsnNode(ILOAD, 4),
      MethodInsnNode(INVOKEINTERFACE, "aak", "r", "(III)Laqp;"),
      VarInsnNode(ASTORE, 5),
      VarInsnNode(ALOAD, 5),
      TypeInsnNode(INSTANCEOF, "FCTileEntityTurntable"),
      JumpInsnNode(IFEQ, label),
      VarInsnNode(ALOAD, 5),
      TypeInsnNode(CHECKCAST, "FCTileEntityTurntable"),
      FieldInsnNode(GETFIELD, "FCTileEntityTurntable", "visualSpin", "I"),
      InsnNode(IRETURN),
      label,
      FrameNode(F_APPEND, 1, ["aqp"], 0, null),
      InsnNode(ICONST_0),
      InsnNode(IRETURN),
    ]
  ));
  cn.methods.add(mn);
});
add("FCItemBlockPlanter", "FCItemBlockPlanter", CLIENT, "Adding tooltip item info",
function(cn)
{
  var mn = MethodNode(ACC_PUBLIC, "a", "(Lwm;Lsq;Ljava/util/List;Z)V", null, null);
  var label0 = LabelNode();
  var label1 = LabelNode();
  var label2 = LabelNode();
  var label3 = LabelNode();
  var label4 = LabelNode();
  var label5 = LabelNode();
  mn.instructions.add(toInsnList(
    [
      LdcInsnNode("???"),
      VarInsnNode(ASTORE, 5),
      VarInsnNode(ALOAD, 1),
      MethodInsnNode(INVOKEVIRTUAL, "wm", "k", "()I"),
      TableSwitchInsnNode(1, 9, label2, [label0, label1, label2, label2, label2, label2, label2, label3, label4]),
      label0,
      FrameNode(F_APPEND, 1, ["java/lang/String"], 0, null),
      LdcInsnNode("planter.soil"),
      VarInsnNode(ASTORE, 5),
      JumpInsnNode(GOTO, label5),
      label1,
      FrameNode(F_SAME, 0, null, 0, null),
      LdcInsnNode("planter.fertilizedSoil"),
      VarInsnNode(ASTORE, 5),
      JumpInsnNode(GOTO, label5),
      label3,
      FrameNode(F_SAME, 0, null, 0, null),
      LdcInsnNode("planter.soulsand"),
      VarInsnNode(ASTORE, 5),
      JumpInsnNode(GOTO, label5),
      label4,
      FrameNode(F_SAME, 0, null, 0, null),
      LdcInsnNode("planter.grass"),
      VarInsnNode(ASTORE, 5),
      JumpInsnNode(GOTO, label5),
      label2,
      FrameNode(F_SAME, 0, null, 0, null),
      InsnNode(RETURN),
      label5,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 3),
      VarInsnNode(ALOAD, 5),
      MethodInsnNode(INVOKESTATIC, "bo", "a", "(Ljava/lang/String;)Ljava/lang/String;"),
      MethodInsnNode(INVOKEINTERFACE, "java/util/List", "add", "(Ljava/lang/Object;)Z"),
      InsnNode(POP),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
});
add("FCItemBlockUnfiredPottery", "FCItemBlockUnfiredPottery", CLIENT, "Adding tooltip item info",
function(cn)
{
  var mn = MethodNode(ACC_PUBLIC, "a", "(Lwm;Lsq;Ljava/util/List;Z)V", null, null);
  var label0 = LabelNode();
  var label1 = LabelNode();
  var label2 = LabelNode();
  var label3 = LabelNode();
  var label4 = LabelNode();
  var label5 = LabelNode();
  var label6 = LabelNode();
  mn.instructions.add(toInsnList(
    [
      LdcInsnNode("???"),
      VarInsnNode(ASTORE, 5),
      VarInsnNode(ALOAD, 1),
      MethodInsnNode(INVOKEVIRTUAL, "wm", "k", "()I"),
      TableSwitchInsnNode(0, 4, label5, [label0, label1, label2, label3, label4]),
      label0,
      FrameNode(F_APPEND, 1, ["java/lang/String"], 0, null),
      LdcInsnNode("pottery.crucible"),
      VarInsnNode(ASTORE, 5),
      JumpInsnNode(GOTO, label6),
      label1,
      FrameNode(F_SAME, 0, null, 0, null),
      LdcInsnNode("pottery.planter"),
      VarInsnNode(ASTORE, 5),
      JumpInsnNode(GOTO, label6),
      label2,
      FrameNode(F_SAME, 0, null, 0, null),
      LdcInsnNode("pottery.vase"),
      VarInsnNode(ASTORE, 5),
      JumpInsnNode(GOTO, label6),
      label3,
      FrameNode(F_SAME, 0, null, 0, null),
      LdcInsnNode("pottery.urn"),
      VarInsnNode(ASTORE, 5),
      JumpInsnNode(GOTO, label6),
      label4,
      FrameNode(F_SAME, 0, null, 0, null),
      LdcInsnNode("pottery.mould"),
      VarInsnNode(ASTORE, 5),
      JumpInsnNode(GOTO, label6),
      label5,
      FrameNode(F_SAME, 0, null, 0, null),
      InsnNode(RETURN),
      label6,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 3),
      VarInsnNode(ALOAD, 5),
      MethodInsnNode(INVOKESTATIC, "bo", "a", "(Ljava/lang/String;)Ljava/lang/String;"),
      MethodInsnNode(INVOKEINTERFACE, "java/util/List", "add", "(Ljava/lang/Object;)Z"),
      InsnNode(POP),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
});

// Technically visual, but require tweaks on both sides
tweak("FCBlockHandCrank", "FCBlockHandCrank", BOTH, "a(Laak;III)V", 0x47E01C6, "Lowering hand crank bounding box",
function(mn)
{
  var counter = 0;
  for (var i = mn.instructions.size() - 1; i >= 0; i--)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == FCONST_1))
    {
      if (counter == 1)
      {
        mn.instructions.set(n, LdcInsnNode(Float("0.75")));
        return true;
      }
      counter++;
    }
  }
});
tweak("FCBlockKiln", "FCBlockKiln", BOTH, "a(Laab;IIILjava/util/Random;)V", 0x2DAB2AE1, "Improving the crack (1/3)",
function(mn)
{
  return replaceAllMethodCalls(mn,
    [INVOKEVIRTUAL, "aab", "f", "(IIIII)V"],
    [INVOKESTATIC, "GPEBTWTweak", "addKilnCrackEffect", "(Laab;IIIII)V"]);
});
tweak("FCBlockKiln", "FCBlockKiln", BOTH, "a(Laab;IIIII)V", 0x358204FD, "Improving the crack (2/3)",
function(mn)
{
  return replaceAllMethodCalls(mn,
    [INVOKEVIRTUAL, "aab", "f", "(IIIII)V"],
    [INVOKESTATIC, "GPEBTWTweak", "addKilnCrackEffect", "(Laab;IIIII)V"]);
});
tweak("FCBlockKiln", "FCBlockKiln", BOTH, "a(Laab;IIII)V", 0x6D780E50, "Improving the crack (3/3)",
function(mn)
{
  return replaceAllMethodCalls(mn,
    [INVOKEVIRTUAL, "aab", "f", "(IIIII)V"],
    [INVOKESTATIC, "GPEBTWTweak", "addKilnCrackEffect", "(Laab;IIIII)V"]);
});
tweak("FCTileEntityTurntable", "FCTileEntityTurntable", BOTH, "<init>()V", 0x41CA0676, "Adding visual spin init",
function(mn)
{
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 0),
      InsnNode(ICONST_0),
      FieldInsnNode(PUTFIELD, "FCTileEntityTurntable", "visualSpin", "I"),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("FCTileEntityTurntable", "FCTileEntityTurntable", BOTH, "h()V", 0x6AAB37DE, "Adding visual spin support",
function(mn)
{
  return CodeInserter(
    JumpInsnFinder(IF_ICMPLT),
    [
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCTileEntityTurntable", "visualSpin", "I"),
      InsnNode(ICONST_1),
      InsnNode(ISHR),
      InsnNode(ICONST_2),
      InsnNode(IADD),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCTileEntityTurntable", "visualSpin", "I"),
      InsnNode(ICONST_1),
      InsnNode(ISHL),
      InsnNode(ISUB),
      InsnNode(ICONST_3),
      InsnNode(IAND),
      FieldInsnNode(PUTFIELD, "FCTileEntityTurntable", "visualSpin", "I"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCTileEntityTurntable", "k", "Laab;"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCTileEntityTurntable", "l", "I"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCTileEntityTurntable", "m", "I"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCTileEntityTurntable", "n", "I"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCTileEntityTurntable", "l", "I"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCTileEntityTurntable", "m", "I"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCTileEntityTurntable", "n", "I"),
      MethodInsnNode(INVOKEVIRTUAL, "aab", "g", "(IIIIII)V"),
    ]
  ).process(mn);
});
add("FCTileEntityTurntable", "FCTileEntityTurntable", BOTH, "Adding visual spin field",
function(cn)
{
  cn.fields.add(FieldNode(ACC_PUBLIC, "visualSpin", "I", null, null));
});
tweak("FCUtilsWorld", "FCUtilsWorld", BOTH, "CanMobsSpawnHere(Laab;III)Z", 0x65EC265F, "Fixing True Sight wrongly marking Mycelium as mob-spawnable",
function(mn)
{
  var label1 = LabelNode();
  var label2 = LabelNode();
  return CodeInserter(
    CustomFinder(function(n)
    {
      return isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") &&
        n.owner.equals("aab") && n.name.equals("a") && n.desc.equals("(III)I");
    }),
    [
      VarInsnNode(ISTORE, 4),
      VarInsnNode(ILOAD, 4),
      FieldInsnNode(GETSTATIC, "apa", "bC", "Lann;"),
      FieldInsnNode(GETFIELD, "ann", "cz", "I"),
      JumpInsnNode(IF_ICMPEQ, label1),
      VarInsnNode(ILOAD, 4),
      FieldInsnNode(GETSTATIC, "apa", "br", "Lapa;"),
      FieldInsnNode(GETFIELD, "apa", "cz", "I"),
      JumpInsnNode(IF_ICMPEQ, label1),
      VarInsnNode(ILOAD, 4),
      FieldInsnNode(GETSTATIC, "apa", "bs", "Lapa;"),
      FieldInsnNode(GETFIELD, "apa", "cz", "I"),
      JumpInsnNode(IF_ICMPNE, label2),
      label1,
      FrameNode(F_APPEND, 1, [INTEGER], 0, null),
      InsnNode(ICONST_0),
      InsnNode(IRETURN),
      label2,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ILOAD, 4),
    ]
  ).process(mn);
});

// ===========
// GUI-related
// ===========

tweak("azb", "InventoryEffectRenderer", CLIENT, "A_()V", 0x869B0A01, "Removing inventory shift due to effects",
function(mn)
{
  var changes = 0;
  var label = LabelNode();
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == SIPUSH) && (n.operand == 160))
    {
      mn.instructions.insertBefore(n, toInsnList(
        [
          FieldInsnNode(GETFIELD, "azb", "h", "I"),
          IntInsnNode(SIPUSH, 424),
          JumpInsnNode(IF_ICMPGE, label),
          VarInsnNode(ALOAD, 0),
        ]
      ));
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && (n.opcode == PUTFIELD) && n.owner.equals("azb") && n.name.equals("e"))
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
  return (changes == 2)
});
tweak("axj", "GuiOptions", CLIENT, "a(Lawg;)V", 0x3789421D, "Replacing controls GUI to a scrolling list",
function(mn)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.TypeInsnNode") && n.desc.equals("awl"))
    {
      n.desc = "GPEGuiControls";
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("awl"))
    {
      n.owner = "GPEGuiControls";
      changes++;
      break;
    }
  }
  return changes == 2;
});
tweak("bkf", "GuiMainMenu", CLIENT, "a(IIF)V", 0xE0F95B5B, "Improving version info detail",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("bkf") && n.name.equals("b") && n.desc.equals("(Lawv;Ljava/lang/String;III)V"))
    {
      mn.instructions.insert(n, toInsnList(
        [
          VarInsnNode(ALOAD, 0),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "bkf", "m", "Lawv;"),
          TypeInsnNode(NEW, "java/lang/StringBuilder"),
          InsnNode(DUP),
          MethodInsnNode(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V"),
          LdcInsnNode(String("BTW ")),
          MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
          FieldInsnNode(GETSTATIC, "FCBetterThanWolves", "fcVersionString", "Ljava/lang/String;"),
          MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
          MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;"),
          InsnNode(ICONST_2),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "bkf", "i", "I"),
          IntInsnNode(BIPUSH, 30),
          InsnNode(ISUB),
          LdcInsnNode(Integer(0xFFFF00)),
          MethodInsnNode(INVOKEVIRTUAL, "bkf", "b", "(Lawv;Ljava/lang/String;III)V"),
          VarInsnNode(ALOAD, 0),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "bkf", "m", "Lawv;"),
          TypeInsnNode(NEW, "java/lang/StringBuilder"),
          InsnNode(DUP),
          MethodInsnNode(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V"),
          LdcInsnNode(String("BTWTweak ")),
          MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
          FieldInsnNode(GETSTATIC, "GPEBTWTweak", "tweakVersion", "Ljava/lang/String;"),
          MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;"),
          MethodInsnNode(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;"),
          InsnNode(ICONST_2),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "bkf", "i", "I"),
          IntInsnNode(BIPUSH, 20),
          InsnNode(ISUB),
          LdcInsnNode(Integer(0x55AAFF)),
          MethodInsnNode(INVOKEVIRTUAL, "bkf", "b", "(Lawv;Ljava/lang/String;III)V"),
        ]
      ));
      return true;
    }
  }
});
