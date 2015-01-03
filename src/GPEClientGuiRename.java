package net.minecraft.src;

import java.util.List;
import org.lwjgl.input.Keyboard;
import org.lwjgl.opengl.GL11;

public class GPEClientGuiRename extends GuiContainer implements ICrafting
{
  private GPETileEntityRename tile;
  private GPEContainerRename container;
  private GuiTextField itemNameField;
  private EntityPlayer thePlayer;

  public GPEClientGuiRename(InventoryPlayer inventory, World world, GPETileEntityRename tileEntity)
  {
    super(new GPEContainerRename(inventory, world, tileEntity));
    thePlayer = inventory.player;
    container = (GPEContainerRename)inventorySlots;
    tile = tileEntity;
    ySize = 168;
  }

  public void initGui()
  {
    super.initGui();
    Keyboard.enableRepeatEvents(true);
    itemNameField = new GuiTextField(fontRenderer, guiLeft + 10, guiTop + 20, 155, 12);
    itemNameField.setTextColor(-1);
    itemNameField.setDisabledTextColour(-1);
    itemNameField.setEnableBackgroundDrawing(false);
    itemNameField.setMaxStringLength(30);
    inventorySlots.removeCraftingFromCrafters(this);
    inventorySlots.addCraftingToCrafters(this);
  }

  public void onGuiClosed()
  {
    super.onGuiClosed();
    Keyboard.enableRepeatEvents(false);
    inventorySlots.removeCraftingFromCrafters(this);
  }

  protected void keyTyped(char par1, int par2)
  {
    if (itemNameField.textboxKeyTyped(par1, par2))
    {
      container.updateItemName(itemNameField.getText());
      mc.thePlayer.sendQueue.addToSendQueue(new Packet250CustomPayload("GPE|ItemName", itemNameField.getText().getBytes()));
    }
    else
    {
      super.keyTyped(par1, par2);
    }
  }

  protected void mouseClicked(int par1, int par2, int par3)
  {
    super.mouseClicked(par1, par2, par3);
    itemNameField.mouseClicked(par1, par2, par3);
  }

  public void drawScreen(int par1, int par2, float par3)
  {
    super.drawScreen(par1, par2, par3);
    GL11.glDisable(GL11.GL_LIGHTING);
    itemNameField.drawTextBox();
  }

  protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)
  {
    String name = tile.isInvNameLocalized() ? tile.getInvName() : StatCollector.translateToLocal(tile.getInvName());
    fontRenderer.drawString(name, 22, 6, 0x404040);
    fontRenderer.drawString(StatCollector.translateToLocal("container.inventory"), 8, ySize - 94, 0x404040);
  }

  protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)
  {
    GL11.glColor4f(1.0F, 1.0F, 1.0F, 1.0F);
    mc.renderEngine.bindTexture("/btwmodtex/rename_gui.png");
    drawTexturedModalRect(guiLeft, guiTop, 0, 0, xSize, ySize);
    boolean canCraft = container.getSlot(1).getHasStack() && container.getSlot(2).getHasStack();
    drawTexturedModalRect(guiLeft + 7, guiTop + 16, 0, ySize + (canCraft ? 0 : 16), 162, 16);
    itemNameField.setEnabled(canCraft);
  }

  public void sendContainerAndContentsToPlayer(Container container, List list)
  {
    sendSlotContents(container, 0, container.getSlot(0).getStack());
  }

  public void sendSlotContents(Container container, int index, ItemStack stack)
  {
    if (index == 0)
    {
      itemNameField.setText(stack == null ? "" : stack.getDisplayName());
      if (stack != null)
      {
        this.container.updateItemName(itemNameField.getText());
        mc.thePlayer.sendQueue.addToSendQueue(new Packet250CustomPayload("GPE|ItemName", itemNameField.getText().getBytes()));
      }
    }
  }

  public void sendProgressBarUpdate(Container container, int a, int b) {}
}
