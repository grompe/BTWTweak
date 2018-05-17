package net.minecraft.src;

public class GPERecipesArmorRepair implements IRecipe
{
  private ItemStack armor;
  private int pieces;
  private int armorCraftPieces = 8;
  
  public boolean matches(InventoryCrafting ic, World world)
  {
    return validateRecipe(ic);
  }

  public ItemStack getCraftingResult(InventoryCrafting ic)
  {
    if (!validateRecipe(ic)) return null;
    ItemStack newstack = armor.copy();
    if (newstack.isItemEnchanted())
    {
      newstack.getTagCompound().removeTag("ench");
    }
    float repairAmount = (1.05F * armor.getMaxDamage() * pieces / armorCraftPieces);
    newstack.setItemDamage(armor.getItemDamage() - (int)repairAmount);
    return newstack;
  }

  public int getRecipeSize()
  {
    return 10;
  }

  public ItemStack getRecipeOutput()
  {
    return null;
  }

  public boolean matches(IRecipe recipe)
  {
    return false;
  }

  private boolean validateRecipe(InventoryCrafting ic)
  {
    int material = 0; // 1 = wool, 2 = padded, 3 = leather, 4 = tanned leather
    armor = null;
    pieces = 0;
    for (int i = 0; i < ic.getSizeInventory(); i++)
    {
      ItemStack stack = ic.getStackInSlot(i);
      if (stack == null) continue;
      Item item = stack.getItem();
      if (stack.getItemDamage() > 0)
      {
        if (item instanceof FCItemArmorWool)
        {
          if (armor == null && (material == 0 || material == 1))
          {
            armor = stack;
            material = 1;
            switch (((ItemArmor)item).armorType)
            {
              case 0: armorCraftPieces = GPEBTWTweak.btwKnitting ? 2 : 5; break;
              case 1: armorCraftPieces = GPEBTWTweak.btwKnitting ? 3 : 8; break;
              case 2: armorCraftPieces = GPEBTWTweak.btwKnitting ? 4 : 7; break;
              case 3: armorCraftPieces = GPEBTWTweak.btwKnitting ? 2 : 4; break;
            }
            continue;
          }
        }
        else if (item instanceof FCItemArmorPadded)
        {
          if (armor == null && (material == 0 || material == 2))
          {
            armor = stack;
            material = 2;
            switch (((ItemArmor)item).armorType)
            {
              case 0: armorCraftPieces = 5; break;
              case 1: armorCraftPieces = 8; break;
              case 2: armorCraftPieces = 7; break;
              case 3: armorCraftPieces = 4; break;
            }
            continue;
          }
        }
        else if (item instanceof FCItemArmorTanned)
        {
          if (armor == null && (material == 0 || material == 4))
          {
            armor = stack;
            material = 4;
            switch (((ItemArmor)item).armorType)
            {
              case 0: armorCraftPieces = 5; break;
              case 1: armorCraftPieces = 8; break;
              case 2: armorCraftPieces = 7; break;
              case 3: armorCraftPieces = 4; break;
            }
            continue;
          }
        }
        else if (item instanceof ItemArmor && ((ItemArmor)item).getArmorMaterial() == EnumArmorMaterial.CLOTH)
        {
          if (armor == null && (material == 0 || material == 3))
          {
            armor = stack;
            material = 3;
            switch (((ItemArmor)item).armorType)
            {
              case 0: armorCraftPieces = 5; break;
              case 1: armorCraftPieces = 8; break;
              case 2: armorCraftPieces = 7; break;
              case 3: armorCraftPieces = 4; break;
            }
            continue;
          }
        }
      }
      if (item.itemID == GPEBTWTweak.woolArmorIngredientID)
      {
        if (material == 0 || material == 1)
        {
          material = 1;
          pieces++;
          continue;
        }
      }
      else if (item.itemID == FCBetterThanWolves.fcPadding.itemID)
      {
        if (material == 0 || material == 2)
        {
          material = 2;
          pieces++;
          continue;
        }
      }
      else if (item.itemID == Item.leather.itemID || item.itemID == FCBetterThanWolves.fcItemLeatherCut.itemID)
      {
        if (material == 0 || material == 3)
        {
          material = 3;
          pieces++;
          continue;
        }
      }
      else if (item.itemID == FCBetterThanWolves.fcTannedLeather.itemID || item.itemID == FCBetterThanWolves.fcItemTannedLeatherCut.itemID)
      {
        if (material == 0 || material == 4)
        {
          material = 4;
          pieces++;
          continue;
        }
      }
      return false;
    }
    return armor != null && pieces > 0;
  }
}
