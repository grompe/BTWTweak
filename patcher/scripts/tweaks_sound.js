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
tweak("ru", "EntityCreeper", BOTH, "a_(Lsq;)Z", [0xC74B29CB, 0xC58F29C5, 0xC7B729D7, 0xC5FB29D1], "Hurting and shutting up Creeper when sheared",
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
