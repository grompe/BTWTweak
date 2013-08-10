package net.minecraft.src;

final class GPEBehaviorRock extends BehaviorProjectileDispense
{
  protected IProjectile getProjectileEntity(World world, IPosition pos)
  {
    return new GPEEntityRock(world, pos.getX(), pos.getY(), pos.getZ());
  }
}
