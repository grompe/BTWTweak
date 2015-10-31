package net.minecraft.src;

public class GPEWorldProxy4BB implements IBlockAccess
{
  private World actualWorld;
  private int fakeX;
  private int fakeY;
  private int fakeZ;
  private int fakeID;
  private int fakeMeta;

  public GPEWorldProxy4BB(World w, int x, int y, int z, int id, int meta)
  {
    this.actualWorld = w;
    this.fakeX = x;
    this.fakeY = y;
    this.fakeZ = z;
    this.fakeID = id;
    this.fakeMeta = meta;
  }

  public int getBlockId(int x, int y, int z)
  {
    if (x == fakeX && y == fakeY && z == fakeZ) return fakeID;
    return actualWorld.getBlockId(x, y, z);
  }

  public TileEntity getBlockTileEntity(int var1, int var2, int var3)
  {
    return actualWorld.getBlockTileEntity(var1, var2, var3);
  }

  public int getLightBrightnessForSkyBlocks(int var1, int var2, int var3, int var4)
  {
    return actualWorld.getLightBrightnessForSkyBlocks(var1, var2, var3, var4);
  }

  public float getBrightness(int var1, int var2, int var3, int var4)
  {
    return actualWorld.getBrightness(var1, var2, var3, var4);
  }

  public float getLightBrightness(int var1, int var2, int var3)
  {
    return actualWorld.getLightBrightness(var1, var2, var3);
  }

  public int getBlockMetadata(int x, int y, int z)
  {
    if (x == fakeX && y == fakeY && z == fakeZ) return fakeMeta;
    return actualWorld.getBlockMetadata(x, y, z);
  }

  public Material getBlockMaterial(int var1, int var2, int var3)
  {
    return actualWorld.getBlockMaterial(var1, var2, var3);
  }

  public boolean isBlockOpaqueCube(int var1, int var2, int var3)
  {
    return actualWorld.isBlockOpaqueCube(var1, var2, var3);
  }

  public boolean isBlockNormalCube(int var1, int var2, int var3)
  {
    return actualWorld.isBlockNormalCube(var1, var2, var3);
  }

  public boolean isAirBlock(int var1, int var2, int var3)
  {
    return actualWorld.isAirBlock(var1, var2, var3);
  }

  public BiomeGenBase getBiomeGenForCoords(int var1, int var2)
  {
    return actualWorld.getBiomeGenForCoords(var1, var2);
  }

  public int getHeight()
  {
    return actualWorld.getHeight();
  }

  public boolean extendedLevelsInChunkCache()
  {
    return actualWorld.extendedLevelsInChunkCache();
  }

  public boolean doesBlockHaveSolidTopSurface(int var1, int var2, int var3)
  {
    return actualWorld.doesBlockHaveSolidTopSurface(var1, var2, var3);
  }

  public Vec3Pool getWorldVec3Pool()
  {
    return actualWorld.getWorldVec3Pool();
  }

  public int isBlockProvidingPowerTo(int var1, int var2, int var3, int var4)
  {
    return actualWorld.isBlockProvidingPowerTo(var1, var2, var3, var4);
  }
}
