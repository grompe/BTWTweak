package net.minecraft.src;

import java.lang.reflect.*;
import java.util.Random;

class GPEInteropCraftGuide implements InvocationHandler
{
  private static Object[][] wantsFarmer, sellsFarmer;
  private static Object[][] wantsButcher, sellsButcher;
  private static Object[][] wantsBlacksmith, sellsBlacksmith;
  private static Object[][] wantsLibrarian, sellsLibrarian;
  private static Object[][] wantsPriest, sellsPriest;

  private static Object[][][] wants, sells;
  private static Object[] villagers = new String[] {"Farmer", "Butcher", "Blacksmith", "Librarian", "Priest"};
  private static int[][] bgcoords = new int[][] {{1, 1, 82, 1}, {1, 61, 82, 61}, {1, 121, 82, 121}, {1, 181, 82, 181}, {163, 1, 163, 61}};

  private static final Random random = new Random();

  public Object invoke(Object proxy, Method method, Object[] args)
  {
    if (method.getName().equals("generateRecipes"))
    {
      try
      {
        FCAddOnHandler.LogMessage("Now integrating with CraftGuide for real...");

        Object generator = args[0];
        Class rg = generator.getClass();
        Class rt = Class.forName("uristqwerty.CraftGuide.api.RecipeTemplate");
        Class slot = Class.forName("uristqwerty.CraftGuide.api.Slot");
        Class slots = Array.newInstance(slot, 0).getClass();
        Class slottype = Class.forName("uristqwerty.CraftGuide.api.SlotType");
        Class itemslot = Class.forName("uristqwerty.CraftGuide.api.ItemSlot");
        Constructor itemsslot_ctor = itemslot.getConstructor(int.class, int.class, int.class, int.class, boolean.class);
        Class extraslot = Class.forName("uristqwerty.CraftGuide.api.ExtraSlot");
        Constructor extraslot_ctor = extraslot.getConstructor(int.class, int.class, int.class, int.class, Object.class);
        Class infoslot = Class.forName("uristqwerty.CraftGuide.api.InfoSlot");
        Constructor infoslot_ctor = infoslot.getConstructor(int.class, int.class, ItemStack.class, String[].class);
        Method addRecipe = rg.getMethod("addRecipe", new Class[] {rt, Object[].class});
        Method createTemplate = rg.getMethod("createRecipeTemplate", new Class[] {slots, ItemStack.class});
        Method createTemplateBg = rg.getMethod("createRecipeTemplate", new Class[] {slots, ItemStack.class, String.class, int.class, int.class, int.class, int.class});
        Method drawownbg = itemslot.getMethod("drawOwnBackground", new Class[0]);
        Method setslottype = itemslot.getMethod("setSlotType", new Class[] {slottype});
        Method setclickable = extraslot.getMethod("clickable", new Class[0]);
        Method setshowname = extraslot.getMethod("showName", new Class[0]);
        Enum output_slot = Enum.valueOf(slottype, "OUTPUT_SLOT");
        Enum machine_slot = Enum.valueOf(slottype, "MACHINE_SLOT");

        ItemStack workbench = new ItemStack(Block.workbench);

        Object myslots = Array.newInstance(slot, 7);
        Object tmp;
        tmp = itemsslot_ctor.newInstance(3, 12, 16, 16, true); drawownbg.invoke(tmp); Array.set(myslots, 0, tmp);
        tmp = itemsslot_ctor.newInstance(3, 30, 16, 16, false); drawownbg.invoke(tmp); Array.set(myslots, 1, tmp);
        tmp = itemsslot_ctor.newInstance(41, 12, 16, 16, true); setslottype.invoke(tmp, output_slot); drawownbg.invoke(tmp); Array.set(myslots, 2, tmp);
        tmp = itemsslot_ctor.newInstance(41, 30, 16, 16, true); setslottype.invoke(tmp, output_slot); drawownbg.invoke(tmp); Array.set(myslots, 3, tmp);
        tmp = itemsslot_ctor.newInstance(59, 12, 16, 16, true); setslottype.invoke(tmp, output_slot); drawownbg.invoke(tmp); Array.set(myslots, 4, tmp);
        tmp = itemsslot_ctor.newInstance(59, 30, 16, 16, true); setslottype.invoke(tmp, output_slot); drawownbg.invoke(tmp); Array.set(myslots, 5, tmp);
        tmp = extraslot_ctor.newInstance(22, 21, 16, 16, workbench); setclickable.invoke(tmp); setslottype.invoke(tmp, machine_slot); Array.set(myslots, 6, tmp);

        Object template = createTemplate.invoke(generator, myslots, workbench);

        // Wood chopping
        ItemStack axeStone = new ItemStack(Item.axeStone);
        ItemStack axe2 = axeStone;
        if (GPEBTWTweak.isBTWVersionOrNewer("4.AAAAAAAAAAHHHH"))
        {
          axe2 = new ItemStack(Item.axeIron);
          addRecipe.invoke(generator, template, new Object[] {new ItemStack(Block.wood), axeStone, new ItemStack(Item.stick, 2), new ItemStack(FCBetterThanWolves.fcItemBark), new ItemStack(GPEBTWTweak.compatItemSawDust, 4), null, workbench});
          addRecipe.invoke(generator, template, new Object[] {new ItemStack(Block.wood, 1, 1), axeStone, new ItemStack(Item.stick, 2), new ItemStack(FCBetterThanWolves.fcItemBark, 1, 1), new ItemStack(GPEBTWTweak.compatItemSawDust, 4), null, workbench});
          addRecipe.invoke(generator, template, new Object[] {new ItemStack(Block.wood, 1, 2), axeStone, new ItemStack(Item.stick, 2), new ItemStack(FCBetterThanWolves.fcItemBark, 1, 2), new ItemStack(GPEBTWTweak.compatItemSawDust, 4), null, workbench});
          addRecipe.invoke(generator, template, new Object[] {new ItemStack(Block.wood, 1, 3), axeStone, new ItemStack(Item.stick, 2), new ItemStack(FCBetterThanWolves.fcItemBark, 1, 3), new ItemStack(GPEBTWTweak.compatItemSawDust, 4), null, workbench});
          addRecipe.invoke(generator, template, new Object[] {new ItemStack(Block.wood, 1, 4), axeStone, new ItemStack(Item.stick, 2), new ItemStack(FCBetterThanWolves.fcItemBark, 1, 4), new ItemStack(GPEBTWTweak.compatItemSawDust, 3), new ItemStack(FCBetterThanWolves.fcSoulDust, 1), workbench});
        }
        addRecipe.invoke(generator, template, new Object[] {new ItemStack(Block.wood), axe2, new ItemStack(Block.planks, 2), new ItemStack(FCBetterThanWolves.fcItemBark), new ItemStack(GPEBTWTweak.compatItemSawDust, 2), null, workbench});
        addRecipe.invoke(generator, template, new Object[] {new ItemStack(Block.wood, 1, 1), axe2, new ItemStack(Block.planks, 2, 1), new ItemStack(FCBetterThanWolves.fcItemBark, 1, 1), new ItemStack(GPEBTWTweak.compatItemSawDust, 2), null, workbench});
        addRecipe.invoke(generator, template, new Object[] {new ItemStack(Block.wood, 1, 2), axe2, new ItemStack(Block.planks, 2, 2), new ItemStack(FCBetterThanWolves.fcItemBark, 1, 2), new ItemStack(GPEBTWTweak.compatItemSawDust, 2), null, workbench});
        addRecipe.invoke(generator, template, new Object[] {new ItemStack(Block.wood, 1, 3), axe2, new ItemStack(Block.planks, 2, 3), new ItemStack(FCBetterThanWolves.fcItemBark, 1, 3), new ItemStack(GPEBTWTweak.compatItemSawDust, 2), null, workbench});
        addRecipe.invoke(generator, template, new Object[] {new ItemStack(Block.wood, 1, 4), axe2, new ItemStack(Block.planks, 2, 4), new ItemStack(FCBetterThanWolves.fcItemBark, 1, 4), new ItemStack(GPEBTWTweak.compatItemSawDust, 1), new ItemStack(FCBetterThanWolves.fcSoulDust, 1), workbench});

        // Baiting
        ItemStack fishingRod = new ItemStack(Item.fishingRod);
        ItemStack fishingRodBaited = new ItemStack(FCBetterThanWolves.fcItemFishingRodBaited);
        addRecipe.invoke(generator, template, new Object[] {new ItemStack(Item.rottenFlesh), fishingRod, fishingRodBaited, null, null, null, workbench});
        addRecipe.invoke(generator, template, new Object[] {new ItemStack(Item.spiderEye), fishingRod, fishingRodBaited, null, null, null, workbench});
        addRecipe.invoke(generator, template, new Object[] {new ItemStack(FCBetterThanWolves.fcItemCreeperOysters), fishingRod, fishingRodBaited, null, null, null, workbench});
        addRecipe.invoke(generator, template, new Object[] {new ItemStack(FCBetterThanWolves.fcItemBatWing), fishingRod, fishingRodBaited, null, null, null, workbench});
        addRecipe.invoke(generator, template, new Object[] {new ItemStack(FCBetterThanWolves.fcItemWitchWart), fishingRod, fishingRodBaited, null, null, null, workbench});
        
        // Knitting
        if (GPEBTWTweak.isBTWVersionOrNewer("4.AABBBbbb"))
        {
          addRecipe.invoke(generator, template, new Object[] {new ItemStack(FCBetterThanWolves.fcItemWool, 2, 32767), new ItemStack(22321+256, 1, 0), new ItemStack(22322+256, 1, 0), null, null, null, workbench});
        }
        
        // Piston packing
        if (GPEBTWTweak.isBTWVersionOrNewer("4.89666"))
        {
          ItemStack piston = new ItemStack(Block.pistonBase);

          myslots = Array.newInstance(slot, 3);
          tmp = itemsslot_ctor.newInstance(12, 21, 16, 16, true); drawownbg.invoke(tmp); Array.set(myslots, 0, tmp);
          tmp = itemsslot_ctor.newInstance(50, 21, 16, 16, true); setslottype.invoke(tmp, output_slot); drawownbg.invoke(tmp); Array.set(myslots, 1, tmp);
          tmp = extraslot_ctor.newInstance(31, 21, 16, 16, piston); setclickable.invoke(tmp); setshowname.invoke(tmp); setslottype.invoke(tmp, machine_slot); Array.set(myslots, 2, tmp);

          template = createTemplate.invoke(generator, myslots, piston);

          for (int i = 0; i < Item.itemsList.length; i++)
          {
            Item item = Item.itemsList[i];
            if (item != null)
            {
              ItemStack tmpstack = new ItemStack(item);
              if (GPEBTWTweak.isPistonPackable(tmpstack))
              {
                int count = GPEBTWTweak.getRequiredItemCountToPistonPack(tmpstack);
                int resultid = GPEBTWTweak.getResultingBlockIDOnPistonPack(tmpstack);
                int resultmeta = GPEBTWTweak.getResultingBlockMetadataOnPistonPack(tmpstack);
                addRecipe.invoke(generator, template, new Object[] {new ItemStack(item, count), new ItemStack(resultid, 1, resultmeta), piston});
              }
              else if (item.IsPistonPackable(tmpstack))
              {
                int count = item.GetRequiredItemCountToPistonPack(tmpstack);
                int resultid = item.GetResultingBlockIDOnPistonPack(tmpstack);
                int resultmeta = item.GetResultingBlockMetadataOnPistonPack(tmpstack);
                addRecipe.invoke(generator, template, new Object[] {new ItemStack(item, count), new ItemStack(resultid, 1, resultmeta), piston});
              }
            }
          }
        }
        
        // Villager trading
        if (wants == null)
        {
          initVillagerTrades();
          wants = new Object[][][] {wantsFarmer, wantsButcher, wantsBlacksmith, wantsLibrarian, wantsPriest};
          sells = new Object[][][] {sellsFarmer, sellsButcher, sellsBlacksmith, sellsLibrarian, sellsPriest};
        }
        ItemStack emerald = new ItemStack(Item.emerald);
        for (int villager = 0; villager < villagers.length; villager++)
        {
          for (int currentlvl = 1; currentlvl <= 5; currentlvl++)
          {
            myslots = Array.newInstance(slot, 4);
            tmp = itemsslot_ctor.newInstance(12, 12, 16, 16, true); drawownbg.invoke(tmp); Array.set(myslots, 0, tmp);
            tmp = itemsslot_ctor.newInstance(12, 30, 16, 16, true); drawownbg.invoke(tmp); Array.set(myslots, 1, tmp);
            tmp = itemsslot_ctor.newInstance(50, 21, 16, 16, true); setslottype.invoke(tmp, output_slot); drawownbg.invoke(tmp); Array.set(myslots, 2, tmp);
            tmp = infoslot_ctor.newInstance(31, 21, null, new String[] {String.format("%s lvl %s", villagers[villager], currentlvl)}); Array.set(myslots, 3, tmp);

            template = createTemplateBg.invoke(generator, myslots, emerald, "/gui/craftguide_villagers.png",
              bgcoords[villager][0], bgcoords[villager][1], bgcoords[villager][2], bgcoords[villager][3]);
            Object[][] want = wants[villager];
            for (int i = 0; i < want.length; i++)
            {
              int lvl = (Integer)want[i][0];
              if (lvl != currentlvl) continue;
              ItemStack item1 = (ItemStack)want[i][1];
              ItemStack item2 = (ItemStack)want[i][2];
              int price = (Integer)want[i][3];
              ItemStack emeralds = price == 1 ? emerald : new ItemStack(Item.emerald, price);
              addRecipe.invoke(generator, template, new Object[] {item1, item2, emeralds, null});
            }
            Object[][] sell = sells[villager];
            for (int i = 0; i < sell.length; i++)
            {
              int lvl = (Integer)sell[i][0];
              if (lvl != currentlvl) continue;
              ItemStack itemsold = (ItemStack)sell[i][1];
              ItemStack itemreq = (ItemStack)sell[i][2];
              int price = (Integer)sell[i][3];
              ItemStack emeralds;
              if (price < 666)
              {
                emeralds = price == 1 ? emerald : new ItemStack(Item.emerald, price);
              } else {
                emeralds = new ItemStack(1002, 1, 0); // Dormant Soulforge
              }
              addRecipe.invoke(generator, template, new Object[] {emeralds, itemreq, itemsold, null});
            }
          }
        }
        FCAddOnHandler.LogMessage("Integration with CraftGuide successful! Added recipes.");
      }
      catch (Exception e)
      {
        FCAddOnHandler.LogMessage("Error while integrating with CraftGuide!");
        e.printStackTrace();
      }
    }
    return null;
  }

  private static void initVillagerTrades() // will be replaced with actual data during BTWTweak install!
  {
    // wants: level, stack1, stack2, best price
    // sells: level, stack_sold, stack_required, best price
    wantsFarmer = new Object[][]
    {
      {1, new ItemStack(Item.wheat, 18), null, 1},
      {1, new ItemStack(Block.cloth, 14), null, 1},
      {1, new ItemStack(Item.chickenRaw, 11), null, 1},
      {1, new ItemStack(Item.fishCooked, 9), null, 1}
    };
    sellsFarmer = new Object[][]
    {
      {1, new ItemStack(Item.bread, 4), null, 1},
      {1, new ItemStack(Item.melon, 8), null, 1},
      {1, new ItemStack(Item.appleRed, 8), null, 1},
      {1, new ItemStack(Item.cookie, 10), null, 1},
      {1, new ItemStack(Item.shears), null, 3},
      {1, new ItemStack(Item.flintAndSteel), null, 3},
      {1, new ItemStack(Item.chickenCooked, 8), null, 1},
      {1, new ItemStack(Item.arrow, 12), null, 1},
      {1, new ItemStack(Item.flint, 5), new ItemStack(Block.gravel, 10), 1},
      {1, new ItemStack(FCBetterThanWolves.fcArcaneScroll, 1, Enchantment.looting.effectId), new ItemStack(Item.paper), 16}
    };
    wantsButcher = new Object[][]
    {
      {1, new ItemStack(Item.coal, 16), null, 1},
      {1, new ItemStack(Item.porkRaw, 9), null, 1},
      {1, new ItemStack(Item.beefRaw, 9), null, 1}
    };
    sellsButcher = new Object[][]
    {
      {1, new ItemStack(Item.saddle), null, 6},
      {1, new ItemStack(Item.plateLeather), null, 4},
      {1, new ItemStack(Item.bootsLeather), null, 2},
      {1, new ItemStack(Item.helmetLeather), null, 2},
      {1, new ItemStack(Item.legsLeather), null, 2},
      {1, new ItemStack(Item.porkCooked, 7), null, 1},
      {1, new ItemStack(Item.beefCooked, 7), null, 1},
      {1, new ItemStack(FCBetterThanWolves.fcArcaneScroll, 1, Enchantment.sharpness.effectId), new ItemStack(Item.paper), 32}
    };
    wantsBlacksmith = new Object[][]
    {
      {1, new ItemStack(Item.coal, 16), null, 1},
      {1, new ItemStack(Item.ingotIron, 8), null, 1},
      {1, new ItemStack(Item.ingotGold, 8), null, 1},
      {1, new ItemStack(Item.diamond, 4), null, 1}
    };
    sellsBlacksmith = new Object[][]
    {
      {1, new ItemStack(Item.swordIron), null, 7},
      {1, new ItemStack(Item.axeIron), null, 6},
      {1, new ItemStack(Item.pickaxeIron), null, 7},
      {1, new ItemStack(Item.shovelIron), null, 4},
      {1, new ItemStack(Item.hoeIron), null, 4},
      {1, new ItemStack(Item.bootsIron), null, 4},
      {1, new ItemStack(Item.helmetIron), null, 4},
      {1, new ItemStack(Item.plateIron), null, 10},
      {1, new ItemStack(Item.legsIron), null, 8},
      {1, new ItemStack(Item.bootsChain), null, 5},
      {1, new ItemStack(Item.helmetChain), null, 5},
      {1, new ItemStack(Item.plateChain), null, 11},
      {1, new ItemStack(Item.legsChain), null, 9},
      {1, new ItemStack(FCBetterThanWolves.fcArcaneScroll, 1, Enchantment.unbreaking.effectId), new ItemStack(Item.paper), 32}
    };
    wantsLibrarian = new Object[][]
    {
      {1, new ItemStack(Item.paper, 27), null, 1},
      {1, new ItemStack(Item.book, 4), null, 1},
      {1, new ItemStack(Item.writableBook), null, 1},
      {1, new ItemStack(Block.bookShelf), null, 1}
    };
    sellsLibrarian = new Object[][]
    {
      {1, new ItemStack(Block.glass, 5), null, 1},
      {1, new ItemStack(Item.compass), null, 10},
      {1, new ItemStack(FCBetterThanWolves.fcArcaneScroll, 1, Enchantment.power.effectId), new ItemStack(Item.paper), 32}
    };
    wantsPriest = new Object[][]
    {
      {1, new ItemStack(FCBetterThanWolves.fcHemp, 18), null, 1}
    };
    sellsPriest = new Object[][]
    {
      {1, EnchantmentHelper.addRandomEnchantment(random, new ItemStack(Item.swordIron), 19), new ItemStack(Item.swordIron), 2},
      {1, EnchantmentHelper.addRandomEnchantment(random, new ItemStack(Item.swordDiamond), 19), new ItemStack(Item.swordDiamond), 2},
      {1, EnchantmentHelper.addRandomEnchantment(random, new ItemStack(Item.plateIron), 19), new ItemStack(Item.plateIron), 2},
      {1, EnchantmentHelper.addRandomEnchantment(random, new ItemStack(Item.plateDiamond), 19), new ItemStack(Item.plateDiamond), 2},
      {1, EnchantmentHelper.addRandomEnchantment(random, new ItemStack(Item.axeIron), 19), new ItemStack(Item.axeIron), 2},
      {1, EnchantmentHelper.addRandomEnchantment(random, new ItemStack(Item.axeDiamond), 19), new ItemStack(Item.axeDiamond), 2},
      {1, EnchantmentHelper.addRandomEnchantment(random, new ItemStack(Item.pickaxeIron), 19), new ItemStack(Item.pickaxeIron), 2},
      {1, EnchantmentHelper.addRandomEnchantment(random, new ItemStack(Item.pickaxeDiamond), 19), new ItemStack(Item.pickaxeDiamond), 2},
      {1, new ItemStack(FCBetterThanWolves.fcArcaneScroll, 1, Enchantment.fortune.effectId), new ItemStack(Item.paper), 48}
    };
  }
}
