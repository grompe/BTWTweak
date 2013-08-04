package net.minecraft.src;

public class GPEItemPotash extends Item
{
    public GPEItemPotash(int var1)
    {
        super(var1);
    }

    public boolean onItemUse(ItemStack var1, EntityPlayer var2, World var3, int var4, int var5, int var6, int var7, float var8, float var9, float var10)
    {
        if (!var2.canPlayerEdit(var4, var5, var6, var7, var1))
        {
            return false;
        }
        return this.ApplyBoneMeal(var1, var2, var3, var4, var5, var6, var7, var8, var9, var10);
    }

    private boolean CanBonemealBeAppliedToBlock(World var1, int var2, int var3, int var4)
    {
        int var5 = var1.getBlockId(var2, var3, var4);
        int var6 = var1.getBlockMetadata(var2, var3, var4);
        return var5 == Block.tilledField.blockID || var5 == FCBetterThanWolves.fcPlanter.blockID && var6 == 1;
    }

    private boolean ApplyBoneMeal(ItemStack var1, EntityPlayer var2, World var3, int var4, int var5, int var6, int var7, float var8, float var9, float var10)
    {
        if (!this.CanBonemealBeAppliedToBlock(var3, var4, var5, var6))
        {
            --var5;
        }

        if (this.CanBonemealBeAppliedToBlock(var3, var4, var5, var6))
        {
            int var11 = var3.getBlockId(var4, var5, var6);

            if (var11 == Block.tilledField.blockID)
            {
                int var12 = var3.getBlockMetadata(var4, var5, var6);
                var3.setBlockAndMetadataWithNotify(var4, var5, var6, FCBetterThanWolves.fcBlockFarmlandFertilized.blockID, var12);
            }
            else if (var11 == FCBetterThanWolves.fcPlanter.blockID)
            {
                ((FCBlockPlanter)((FCBlockPlanter)FCBetterThanWolves.fcPlanter)).SetPlanterType(var3, var4, var5, var6, 2);
            }

            --var1.stackSize;
            return true;
        }
        else
        {
            return false;
        }
    }
}
