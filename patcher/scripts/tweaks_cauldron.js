// className, deobfName, side, method, checksums, description
tweak("FCBlockCauldron", null, CLIENT, "RenderBlock(Lbgf;III)Z", 0xDD0A1369, "Adjusting visual fullness to 9 slots",
function(mn)
{
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && isInstance(n.cst, "java.lang.Float") && (n.cst == "27.0"))
    {
      n.cst = Float("9.0");
      return true;
    }
  }
});
tweak("FCBlockCrucible", null, CLIENT, "RenderBlock(Lbgf;III)Z", 0xC9BA1A38, "Adjusting visual fullness to 9 slots",
function(mn)
{
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && isInstance(n.cst, "java.lang.Float") && (n.cst == "27.0"))
    {
      n.cst = Float("9.0");
      return true;
    }
  }
});
tweak("FCClientGuiCookingVessel", null, CLIENT, "a(FII)V", 0xA47A1391, "Adding GUI stoked indication and reducing slots to 9",
function(mn)
{
  var changes = 0;
  var i;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && (n.cst.toString() == "/btwmodtex/fccauldron.png"))
    {
      n.cst = String("/btwmodtex/fccauldron_small.png");
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && (n.name == "m_AssociatedTileEntity"))
    {
      var label1 = LabelNode();
      var label2 = LabelNode();
      var label3 = LabelNode();
      var label4 = LabelNode();
      //mn.localVariables.clear();
      //truncateInsnAfter(mn, n);
      mn.instructions.insert(n, toInsnList(
        [
          FieldInsnNode(GETFIELD, "FCTileEntityCookingVessel", "m_iFireUnderType", "I"),
          InsnNode(ICONST_2),
          JumpInsnNode(IF_ICMPNE, label1),
          InsnNode(ICONST_1),
          JumpInsnNode(GOTO, label2),
          label1,
          FrameNode(F_APPEND, 2, [INTEGER, INTEGER], 0, null),
          InsnNode(ICONST_0),
          label2,
          FrameNode(F_SAME1, 0, null, 1, [INTEGER]),
          VarInsnNode(ISTORE, 6),
          VarInsnNode(ILOAD, 6),
          InsnNode(ICONST_1),
          JumpInsnNode(IF_ICMPNE, label3),
          VarInsnNode(ALOAD, 0),
          VarInsnNode(ILOAD, 4),
          IntInsnNode(BIPUSH, 61),
          InsnNode(IADD),
          VarInsnNode(ILOAD, 5),
          IntInsnNode(BIPUSH, 82),
          InsnNode(IADD),
          IntInsnNode(SIPUSH, 176),
          IntInsnNode(BIPUSH, 14),
          IntInsnNode(BIPUSH, 54),
          IntInsnNode(BIPUSH, 14),
          MethodInsnNode(INVOKEVIRTUAL, "FCClientGuiCookingVessel", "b", "(IIIIII)V"),
          label3,
          FrameNode(F_APPEND, 1, [INTEGER], 0, null),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "FCClientGuiCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
          MethodInsnNode(INVOKEVIRTUAL, "FCTileEntityCookingVessel", "IsCooking", "()Z"),
          JumpInsnNode(IFEQ, label4),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "FCClientGuiCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
          IntInsnNode(BIPUSH, 12),
          MethodInsnNode(INVOKEVIRTUAL, "FCTileEntityCookingVessel", "getCookProgressScaled", "(I)I"),
          VarInsnNode(ISTORE, 7),
          VarInsnNode(ALOAD, 0),
          VarInsnNode(ILOAD, 4),
          IntInsnNode(BIPUSH, 61),
          InsnNode(IADD),
          VarInsnNode(ILOAD, 5),
          IntInsnNode(BIPUSH, 82),
          InsnNode(IADD),
          IntInsnNode(BIPUSH, 12),
          InsnNode(IADD),
          VarInsnNode(ILOAD, 7),
          InsnNode(ISUB),
          IntInsnNode(SIPUSH, 176),
          VarInsnNode(ILOAD, 6),
          IntInsnNode(BIPUSH, 28),
          InsnNode(IMUL),
          IntInsnNode(BIPUSH, 12),
          InsnNode(IADD),
          VarInsnNode(ILOAD, 7),
          InsnNode(ISUB),
          IntInsnNode(BIPUSH, 54),
          VarInsnNode(ILOAD, 7),
          InsnNode(ICONST_2),
          InsnNode(IADD),
          MethodInsnNode(INVOKEVIRTUAL, "FCClientGuiCookingVessel", "b", "(IIIIII)V"),
          label4,
          FrameNode(F_SAME, 0, null, 0, null),
          InsnNode(RETURN),
        ]
      ));
      changes++;
      break;
    }
  }
  return changes == 2;
});
tweak("FCContainerCookingVessel", null, BOTH, "<init>(Llt;LFCTileEntityCookingVessel;)V", 0xE7B32136, "(1/3) Adding stoked info handling and (1/2) reducing slots to 9",
function(mn)
{
  var changes = 0;
  var i;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode"))
    {
      mn.instructions.insert(n, toInsnList(
        [
          VarInsnNode(ALOAD, 0),
          InsnNode(ICONST_0),
          FieldInsnNode(PUTFIELD, "FCContainerCookingVessel", "m_iLastFireUnderType", "I"),
        ]
      ));
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 9))
    {
      n.operand = 3;
      changes++;
      if (changes == 4) break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 8))
    {
      n.operand = 62;
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 43))
    {
      n.operand = 17;
      changes++;
      break;
    }
  }
  return changes == 6;
});
tweak("FCContainerCookingVessel", null, BOTH, "b(Lsq;I)Lwm;", 0xE83F127D, "(2/2) Reducing slots to 9",
function(mn)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 27))
    {
      n.operand = 9;
      changes++;
      if (changes == 3) break;
    }
  }
  return changes == 3;
});
tweak("FCContainerCookingVessel", null, BOTH, "a(Ltp;)V", 0x119C040A, "(2/3) Adding stoked info handling",
function(mn)
{
  return CodeInserter(
    MethodInsnFinder("tp"),
    [
      VarInsnNode(ALOAD, 1),
      VarInsnNode(ALOAD, 0),
      InsnNode(ICONST_1),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCContainerCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
      FieldInsnNode(GETFIELD, "FCTileEntityCookingVessel", "m_iFireUnderType", "I"),
      MethodInsnNode(INVOKEINTERFACE, "tp", "a", "(Ltj;II)V"),
    ]
  ).process(mn);
});
tweak("FCContainerCookingVessel", null, BOTH, "b()V", 0x3F10F73, "(3/3) Adding stoked info handling",
function(mn)
{
  var changes = 0;
  var i;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.name.equals("a"))
    {
      for (i += 1; i < mn.instructions.size(); i++)
      {
        n = mn.instructions.get(i);
        if (isInstance(n, "org.objectweb.asm.tree.FrameNode") && (getObjProperty(n, "type") == F_SAME))
        {
          var label = LabelNode();
          mn.instructions.insert(n, toInsnList(
            [
              FrameNode(F_APPEND, 1, ["tp"], 0, null),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "FCContainerCookingVessel", "m_iLastFireUnderType", "I"),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "FCContainerCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
              FieldInsnNode(GETFIELD, "FCTileEntityCookingVessel", "m_iFireUnderType", "I"),
              JumpInsnNode(IF_ICMPEQ, label),
              VarInsnNode(ALOAD, 2),
              VarInsnNode(ALOAD, 0),
              InsnNode(ICONST_1),
              VarInsnNode(ALOAD, 0),
              FieldInsnNode(GETFIELD, "FCContainerCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
              FieldInsnNode(GETFIELD, "FCTileEntityCookingVessel", "m_iFireUnderType", "I"),
              MethodInsnNode(INVOKEINTERFACE, "tp", "a", "(Ltj;II)V"),
              label,
              FrameNode(F_CHOP, 1, null, 0, null),
            ]
          ));
          mn.instructions.remove(n);
          changes++;
          break;
        }
      }
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == RETURN))
    {
      mn.instructions.insertBefore(n, toInsnList(
        [
          VarInsnNode(ALOAD, 0),
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "FCContainerCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
          FieldInsnNode(GETFIELD, "FCTileEntityCookingVessel", "m_iFireUnderType", "I"),
          FieldInsnNode(PUTFIELD, "FCContainerCookingVessel", "m_iLastFireUnderType", "I"),
        ]
      ));
      changes++;
      break;
    }
  }
  return changes == 2;
});
tweak("FCContainerCookingVessel", null, CLIENT, "b(II)V", 0x9DD02F8, "(GUI) Adding stoked info handling",
function(mn)
{
  var label = LabelNode();
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ILOAD, 1),
      InsnNode(ICONST_1),
      JumpInsnNode(IF_ICMPNE, label),
      VarInsnNode(ALOAD, 0),
      FieldInsnNode(GETFIELD, "FCContainerCookingVessel", "m_AssociatedTileEntity", "LFCTileEntityCookingVessel;"),
      VarInsnNode(ILOAD, 2),
      FieldInsnNode(PUTFIELD, "FCTileEntityCookingVessel", "m_iFireUnderType", "I"),
      label,
      FrameNode(F_SAME, 0, null, 0, null),
    ],
    INSERT_BEFORE
  ).process(mn);
});
add("FCContainerCookingVessel", null, BOTH, "Added private integer m_iLastFireUnderType",
function(cn)
{
  cn.fields.add(FieldNode(ACC_PRIVATE, "m_iLastFireUnderType", "I", null, null));
});
tweak("FCTileEntityCauldron", null, BOTH, "GetUncookedItemInventoryIndex()I", 0xB3C40CCC, "(1/3) Changing 27 slots to 9",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 27))
    {
      n.operand = 9;
      return true;
    }
  }
});
tweak("FCTileEntityCauldron", null, BOTH, "ContainsNonFoulFood()Z", 0x57AF11C4, "(2/3) Changing 27 slots to 9",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 27))
    {
      n.operand = 9;
      return true;
    }
  }
});
tweak("FCTileEntityCauldron", null, BOTH, "TaintAllNonFoulFoodInInventory()Z", 0x7E9A19E2, "(3/3) Changing 27 slots to 9",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 27))
    {
      n.operand = 9;
      return true;
    }
  }
});
tweak("FCTileEntityCookingVessel", null, BOTH, "<init>()V", 0xC37E1086, "(1/2) Changing 27 slots to 9",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 27))
    {
      n.operand = 9;
      return true;
    }
  }
});
tweak("FCTileEntityCookingVessel", null, BOTH, "j_()I", 0xCE00BD, "(2/2) Changing 27 slots to 9",
function(mn)
{
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode") && (n.getOpcode() == BIPUSH) && (n.operand == 27))
    {
      n.operand = 9;
      return true;
    }
  }
});
tweak("FCTileEntityCookingVessel", null, BOTH, "a(I)Lwm;", 0x4A501C5, "(1/2) Including anti-crash safety measure",
function(mn)
{
  var label = LabelNode();
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ILOAD, 1),
      IntInsnNode(BIPUSH, 9),
      JumpInsnNode(IF_ICMPLT, label),
      InsnNode(ACONST_NULL),
      InsnNode(ARETURN),
      label,
      FrameNode(F_SAME, 0, null, 0, null),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("FCTileEntityCookingVessel", null, BOTH, "a(ILwm;)V", 0x414B078B, "(2/2) Including anti-crash safety measure",
function(mn)
{
  var label = LabelNode();
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ILOAD, 1),
      IntInsnNode(BIPUSH, 9),
      JumpInsnNode(IF_ICMPLT, label),
      InsnNode(RETURN),
      label,
      FrameNode(F_SAME, 0, null, 0, null),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("FCTileEntityCookingVessel", null, BOTH, "h()V", 0x5D0638DA, "Making heat dissipate slower",
function(mn)
{
  var i;
  var state = 0;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if ((state == 0) && isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && (n.name == "PerformNormalFireUpdate"))
    {
      state = 1;
    }
    if ((state == 1) && isInstance(n, "org.objectweb.asm.tree.InsnNode") && (n.getOpcode() == ICONST_0))
    {
      mn.instructions.insert(n, toInsnList(
        [
          MethodInsnNode(INVOKESTATIC, "java/lang/Math", "max", "(II)I"),
        ]
      ));
      mn.instructions.insertBefore(n, toInsnList(
        [
          VarInsnNode(ALOAD, 0),
          FieldInsnNode(GETFIELD, "FCTileEntityCookingVessel", "m_iCookCounter", "I"),
          IntInsnNode(BIPUSH, 24),
          InsnNode(ISUB),
        ]
      ));
      return true;
    }
  }
});
