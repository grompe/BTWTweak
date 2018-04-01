if (!isBTWVersionOrNewer("4.AAAAAAAAAAHHHH"))
{
  add("GPEBlockLogDamaged", null, BOTH, "Removing references to new BTW",
  function(cn)
  {
    cn.superName = "FCBlockLog";
  });
  // tweaking overrides adapting, so have to call it manually
  add("GPEBlockLogDamaged", null, SERVER, "Removing client-only methods", removeClientOnlyMethods);
}
