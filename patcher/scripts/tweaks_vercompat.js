// ============================
// Compatibility with older BTW
// ============================

if (!isBTWVersionOrNewer("4.AAAAAAAAAAHHHH"))
{
  add("GPEBlockLogDamaged", null, BOTH, "Removing references to new BTW",
  function(cn)
  {
    cn.superName = "FCBlockLog";
  });
  // tweaking overrides adapting, so have to call it manually
  add("GPEBlockLogDamaged", null, SERVER, "Removing client-only methods", removeClientOnlyMethods);

  add("GPEItemChiselRefined", null, BOTH, "Removing references to new BTW",
  function(cn)
  {
    cn.superName = "FCItemToolPickaxeCustom";
  })
  // tweaking overrides adapting, so have to call it manually
  add("GPEItemChiselRefined", null, SERVER, "Removing client-only methods", removeClientOnlyMethods);
}

// ============================
// Compatibility with newer BTW
// ============================

if (isBTWVersionOrNewer("4.AABABABA"))
{
  tweak("GPEBlockChest", null, BOTH, "<init>(I)V", CHECKSUM_IGNORE, "Removing extra init parameter",
  function(mn)
  {
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("FCBlockChest") && n.name.equals("<init>") && n.desc.equals("(II)V"))
      {
        n.desc = "(I)V";
        mn.instructions.insertBefore(n, toInsnList(
          [
            InsnNode(POP),
          ]
        ));
        return true;
      }
    }
  });
  // tweaking overrides adapting, so have to call it manually
  add("GPEBlockChest", null, SERVER, "Removing client-only methods", removeClientOnlyMethods);
}
if (isBTWVersionOrNewer("4.ABBBBURNBABYBURNAHAHAHAHAHA"))
{
  function changeOwner(mn)
  {
    for (var i = 0; i < mn.instructions.size(); i++)
    {
      var n = mn.instructions.get(i);
      if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode") && n.owner.equals("FCItemBlockCustom"))
      {
        n.owner = "xn";
        return true;
      }
    }
  }
  tweak("GPEItemBlockMicro", null, BOTH, "<init>(I)V", CHECKSUM_IGNORE, "(1/2) Changing inheritance from removed class",
    changeOwner);
  tweak("GPEItemBlockMicro", null, BOTH, "a(Lwm;Lsq;Laab;IIIIFFF)Z", CHECKSUM_IGNORE, "(1/3) Changing inheritance from removed class",
    changeOwner);
  add("GPEItemBlockMicro", null, BOTH, "(3/3) Changing inheritance from removed class",
  function(cn)
  {
    cn.superName = "xn";
  });
  // tweaking overrides adapting, so have to call it manually
  add("GPEItemBlockMicro", null, SERVER, "Removing client-only methods", removeClientOnlyMethods);
}
