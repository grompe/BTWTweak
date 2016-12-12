package net.minecraft.src;

public class GPEEntityRock extends EntityThrowable implements FCIEntityPacketHandler
{
  public GPEEntityRock(World world)
  {
    super(world);
  }

  public GPEEntityRock(World world, EntityLiving living)
  {
    super(world, living);
    motionX *= 0.5D;
    motionY *= 0.5D;
    motionZ *= 0.5D;
  }

  public GPEEntityRock(World world, EntityLiving living, double strength)
  {
    super(world, living);
    motionX *= strength;
    motionY *= strength;
    motionZ *= strength;
  }

  public GPEEntityRock(World world, double x, double y, double z)
  {
    super(world, x, y, z);
  }

  protected void onImpact(MovingObjectPosition mop)
  {
    if (mop.entityHit != null)
    {
      // Usual sling shot velocity: weakest 0.2, strongest 1.1
      double velocity = Math.sqrt(motionX * motionX + motionY * motionY + motionZ * motionZ);
      int damage = (velocity < 0.2) ? 0 : (int)(velocity * 5);
      mop.entityHit.attackEntityFrom(DamageSource.causeThrownDamage(this, getThrower()), damage);
    }
    if (!worldObj.isRemote)
    {
      if (mop.typeOfHit == EnumMovingObjectType.TILE)
      {
        int x = mop.blockX;
        int y = mop.blockY;
        int z = mop.blockZ;
        int id = worldObj.getBlockId(x, y, z);
        if (id == Block.glass.blockID || id == Block.thinGlass.blockID)
        {
          worldObj.playAuxSFX(2001, x, y, z, Block.glass.blockID);
          worldObj.destroyBlock(x, y, z, true);
        }
      }
      FCUtilsItem.EjectSingleItemWithRandomVelocity(worldObj, (float)posX, (float)posY, (float)posZ, GPEBTWTweak.gpeItemLooseRock.itemID, 0);
      setDead();
    }
  }

  public int GetTrackerViewDistance() { return 64; }
  public int GetTrackerUpdateFrequency() { return 10; }
  public boolean GetTrackMotion() { return true; }
  public boolean ShouldServerTreatAsOversized() { return false; }

  public static int getVehicleSpawnPacketType() { return GPEBTWTweak.gpeEntityRockVehicleSpawnType; }

  /*
  public Packet GetSpawnPacketForThisEntity()
  {
    ByteArrayOutputStream a = new ByteArrayOutputStream();
    DataOutputStream d = new DataOutputStream(a);
    try
    {
      d.writeInt(7);
      d.writeInt(this.entityId);
      d.writeInt(MathHelper.floor_double(this.posX * 32.0D));
      d.writeInt(MathHelper.floor_double(this.posY * 32.0D));
      d.writeInt(MathHelper.floor_double(this.posZ * 32.0D));
      d.writeByte((byte)((int)(this.motionX * 128.0D)));
      d.writeByte((byte)((int)(this.motionY * 128.0D)));
      d.writeByte((byte)((int)(this.motionZ * 128.0D)));
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
    return new Packet250CustomPayload("GPE|SE", a.toByteArray());
  }
  */

  public Packet GetSpawnPacketForThisEntity()
  {
    return new Packet23VehicleSpawn(this, getVehicleSpawnPacketType(), 0);
  }

}
