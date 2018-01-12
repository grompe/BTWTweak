add("bkc", "SoundSystem", CLIENT, "Adding ability to play entity-bound sound once",
function(cn)
{
  var source;
  for (var i = 0; i < cn.methods.size(); i++)
  {
    mn = cn.methods.get(i);
    if (mn.name + mn.desc == "a(Ljava/lang/String;Lmp;FFZ)V")
    {
      source = mn;
      break;
    }
  }
  if (!source)
  {
    log("Error: failed to find playEntitySound function!");
    return;
  }
  var mn = cloneMethod(source, ACC_PUBLIC, "playEntitySoundOnce", "(Ljava/lang/String;Lmp;FFZ)V", null, null);
  var found = false;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("paulscode/sound/SoundSystem") && n.name.equals("setLooping") && n.desc.equals("(Ljava/lang/String;Z)V"))
    {
      var n2 = n.getPrevious();
      if (n2.opcode == ICONST_1)
      {
        mn.instructions.set(n2, InsnNode(ICONST_0));
        found = true;
        break;
      }
    }
  }
  if (!found)
  {
    log("Error: failed to find the looping setting in playEntitySound function!");
    return;
  };
  cn.methods.add(mn);
});
tweak("ru", "EntityCreeper", BOTH, "a_(Lsq;)Z", [0xC74B29CB, 0xC58F29C5, 0xC7B729D7, 0xC5FB29D1, 0xB4E52E97], "Hurting and shutting up Creeper when sheared",
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

      VarInsnNode(ALOAD, 1),
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "stopEntitySoundBroadcast", "(Lsq;Lmp;)V"),
    ]
  ).process(mn);
});
tweak("ru", "EntityCreeper", BOTH, "a(Lmg;)V", 0xD7750D7F, "Shutting up Creeper when killed",
function(mn)
{
  return CodeInserter(
    BeginningFinder(),
    [
      VarInsnNode(ALOAD, 0),
      MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "stopEntitySound", "(Lmp;)V"),
    ],
    INSERT_BEFORE
  ).process(mn);
});
tweak("ru", "EntityCreeper", BOTH, "l_()V", 0x738C246E, "Making Creeper hiss stoppable",
function(mn)
{
  var changes = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && (n.cst.toString() == "random.fuse"))
    {
      n2 = n.getPrevious();
      mn.instructions.insert(n, VarInsnNode(ALOAD, 0));
      mn.instructions.remove(n2);
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("ru") && n.name.equals("a") && n.desc.equals("(Ljava/lang/String;FF)V"))
    {
      mn.instructions.insert(n, toInsnList(
        [
          InsnNode(ICONST_1),
          MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "playEntitySoundOnce", "(Ljava/lang/String;Lmp;FFZ)V"),
        ]
      ));
      mn.instructions.remove(n);
      changes++;
      break;
    }
  }
  for (i += 1; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("ru") && n.name.equals("q") && n.desc.equals("Laab;"))
    {
      mn.instructions.insertBefore(n, toInsnList(
        [
          MethodInsnNode(INVOKESTATIC, "GPEBTWTweak", "stopEntitySound", "(Lmp;)V"),
          VarInsnNode(ALOAD, 0),
        ]
      ));
      changes++;
      break;
    }
  }
  if (changes == 3) return true;
});

tweak("anm", "BlockNote", BOTH, "b(Laab;IIIII)Z", 0x3C4D15CA, "(1/3) Adding a bark note",
function(mn)
{
  var changes = 0;
  if (replaceFirstString(mn, "harp", "note.harp")) changes++;
  if (replaceFirstString(mn, "bd", "note.bd")) changes++;
  if (replaceFirstString(mn, "snare", "note.snare")) changes++;
  if (replaceFirstString(mn, "hat", "note.hat")) changes++;
  if (replaceFirstString(mn, "note.", "")) changes++;

  var label = LabelNode();
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && (n.cst.toString() == "bassattack"))
    {
      n.cst = String("note.bassattack");
      n2 = mn.instructions.get(i + 3); // fakeinst
      if (isInstance(n2, "org.objectweb.asm.tree.LineNumberNode"))
      {
        mn.instructions.insert(n2, toInsnList(
          [
            VarInsnNode(ILOAD, 5),
            InsnNode(ICONST_5),
            JumpInsnNode(IF_ICMPNE, label),
            LdcInsnNode("mob.wolf.bark1"),
            VarInsnNode(ASTORE, 8),
            label,
            //FrameNode(F_SAME, 0, null, 0, null),
          ]
        ));
        return changes == 5;
      }
    }
  }
});
tweak("FCItemTuningFork", null, BOTH, "a(Lwm;Lsq;Laab;IIIIFFF)Z", 0xDBBD1F93, "(3/3) Adding a bark note",
function(mn)
{
  var changes = 0;
  if (replaceFirstString(mn, "harp", "note.harp")) changes++;
  if (replaceFirstString(mn, "bd", "note.bd")) changes++;
  if (replaceFirstString(mn, "snare", "note.snare")) changes++;
  if (replaceFirstString(mn, "hat", "note.hat")) changes++;
  if (replaceFirstString(mn, "note.", "")) changes++;

  var label = LabelNode();
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.LdcInsnNode") && (n.cst.toString() == "bassattack"))
    {
      n.cst = String("note.bassattack");
      n2 = mn.instructions.get(i + 4); // fakeinst
      if (isInstance(n2, "org.objectweb.asm.tree.FrameNode"))
      {
        mn.instructions.insert(n2, toInsnList(
          [
            VarInsnNode(ALOAD, 3),
            VarInsnNode(ILOAD, 4),
            VarInsnNode(ILOAD, 5),
            VarInsnNode(ILOAD, 6),
            MethodInsnNode(INVOKEVIRTUAL, "aab", "a", "(III)I"),
            VarInsnNode(ISTORE, 16),
            VarInsnNode(ILOAD, 16),
            FieldInsnNode(GETSTATIC, "FCBetterThanWolves", "fcCompanionCube", "Lapa;"),
            FieldInsnNode(GETFIELD, "apa", "cz", "I"),
            JumpInsnNode(IF_ICMPNE, label),
            LdcInsnNode("mob.wolf.bark1"),
            VarInsnNode(ASTORE, 13),
            label,
            FrameNode(F_APPEND, 1, [INTEGER], 0, null),
          ]
        ));
        return changes == 5;
      }
    }
  }
});
tweak("aql", "TileEntityNote", BOTH, "a(Laab;III)V", 0x8218101D, "(2/3) Adding a bark note",
function(mn)
{
  var changes = 0;
  var label = LabelNode();
  var i;
  for (i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && n.owner.equals("aif") && n.name.equals("d") && n.desc.equals("Laif;"))
    {
      n2 = mn.instructions.get(i + 5); // fakeinst
      if (isInstance(n2, "org.objectweb.asm.tree.LineNumberNode"))
      {
        mn.instructions.insert(n2, toInsnList(
          [
            VarInsnNode(ALOAD, 1),
            VarInsnNode(ILOAD, 2),
            VarInsnNode(ILOAD, 3),
            InsnNode(ICONST_1),
            InsnNode(ISUB),
            VarInsnNode(ILOAD, 4),
            MethodInsnNode(INVOKEVIRTUAL, "aab", "a", "(III)I"),
            VarInsnNode(ISTORE, 7),
            VarInsnNode(ILOAD, 7),
            FieldInsnNode(GETSTATIC, "FCBetterThanWolves", "fcCompanionCube", "Lapa;"),
            FieldInsnNode(GETFIELD, "apa", "cz", "I"),
            JumpInsnNode(IF_ICMPNE, label),
            InsnNode(ICONST_5),
            VarInsnNode(ISTORE, 6),
            label,
            //FrameNode(F_APPEND, 1, [INTEGER], 0, null),
          ]
        ));
        return true;
      }
    }
  }
});
