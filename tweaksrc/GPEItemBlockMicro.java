package net.minecraft.src;

public abstract class GPEItemBlockMicro extends FCItemBlockCustom
{
  public GPEItemBlockMicro(int id)
  {
    super(id);
    setMaxDamage(0);
    setHasSubtypes(true);
  }

  public int GetBlockIDToPlace(int meta, int side, float hitX, float hitY, float hitZ)
  {
    return getBlockID();
  }

  public boolean onItemUse(ItemStack stack, EntityPlayer player, World world, int x, int y, int z, int side, float hitX, float hitY, float hitZ)
  {
    int id = world.getBlockId(x, y, z);
    if (player.canPlayerEdit(x, y, z, side, stack)
      && attemptToCombineWithBlock(stack, world, x, y, z, side, hitX, hitY, hitZ, false, false))
    {
      id = GetBlockIDToPlace(stack.getItemDamage(), side, hitX, hitY, hitZ);
      Block block = Block.blocksList[id];
      world.playSoundEffect(x + 0.5F, y + 0.5F, z + 0.5F, block.stepSound.getStepSound(), (block.stepSound.getVolume() + 1.0F) / 2.0F, block.stepSound.getPitch() * 0.8F);
      --stack.stackSize;
      return true;
    }
    int ox = x;
    int oy = y;
    int oz = z;
    if (id == Block.snow.blockID && (world.getBlockMetadata(x, y, z) & 7) < 1)
    {
      side = 1;
    }
    else if (id != Block.vine.blockID && id != Block.tallGrass.blockID && id != Block.deadBush.blockID)
    {
      if (side == 0) --y;
      if (side == 1) ++y;
      if (side == 2) --z;
      if (side == 3) ++z;
      if (side == 4) --x;
      if (side == 5) ++x;
    }
    if (stack.stackSize == 0) return false;
    if (!player.canPlayerEdit(x, y, z, side, stack)) return false;
    if (attemptToCombineWithBlock(stack, world, x, y, z, side, hitX, hitY, hitZ, true, false))
    {
      id = GetBlockIDToPlace(stack.getItemDamage(), side, hitX, hitY, hitZ);
      Block block = Block.blocksList[id];
      world.playSoundEffect(x + 0.5F, y + 0.5F, z + 0.5F, block.stepSound.getStepSound(), (block.stepSound.getVolume() + 1.0F) / 2.0F, block.stepSound.getPitch() * 0.8F);
      --stack.stackSize;
      return true;
    }
    return super.onItemUse(stack, player, world, ox, oy, oz, side, hitX, hitY, hitZ);
  }

  public boolean attemptToCombineWithBlock(ItemStack stack, World world, int x, int y, int z, int side, float hitX, float hitY, float hitZ, boolean shifted, boolean simulate)
  {
    int id = stack.itemID;
    if (id > 4096) return false;
    if (isSawFacingHere(world, x, y, z)) return false;
    Block block = Block.blocksList[id];
    if (block == null) return false;
    int meta = stack.getItemDamage();
    boolean isSiding = id == FCBetterThanWolves.fcBlockWoodSidingItemStubID
      || (id != FCBetterThanWolves.fcBlockWoodCornerItemStubID
       && id != FCBetterThanWolves.fcBlockWoodSidingDecorativeItemStubID
       && meta == 0 && block instanceof FCBlockSidingAndCorner);
    boolean isMoulding = id == FCBetterThanWolves.fcBlockWoodMouldingItemStubID
      || (id != FCBetterThanWolves.fcBlockWoodMouldingDecorativeItemStubID
       && meta == 0 && block instanceof FCBlockMoulding);
    boolean isCorner = id == FCBetterThanWolves.fcBlockWoodCornerItemStubID
      || (id != FCBetterThanWolves.fcBlockWoodSidingItemStubID
       && id != FCBetterThanWolves.fcBlockWoodSidingDecorativeItemStubID
       && meta == 1 && block instanceof FCBlockSidingAndCorner);
    /*
    FCItemBlockSidingAndCorner -> FCBlockSidingAndCornerAndDecorative
    FCItemBlockWoodCornerStub -> FCBlockWoodSidingAndCornerAndDecorative
    FCItemBlockMouldingAndDecorative -> FCBlockMouldingAndDecorative
    FCItemBlockWoodMouldingStub -> FCBlockWoodMouldingAndDecorative
    FCItemBlockSidingAndCorner -> FCBlockSidingAndCornerAndDecorative
    FCItemBlockWoodSidingStub -> FCBlockWoodSidingAndCornerAndDecorative
    */
    int placeid = GetBlockIDToPlace(stack.getItemDamage(), side, hitX, hitY, hitZ);
    if (isSiding) return attemptToCombineSidingWithBlock(placeid, world, x, y, z, side, hitX, hitY, hitZ, shifted, simulate);
    if (isMoulding) return attemptToCombineMouldingWithBlock(placeid, world, x, y, z, side, hitX, hitY, hitZ, shifted, simulate);
    if (isCorner) return attemptToCombineCornerWithBlock(placeid, world, x, y, z, side, hitX, hitY, hitZ, shifted, simulate);
    return false;
  }

  private boolean isSawFacingHere(World world, int x, int y, int z)
  {
    int saw = FCBetterThanWolves.fcSaw.blockID;
    int meta = 0;
         if (world.getBlockId(x + 1, y, z) == saw) { meta = world.getBlockMetadata(x + 1, y, z); return (meta & 7) == 4; }
    else if (world.getBlockId(x - 1, y, z) == saw) { meta = world.getBlockMetadata(x - 1, y, z); return (meta & 7) == 5; }
    else if (world.getBlockId(x, y + 1, z) == saw) { meta = world.getBlockMetadata(x, y + 1, z); return (meta & 7) == 0; }
    else if (world.getBlockId(x, y - 1, z) == saw) { meta = world.getBlockMetadata(x, y - 1, z); return (meta & 7) == 1; }
    else if (world.getBlockId(x, y, z + 1) == saw) { meta = world.getBlockMetadata(x, y, z + 1); return (meta & 7) == 2; }
    else if (world.getBlockId(x, y, z - 1) == saw) { meta = world.getBlockMetadata(x, y, z - 1); return (meta & 7) == 3; }
    return false;
  }

  private boolean attemptToCombineSidingWithBlock(int placeid, World world, int x, int y, int z, int side, float hitX, float hitY, float hitZ, boolean shifted, boolean simulate)
  {
    int id = world.getBlockId(x, y, z);
    if (id == placeid)
    {
      // siding + siding = full block (6 ways)
      int meta = world.getBlockMetadata(x, y, z);
      if ((meta & 1) != 0) return false;

      //if (!world.isRemote)
      //  System.out.println(String.format("if (side == %d && %sshifted)",
      //  side, shifted ? " " : "!"));

      int placemeta = siding2fullblockMeta(placeid);
      placeid = siding2fullblockID(placeid);
      if (placeid == -1) return false;
      boolean valid = false;
      if (meta == 0)
      {
        if (side == 0 && !shifted) valid = true;
        if (side == 1 &&  shifted) valid = true;
      }
      if (meta == 2)
      {
        if (side == 1 && !shifted) valid = true;
        if (side == 0 &&  shifted) valid = true;
      }
      if (meta == 4)
      {
        if (side == 2 && !shifted) valid = true;
        if (side == 3 &&  shifted) valid = true;
      }
      if (meta == 6)
      {
        if (side == 3 && !shifted) valid = true;
        if (side == 2 &&  shifted) valid = true;
      }
      if (meta == 8)
      {
        if (side == 4 && !shifted) valid = true;
        if (side == 5 &&  shifted) valid = true;
      }
      if (meta == 10)
      {
        if (side == 5 && !shifted) valid = true;
        if (side == 4 &&  shifted) valid = true;
      }
      if (valid)
      {
        if (!simulate) world.setBlockAndMetadataWithNotify(x, y, z, placeid, placemeta);
        return true;
      }
    }
    else if (id == siding2mouldingID(placeid))
    {
      // moulding + siding = stairs (16 ways)
      int meta = world.getBlockMetadata(x, y, z);
      if (meta > 11) return false;

      //if (!world.isRemote)
      //  System.out.println(String.format("if (side == %d && %sshifted)",
      //  side, shifted ? " " : "!"));

      int placemeta = -1;
      placeid = siding2stairsID(placeid);
      if (placeid == -1) return false;
      if (meta == 0)
      {
        if (side == 3 && !shifted) placemeta = 2;
        if (side == 2 &&  shifted) placemeta = 2;
        if (side == 1 && !shifted) placemeta = 7;
        if (side == 0 &&  shifted) placemeta = 7;
      }
      if (meta == 1)
      {
        if (side == 4 && !shifted) placemeta = 1;
        if (side == 5 &&  shifted) placemeta = 1;
        if (side == 1 && !shifted) placemeta = 4;
        if (side == 0 &&  shifted) placemeta = 4;
      }
      if (meta == 2)
      {
        if (side == 2 && !shifted) placemeta = 3;
        if (side == 3 &&  shifted) placemeta = 3;
        if (side == 1 && !shifted) placemeta = 6;
        if (side == 0 &&  shifted) placemeta = 6;
      }
      if (meta == 3)
      {
        if (side == 5 && !shifted) placemeta = 0;
        if (side == 4 &&  shifted) placemeta = 0;
        if (side == 1 && !shifted) placemeta = 5;
        if (side == 0 &&  shifted) placemeta = 5;
      }
      if (meta == 8)
      {
        if (side == 0 && !shifted) placemeta = 3;
        if (side == 1 &&  shifted) placemeta = 3;
        if (side == 3 && !shifted) placemeta = 6;
        if (side == 2 &&  shifted) placemeta = 6;
      }
      if (meta == 9)
      {
        if (side == 0 && !shifted) placemeta = 0;
        if (side == 1 &&  shifted) placemeta = 0;
        if (side == 4 && !shifted) placemeta = 5;
        if (side == 5 &&  shifted) placemeta = 5;
      }
      if (meta == 10)
      {
        if (side == 0 && !shifted) placemeta = 2;
        if (side == 1 &&  shifted) placemeta = 2;
        if (side == 2 && !shifted) placemeta = 7;
        if (side == 3 &&  shifted) placemeta = 7;
      }
      if (meta == 11)
      {
        if (side == 0 && !shifted) placemeta = 1;
        if (side == 1 &&  shifted) placemeta = 1;
        if (side == 5 && !shifted) placemeta = 4;
        if (side == 4 &&  shifted) placemeta = 4;
      }
      if (placemeta != -1)
      {
        if (!simulate) world.setBlockAndMetadataWithNotify(x, y, z, placeid, placemeta);
        return true;
      }
    }
    return false;
  }

  private boolean attemptToCombineMouldingWithBlock(int placeid, World world, int x, int y, int z, int side, float hitX, float hitY, float hitZ, boolean shifted, boolean simulate)
  {
    int id = world.getBlockId(x, y, z);
    if (id == placeid)
    {
      // moulding + moulding = siding (24 ways)
      int meta = world.getBlockMetadata(x, y, z);
      if (meta > 11) return false;

      boolean xz = Math.abs(hitX - 0.5) > Math.abs(hitZ - 0.5);
      boolean xy = Math.abs(hitX - 0.5) > Math.abs(hitY - 0.5);
      boolean yz = Math.abs(hitY - 0.5) > Math.abs(hitZ - 0.5);
      boolean ax = hitX > 0.5;
      boolean ay = hitY > 0.5;
      boolean az = hitZ > 0.5;
      //if (!world.isRemote)
      //  System.out.println(String.format("if (side == %d && %sxz && %sxy && %syz && %sax && %say && %saz && %sshifted)",
      //  side, xz ? " " : "!", xy ? " " : "!", yz ? " " : "!", ax ? " " : "!", ay ? " " : "!", az ? " " : "!", shifted ? " " : "!"));

      placeid = moulding2sidingID(placeid);
      int placemeta = -1;
      if (meta == 0)
      {
        if (side == 3 &&  xz && !xy &&  yz        && !ay && !az && !shifted) placemeta = 2;
        if (side == 1 && !xz && !xy &&  yz        &&  ay &&  az &&  shifted) placemeta = 2;
        if (side == 2 && !xz && !xy && !yz        && !ay && !az &&  shifted) placemeta = 2;
        if (side == 1 && !xz &&  xy && !yz        && !ay && !az && !shifted) placemeta = 6;
        if (side == 3 && !xz && !xy && !yz        &&  ay &&  az &&  shifted) placemeta = 6;
        if (side == 0 && !xz && !xy &&  yz        && !ay && !az &&  shifted) placemeta = 6;
      }
      if (meta == 1)
      {
        if (side == 4 && !xz && !xy &&  yz && !ax && !ay        && !shifted) placemeta = 2;
        if (side == 1 &&  xz && !xy &&  yz && !ax &&  ay        &&  shifted) placemeta = 2;
        if (side == 5 &&  xz &&  xy &&  yz &&  ax && !ay        &&  shifted) placemeta = 2;
        if (side == 1 &&  xz &&  xy && !yz &&  ax && !ay        && !shifted) placemeta = 8;
        if (side == 4 &&  xz &&  xy &&  yz && !ax &&  ay        &&  shifted) placemeta = 8;
        if (side == 0 &&  xz && !xy &&  yz &&  ax && !ay        &&  shifted) placemeta = 8;
      }
      if (meta == 2)
      {
        if (side == 2 &&  xz && !xy &&  yz        && !ay && !az && !shifted) placemeta = 2;
        if (side == 1 && !xz && !xy &&  yz        &&  ay && !az &&  shifted) placemeta = 2;
        if (side == 3 && !xz && !xy && !yz        && !ay &&  az &&  shifted) placemeta = 2;
        if (side == 1 && !xz &&  xy && !yz        && !ay &&  az && !shifted) placemeta = 4;
        if (side == 2 && !xz && !xy && !yz        &&  ay && !az &&  shifted) placemeta = 4;
        if (side == 0 && !xz && !xy &&  yz        && !ay &&  az &&  shifted) placemeta = 4;
      }
      if (meta == 3)
      {
        if (side == 5 && !xz && !xy &&  yz && !ax && !ay        && !shifted) placemeta = 2;
        if (side == 1 &&  xz && !xy &&  yz &&  ax &&  ay        &&  shifted) placemeta = 2;
        if (side == 4 &&  xz &&  xy &&  yz && !ax && !ay        &&  shifted) placemeta = 2;
        if (side == 1 &&  xz &&  xy && !yz && !ax && !ay        && !shifted) placemeta = 10;
        if (side == 5 &&  xz &&  xy &&  yz &&  ax &&  ay        &&  shifted) placemeta = 10;
        if (side == 0 &&  xz && !xy &&  yz && !ax && !ay        &&  shifted) placemeta = 10;
      }
      if (meta == 4)
      {
        if (side == 5 && !xz && !xy && !yz && !ax        && !az && !shifted) placemeta = 6;
        if (side == 3 && !xz &&  xy && !yz &&  ax        &&  az &&  shifted) placemeta = 6;
        if (side == 4 &&  xz &&  xy && !yz && !ax        && !az &&  shifted) placemeta = 6;
        if (side == 3 &&  xz &&  xy &&  yz && !ax        && !az && !shifted) placemeta = 10;
        if (side == 5 &&  xz &&  xy && !yz &&  ax        &&  az &&  shifted) placemeta = 10;
        if (side == 2 && !xz &&  xy && !yz && !ax        && !az &&  shifted) placemeta = 10;
      }
      if (meta == 5)
      {
        if (side == 4 && !xz && !xy && !yz && !ax        && !az && !shifted) placemeta = 6;
        if (side == 3 && !xz &&  xy && !yz && !ax        &&  az &&  shifted) placemeta = 6;
        if (side == 5 &&  xz &&  xy && !yz &&  ax        && !az &&  shifted) placemeta = 6;
        if (side == 3 &&  xz &&  xy &&  yz &&  ax        && !az && !shifted) placemeta = 8;
        if (side == 4 &&  xz &&  xy && !yz && !ax        &&  az &&  shifted) placemeta = 8;
        if (side == 2 && !xz &&  xy && !yz &&  ax        && !az &&  shifted) placemeta = 8;
      }
      if (meta == 6)
      {
        if (side == 4 && !xz && !xy && !yz && !ax        &&  az && !shifted) placemeta = 4;
        if (side == 2 && !xz &&  xy && !yz && !ax        && !az &&  shifted) placemeta = 4;
        if (side == 5 &&  xz &&  xy && !yz &&  ax        &&  az &&  shifted) placemeta = 4;
        if (side == 2 &&  xz &&  xy &&  yz &&  ax        && !az && !shifted) placemeta = 8;
        if (side == 4 &&  xz &&  xy && !yz && !ax        && !az &&  shifted) placemeta = 8;
        if (side == 3 && !xz &&  xy && !yz &&  ax        &&  az &&  shifted) placemeta = 8;
      }
      if (meta == 7)
      {
        if (side == 5 && !xz && !xy && !yz && !ax        &&  az && !shifted) placemeta = 4;
        if (side == 2 && !xz &&  xy && !yz &&  ax        && !az &&  shifted) placemeta = 4;
        if (side == 4 &&  xz &&  xy && !yz && !ax        &&  az &&  shifted) placemeta = 4;
        if (side == 2 &&  xz &&  xy &&  yz && !ax        && !az && !shifted) placemeta = 10;
        if (side == 5 &&  xz &&  xy && !yz &&  ax        && !az &&  shifted) placemeta = 10;
        if (side == 3 && !xz &&  xy && !yz && !ax        &&  az &&  shifted) placemeta = 10;
      }
      if (meta == 8)
      {
        if (side == 3 &&  xz && !xy &&  yz        &&  ay && !az && !shifted) placemeta = 0;
        if (side == 0 && !xz && !xy &&  yz        && !ay &&  az &&  shifted) placemeta = 0;
        if (side == 2 && !xz && !xy && !yz        &&  ay && !az &&  shifted) placemeta = 0;
        if (side == 0 && !xz &&  xy && !yz        && !ay && !az && !shifted) placemeta = 6;
        if (side == 3 && !xz && !xy && !yz        && !ay &&  az &&  shifted) placemeta = 6;
        if (side == 1 && !xz && !xy &&  yz        &&  ay && !az &&  shifted) placemeta = 6;
      }
      if (meta == 9)
      {
        if (side == 4 && !xz && !xy &&  yz && !ax &&  ay        && !shifted) placemeta = 0;
        if (side == 0 &&  xz && !xy &&  yz && !ax && !ay        &&  shifted) placemeta = 0;
        if (side == 5 &&  xz &&  xy &&  yz &&  ax &&  ay        &&  shifted) placemeta = 0;
        if (side == 0 &&  xz &&  xy && !yz &&  ax && !ay        && !shifted) placemeta = 8;
        if (side == 4 &&  xz &&  xy &&  yz && !ax && !ay        &&  shifted) placemeta = 8;
        if (side == 1 &&  xz && !xy &&  yz &&  ax &&  ay        &&  shifted) placemeta = 8;
      }
      if (meta == 10)
      {
        if (side == 2 &&  xz && !xy &&  yz        &&  ay && !az && !shifted) placemeta = 0;
        if (side == 0 && !xz && !xy &&  yz        && !ay && !az &&  shifted) placemeta = 0;
        if (side == 3 && !xz && !xy && !yz        &&  ay &&  az &&  shifted) placemeta = 0;
        if (side == 0 && !xz &&  xy && !yz        && !ay &&  az && !shifted) placemeta = 4;
        if (side == 2 && !xz && !xy && !yz        && !ay && !az &&  shifted) placemeta = 4;
        if (side == 1 && !xz && !xy &&  yz        &&  ay &&  az &&  shifted) placemeta = 4;
      }
      if (meta == 11)
      {
        if (side == 5 && !xz && !xy &&  yz && !ax &&  ay        && !shifted) placemeta = 0;
        if (side == 0 &&  xz && !xy &&  yz &&  ax && !ay        &&  shifted) placemeta = 0;
        if (side == 4 &&  xz &&  xy &&  yz && !ax &&  ay        &&  shifted) placemeta = 0;
        if (side == 0 &&  xz &&  xy && !yz && !ax && !ay        && !shifted) placemeta = 10;
        if (side == 5 &&  xz &&  xy &&  yz &&  ax && !ay        &&  shifted) placemeta = 10;
        if (side == 1 &&  xz && !xy &&  yz && !ax &&  ay        &&  shifted) placemeta = 10;
      }
      if (placemeta != -1)
      {
        if (!simulate) world.setBlockAndMetadataWithNotify(x, y, z, placeid, placemeta);
        return true;
      }
    }
    else if (id == moulding2sidingID(placeid))
    {
      // siding + moulding = stairs (16 ways)
      int meta = world.getBlockMetadata(x, y, z);
      if ((meta & 1) != 0) return false;

      boolean xz = Math.abs(hitX - 0.5) > Math.abs(hitZ - 0.5);
      boolean xy = Math.abs(hitX - 0.5) > Math.abs(hitY - 0.5);
      boolean yz = Math.abs(hitY - 0.5) > Math.abs(hitZ - 0.5);
      boolean ax = hitX > 0.5;
      boolean ay = hitY > 0.5;
      boolean az = hitZ > 0.5;
      //if (!world.isRemote)
      //  System.out.println(String.format("if (side == %d && %sxz && %sxy && %syz && %sax && %say && %saz && %sshifted)",
      //  side, xz ? " " : "!", xy ? " " : "!", yz ? " " : "!", ax ? " " : "!", ay ? " " : "!", az ? " " : "!", shifted ? " " : "!"));

      int placemeta = -1;
      placeid = moulding2stairsID(placeid);
      if (placeid == -1) return false;
      if (meta == 0)
      {
        if (side == 0 &&  xz &&  xy && !yz &&  ax && !ay        && !shifted) placemeta = 4;
        if (side == 4 &&  xz &&  xy &&  yz && !ax && !ay        &&  shifted) placemeta = 4;
        if (side == 1 &&  xz && !xy &&  yz &&  ax &&  ay        &&  shifted) placemeta = 4;
        if (side == 0 &&  xz &&  xy && !yz && !ax && !ay        && !shifted) placemeta = 5;
        if (side == 5 &&  xz &&  xy &&  yz &&  ax && !ay        &&  shifted) placemeta = 5;
        if (side == 1 &&  xz && !xy &&  yz && !ax &&  ay        &&  shifted) placemeta = 5;
        if (side == 0 && !xz &&  xy && !yz        && !ay &&  az && !shifted) placemeta = 6;
        if (side == 2 && !xz && !xy && !yz        && !ay && !az &&  shifted) placemeta = 6;
        if (side == 1 && !xz && !xy &&  yz        &&  ay &&  az &&  shifted) placemeta = 6;
        if (side == 0 && !xz &&  xy && !yz        && !ay && !az && !shifted) placemeta = 7;
        if (side == 3 && !xz && !xy && !yz        && !ay &&  az &&  shifted) placemeta = 7;
        if (side == 1 && !xz && !xy &&  yz        &&  ay && !az &&  shifted) placemeta = 7;
      }
      if (meta == 2)
      {
        if (side == 1 &&  xz &&  xy && !yz &&  ax && !ay        && !shifted) placemeta = 0;
        if (side == 4 &&  xz &&  xy &&  yz && !ax &&  ay        &&  shifted) placemeta = 0;
        if (side == 0 &&  xz && !xy &&  yz &&  ax && !ay        &&  shifted) placemeta = 0;
        if (side == 1 &&  xz &&  xy && !yz && !ax && !ay        && !shifted) placemeta = 1;
        if (side == 5 &&  xz &&  xy &&  yz &&  ax &&  ay        &&  shifted) placemeta = 1;
        if (side == 0 &&  xz && !xy &&  yz && !ax && !ay        &&  shifted) placemeta = 1;
        if (side == 1 && !xz &&  xy && !yz        && !ay &&  az && !shifted) placemeta = 2;
        if (side == 2 && !xz && !xy && !yz        &&  ay && !az &&  shifted) placemeta = 2;
        if (side == 0 && !xz && !xy &&  yz        && !ay &&  az &&  shifted) placemeta = 2;
        if (side == 1 && !xz &&  xy && !yz        && !ay && !az && !shifted) placemeta = 3;
        if (side == 3 && !xz && !xy && !yz        &&  ay &&  az &&  shifted) placemeta = 3;
        if (side == 0 && !xz && !xy &&  yz        && !ay && !az &&  shifted) placemeta = 3;
      }
      if (meta == 4)
      {
        if (side == 2 &&  xz && !xy &&  yz        && !ay && !az && !shifted) placemeta = 2;
        if (side == 1 && !xz && !xy &&  yz        &&  ay && !az &&  shifted) placemeta = 2;
        if (side == 3 && !xz && !xy && !yz        && !ay &&  az &&  shifted) placemeta = 2;
        if (side == 2 &&  xz && !xy &&  yz        &&  ay && !az && !shifted) placemeta = 6;
        if (side == 0 && !xz && !xy &&  yz        && !ay && !az &&  shifted) placemeta = 6;
        if (side == 3 && !xz && !xy && !yz        &&  ay &&  az &&  shifted) placemeta = 6;
      }
      if (meta == 6)
      {
        if (side == 3 &&  xz && !xy &&  yz        && !ay && !az && !shifted) placemeta = 3;
        if (side == 1 && !xz && !xy &&  yz        &&  ay &&  az &&  shifted) placemeta = 3;
        if (side == 2 && !xz && !xy && !yz        && !ay && !az &&  shifted) placemeta = 3;
        if (side == 3 &&  xz && !xy &&  yz        &&  ay && !az && !shifted) placemeta = 7;
        if (side == 0 && !xz && !xy &&  yz        && !ay &&  az &&  shifted) placemeta = 7;
        if (side == 2 && !xz && !xy && !yz        &&  ay && !az &&  shifted) placemeta = 7;
      }
      if (meta == 8)
      {
        if (side == 4 && !xz && !xy &&  yz && !ax && !ay        && !shifted) placemeta = 0;
        if (side == 1 &&  xz && !xy &&  yz && !ax &&  ay        &&  shifted) placemeta = 0;
        if (side == 5 &&  xz &&  xy &&  yz &&  ax && !ay        &&  shifted) placemeta = 0;
        if (side == 4 && !xz && !xy &&  yz && !ax &&  ay        && !shifted) placemeta = 4;
        if (side == 0 &&  xz && !xy &&  yz && !ax && !ay        &&  shifted) placemeta = 4;
        if (side == 5 &&  xz &&  xy &&  yz &&  ax &&  ay        &&  shifted) placemeta = 4;
      }
      if (meta == 10)
      {
        if (side == 5 && !xz && !xy &&  yz && !ax && !ay        && !shifted) placemeta = 1;
        if (side == 1 &&  xz && !xy &&  yz &&  ax &&  ay        &&  shifted) placemeta = 1;
        if (side == 4 &&  xz &&  xy &&  yz && !ax && !ay        &&  shifted) placemeta = 1;
        if (side == 5 && !xz && !xy &&  yz && !ax &&  ay        && !shifted) placemeta = 5;
        if (side == 0 &&  xz && !xy &&  yz &&  ax && !ay        &&  shifted) placemeta = 5;
        if (side == 4 &&  xz &&  xy &&  yz && !ax &&  ay        &&  shifted) placemeta = 5;
      }
      if (placemeta != -1)
      {
        if (!simulate) world.setBlockAndMetadataWithNotify(x, y, z, placeid, placemeta);
        return true;
      }
    }
    else if (id == moulding2stairsID(placeid))
    {
      // stairs + moulding = full block (8 ways)
      int meta = world.getBlockMetadata(x, y, z);

      boolean xz = Math.abs(hitX - 0.5) > Math.abs(hitZ - 0.5);
      boolean xy = Math.abs(hitX - 0.5) > Math.abs(hitY - 0.5);
      boolean yz = Math.abs(hitY - 0.5) > Math.abs(hitZ - 0.5);
      boolean ax = hitX > 0.5;
      boolean ay = hitY > 0.5;
      boolean az = hitZ > 0.5;
      //if (!world.isRemote)
      //  System.out.println(String.format("if (side == %d && %sxz && %sxy && %syz && %sax && %say && %saz && %sshifted)",
      //  side, xz ? " " : "!", xy ? " " : "!", yz ? " " : "!", ax ? " " : "!", ay ? " " : "!", az ? " " : "!", shifted ? " " : "!"));

      int placemeta = moulding2fullblockMeta(placeid);
      placeid = moulding2fullblockID(placeid);
      if (placeid == -1) return false;
      boolean valid = false;
      if (meta == 0)
      {
        if (side == 1 &&  xz &&  xy && !yz && !ax && !ay        && !shifted) valid = true;
        if (side == 4 && !xz && !xy &&  yz && !ax &&  ay        && !shifted) valid = true;
        if (side == 0 &&  xz && !xy &&  yz && !ax && !ay        &&  shifted) valid = true;
        if (side == 5 &&  xz &&  xy &&  yz &&  ax &&  ay        &&  shifted) valid = true;
      }
      if (meta == 1)
      {
        if (side == 1 &&  xz &&  xy && !yz &&  ax && !ay        && !shifted) valid = true;
        if (side == 5 && !xz && !xy &&  yz && !ax &&  ay        && !shifted) valid = true;
        if (side == 0 &&  xz && !xy &&  yz &&  ax && !ay        &&  shifted) valid = true;
        if (side == 4 &&  xz &&  xy &&  yz && !ax &&  ay        &&  shifted) valid = true;
      }
      if (meta == 2)
      {
        if (side == 1 && !xz &&  xy && !yz        && !ay && !az && !shifted) valid = true;
        if (side == 2 &&  xz && !xy &&  yz        &&  ay && !az && !shifted) valid = true;
        if (side == 0 && !xz && !xy &&  yz        && !ay && !az &&  shifted) valid = true;
        if (side == 3 && !xz && !xy && !yz        &&  ay &&  az &&  shifted) valid = true;
      }
      if (meta == 3)
      {
        if (side == 1 && !xz &&  xy && !yz        && !ay &&  az && !shifted) valid = true;
        if (side == 3 &&  xz && !xy &&  yz        &&  ay && !az && !shifted) valid = true;
        if (side == 0 && !xz && !xy &&  yz        && !ay &&  az &&  shifted) valid = true;
        if (side == 2 && !xz && !xy && !yz        &&  ay && !az &&  shifted) valid = true;
      }
      if (meta == 4)
      {
        if (side == 0 &&  xz &&  xy && !yz && !ax && !ay        && !shifted) valid = true;
        if (side == 4 && !xz && !xy &&  yz && !ax && !ay        && !shifted) valid = true;
        if (side == 5 &&  xz &&  xy &&  yz &&  ax && !ay        &&  shifted) valid = true;
        if (side == 1 &&  xz && !xy &&  yz && !ax &&  ay        &&  shifted) valid = true;
      }
      if (meta == 5)
      {
        if (side == 0 &&  xz &&  xy && !yz &&  ax && !ay        && !shifted) valid = true;
        if (side == 5 && !xz && !xy &&  yz && !ax && !ay        && !shifted) valid = true;
        if (side == 4 &&  xz &&  xy &&  yz && !ax && !ay        &&  shifted) valid = true;
        if (side == 1 &&  xz && !xy &&  yz &&  ax &&  ay        &&  shifted) valid = true;
      }
      if (meta == 6)
      {
        if (side == 0 && !xz &&  xy && !yz        && !ay && !az && !shifted) valid = true;
        if (side == 2 &&  xz && !xy &&  yz        && !ay && !az && !shifted) valid = true;
        if (side == 3 && !xz && !xy && !yz        && !ay &&  az &&  shifted) valid = true;
        if (side == 1 && !xz && !xy &&  yz        &&  ay && !az &&  shifted) valid = true;
      }
      if (meta == 7)
      {
        if (side == 0 && !xz &&  xy && !yz        && !ay &&  az && !shifted) valid = true;
        if (side == 3 &&  xz && !xy &&  yz        && !ay && !az && !shifted) valid = true;
        if (side == 2 && !xz && !xy && !yz        && !ay && !az &&  shifted) valid = true;
        if (side == 1 && !xz && !xy &&  yz        &&  ay &&  az &&  shifted) valid = true;
      }
      if (valid)
      {
        if (!simulate) world.setBlockAndMetadataWithNotify(x, y, z, placeid, placemeta);
        return true;
      }
    }
    return false;
  }

  private boolean attemptToCombineCornerWithBlock(int placeid, World world, int x, int y, int z, int side, float hitX, float hitY, float hitZ, boolean shifted, boolean simulate)
  {
    // corner + corner = moulding (24 ways)
    int id = world.getBlockId(x, y, z);
    if (id != placeid) return false;
    int meta = world.getBlockMetadata(x, y, z);
    if ((meta & 1) == 0) return false;
    int placemeta = -1;

    boolean ax = hitX > 0.5;
    boolean ay = hitY > 0.5;
    boolean az = hitZ > 0.5;
    //if (!world.isRemote)
    //  System.out.println(String.format("if (side == %d && %sax && %say && %saz && %sshifted)",
    //  side, ax ? " " : "!", ay ? " " : "!", az ? " " : "!", shifted ? " " : "!"));
    
    int mouldingID = corner2mouldingID(id);
    if (meta == 1)
    {
      if (side == 5 && !ax && !ay && !az && !shifted) placemeta = 0;
      if (side == 3 &&  ax && !ay &&  az &&  shifted) placemeta = 0;
      if (side == 4 && !ax && !ay && !az &&  shifted) placemeta = 0;
      if (side == 1 &&  ax &&  ay && !az &&  shifted) placemeta = 0;

      if (side == 3 && !ax && !ay && !az && !shifted) placemeta = 3;
      if (side == 1 && !ax &&  ay &&  az &&  shifted) placemeta = 3;
      if (side == 5 &&  ax && !ay &&  az &&  shifted) placemeta = 3;
      if (side == 2 && !ax && !ay && !az &&  shifted) placemeta = 3;

      if (side == 1 && !ax && !ay && !az && !shifted) placemeta = 4;
      if (side == 5 &&  ax &&  ay && !az &&  shifted) placemeta = 4;
      if (side == 3 && !ax &&  ay &&  az &&  shifted) placemeta = 4;
      if (side == 0 && !ax && !ay && !az &&  shifted) placemeta = 4;
    }
    else if (meta == 3)
    {
      if (side == 5 && !ax && !ay &&  az && !shifted) placemeta = 2;
      if (side == 2 &&  ax && !ay && !az &&  shifted) placemeta = 2;
      if (side == 4 && !ax && !ay &&  az &&  shifted) placemeta = 2;
      if (side == 1 &&  ax &&  ay &&  az &&  shifted) placemeta = 2;

      if (side == 2 && !ax && !ay && !az && !shifted) placemeta = 3;
      if (side == 5 &&  ax && !ay && !az &&  shifted) placemeta = 3;
      if (side == 3 && !ax && !ay &&  az &&  shifted) placemeta = 3;
      if (side == 1 && !ax &&  ay && !az &&  shifted) placemeta = 3;

      if (side == 1 && !ax && !ay &&  az && !shifted) placemeta = 7;
      if (side == 2 && !ax &&  ay && !az &&  shifted) placemeta = 7;
      if (side == 0 && !ax && !ay &&  az &&  shifted) placemeta = 7;
      if (side == 5 &&  ax &&  ay &&  az &&  shifted) placemeta = 7;
    }
    else if (meta == 5)
    {
      if (side == 0 && !ax && !ay && !az && !shifted) placemeta = 4;
      if (side == 1 && !ax &&  ay && !az &&  shifted) placemeta = 4;
      if (side == 3 && !ax && !ay &&  az &&  shifted) placemeta = 4;
      if (side == 5 &&  ax && !ay && !az &&  shifted) placemeta = 4;
      
      if (side == 5 && !ax &&  ay && !az && !shifted) placemeta = 8;
      if (side == 3 &&  ax &&  ay &&  az &&  shifted) placemeta = 8;
      if (side == 0 &&  ax && !ay && !az &&  shifted) placemeta = 8;
      if (side == 4 && !ax &&  ay && !az &&  shifted) placemeta = 8;

      if (side == 3 && !ax &&  ay && !az && !shifted) placemeta = 11;
      if (side == 2 && !ax &&  ay && !az &&  shifted) placemeta = 11;
      if (side == 0 && !ax && !ay &&  az &&  shifted) placemeta = 11;
      if (side == 5 &&  ax &&  ay &&  az &&  shifted) placemeta = 11;
    }
    else if (meta == 7)
    {
      if (side == 0 && !ax && !ay &&  az && !shifted) placemeta = 7;
      if (side == 2 && !ax && !ay && !az &&  shifted) placemeta = 7;
      if (side == 1 && !ax &&  ay &&  az &&  shifted) placemeta = 7;
      if (side == 5 &&  ax && !ay &&  az &&  shifted) placemeta = 7;

      if (side == 5 && !ax &&  ay &&  az && !shifted) placemeta = 10;
      if (side == 0 &&  ax && !ay &&  az &&  shifted) placemeta = 10;
      if (side == 4 && !ax &&  ay &&  az &&  shifted) placemeta = 10;
      if (side == 2 &&  ax &&  ay && !az &&  shifted) placemeta = 10;

      if (side == 2 && !ax &&  ay && !az && !shifted) placemeta = 11;
      if (side == 0 && !ax && !ay && !az &&  shifted) placemeta = 11;
      if (side == 3 && !ax &&  ay &&  az &&  shifted) placemeta = 11;
      if (side == 5 &&  ax &&  ay && !az &&  shifted) placemeta = 11;
    }
    else if (meta == 9)
    {
      if (side == 4 && !ax && !ay && !az && !shifted) placemeta = 0;
      if (side == 3 && !ax && !ay &&  az &&  shifted) placemeta = 0;
      if (side == 5 &&  ax && !ay && !az &&  shifted) placemeta = 0;
      if (side == 1 && !ax &&  ay && !az &&  shifted) placemeta = 0;

      if (side == 3 &&  ax && !ay && !az && !shifted) placemeta = 1;
      if (side == 4 && !ax && !ay &&  az &&  shifted) placemeta = 1;
      if (side == 2 &&  ax && !ay && !az &&  shifted) placemeta = 1;
      if (side == 1 &&  ax &&  ay &&  az &&  shifted) placemeta = 1;

      if (side == 1 &&  ax && !ay && !az && !shifted) placemeta = 5;
      if (side == 4 && !ax &&  ay && !az &&  shifted) placemeta = 5;
      if (side == 0 &&  ax && !ay && !az &&  shifted) placemeta = 5;
      if (side == 3 &&  ax &&  ay &&  az &&  shifted) placemeta = 5;
    }
    else if (meta == 11)
    {
      if (side == 2 &&  ax && !ay && !az && !shifted) placemeta = 1;
      if (side == 4 && !ax && !ay && !az &&  shifted) placemeta = 1;
      if (side == 3 &&  ax && !ay &&  az &&  shifted) placemeta = 1;
      if (side == 1 &&  ax &&  ay && !az &&  shifted) placemeta = 1;

      if (side == 4 && !ax && !ay &&  az && !shifted) placemeta = 2;
      if (side == 2 && !ax && !ay && !az &&  shifted) placemeta = 2;
      if (side == 5 &&  ax && !ay &&  az &&  shifted) placemeta = 2;
      if (side == 1 && !ax &&  ay &&  az &&  shifted) placemeta = 2;

      if (side == 1 &&  ax && !ay &&  az && !shifted) placemeta = 6;
      if (side == 4 && !ax &&  ay &&  az &&  shifted) placemeta = 6;
      if (side == 0 &&  ax && !ay &&  az &&  shifted) placemeta = 6;
      if (side == 2 &&  ax &&  ay && !az &&  shifted) placemeta = 6;
    }
    else if (meta == 13)
    {
      if (side == 0 &&  ax && !ay && !az && !shifted) placemeta = 5;
      if (side == 3 &&  ax && !ay &&  az &&  shifted) placemeta = 5;
      if (side == 1 &&  ax &&  ay && !az &&  shifted) placemeta = 5;
      if (side == 4 && !ax && !ay && !az &&  shifted) placemeta = 5;

      if (side == 4 && !ax &&  ay && !az && !shifted) placemeta = 8;
      if (side == 0 && !ax && !ay && !az &&  shifted) placemeta = 8;
      if (side == 5 &&  ax &&  ay && !az &&  shifted) placemeta = 8;
      if (side == 3 && !ax &&  ay &&  az &&  shifted) placemeta = 8;

      if (side == 3 &&  ax &&  ay && !az && !shifted) placemeta = 9;
      if (side == 0 &&  ax && !ay &&  az &&  shifted) placemeta = 9;
      if (side == 2 &&  ax &&  ay && !az &&  shifted) placemeta = 9;
      if (side == 4 && !ax &&  ay &&  az &&  shifted) placemeta = 9;
    }
    else if (meta == 15)
    {
      if (side == 0 &&  ax && !ay &&  az && !shifted) placemeta = 6;
      if (side == 4 && !ax && !ay &&  az &&  shifted) placemeta = 6;
      if (side == 1 &&  ax &&  ay &&  az &&  shifted) placemeta = 6;
      if (side == 2 &&  ax && !ay && !az &&  shifted) placemeta = 6;

      if (side == 2 &&  ax &&  ay && !az && !shifted) placemeta = 9;
      if (side == 0 &&  ax && !ay && !az &&  shifted) placemeta = 9;
      if (side == 3 &&  ax &&  ay &&  az &&  shifted) placemeta = 9;
      if (side == 4 && !ax &&  ay && !az &&  shifted) placemeta = 9;

      if (side == 4 && !ax &&  ay &&  az && !shifted) placemeta = 10;
      if (side == 0 && !ax && !ay &&  az &&  shifted) placemeta = 10;
      if (side == 5 &&  ax &&  ay &&  az &&  shifted) placemeta = 10;
      if (side == 2 && !ax &&  ay && !az &&  shifted) placemeta = 10;
    }
    if (placemeta != -1)
    {
      if (!simulate) world.setBlockAndMetadataWithNotify(x, y, z, mouldingID, placemeta);
      return true;
    }
    return false;
  }

  private int corner2mouldingID(int id)
  {
    if (id == FCBetterThanWolves.fcBlockSidingAndCornerBlackStone.blockID)
       return FCBetterThanWolves.fcBlockMouldingAndDecorativeBlackStone.blockID;
    if (id == FCBetterThanWolves.fcBlockSandstoneSidingAndCorner.blockID)
       return FCBetterThanWolves.fcBlockSandstoneMouldingAndDecorative.blockID;
    if (id == FCBetterThanWolves.fcBlockSmoothStoneSidingAndCorner.blockID)
       return FCBetterThanWolves.fcBlockSmoothStoneMouldingAndDecorative.blockID;
    if (id == FCBetterThanWolves.fcBlockBrickSidingAndCorner.blockID)
       return FCBetterThanWolves.fcBlockBrickMouldingAndDecorative.blockID;
    if (id == FCBetterThanWolves.fcBlockNetherBrickSidingAndCorner.blockID)
       return FCBetterThanWolves.fcBlockNetherBrickMouldingAndDecorative.blockID;
    if (id == FCBetterThanWolves.fcBlockWhiteStoneSidingAndCorner.blockID)
       return FCBetterThanWolves.fcBlockWhiteStoneMouldingAndDecorative.blockID;
    if (id == FCBetterThanWolves.fcBlockStoneBrickSidingAndCorner.blockID)
       return FCBetterThanWolves.fcBlockStoneBrickMouldingAndDecorative.blockID;
    if (id == FCBetterThanWolves.fcBlockWoodOakSidingAndCorner.blockID)
       return FCBetterThanWolves.fcBlockWoodOakMouldingAndDecorative.blockID;
    if (id == FCBetterThanWolves.fcBlockWoodSpruceSidingAndCorner.blockID)
       return FCBetterThanWolves.fcBlockWoodSpruceMouldingAndDecorative.blockID;
    if (id == FCBetterThanWolves.fcBlockWoodBirchSidingAndCorner.blockID)
       return FCBetterThanWolves.fcBlockWoodBirchMouldingAndDecorative.blockID;
    if (id == FCBetterThanWolves.fcBlockWoodJungleSidingAndCorner.blockID)
       return FCBetterThanWolves.fcBlockWoodJungleMouldingAndDecorative.blockID;
    return id + 1; // hope that addons have moulding ID follow corner ID
  }

  private int siding2mouldingID(int id)
  {
    return corner2mouldingID(id);
  }

  private int moulding2sidingID(int id)
  {
    if (id == FCBetterThanWolves.fcBlockMouldingAndDecorativeBlackStone.blockID)
       return FCBetterThanWolves.fcBlockSidingAndCornerBlackStone.blockID;
    if (id == FCBetterThanWolves.fcBlockSandstoneMouldingAndDecorative.blockID)
       return FCBetterThanWolves.fcBlockSandstoneSidingAndCorner.blockID;
    if (id == FCBetterThanWolves.fcBlockSmoothStoneMouldingAndDecorative.blockID)
       return FCBetterThanWolves.fcBlockSmoothStoneSidingAndCorner.blockID;
    if (id == FCBetterThanWolves.fcBlockBrickMouldingAndDecorative.blockID)
       return FCBetterThanWolves.fcBlockBrickSidingAndCorner.blockID;
    if (id == FCBetterThanWolves.fcBlockNetherBrickMouldingAndDecorative.blockID)
       return FCBetterThanWolves.fcBlockNetherBrickSidingAndCorner.blockID;
    if (id == FCBetterThanWolves.fcBlockWhiteStoneMouldingAndDecorative.blockID)
       return FCBetterThanWolves.fcBlockWhiteStoneSidingAndCorner.blockID;
    if (id == FCBetterThanWolves.fcBlockStoneBrickMouldingAndDecorative.blockID)
       return FCBetterThanWolves.fcBlockStoneBrickSidingAndCorner.blockID;
    if (id == FCBetterThanWolves.fcBlockWoodOakMouldingAndDecorative.blockID)
       return FCBetterThanWolves.fcBlockWoodOakSidingAndCorner.blockID;
    if (id == FCBetterThanWolves.fcBlockWoodSpruceMouldingAndDecorative.blockID)
       return FCBetterThanWolves.fcBlockWoodSpruceSidingAndCorner.blockID;
    if (id == FCBetterThanWolves.fcBlockWoodBirchMouldingAndDecorative.blockID)
       return FCBetterThanWolves.fcBlockWoodBirchSidingAndCorner.blockID;
    if (id == FCBetterThanWolves.fcBlockWoodJungleMouldingAndDecorative.blockID)
       return FCBetterThanWolves.fcBlockWoodJungleSidingAndCorner.blockID;
    return id - 1; // hope that addons have siding ID precede moulding ID
  }

  private int siding2fullblockID(int id)
  {
    if (id == FCBetterThanWolves.fcBlockSidingAndCornerBlackStone.blockID)  return 155;
    if (id == FCBetterThanWolves.fcBlockSandstoneSidingAndCorner.blockID)   return 24;
    if (id == FCBetterThanWolves.fcBlockSmoothStoneSidingAndCorner.blockID) return 1;
    if (id == FCBetterThanWolves.fcBlockBrickSidingAndCorner.blockID)       return 45;
    if (id == FCBetterThanWolves.fcBlockNetherBrickSidingAndCorner.blockID) return 112;
    if (id == FCBetterThanWolves.fcBlockWhiteStoneSidingAndCorner.blockID)  return FCBetterThanWolves.fcAestheticOpaque.blockID;
    if (id == FCBetterThanWolves.fcBlockStoneBrickSidingAndCorner.blockID)  return 98;
    if (id == FCBetterThanWolves.fcBlockWoodOakSidingAndCorner.blockID)     return 5;
    if (id == FCBetterThanWolves.fcBlockWoodSpruceSidingAndCorner.blockID)  return 5;
    if (id == FCBetterThanWolves.fcBlockWoodBirchSidingAndCorner.blockID)   return 5;
    if (id == FCBetterThanWolves.fcBlockWoodJungleSidingAndCorner.blockID)  return 5;
    return -1; // impossible to guess otherwise
  }

  private int siding2fullblockMeta(int id)
  {
    if (id == FCBetterThanWolves.fcBlockWhiteStoneSidingAndCorner.blockID)  return 9;
    if (id == FCBetterThanWolves.fcBlockWoodSpruceSidingAndCorner.blockID)  return 1;
    if (id == FCBetterThanWolves.fcBlockWoodBirchSidingAndCorner.blockID)   return 2;
    if (id == FCBetterThanWolves.fcBlockWoodJungleSidingAndCorner.blockID)  return 3;
    return 0;
  }

  private int siding2stairsID(int id)
  {
    if (id == FCBetterThanWolves.fcBlockSidingAndCornerBlackStone.blockID)  return 156;
    if (id == FCBetterThanWolves.fcBlockSandstoneSidingAndCorner.blockID)   return 128;
    if (id == FCBetterThanWolves.fcBlockSmoothStoneSidingAndCorner.blockID) return -1;
    if (id == FCBetterThanWolves.fcBlockBrickSidingAndCorner.blockID)       return 108;
    if (id == FCBetterThanWolves.fcBlockNetherBrickSidingAndCorner.blockID) return 114;
    if (id == FCBetterThanWolves.fcBlockWhiteStoneSidingAndCorner.blockID)  return FCBetterThanWolves.fcBlockWhiteStoneStairs.blockID;
    if (id == FCBetterThanWolves.fcBlockStoneBrickSidingAndCorner.blockID)  return 109;
    if (id == FCBetterThanWolves.fcBlockWoodOakSidingAndCorner.blockID)     return 53;
    if (id == FCBetterThanWolves.fcBlockWoodSpruceSidingAndCorner.blockID)  return 134;
    if (id == FCBetterThanWolves.fcBlockWoodBirchSidingAndCorner.blockID)   return 135;
    if (id == FCBetterThanWolves.fcBlockWoodJungleSidingAndCorner.blockID)  return 136;
    return -1; // impossible to guess otherwise
  }

  private int moulding2stairsID(int id)
  {
    return siding2stairsID(moulding2sidingID(id));
  }

  private int moulding2fullblockID(int id)
  {
    return siding2fullblockID(moulding2sidingID(id));
  }

  private int moulding2fullblockMeta(int id)
  {
    return siding2fullblockMeta(moulding2sidingID(id));
  }
}
