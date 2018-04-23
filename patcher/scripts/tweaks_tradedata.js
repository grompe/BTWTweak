var villagerTrades =
{
//  wantsFarmer: [[1, ["wk", "U", "Lwk;", 48, 0], null, 1]], sellsFarmer: [[1, ["wk", "U", "Lwk;", 48, 0], null, 1]],
  wantsFarmer: [], sellsFarmer: [],
  wantsButcher: [], sellsButcher: [],
  wantsBlacksmith: [], sellsBlacksmith: [],
  wantsLibrarian: [], sellsLibrarian: [],
  wantsPriest: [], sellsPriest: [],
};
var wantsNames = ["wantsFarmer", "wantsButcher", "wantsBlacksmith", "wantsLibrarian", "wantsPriest"];
var sellsNames = ["sellsFarmer", "sellsButcher", "sellsBlacksmith", "sellsLibrarian", "sellsPriest"];
var enchantment2meta =
{
  d: 0,
  e: 1,
  f: 2,
  g: 3,
  h: 4,
  i: 5,
  j: 6,
  k: 7,
  l: 16,
  m: 17,
  n: 18,
  o: 19,
  p: 20,
  q: 21,
  r: 32,
  s: 33,
  t: 34,
  u: 35,
  v: 48,
  w: 49,
  x: 50,
  y: 51,
};
function isBlockClass(desc)
{
  if (desc == "Lapa;") return true;
  if (desc == "Lann;") return true;
  return false;
}

function analyzeTrades(mn, villagerType)
{
  var wants = villagerTrades[wantsNames[villagerType]];
  var sells = villagerTrades[sellsNames[villagerType]];
  var seenints = [];
  var seenfields = [];
  var seenitemstacks = [];
  var lvl, stack1, stack2, price, amount, meta, id;
  var numberOfzq2stackInitSeen = 0;
  for (var i = 0; i < mn.instructions.size(); i++)
  {
    var n = mn.instructions.get(i);
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && (n.opcode == GETSTATIC))
    {
      if (n.desc.equals("Lapa;") || n.desc.equals("Lwk;")
        // ItemShears, ItemArmor, ItemFishingRod, ItemEnchantedBook
        || n.desc.equals("Lxe;") || n.desc.equals("Luo;") || n.desc.equals("Lwd;") || n.desc.equals("Lvw;")
        // BlockMycelium
        || n.desc.equals("Lann;")
        // Enchantment
        || n.desc.equals("Lyz;")
        )
      {
        seenfields.push([n.owner, n.name, n.desc]);
      }
    }
    if (isInstance(n, "org.objectweb.asm.tree.FieldInsnNode") && (n.opcode == GETFIELD) && n.desc.equals("I"))
    {
      id = -1; // this shouldn't appear anywhere
      if (n.owner.equals("wk") && n.name.equals("cp"))
      {
        stack1 = seenfields[seenfields.length - 1];
        if (stack1[0] == "wk" && stack1[1] == "bI" && stack1[2] == "Lwk;") id = 132+256; // emerald
        if (stack1[0] == "wk" && stack1[1] == "bR" && stack1[2] == "Lwk;") id = 141+256; // skull
      }
      seenints.push(id);
    }
    if (isInstance(n, "org.objectweb.asm.tree.IntInsnNode"))
    {
      seenints.push(n.operand);
    }
    if (isInstance(n, "org.objectweb.asm.tree.InsnNode"))
    {
      if (n.opcode == ICONST_M1) seenints.push(-1);
      if (n.opcode == ICONST_0) seenints.push(0);
      if (n.opcode == ICONST_1) seenints.push(1);
      if (n.opcode == ICONST_2) seenints.push(2);
      if (n.opcode == ICONST_3) seenints.push(3);
      if (n.opcode == ICONST_4) seenints.push(4);
      if (n.opcode == ICONST_5) seenints.push(5);
    }
    if (isInstance(n, "org.objectweb.asm.tree.MethodInsnNode"))
    {
      if (n.owner.equals("wm") && n.name.equals("<init>"))
      {
        meta = 0;
        amount = 1;
        if (n.desc.equals("(Lapa;II)V") || n.desc.equals("(Lwk;II)V"))
        {
          meta = seenints.pop();
          amount = seenints.pop();
        }
        else if (n.desc.equals("(Lapa;I)V") || n.desc.equals("(Lwk;I)V"))
        {
          amount = seenints.pop();
        }
        else if (n.desc.equals("(Lapa;)V") || n.desc.equals("(Lwk;)V"))
        {
        }
        else if (n.desc.equals("(III)V"))
        {
          meta = seenints.pop();
          amount = seenints.pop();
          id = seenints.pop();
          seenitemstacks.push([id, null, "I", amount, meta]);
          continue;
        }
        else
        {
          log("Unexpected ItemStack initialization with desc: " + n.desc);
          return false; // fail early
        }
        seenitemstacks.push(seenfields.pop().concat(amount, meta));
      }
      if (n.owner.equals("zq") && n.name.equals("<init>"))
      {
        if (n.desc.equals("(Lwm;Lwm;I)V"))
        {
          lvl = numberOfzq2stackInitSeen + 1;
          numberOfzq2stackInitSeen++;
          var stack_emeralds = seenitemstacks.pop();
          price = stack_emeralds[3];
          stack1 = seenitemstacks.pop();
          wants.push([lvl, stack1, null, price]);
          seenints = [];
          seenfields = [];
          seenitemstacks = [];
        }
        else if (n.desc.equals("(Lwm;Lwm;Lwm;I)V"))
        {
          lvl = seenints.pop();
          stack1 = seenitemstacks.pop();
          var stack_emeralds = seenitemstacks.pop();
          price = stack_emeralds[3];
          if (stack_emeralds[1] == "fcBlockSoulforgeDormant") price = 666; // special case
          stack2 = seenitemstacks.pop();
          sells.push([lvl, stack1, stack2, price]);
          seenints = [];
          seenfields = [];
          seenitemstacks = [];
        }
        else
        {
          log("Unexpected MerchantRecipe initialization with desc: " + n.desc);
          return false; // fail early
        }
      }
      if (n.name.equals("CheckForWishToBuyMultipleItemsTrade"))
      {
        lvl = seenints.pop();
        seenints.pop();
        amount = seenints.pop();
        meta = 0;
        if (n.desc.equals("(Lzr;IIFIII)V")) meta = seenints.pop();
        stack1 = seenfields.pop();
        if (stack1[1] == "fcItemCandle" && meta == 16) meta = 0; // 16 is picked up from random.nextInt(16)
        wants.push([lvl, stack1.concat(amount, meta), null, 1]);
        seenints = [];
        seenfields = [];
        seenitemstacks = [];
      }
      if (n.name.equals("CheckForWishToSellMultipleItemsTrade"))
      {
        lvl = seenints.pop();
        amount = seenints.pop();
        seenints.pop();
        meta = 0;
        if (n.desc.equals("(Lzr;IIFIII)V")) meta = seenints.pop();
        sells.push([lvl, seenfields.pop().concat(amount, meta), null, 1]);
        seenints = [];
        seenfields = [];
        seenitemstacks = [];
      }
      if (n.name.equals("CheckForWishToBuySingleItemTrade"))
      {
        lvl = seenints.pop();
        price = seenints.pop();
        seenints.pop();
        meta = 0;
        if (n.desc.equals("(Lzr;IIFIII)V")) meta = seenints.pop();
        wants.push([lvl, seenfields.pop().concat(1, meta), null, price]);
        seenints = [];
        seenfields = [];
        seenitemstacks = [];
      }
      if (n.name.equals("CheckForComplexTrade") && n.desc.equals("(Lzr;Lwm;Lwm;Lwm;FI)V"))
      {
        lvl = seenints.pop();
        price = seenitemstacks.pop()[3]; // from emerald ItemStack creation
        stack1 = seenitemstacks.pop();
        stack2 = seenitemstacks.pop();
        wants.push([lvl, stack1, stack2, price]);
        seenints = [];
        seenfields = [];
        seenitemstacks = [];
      }
      if (n.name.equals("CheckForWishToSellSingleItemTrade"))
      {
        lvl = seenints.pop();
        seenints.pop();
        price = seenints.pop();
        meta = 0;
        if (n.desc.equals("(Lzr;IIFIII)V")) meta = seenints.pop();
        sells.push([lvl, seenfields.pop().concat(1, meta), null, price]);
        seenints = [];
        seenfields = [];
        seenitemstacks = [];
      }
      if (n.name.equals("CheckForArcaneScrollTrade") && n.desc.equals("(Lzr;IFIII)V"))
      {
        lvl = seenints.pop();
        seenints.pop();
        price = seenints.pop();
        meta = enchantment2meta[seenfields.pop()[1]];
        // wk.aL = paper
        sells.push([lvl, ["FCBetterThanWolves", "fcArcaneScroll", "Lwk;", 1, meta], ["wk", "aL", "Lwk;", 1, 0], price]);
        seenints = [];
        seenfields = [];
        seenitemstacks = [];
      }
      if (n.name.equals("CheckForItemEnchantmentForCostTrade") && n.desc.equals("(Lzr;Lwk;FIII)V"))
      {
        lvl = seenints.pop();
        seenints.pop();
        price = seenints.pop();
        stack1 = seenfields.pop().concat(1, 0);
        sells.push([lvl, stack1.concat(true), stack1, price]);
        seenints = [];
        seenfields = [];
        seenitemstacks = [];
      }
    }
  }
  return true;
}

function analyzeFarmerTrades(mn) { return analyzeTrades(mn, 0); }
function analyzeButcherTrades(mn) { return analyzeTrades(mn, 1); }
function analyzeBlacksmithTrades(mn) { return analyzeTrades(mn, 2); }
function analyzeLibrarianTrades(mn) { return analyzeTrades(mn, 3); }
function analyzePriestTrades(mn) { return analyzeTrades(mn, 4); }

if (isBTWVersionOrNewer("4.9 Marsupial?"))
{
  tweak("sm", "EntityVillager", CLIENT, "CheckForPeasantTrades(Lzr;)V", CHECKSUM_IGNORE, "(1/5) Analyzing villager trades", analyzeFarmerTrades);
  tweak("sm", "EntityVillager", CLIENT, "CheckForLibrarianTrades(Lzr;)V", CHECKSUM_IGNORE, "(2/5) Analyzing villager trades", analyzeLibrarianTrades);
  tweak("sm", "EntityVillager", CLIENT, "CheckForPriestTrades(Lzr;)V", CHECKSUM_IGNORE, "(3/5) Analyzing villager trades", analyzePriestTrades);
  tweak("sm", "EntityVillager", CLIENT, "CheckForBlacksmithTrades(Lzr;)V", CHECKSUM_IGNORE, "(4/5) Analyzing villager trades", analyzeBlacksmithTrades);
  tweak("sm", "EntityVillager", CLIENT, "CheckForButcherTrades(Lzr;)V", CHECKSUM_IGNORE, "(5/5) Analyzing villager trades", analyzeButcherTrades);

  tweak("sm", "EntityVillager", CLIENT, "GetPeasantLevelUpRecipe()Lzq;", CHECKSUM_IGNORE, "(1/5) Analyzing villager level-up trades", analyzeFarmerTrades);
  tweak("sm", "EntityVillager", CLIENT, "GetLibrarianLevelUpRecipe()Lzq;", CHECKSUM_IGNORE, "(2/5) Analyzing villager level-up trades", analyzeLibrarianTrades);
  tweak("sm", "EntityVillager", CLIENT, "GetPriestLevelUpRecipe()Lzq;", CHECKSUM_IGNORE, "(3/5) Analyzing villager level-up trades", analyzePriestTrades);
  tweak("sm", "EntityVillager", CLIENT, "GetBlacksmithLevelUpRecipe()Lzq;", CHECKSUM_IGNORE, "(4/5) Analyzing villager level-up trades", analyzeBlacksmithTrades);
  tweak("sm", "EntityVillager", CLIENT, "GetButcherLevelUpRecipe()Lzq;", CHECKSUM_IGNORE, "(5/5) Analyzing villager level-up trades", analyzeButcherTrades);

  if (isBTWVersionOrNewer("4.A3 Headed Beastie"))
  {
    tweak("sm", "EntityVillager", CLIENT, "CheckForPeasantMandatoryTrades(I)I", CHECKSUM_IGNORE, "(1/5) Analyzing villager mandatory trades", analyzeFarmerTrades);
    tweak("sm", "EntityVillager", CLIENT, "CheckForLibrarianMandatoryTrades(I)I", CHECKSUM_IGNORE, "(2/5) Analyzing villager mandatory trades", analyzeLibrarianTrades);
    tweak("sm", "EntityVillager", CLIENT, "CheckForPriestMandatoryTrades(I)I", CHECKSUM_IGNORE, "(3/5) Analyzing villager mandatory trades", analyzePriestTrades);
    tweak("sm", "EntityVillager", CLIENT, "CheckForBlacksmithMandatoryTrades(I)I", CHECKSUM_IGNORE, "(4/5) Analyzing villager mandatory trades", analyzeBlacksmithTrades);
    tweak("sm", "EntityVillager", CLIENT, "CheckForButcherMandatoryTrades(I)I", CHECKSUM_IGNORE, "(5/5) Analyzing villager mandatory trades", analyzeButcherTrades);
  }
  tweak("GPEInteropCraftGuide", null, CLIENT, "initVillagerTrades()V", CHECKSUM_IGNORE, "Adding real villager trades",
  function(mn)
  {
    function addItemStack(owner, name, desc, amount, meta, enchanted)
    {
      if (typeof owner == "undefined")
      {
        mn.instructions.add(toInsnList(
          [
            InsnNode(ACONST_NULL),
          ]
        ));
        return;
      }
      if (typeof amount == "undefined") amount = 1;
      if (typeof meta == "undefined") meta = 0;
      rootdesc = isBlockClass(desc) ? "Lapa;" : "Lwk;";
      if (desc == "I") rootdesc = "I";
      if (enchanted)
      {
        mn.instructions.add(toInsnList(
          [
            FieldInsnNode(GETSTATIC, "GPEInteropCraftGuide", "random", "Ljava/util/Random;"),
          ]
        ));
      }
      mn.instructions.add(toInsnList(
        [
          TypeInsnNode(NEW, "wm"),
          InsnNode(DUP),
        ]
      ));
      if (desc == "I")
      {
        mn.instructions.add(toInsnList(
          [
            IntInsnNode(SIPUSH, owner), // actually item ID
          ]
        ));
      } else {
        mn.instructions.add(toInsnList(
          [
            FieldInsnNode(GETSTATIC, owner, name, desc),
          ]
        ));
      }
      mn.instructions.add(toInsnList(
        [
          IntInsnNode(BIPUSH, amount),
          IntInsnNode(SIPUSH, meta),
          MethodInsnNode(INVOKESPECIAL, "wm", "<init>", "(" + rootdesc + "II)V"),
        ]
      ));
      if (enchanted)
      {
        mn.instructions.add(toInsnList(
          [
            IntInsnNode(BIPUSH, 19),
            MethodInsnNode(INVOKESTATIC, "zb", "a", "(Ljava/util/Random;Lwm;I)Lwm;"),
          ]
        ));
      }
    }
    mn.instructions.clear();

    for (var villager = 0; villager < wantsNames.length; villager++)
    {
      for (var doingSells = 0; doingSells <= 1; doingSells++)
      {
        var wantsName = doingSells ? sellsNames[villager] : wantsNames[villager];
        var wants = villagerTrades[wantsName];
        mn.instructions.add(toInsnList(
          [
            IntInsnNode(SIPUSH, wants.length),
            TypeInsnNode(ANEWARRAY, "[Ljava/lang/Object;"),
          ]
        ));

        for (var i = 0; i < wants.length; i++)
        {
          mn.instructions.add(toInsnList(
            [
              InsnNode(DUP),
              IntInsnNode(SIPUSH, i),

              InsnNode(ICONST_4),
              TypeInsnNode(ANEWARRAY, "java/lang/Object"),

              InsnNode(DUP),
              InsnNode(ICONST_0),
              IntInsnNode(BIPUSH, wants[i][0]),
              MethodInsnNode(INVOKESTATIC, "java/lang/Integer", "valueOf", "(I)Ljava/lang/Integer;"),
              InsnNode(AASTORE),

              InsnNode(DUP),
              InsnNode(ICONST_1),
            ]
          ));
          addItemStack.apply(null, wants[i][1]);
          mn.instructions.add(toInsnList(
            [
              InsnNode(AASTORE),

              InsnNode(DUP),
              InsnNode(ICONST_2),
            ]
          ));
          addItemStack.apply(null, wants[i][2]);
          mn.instructions.add(toInsnList(
            [
              InsnNode(AASTORE),

              InsnNode(DUP),
              InsnNode(ICONST_3),
              IntInsnNode(SIPUSH, wants[i][3]), // SIPUSH because of special case 666
              MethodInsnNode(INVOKESTATIC, "java/lang/Integer", "valueOf", "(I)Ljava/lang/Integer;"),
              InsnNode(AASTORE),

              InsnNode(AASTORE),
            ]
          ));
        }
        mn.instructions.add(toInsnList(
          [
            FieldInsnNode(PUTSTATIC, "GPEInteropCraftGuide", wantsName, "[[Ljava/lang/Object;"),
          ]
        ));
      }
    }
    mn.instructions.add(toInsnList(
      [
        InsnNode(RETURN),
      ]
    ));
    return true;
  });
}
