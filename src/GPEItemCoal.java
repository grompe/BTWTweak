package net.minecraft.src;

public class GPEItemCoal extends ItemCoal
{
  private Icon charcoalIcon;

  public GPEItemCoal(int id)
  {
    super(id);
    setUnlocalizedName("coal");
    SetDefaultFurnaceBurnTime(1600);
  }

  @ClientOnly
  public Icon getIconFromDamage(int meta)
  {
    return meta == 1 ? charcoalIcon : super.getIconFromDamage(meta);
  }

  @ClientOnly
  public void registerIcons(IconRegister r)
  {
    super.registerIcons(r);
    charcoalIcon = r.registerIcon("charcoal");
  }
}
