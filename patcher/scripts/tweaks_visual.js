function addSignSpecificBlockDamageCode(mn)
{
  var label = LabelNode();
  mn.instructions.add(toInsnList(
    [
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCBlockSign", "cz", "I"),
      IntInsnNode(BIPUSH, 68),
      JumpInsnNode(IF_ICMPEQ, label),
      InsnNode(RETURN),
      label,
      FrameNode(F_SAME, 0, null, 0, null),
    ]
  ));
}
function addRenderBlockDamageEffectMethod(cn, isSign)
{
  var mn = MethodNode(ACC_PUBLIC, "RenderBlockDamageEffect", "(Lbgf;IIILlx;)V", null, null);
  if (isSign) addSignSpecificBlockDamageCode(mn);
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
  mn = MethodNode(ACC_PUBLIC, "RenderBlockWithTexture", "(Lbgf;IIILlx;)Z", null, null);
  if (isSign) addSignSpecificBlockDamageCode(mn);
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
      // optimization; as a side note; both jad and cfr fail to retain the execution order while fernflower does fine
      //VarInsnNode(ISTORE, 6),
      VarInsnNode(ALOAD, 1),
      MethodInsnNode(INVOKEVIRTUAL, "bgf", "a", "()V"),
      //VarInsnNode(ILOAD, 6),
      InsnNode(IRETURN),
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
tweak("aww", "GuiIngame", CLIENT, "<init>(Lnet/minecraft/client/Minecraft;)V", [0xBBFB0BE1, 0x23BA0E5C], "Adding new vars init to ingame GUI",
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
tweak("aww", "GuiIngame", CLIENT, "a(Lare;IILawv;)V", 0x1C9F4439, "Show scoreboard sidebar only as player list is shown",
function(mn)
{
  var label = LabelNode();
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "z", "Lavy;"),
      FieldInsnNode(GETFIELD, "avy", "T", "Lava;"),
      FieldInsnNode(GETFIELD, "ava", "e", "Z"),
      JumpInsnNode(IFNE, label),
      InsnNode(RETURN),
      label,
      FrameNode(F_SAME, 0, null, 0, null),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("aww", "GuiIngame", CLIENT, "a(FZII)V", [0x641C265B, 0x995D1671], "Inserting checkForGloomRender() and drawCrosshairCustom()",
function(mn)
{
  var changes = 0;
  var i;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("so"))
    {
      n = n.getNext();
      mn.instructions.insert(n, toInsnList(
        [
          VarInsnNode(ALOAD, 0),
          VarInsnNode(ILOAD, 6),
          VarInsnNode(ILOAD, 7),
          MethodInsnNode(INVOKESPECIAL, "aww", "checkForGloomRender", "(II)V"),
        ]
      ));
      changes++;
      break;
    }
  }
  for (i += 5; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 16))
    {
      n = n.getNext();
      if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 16))
      {
        n = n.getNext();
        if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("aww") && n.name.equals("b") && n.desc.equals("(IIIIII)V"))
        {
          mn.instructions.insert(n, toInsnList(
            [
              InsnNode(POP),
              InsnNode(POP),
              InsnNode(POP),
              InsnNode(POP),
              MethodInsnNode(INVOKESPECIAL, "aww", "drawCrosshairCustom", "(II)V"),
            ]
          ));
          mn.instructions.remove(n);
          changes++;
          break;
        }
      }
    }
  }
  return changes == 2;
});
add("aww", "GuiIngame", CLIENT, "Adding gloom and custom crosshair render to ingame GUI",
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
  mn = MethodNode(ACC_PRIVATE, "drawCrosshairCustom", "(II)V", null, null);
  var l0 = LabelNode();
  var l1 = LabelNode();
  var l2 = LabelNode();
  var l3 = LabelNode();
  var l4 = LabelNode();
  var l5 = LabelNode();
  var l6 = LabelNode();
  var l7 = LabelNode();
  var l8 = LabelNode();
  var l9 = LabelNode();
  var l10 = LabelNode();
  var l11 = LabelNode();
  var l12 = LabelNode();
  var l13 = LabelNode();
  var l14 = LabelNode();
  var l15 = LabelNode();
  var l16 = LabelNode();
  var l17 = LabelNode();
  var l18 = LabelNode();
  var l19 = LabelNode();
  var l20 = LabelNode();
  var l21 = LabelNode();
  var l22 = LabelNode();
  var l23 = LabelNode();
  var l24 = LabelNode();
  var l25 = LabelNode();
  var l26 = LabelNode();
  var l27 = LabelNode();
  var l28 = LabelNode();
  var l29 = LabelNode();
  var l30 = LabelNode();
  var l31 = LabelNode();
  var l32 = LabelNode();
  var l33 = LabelNode();
  var l34 = LabelNode();
  var l35 = LabelNode();
  mn.instructions.add(toInsnList(
    [
      FieldInsnNode(GETSTATIC, "GPEBTWTweak", "hasAdaptiveCrosshair", "Z"),
      JumpInsnNode(IFNE, l0),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 1),
      VarInsnNode(ILOAD, 2),
      InsnNode(ICONST_0),
      InsnNode(ICONST_0),
      IntInsnNode(BIPUSH, 16),
      IntInsnNode(BIPUSH, 16),
      MethodInsnNode(INVOKEVIRTUAL, "aww", "b", "(IIIIII)V"),
      InsnNode(RETURN),
      l0,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "y", "Lara;"),
      JumpInsnNode(IFNULL, l1),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "y", "Lara;"),
      FieldInsnNode(GETFIELD, "ara", "a", "Larb;"),
      FieldInsnNode(GETSTATIC, "arb", "a", "Larb;"),
      JumpInsnNode(IF_ACMPNE, l2),
      InsnNode(ICONST_0),
      VarInsnNode(ISTORE, 3),
      InsnNode(ICONST_0),
      VarInsnNode(ISTORE, 4),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "y", "Lara;"),
      FieldInsnNode(GETFIELD, "ara", "b", "I"),
      VarInsnNode(ISTORE, 5),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "y", "Lara;"),
      FieldInsnNode(GETFIELD, "ara", "c", "I"),
      VarInsnNode(ISTORE, 6),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "y", "Lara;"),
      FieldInsnNode(GETFIELD, "ara", "d", "I"),
      VarInsnNode(ISTORE, 7),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "e", "Lbds;"),
      VarInsnNode(ILOAD, 5),
      VarInsnNode(ILOAD, 6),
      VarInsnNode(ILOAD, 7),
      MethodInsnNode(INVOKEVIRTUAL, "bds", "a", "(III)I"),
      VarInsnNode(ISTORE, 8),
      FieldInsnNode(GETSTATIC, "apa", "r", "[Lapa;"),
      VarInsnNode(ILOAD, 8),
      InsnNode(AALOAD),
      VarInsnNode(ASTORE, 9),
      VarInsnNode(ALOAD, 9),
      JumpInsnNode(IFNULL, l3),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      VarInsnNode(ALOAD, 9),
      VarInsnNode(ILOAD, 5),
      VarInsnNode(ILOAD, 6),
      VarInsnNode(ILOAD, 7),
      MethodInsnNode(INVOKEVIRTUAL, "bdv", "IsCurrentToolEffectiveOnBlock", "(Lapa;III)Z"),
      JumpInsnNode(IFEQ, l4),
      InsnNode(ICONST_1),
      VarInsnNode(ISTORE, 3),
      l4,
      FrameNode(F_FULL, 10, ["aww", INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, "apa"], 0, []),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      VarInsnNode(ALOAD, 9),
      VarInsnNode(ILOAD, 5),
      VarInsnNode(ILOAD, 6),
      VarInsnNode(ILOAD, 7),
      MethodInsnNode(INVOKEVIRTUAL, "bdv", "canHarvestBlock", "(Lapa;III)Z"),
      JumpInsnNode(IFEQ, l5),
      InsnNode(ICONST_1),
      VarInsnNode(ISTORE, 4),
      VarInsnNode(ILOAD, 8),
      IntInsnNode(BIPUSH, 58),
      JumpInsnNode(IF_ICMPEQ, l6),
      VarInsnNode(ILOAD, 8),
      IntInsnNode(SIPUSH, 1034),
      JumpInsnNode(IF_ICMPEQ, l6),
      VarInsnNode(ILOAD, 8),
      IntInsnNode(BIPUSH, 20),
      JumpInsnNode(IF_ICMPEQ, l6),
      VarInsnNode(ILOAD, 8),
      IntInsnNode(BIPUSH, 102),
      JumpInsnNode(IF_ICMPNE, l7),
      l6,
      FrameNode(F_SAME, 0, null, 0, null),
      InsnNode(ICONST_0),
      VarInsnNode(ISTORE, 4),
      l7,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ILOAD, 8),
      IntInsnNode(BIPUSH, 32),
      JumpInsnNode(IF_ICMPEQ, l8),
      VarInsnNode(ILOAD, 8),
      IntInsnNode(BIPUSH, 18),
      JumpInsnNode(IF_ICMPEQ, l8),
      VarInsnNode(ILOAD, 8),
      IntInsnNode(SIPUSH, 211),
      JumpInsnNode(IF_ICMPEQ, l8),
      VarInsnNode(ILOAD, 8),
      IntInsnNode(BIPUSH, 31),
      JumpInsnNode(IF_ICMPEQ, l8),
      VarInsnNode(ILOAD, 8),
      IntInsnNode(BIPUSH, 106),
      JumpInsnNode(IF_ICMPNE, l9),
      l8,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "bK", "Lso;"),
      MethodInsnNode(INVOKEVIRTUAL, "so", "h", "()Lwm;"),
      VarInsnNode(ASTORE, 10),
      VarInsnNode(ALOAD, 10),
      JumpInsnNode(IFNULL, l10),
      VarInsnNode(ALOAD, 10),
      MethodInsnNode(INVOKEVIRTUAL, "wm", "b", "()Lwk;"),
      FieldInsnNode(GETFIELD, "wk", "cp", "I"),
      FieldInsnNode(GETSTATIC, "wk", "bf", "Lxe;"),
      FieldInsnNode(GETFIELD, "xe", "cp", "I"),
      JumpInsnNode(IF_ICMPEQ, l9),
      l10,
      FrameNode(F_APPEND, 1, ["wm"], 0, null),
      InsnNode(ICONST_0),
      VarInsnNode(ISTORE, 4),
      l9,
      FrameNode(F_CHOP, 1, null, 0, null),
      VarInsnNode(ILOAD, 8),
      FieldInsnNode(GETSTATIC, "GPEBTWTweak", "compatAxleBlock", "Lapa;"),
      FieldInsnNode(GETFIELD, "apa", "cz", "I"),
      JumpInsnNode(IF_ICMPNE, l11),
      VarInsnNode(ILOAD, 3),
      JumpInsnNode(IFNE, l11),
      InsnNode(ICONST_0),
      VarInsnNode(ISTORE, 4),
      JumpInsnNode(GOTO, l11),
      l5,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ILOAD, 8),
      IntInsnNode(BIPUSH, 17),
      JumpInsnNode(IF_ICMPNE, l11),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "e", "Lbds;"),
      VarInsnNode(ILOAD, 5),
      VarInsnNode(ILOAD, 6),
      VarInsnNode(ILOAD, 7),
      MethodInsnNode(INVOKEVIRTUAL, "bds", "h", "(III)I"),
      VarInsnNode(ISTORE, 10),
      VarInsnNode(ILOAD, 10),
      IntInsnNode(BIPUSH, 12),
      InsnNode(IAND),
      IntInsnNode(BIPUSH, 12),
      JumpInsnNode(IF_ICMPNE, l11),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "bK", "Lso;"),
      MethodInsnNode(INVOKEVIRTUAL, "so", "h", "()Lwm;"),
      VarInsnNode(ASTORE, 11),
      VarInsnNode(ALOAD, 11),
      JumpInsnNode(IFNULL, l11),
      VarInsnNode(ALOAD, 11),
      MethodInsnNode(INVOKEVIRTUAL, "wm", "b", "()Lwk;"),
      FieldInsnNode(GETFIELD, "wk", "cp", "I"),
      IntInsnNode(SIPUSH, 22573),
      JumpInsnNode(IF_ICMPEQ, l12),
      VarInsnNode(ALOAD, 11),
      MethodInsnNode(INVOKEVIRTUAL, "wm", "b", "()Lwk;"),
      FieldInsnNode(GETFIELD, "wk", "cp", "I"),
      FieldInsnNode(GETSTATIC, "GPEBTWTweak", "gpeItemChiselRefined", "Lwk;"),
      FieldInsnNode(GETFIELD, "wk", "cp", "I"),
      JumpInsnNode(IF_ICMPNE, l11),
      l12,
      FrameNode(F_APPEND, 2, [INTEGER, "wm"], 0, null),
      InsnNode(ICONST_1),
      VarInsnNode(ISTORE, 4),
      l11,
      FrameNode(F_CHOP, 2, null, 0, null),
      VarInsnNode(ILOAD, 8),
      IntInsnNode(BIPUSH, 30),
      JumpInsnNode(IF_ICMPEQ, l13),
      VarInsnNode(ILOAD, 8),
      IntInsnNode(SIPUSH, 1037),
      JumpInsnNode(IF_ICMPNE, l3),
      l13,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "bK", "Lso;"),
      MethodInsnNode(INVOKEVIRTUAL, "so", "h", "()Lwm;"),
      VarInsnNode(ASTORE, 10),
      VarInsnNode(ALOAD, 10),
      JumpInsnNode(IFNONNULL, l14),
      InsnNode(ICONST_0),
      VarInsnNode(ISTORE, 4),
      JumpInsnNode(GOTO, l3),
      l14,
      FrameNode(F_APPEND, 1, ["wm"], 0, null),
      VarInsnNode(ALOAD, 10),
      MethodInsnNode(INVOKEVIRTUAL, "wm", "b", "()Lwk;"),
      FieldInsnNode(GETFIELD, "wk", "cp", "I"),
      VarInsnNode(ISTORE, 11),
      VarInsnNode(ILOAD, 11),
      FieldInsnNode(GETSTATIC, "wk", "bf", "Lxe;"),
      FieldInsnNode(GETFIELD, "xe", "cp", "I"),
      JumpInsnNode(IF_ICMPEQ, l15),
      VarInsnNode(ILOAD, 11),
      IntInsnNode(SIPUSH, 22567),
      JumpInsnNode(IF_ICMPEQ, l15),
      VarInsnNode(ILOAD, 11),
      IntInsnNode(SIPUSH, 22573),
      JumpInsnNode(IF_ICMPEQ, l15),
      VarInsnNode(ILOAD, 11),
      FieldInsnNode(GETSTATIC, "GPEBTWTweak", "gpeItemChiselRefined", "Lwk;"),
      FieldInsnNode(GETFIELD, "wk", "cp", "I"),
      JumpInsnNode(IF_ICMPNE, l16),
      l15,
      FrameNode(F_APPEND, 1, [INTEGER], 0, null),
      InsnNode(ICONST_1),
      JumpInsnNode(GOTO, l17),
      l16,
      FrameNode(F_SAME, 0, null, 0, null),
      InsnNode(ICONST_0),
      l17,
      FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
      VarInsnNode(ISTORE, 4),
      l3,
      FrameNode(F_CHOP, 2, null, 0, null),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 1),
      VarInsnNode(ILOAD, 2),
      VarInsnNode(ILOAD, 4),
      JumpInsnNode(IFNE, l18),
      VarInsnNode(ILOAD, 3),
      JumpInsnNode(IFEQ, l18),
      IntInsnNode(BIPUSH, 16),
      JumpInsnNode(GOTO, l19),
      l18,
      FrameNode(F_FULL, 10, ["aww", INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, "apa"], 3, ["aww", INTEGER, INTEGER]),
      InsnNode(ICONST_0),
      l19,
      FrameNode(F_FULL, 10, ["aww", INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, "apa"], 4, ["aww", INTEGER, INTEGER, INTEGER]),
      VarInsnNode(ILOAD, 4),
      JumpInsnNode(IFEQ, l20),
      InsnNode(ICONST_0),
      JumpInsnNode(GOTO, l21),
      l20,
      FrameNode(F_FULL, 10, ["aww", INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, "apa"], 4, ["aww", INTEGER, INTEGER, INTEGER]),
      IntInsnNode(BIPUSH, 96),
      l21,
      FrameNode(F_FULL, 10, ["aww", INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, "apa"], 5, ["aww", INTEGER, INTEGER, INTEGER, INTEGER]),
      IntInsnNode(BIPUSH, 16),
      IntInsnNode(BIPUSH, 16),
      MethodInsnNode(INVOKEVIRTUAL, "aww", "b", "(IIIIII)V"),
      InsnNode(RETURN),
      l2,
      FrameNode(F_FULL, 3, ["aww", INTEGER, INTEGER], 0, []),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "y", "Lara;"),
      FieldInsnNode(GETFIELD, "ara", "g", "Lmp;"),
      TypeInsnNode(INSTANCEOF, "ng"),
      JumpInsnNode(IFEQ, l22),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "y", "Lara;"),
      FieldInsnNode(GETFIELD, "ara", "g", "Lmp;"),
      TypeInsnNode(CHECKCAST, "ng"),
      VarInsnNode(ASTORE, 3),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "bK", "Lso;"),
      VarInsnNode(ALOAD, 3),
      MethodInsnNode(INVOKEVIRTUAL, "so", "a", "(Lmp;)I"),
      InsnNode(ICONST_2),
      JumpInsnNode(IF_ICMPLE, l23),
      InsnNode(ICONST_1),
      JumpInsnNode(GOTO, l24),
      l23,
      FrameNode(F_APPEND, 1, ["ng"], 0, null),
      InsnNode(ICONST_0),
      l24,
      FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
      VarInsnNode(ISTORE, 4),
      VarInsnNode(ALOAD, 3),
      FieldInsnNode(GETFIELD, "ng", "af", "I"),
      IntInsnNode(BIPUSH, 10),
      JumpInsnNode(IF_ICMPGT, l25),
      InsnNode(ICONST_1),
      JumpInsnNode(GOTO, l26),
      l25,
      FrameNode(F_APPEND, 1, [INTEGER], 0, null),
      InsnNode(ICONST_0),
      l26,
      FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
      VarInsnNode(ISTORE, 5),
      VarInsnNode(ALOAD, 3),
      FieldInsnNode(GETFIELD, "ng", "aZ", "I"),
      JumpInsnNode(IFNE, l27),
      InsnNode(ICONST_1),
      JumpInsnNode(GOTO, l28),
      l27,
      FrameNode(F_APPEND, 1, [INTEGER], 0, null),
      InsnNode(ICONST_0),
      l28,
      FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
      VarInsnNode(ISTORE, 6),
      InsnNode(ICONST_1),
      VarInsnNode(ISTORE, 7),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      VarInsnNode(ALOAD, 3),
      MethodInsnNode(INVOKEVIRTUAL, "bdv", "n", "(Lmp;)Z"),
      JumpInsnNode(IFNE, l29),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "u", "D"),
      VarInsnNode(ALOAD, 3),
      FieldInsnNode(GETFIELD, "ng", "u", "D"),
      InsnNode(DSUB),
      VarInsnNode(DSTORE, 8),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "v", "D"),
      LdcInsnNode(Double("1.62")),
      InsnNode(DSUB),
      VarInsnNode(ALOAD, 3),
      FieldInsnNode(GETFIELD, "ng", "v", "D"),
      InsnNode(DSUB),
      VarInsnNode(DSTORE, 10),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "w", "D"),
      VarInsnNode(ALOAD, 3),
      FieldInsnNode(GETFIELD, "ng", "w", "D"),
      InsnNode(DSUB),
      VarInsnNode(DSTORE, 12),
      VarInsnNode(DLOAD, 8),
      VarInsnNode(DLOAD, 8),
      InsnNode(DMUL),
      VarInsnNode(DLOAD, 10),
      VarInsnNode(DLOAD, 10),
      InsnNode(DMUL),
      InsnNode(DADD),
      VarInsnNode(DLOAD, 12),
      VarInsnNode(DLOAD, 12),
      InsnNode(DMUL),
      InsnNode(DADD),
      LdcInsnNode(Double("9.0")),
      InsnNode(DCMPG),
      JumpInsnNode(IFGE, l30),
      InsnNode(ICONST_1),
      JumpInsnNode(GOTO, l31),
      l30,
      FrameNode(F_FULL, 11, ["aww", INTEGER, INTEGER, "ng", INTEGER, INTEGER, INTEGER, INTEGER, DOUBLE, DOUBLE, DOUBLE], 0, []),
      InsnNode(ICONST_0),
      l31,
      FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
      VarInsnNode(ISTORE, 7),
      l29,
      FrameNode(F_CHOP, 3, null, 0, null),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 1),
      VarInsnNode(ILOAD, 2),
      VarInsnNode(ILOAD, 4),
      JumpInsnNode(IFEQ, l32),
      VarInsnNode(ILOAD, 5),
      JumpInsnNode(IFEQ, l32),
      VarInsnNode(ILOAD, 6),
      JumpInsnNode(IFEQ, l32),
      VarInsnNode(ILOAD, 7),
      JumpInsnNode(IFEQ, l32),
      IntInsnNode(BIPUSH, 32),
      JumpInsnNode(GOTO, l33),
      l32,
      FrameNode(F_FULL, 8, ["aww", INTEGER, INTEGER, "ng", INTEGER, INTEGER, INTEGER, INTEGER], 3, ["aww", INTEGER, INTEGER]),
      InsnNode(ICONST_0),
      l33,
      FrameNode(F_FULL, 8, ["aww", INTEGER, INTEGER, "ng", INTEGER, INTEGER, INTEGER, INTEGER], 4, ["aww", INTEGER, INTEGER, INTEGER]),
      IntInsnNode(BIPUSH, 96),
      IntInsnNode(BIPUSH, 16),
      IntInsnNode(BIPUSH, 16),
      MethodInsnNode(INVOKEVIRTUAL, "aww", "b", "(IIIIII)V"),
      InsnNode(RETURN),
      l1,
      FrameNode(F_FULL, 3, ["aww", INTEGER, INTEGER], 0, []),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "bK", "Lso;"),
      MethodInsnNode(INVOKEVIRTUAL, "so", "h", "()Lwm;"),
      VarInsnNode(ASTORE, 3),
      VarInsnNode(ALOAD, 3),
      JumpInsnNode(IFNULL, l22),
      VarInsnNode(ALOAD, 3),
      MethodInsnNode(INVOKEVIRTUAL, "wm", "b", "()Lwk;"),
      FieldInsnNode(GETFIELD, "wk", "cp", "I"),
      FieldInsnNode(GETSTATIC, "FCBetterThanWolves", "fcItemFishingRodBaited", "Lwk;"),
      FieldInsnNode(GETFIELD, "wk", "cp", "I"),
      JumpInsnNode(IF_ICMPNE, l22),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "ck", "Lsw;"),
      JumpInsnNode(IFNONNULL, l34),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "e", "Lbds;"),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      InsnNode(ICONST_1),
      MethodInsnNode(INVOKESTATIC, "FCUtilsMisc", "GetMovingObjectPositionFromPlayerHitWaterAndLava", "(Laab;Lsq;Z)Lara;"),
      VarInsnNode(ASTORE, 4),
      VarInsnNode(ALOAD, 4),
      JumpInsnNode(IFNULL, l35),
      VarInsnNode(ALOAD, 4),
      FieldInsnNode(GETFIELD, "ara", "a", "Larb;"),
      FieldInsnNode(GETSTATIC, "arb", "a", "Larb;"),
      JumpInsnNode(IF_ACMPNE, l35),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ALOAD, 4),
      FieldInsnNode(GETFIELD, "ara", "b", "I"),
      VarInsnNode(ALOAD, 4),
      FieldInsnNode(GETFIELD, "ara", "c", "I"),
      VarInsnNode(ALOAD, 4),
      FieldInsnNode(GETFIELD, "ara", "d", "I"),
      MethodInsnNode(INVOKESPECIAL, "aww", "goodFishingSpot", "(III)Z"),
      JumpInsnNode(IFEQ, l35),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 1),
      VarInsnNode(ILOAD, 2),
      IntInsnNode(BIPUSH, 48),
      IntInsnNode(BIPUSH, 96),
      IntInsnNode(BIPUSH, 16),
      IntInsnNode(BIPUSH, 16),
      MethodInsnNode(INVOKEVIRTUAL, "aww", "b", "(IIIIII)V"),
      InsnNode(RETURN),
      l35,
      FrameNode(F_APPEND, 1, ["wm"], 0, null),
      JumpInsnNode(GOTO, l22),
      l34,
      FrameNode(F_SAME, 0, null, 0, null),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "ck", "Lsw;"),
      FieldInsnNode(GETFIELD, "sw", "u", "D"),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 4),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "ck", "Lsw;"),
      FieldInsnNode(GETFIELD, "sw", "v", "D"),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 5),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "g", "Lbdv;"),
      FieldInsnNode(GETFIELD, "bdv", "ck", "Lsw;"),
      FieldInsnNode(GETFIELD, "sw", "w", "D"),
      MethodInsnNode(INVOKESTATIC, "kx", "c", "(D)I"),
      VarInsnNode(ISTORE, 6),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 4),
      VarInsnNode(ILOAD, 5),
      VarInsnNode(ILOAD, 6),
      MethodInsnNode(INVOKESPECIAL, "aww", "goodFishingSpot", "(III)Z"),
      JumpInsnNode(IFEQ, l22),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 1),
      VarInsnNode(ILOAD, 2),
      IntInsnNode(BIPUSH, 48),
      IntInsnNode(BIPUSH, 96),
      IntInsnNode(BIPUSH, 16),
      IntInsnNode(BIPUSH, 16),
      MethodInsnNode(INVOKEVIRTUAL, "aww", "b", "(IIIIII)V"),
      InsnNode(RETURN),
      l22,
      FrameNode(F_CHOP, 1, null, 0, null),
      VarInsnNode(ALOAD, 0),
      VarInsnNode(ILOAD, 1),
      VarInsnNode(ILOAD, 2),
      InsnNode(ICONST_0),
      IntInsnNode(BIPUSH, 96),
      IntInsnNode(BIPUSH, 16),
      IntInsnNode(BIPUSH, 16),
      MethodInsnNode(INVOKEVIRTUAL, "aww", "b", "(IIIIII)V"),
      InsnNode(RETURN),
    ]
  ));
  cn.methods.add(mn);
  mn = MethodNode(ACC_PRIVATE, "goodFishingSpot", "(III)Z", null, null);
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
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "e", "Lbds;"),
      VarInsnNode(ILOAD, 1),
      VarInsnNode(ILOAD, 2),
      VarInsnNode(ILOAD, 3),
      MethodInsnNode(INVOKEVIRTUAL, "bds", "g", "(III)Laif;"),
      VarInsnNode(ASTORE, 4),
      VarInsnNode(ALOAD, 4),
      FieldInsnNode(GETSTATIC, "aif", "h", "Laif;"),
      JumpInsnNode(IF_ACMPEQ, l0),
      InsnNode(ICONST_0),
      InsnNode(IRETURN),
      l0,
      FrameNode(F_APPEND, 1, ["aif"], 0, null),
      VarInsnNode(ILOAD, 1),
      InsnNode(ICONST_2),
      InsnNode(ISUB),
      VarInsnNode(ISTORE, 5),
      l1,
      FrameNode(F_APPEND, 1, [INTEGER], 0, null),
      VarInsnNode(ILOAD, 5),
      VarInsnNode(ILOAD, 1),
      InsnNode(ICONST_2),
      InsnNode(IADD),
      JumpInsnNode(IF_ICMPGT, l2),
      VarInsnNode(ILOAD, 2),
      InsnNode(ICONST_3),
      InsnNode(ISUB),
      VarInsnNode(ISTORE, 6),
      l3,
      FrameNode(F_APPEND, 1, [INTEGER], 0, null),
      VarInsnNode(ILOAD, 6),
      VarInsnNode(ILOAD, 2),
      JumpInsnNode(IF_ICMPGE, l4),
      VarInsnNode(ILOAD, 3),
      InsnNode(ICONST_2),
      InsnNode(ISUB),
      VarInsnNode(ISTORE, 7),
      l5,
      FrameNode(F_APPEND, 1, [INTEGER], 0, null),
      VarInsnNode(ILOAD, 7),
      VarInsnNode(ILOAD, 3),
      InsnNode(ICONST_2),
      InsnNode(IADD),
      JumpInsnNode(IF_ICMPGT, l6),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "aww", "d", "Lnet/minecraft/client/Minecraft;"),
      FieldInsnNode(GETFIELD, "net/minecraft/client/Minecraft", "e", "Lbds;"),
      VarInsnNode(ILOAD, 5),
      VarInsnNode(ILOAD, 6),
      VarInsnNode(ILOAD, 7),
      MethodInsnNode(INVOKEVIRTUAL, "bds", "g", "(III)Laif;"),
      VarInsnNode(ASTORE, 4),
      VarInsnNode(ALOAD, 4),
      FieldInsnNode(GETSTATIC, "aif", "h", "Laif;"),
      JumpInsnNode(IF_ACMPEQ, l7),
      InsnNode(ICONST_0),
      InsnNode(IRETURN),
      l7,
      FrameNode(F_SAME, 0, null, 0, null),
      IincInsnNode(7, 1),
      JumpInsnNode(GOTO, l5),
      l6,
      FrameNode(F_CHOP, 1, null, 0, null),
      IincInsnNode(6, 1),
      JumpInsnNode(GOTO, l3),
      l4,
      FrameNode(F_CHOP, 1, null, 0, null),
      IincInsnNode(5, 1),
      JumpInsnNode(GOTO, l1),
      l2,
      FrameNode(F_CHOP, 1, null, 0, null),
      InsnNode(ICONST_1),
      InsnNode(IRETURN),
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
add("FCBlockBed", null, CLIENT, "Fixed cracks on bed",
function(cn)
{
  addRenderBlockDamageEffectMethod(cn);
});
add("FCBlockEnderChest", null, CLIENT, "Fixed cracks on ender chest",
function(cn)
{
  addRenderBlockDamageEffectMethod(cn);
});
add("FCBlockBeacon", null, CLIENT, "Fixed cracks on beacon",
function(cn)
{
  addRenderBlockDamageEffectMethod(cn);
});
add("FCBlockCocoa", null, CLIENT, "Fixed cracks on cocoa beans",
function(cn)
{
  addRenderBlockDamageEffectMethod(cn);
});
add("FCBlockSign", null, CLIENT, "Fixed cracks on wall sign",
function(cn)
{
  addRenderBlockDamageEffectMethod(cn, true);
});
tweak("FCBlockTurntable", null, CLIENT, "RenderBlock(Lbgf;III)Z", 0xBBB81AF0, "Using visual spin",
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
add("FCBlockTurntable", null, CLIENT, "Adding visual spin function",
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
add("FCItemBlockPlanter", null, CLIENT, "Adding tooltip item info",
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
add("FCItemBlockUnfiredPottery", null, CLIENT, "Adding tooltip item info",
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
tweak("FCBlockHandCrank", null, BOTH, "a(Laak;III)V", 0x47E01C6, "Lowering hand crank bounding box",
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
if (!isBTWVersionOrNewer("4.A9 Pustules Lancing"))
{
  tweak("FCBlockKiln", null, BOTH, "a(Laab;IIILjava/util/Random;)V", 0x2DAB2AE1, "(1/3) Improving the crack",
  function(mn)
  {
    return replaceAllMethodCalls(mn,
      [INVOKEVIRTUAL, "aab", "f", "(IIIII)V"],
      [INVOKESTATIC, "GPEBTWTweak", "addKilnCrackEffect", "(Laab;IIIII)V"]);
  });
  tweak("FCBlockKiln", null, BOTH, "a(Laab;IIIII)V", 0x358204FD, "(2/3) Improving the crack",
  function(mn)
  {
    return replaceAllMethodCalls(mn,
      [INVOKEVIRTUAL, "aab", "f", "(IIIII)V"],
      [INVOKESTATIC, "GPEBTWTweak", "addKilnCrackEffect", "(Laab;IIIII)V"]);
  });
  tweak("FCBlockKiln", null, BOTH, "a(Laab;IIII)V", 0x6D780E50, "(3/3) Improving the crack",
  function(mn)
  {
    return replaceAllMethodCalls(mn,
      [INVOKEVIRTUAL, "aab", "f", "(IIIII)V"],
      [INVOKESTATIC, "GPEBTWTweak", "addKilnCrackEffect", "(Laab;IIIII)V"]);
  });
}
tweak("FCTileEntityTurntable", null, BOTH, "<init>()V", 0x41CA0676, "Adding visual spin init",
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
tweak("FCTileEntityTurntable", null, BOTH, "h()V", 0x6AAB37DE, "Adding visual spin support",
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
add("FCTileEntityTurntable", null, BOTH, "Adding visual spin field",
function(cn)
{
  cn.fields.add(FieldNode(ACC_PUBLIC, "visualSpin", "I", null, null));
});
tweak("FCUtilsWorld", null, BOTH, "CanMobsSpawnHere(Laab;III)Z", 0x65EC265F, "Fixing True Sight wrongly marking Mycelium as mob-spawnable",
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
tweak("bkf", "GuiMainMenu", CLIENT, "A_()V", 0x40E0618E, "Unshifting buttons to make space for version info",
function(mn)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 12))
    {
      n2 = n.getNext();
      if (isInstance(n2, "org.objectweb.asm.tree.InsnNode") && (n2.getOpcode() == IADD))
      {
        mn.instructions.remove(n);
        mn.instructions.remove(n2);
        changes++;
        if (changes == 3) return true;
      }
    }
  }
});
tweak("acn", "WorldProvider", CLIENT, "j()Z", 0x1E3004E6, "(1/2) Removing void fog",
function(mn)
{
  mn.instructions.clear();
  mn.instructions.add(toInsnList(
    [
      InsnNode(ICONST_0),
      InsnNode(IRETURN),
    ]
  ));
  return true;
});
tweak("acn", "WorldProvider", CLIENT, "k()D", 0x104203A5, "(2/2) Removing void fog",
function(mn)
{
  mn.instructions.clear();
  mn.instructions.add(toInsnList(
    [
      InsnNode(DCONST_1),
      InsnNode(DRETURN),
    ]
  ));
  return true;
});
tweak("bfj", "EntityPlayerSP", CLIENT, "c()V", 0x4714BC75, "Stopping GUI from auto-closing when inside portal",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("net/minecraft/client/Minecraft") && n.name.equals("a") && n.desc.equals("(Laxr;)V"))
    {
      var n2 = n.getPrevious();
      var n3 = n2.getPrevious();
      var n4 = n3.getPrevious();
      var n5 = n4.getPrevious();
      mn.instructions.remove(n);
      mn.instructions.remove(n2);
      mn.instructions.remove(n3);
      mn.instructions.remove(n4);
      mn.instructions.remove(n5);
      return true;
    }
  }
});
