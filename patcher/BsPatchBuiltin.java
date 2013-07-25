import org.apache.commons.compress.compressors.bzip2.BZip2CompressorInputStream;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.util.Arrays;
import java.security.MessageDigest;
import java.security.DigestInputStream;
import java.security.NoSuchAlgorithmException;
import java.math.BigInteger;

public class BsPatchBuiltin {

    static int offtin(byte buf[]) {
        int y = (buf[0] & 0xFF)
              | (buf[1] & 0xFF) << 8
              | (buf[2] & 0xFF) << 16
              | (buf[3] & 0xFF) << 24
              | (buf[4] & 0xFF) << 32
              | (buf[5] & 0xFF) << 40
              | (buf[6] & 0xFF) << 48
              | (buf[7] & 0x7F) << 56;

        if ((buf[7] & 0x80) > 0) y = -y;

        return y;
    }


    private final File oldFile;
    private final File newFile;
    private final String oldFileMD5;
    private final String patchFile = "patch.bsdiff";

    public BsPatchBuiltin() throws IOException, NoSuchAlgorithmException
    {
        BufferedReader s = new BufferedReader(new InputStreamReader(BsPatchBuiltin.class.getResourceAsStream("patch.cfg")));
        oldFile = new File(s.readLine());
        newFile = new File(s.readLine());
        oldFileMD5 = s.readLine();
        s.close();
        
        try {
            applyPatch();
        } catch (IOException e) {
            throw new IllegalStateException("Could not patch " + oldFile, e);
        }
    }
    
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException
    {
        new BsPatchBuiltin();
    }

    public void applyPatch() throws IOException, NoSuchAlgorithmException {
        InputStream f = null, dpf = null, epf = null;
        InputStream cpfbz2 = null, dpfbz2 = null, epfbz2 = null;
        DigestInputStream fd = null;
        MessageDigest md = null;
        int oldsize = 0, newsize;
        long bzctrllen, bzdatalen;
        byte[] header = new byte[32];
        byte[] buf = new byte[8];
        byte[] old;
        byte[] newS;
        int oldpos, newpos;
        int[] ctrl = new int[3];
        long lenread;
        int i;

        /* Open patch file */
        f = BsPatchBuiltin.class.getResourceAsStream("patch.bsdiff");

        /*
      File format:
          0	8	"BSDIFF40"
          8	8	X
          16	8	Y
          24	8	sizeof(newfile)
          32	X	bzip2(control block)
          32+X	Y	bzip2(diff block)
          32+X+Y	???	bzip2(extra block)
      with control block a set of triples (x,y,z) meaning "add x bytes
      from oldfile to x bytes from the diff block; copy y bytes from the
      extra block; seek forwards in oldfile by z bytes".
      */

        /* Read header */
        if (f.read(header, 0, 32) < 32) {
            if (f.read() == -1) {
                throw new IOException("Corrupt patch\n");
            }
            throw new IOException("Invalid header " + patchFile);
        }

        /* Check for appropriate magic */
        if (!new String(header).startsWith("BSDIFF40"))
            throw new IOException("Corrupt patch\n");

        /* Read lengths from header */
        bzctrllen = offtin(Arrays.copyOfRange(header, 8, header.length));
        bzdatalen = offtin(Arrays.copyOfRange(header, 16, header.length));
        newsize = offtin(Arrays.copyOfRange(header, 24, header.length));
        if ((bzctrllen < 0) || (bzdatalen < 0) || (newsize < 0))
            throw new IOException("Corrupt patch\n");

        try {
            cpfbz2 = new BZip2CompressorInputStream(f);
        } catch (IOException e) {
            err(e.getMessage());
        }

        dpf = BsPatchBuiltin.class.getResourceAsStream("patch.bsdiff");

        if (dpf.skip(32 + bzctrllen) != (32 + bzctrllen)) {
            err("fseeko(%s, %lld)", patchFile,
                    (32 + bzctrllen));
        }

        try {
            dpfbz2 = new BZip2CompressorInputStream(dpf);
        } catch (IOException e) {
            err(e.getMessage());
        }

        epf = BsPatchBuiltin.class.getResourceAsStream("patch.bsdiff");

        if (epf.skip(32 + bzctrllen + bzdatalen) != (32 + bzctrllen + bzdatalen)) {
            err("fseeko(%s, %lld)", patchFile,
                    (32 + bzctrllen + bzdatalen));
        }

        try {
            epfbz2 = new BZip2CompressorInputStream(epf);
        } catch (IOException e) {
            err(e.getMessage());
        }

        try {
            md = MessageDigest.getInstance("MD5");
            fd = new DigestInputStream(new FileInputStream(oldFile), md);
        } catch (FileNotFoundException e) {
            err("Can't open %s", oldFile);
        }

        oldsize = (int) oldFile.length();
        old = new byte[oldsize];

        if (fd.read(old, 0, oldsize) != oldsize) {
            err("%s", oldFile);
        }

        try {
            fd.close();
        } catch (IOException e) {
            err("%s", oldFile);
        }

        String calcMD5 = String.format("%032x", new BigInteger(1, md.digest()));
        if (!oldFileMD5.equals(calcMD5))
        {
            err("Wrong old file (MD5 mismatch)\n");
        }

        newS = new byte[newsize];

        oldpos = 0;
        newpos = 0;
        while (newpos < newsize) {
            /* Read control data */
            for (i = 0; i <= 2; i++) {
                lenread = cpfbz2.read(buf, 0, 8);
                if ((lenread < 8))
                    err("Corrupt patch\n");
                ctrl[i] = offtin(buf);
            }

            /* Sanity-check */
            if (newpos + ctrl[0] > newsize)
                err("Corrupt patch\n");

            /* Read diff string */
            lenread = ctrl[0] != 0 ? dpfbz2.read(newS, newpos, ctrl[0]) : 0;
            if ((lenread < ctrl[0]))
                err("Corrupt patch\n");

            /* Add old data to diff string */
            for (i = 0; i < ctrl[0]; i++)
                if ((oldpos + i >= 0) && (oldpos + i < oldsize))
                    newS[newpos + i] += old[oldpos + i];

            /* Adjust pointers */
            newpos += ctrl[0];
            oldpos += ctrl[0];

            /* Sanity-check */
            if (newpos + ctrl[1] > newsize)
                err("Corrupt patch\n");

            /* Read extra string */
            lenread = ctrl[1] != 0 ? epfbz2.read(newS, newpos, ctrl[1]) : 0;
            if ((lenread < ctrl[1]))
                err("Corrupt patch\n");

            /* Adjust pointers */
            newpos += ctrl[1];
            oldpos += ctrl[2];
        }

        /* Clean up the bzip2 reads */
        cpfbz2.close();
        dpfbz2.close();
        epfbz2.close();

        try {
            f.close();
            dpf.close();
            epf.close();
        } catch (IOException e) {
            err("fclose(%s)", patchFile);
        }

        /* Write the new file */
        final FileOutputStream fw = new FileOutputStream(newFile);
        fw.write(newS);
        fw.close();
    }

    public static void err(String message, Object... args) throws IOException {
        throw new IOException(String.format(message, args));
    }

}