// This file is taken from MinecraftForge #716 and slightly adapted
package net.minecraft.src;

public class GPEGuiControls extends GuiScreen
{
  private GuiScreen parentScreen;
  protected String screenTitle = "Controls";
  private GameSettings options;
  private int buttonId = -1;
  private GPEGuiControlsScrollPanel scrollPane;

  public GPEGuiControls(GuiScreen par1GuiScreen, GameSettings par2GameSettings)
  {
    this.parentScreen = par1GuiScreen;
    this.options = par2GameSettings;
  }

  private int getLeftBorder()
  {
    return this.width / 2 - 155;
  }

  public void initGui()
  {
    scrollPane = new GPEGuiControlsScrollPanel(this, options, mc);
    StringTranslate stringtranslate = StringTranslate.getInstance();
    this.buttonList.add(new GuiButton(200, this.width / 2 - 100, this.height - 28, stringtranslate.translateKey("gui.done")));
    scrollPane.registerScrollButtons(buttonList, 7, 8);
    this.screenTitle = stringtranslate.translateKey("controls.title");
  }

  protected void actionPerformed(GuiButton par1GuiButton)
  {
    if (par1GuiButton.id == 200)
    {
      this.mc.displayGuiScreen(this.parentScreen);
    }
  }

  protected void mouseClicked(int par1, int par2, int par3)
  {
    super.mouseClicked(par1, par2, par3);
  }

  protected void keyTyped(char par1, int par2)
  {
    if (scrollPane.keyTyped(par1, par2))
    {
      super.keyTyped(par1, par2);
    }
  }

  public void drawScreen(int par1, int par2, float par3)
  {
    this.drawDefaultBackground();
    scrollPane.drawScreen(par1, par2, par3);
    drawCenteredString(fontRenderer, screenTitle, width / 2, 4, 0xffffff);
    super.drawScreen(par1, par2, par3);
  }
}
