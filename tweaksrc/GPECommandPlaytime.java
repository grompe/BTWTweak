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
    // TODO: StatBase.timeStatType.format() is absent on server, write own processing
    sender.sendChatToPlayer("\u00a7eThis world has been in play for " + format(ticks));
    if (sender instanceof EntityPlayer)
    {
      ticks = MinecraftServer.getServer().worldServers[0].getWorldTime();
      ticks -= ((EntityPlayer)sender).m_lTimeOfLastSpawnAssignment;
      sender.sendChatToPlayer("\u00a7eYou've been alive for " + format(ticks));
    }
  }

  private String format(long ticks)
  {
    double s = (double)ticks / 20.0D;
    double m = s / 60.0D;
    double h = m / 60.0D;
    double d = h / 24.0D;
    if (d > 0.5) return String.format("%1.1f d", d);
    if (h > 0.5) return String.format("%1.1f h", h);
    return "less than half an hour";
  }
}
