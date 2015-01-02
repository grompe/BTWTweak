package net.minecraft.src;

public class GPEItemQuill extends Item
{
  private static Icon quillBackgroundIcon;
  private static Icon paperBackgroundIcon;

  public GPEItemQuill(int id)
  {
    super(id);
    setUnlocalizedName("gpeItemQuill");
    setCreativeTab(CreativeTabs.tabMaterials);
    SetBuoyancy(1.0F);
    SetBellowsBlowDistance(2);
    maxStackSize = 1;
    setMaxDamage(30);
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    super.registerIcons(r);
    quillBackgroundIcon = r.registerIcon("slot_empty_quill");
    paperBackgroundIcon = r.registerIcon("slot_empty_paper");
  }

  @ClientOnly
  static public Icon getBackgroundIcon(int typ)
  {
    if (typ == 0) return quillBackgroundIcon;
    if (typ == 1) return paperBackgroundIcon;
    return null;
  }
}
