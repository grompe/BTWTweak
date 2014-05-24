package net.minecraft.src;

import java.util.List;
import net.minecraft.server.MinecraftServer;

public class GPECommandPlaytime extends CommandBase
{
  public String getCommandName()
  {
    return "playtime";
  }

  public boolean canCommandSenderUseCommand(ICommandSender sender)
  {
    return true;
  }

  public int getRequiredPermissionLevel()
  {
    return 0;
  }

  public String getCommandUsage(ICommandSender sender)
  {
    return "/playtime";
  }

  public void processCommand(ICommandSender sender, String[] args)
  {
    long ticks = MinecraftServer.getServer().worldServers[0].getTotalWorldTime();
    sender.sendChatToPlayer("\u00a7eThis world has been in play for " + StatBase.timeStatType.format((int)ticks));
  }
}
