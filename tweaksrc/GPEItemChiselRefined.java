package net.minecraft.src;

public class GPEItemChiselRefined extends FCItemChisel
{
  protected GPEItemChiselRefined(int id)
  {
    super(id, EnumToolMaterial.EMERALD, 250);
    efficiencyOnProperMaterial *= 0.625F; // wood: 1/5; stone: 1/3; iron: 3; sfs: 8 * 0.625 = 5
    setUnlocalizedName("gpeItemChiselRefined");
  }
}
