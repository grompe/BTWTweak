/***
 * ASM: a very small and fast Java bytecode manipulation framework
 * Copyright (c) 2000-2011 INRIA, France Telecom
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holders nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */
package org.objectweb.asm.util;

import java.io.FileInputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import org.objectweb.asm.Attribute;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.Handle;
import org.objectweb.asm.Label;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;

/**
 * A {@link Printer} that prints the ASM code to generate the classes if visits.
 * 
 * @author Eric Bruneton
 */
public class ASMifier4JS extends Printer {

    /**
     * The name of the visitor variable in the produced code.
     */
    protected final String name;

    /**
     * Identifier of the annotation visitor variable in the produced code.
     */
    protected final int id;

    /**
     * The label names. This map associates String values to Label keys. It is
     * used only in ASMifierMethodVisitor.
     */
    protected Map<Label, String> labelNames;

    /**
     * Pseudo access flag used to distinguish class access flags.
     */
    private static final int ACCESS_CLASS = 262144;

    /**
     * Pseudo access flag used to distinguish field access flags.
     */
    private static final int ACCESS_FIELD = 524288;

    /**
     * Pseudo access flag used to distinguish inner class flags.
     */
    private static final int ACCESS_INNER = 1048576;

    /**
     * Constructs a new {@link ASMifier}. <i>Subclasses must not use this
     * constructor</i>. Instead, they must use the
     * {@link #ASMifier(int, String, int)} version.
     */
    public ASMifier4JS() {
        this(Opcodes.ASM4, "cn", 0);
    }

    /**
     * Constructs a new {@link ASMifier}.
     * 
     * @param api
     *            the ASM API version implemented by this class. Must be one of
     *            {@link Opcodes#ASM4}.
     * @param name
     *            the name of the visitor variable in the produced code.
     * @param id
     *            identifier of the annotation visitor variable in the produced
     *            code.
     */
    protected ASMifier4JS(final int api, final String name, final int id) {
        super(api);
        this.name = name;
        this.id = id;
    }

    /**
     * Prints the ASM source code to generate the given class to the standard
     * output.
     * <p>
     * Usage: ASMifier [-debug] &lt;binary class name or class file name&gt;
     * 
     * @param args
     *            the command line arguments.
     * 
     * @throws Exception
     *             if the class cannot be found, or if an IO exception occurs.
     */
    public static void main(final String[] args) throws Exception {
        int i = 0;
        int flags = ClassReader.SKIP_DEBUG;

        boolean ok = true;
        if (args.length < 1 || args.length > 2) {
            ok = false;
        }
        if (ok && "-debug".equals(args[0])) {
            i = 1;
            flags = 0;
            if (args.length != 2) {
                ok = false;
            }
        }
        if (!ok) {
            System.err.println("Prints the ASM code to generate the given class,");
            System.err.println("modified by Grom PE for use in JS tree patching.");
            System.err.println("Usage: ASMifier4JS [-debug] "
                    + "<fully qualified class name or class file name>");
            return;
        }
        ClassReader cr;
        if (args[i].endsWith(".class") || args[i].indexOf('\\') > -1
                || args[i].indexOf('/') > -1) {
            cr = new ClassReader(new FileInputStream(args[i]));
        } else {
            cr = new ClassReader(args[i]);
        }
        cr.accept(new TraceClassVisitor(null, new ASMifier4JS(), new PrintWriter(
                System.out)), flags);
    }

    // ------------------------------------------------------------------------
    // Classes
    // ------------------------------------------------------------------------

    @Override
    public void visit(final int version, final int access, final String name,
            final String signature, final String superName,
            final String[] interfaces) {
        String simpleName;
        int n = name.lastIndexOf('/');
        if (n == -1) {
            simpleName = name;
        } else {
            text.add("package asm." + name.substring(0, n).replace('/', '.')
                    + ";\n");
            simpleName = name.substring(n + 1);
        }
        text.add("var cn = ClassNode(");

        buf.setLength(0);
        switch (version) {
        case Opcodes.V1_1:
            buf.append("V1_1");
            break;
        case Opcodes.V1_2:
            buf.append("V1_2");
            break;
        case Opcodes.V1_3:
            buf.append("V1_3");
            break;
        case Opcodes.V1_4:
            buf.append("V1_4");
            break;
        case Opcodes.V1_5:
            buf.append("V1_5");
            break;
        case Opcodes.V1_6:
            buf.append("V1_6");
            break;
        case Opcodes.V1_7:
            buf.append("V1_7");
            break;
        default:
            buf.append(version);
            break;
        }
        buf.append(", ");
        appendAccess(access | ACCESS_CLASS);
        buf.append(", ");
        appendConstant(name);
        buf.append(", ");
        appendConstant(signature);
        buf.append(", ");
        appendConstant(superName);
        buf.append(", ");
        if (interfaces != null && interfaces.length > 0) {
            buf.append("[");
            for (int i = 0; i < interfaces.length; ++i) {
                buf.append(i == 0 ? " " : ", ");
                appendConstant(interfaces[i]);
            }
            buf.append("]");
        } else {
            buf.append("null");
        }
        buf.append(");\n\n");
        text.add(buf.toString());
    }

    @Override
    public void visitSource(final String file, final String debug) {
        buf.setLength(0);
        buf.append("cn.visitSource(");
        appendConstant(file);
        buf.append(", ");
        appendConstant(debug);
        buf.append(");\n\n");
        text.add(buf.toString());
    }

    @Override
    public void visitOuterClass(final String owner, final String name,
            final String desc) {
        buf.setLength(0);
        buf.append("cn.visitOuterClass(");
        appendConstant(owner);
        buf.append(", ");
        appendConstant(name);
        buf.append(", ");
        appendConstant(desc);
        buf.append(");\n\n");
        text.add(buf.toString());
    }

    @Override
    public ASMifier4JS visitClassAnnotation(final String desc,
            final boolean visible) {
        return visitAnnotation(desc, visible);
    }

    @Override
    public void visitClassAttribute(final Attribute attr) {
        visitAttribute(attr);
    }

    @Override
    public void visitInnerClass(final String name, final String outerName,
            final String innerName, final int access) {
        buf.setLength(0);
        buf.append("cn.visitInnerClass(");
        appendConstant(name);
        buf.append(", ");
        appendConstant(outerName);
        buf.append(", ");
        appendConstant(innerName);
        buf.append(", ");
        appendAccess(access | ACCESS_INNER);
        buf.append(");\n\n");
        text.add(buf.toString());
    }

    @Override
    public ASMifier4JS visitField(final int access, final String name,
            final String desc, final String signature, final Object value) {
        buf.setLength(0);
        buf.append("cn.fields.add(");
        appendAccess(access | ACCESS_FIELD);
        buf.append(", ");
        appendConstant(name);
        buf.append(", ");
        appendConstant(desc);
        buf.append(", ");
        appendConstant(signature);
        buf.append(", ");
        appendConstant(value);
        buf.append(");\n");
        text.add(buf.toString());
        ASMifier4JS a = createASMifier("fn", 0);
        text.add(a.getText());
        return a;
    }

    @Override
    public ASMifier4JS visitMethod(final int access, final String name,
            final String desc, final String signature, final String[] exceptions) {
        buf.setLength(0);
        buf.append("{\n");
        buf.append("var mn = MethodNode(");
        appendAccess(access);
        buf.append(", ");
        appendConstant(name);
        buf.append(", ");
        appendConstant(desc);
        buf.append(", ");
        appendConstant(signature);
        buf.append(", ");
        if (exceptions != null && exceptions.length > 0) {
            buf.append("new String[] {");
            for (int i = 0; i < exceptions.length; ++i) {
                buf.append(i == 0 ? " " : ", ");
                appendConstant(exceptions[i]);
            }
            buf.append(" }");
        } else {
            buf.append("null");
        }
        buf.append(");\n");
        text.add(buf.toString());
        ASMifier4JS a = createASMifier("mn", 0);
        text.add(a.getText());
        text.add("}\n");
        return a;
    }

    @Override
    public void visitClassEnd() {
    }

    // ------------------------------------------------------------------------
    // Annotations
    // ------------------------------------------------------------------------

    @Override
    public void visit(final String name, final Object value) {
        buf.setLength(0);
        buf.append("av").append(id).append(".visit(");
        appendConstant(buf, name);
        buf.append(", ");
        appendConstant(buf, value);
        buf.append(");\n");
        text.add(buf.toString());
    }

    @Override
    public void visitEnum(final String name, final String desc,
            final String value) {
        buf.setLength(0);
        buf.append("av").append(id).append(".visitEnum(");
        appendConstant(buf, name);
        buf.append(", ");
        appendConstant(buf, desc);
        buf.append(", ");
        appendConstant(buf, value);
        buf.append(");\n");
        text.add(buf.toString());
    }

    @Override
    public ASMifier4JS visitAnnotation(final String name, final String desc) {
        buf.setLength(0);
        buf.append("{\n");
        buf.append("AnnotationVisitor av").append(id + 1).append(" = av");
        buf.append(id).append(".visitAnnotation(");
        appendConstant(buf, name);
        buf.append(", ");
        appendConstant(buf, desc);
        buf.append(");\n");
        text.add(buf.toString());
        ASMifier4JS a = createASMifier("av", id + 1);
        text.add(a.getText());
        text.add("}\n");
        return a;
    }

    @Override
    public ASMifier4JS visitArray(final String name) {
        buf.setLength(0);
        buf.append("{\n");
        buf.append("AnnotationVisitor av").append(id + 1).append(" = av");
        buf.append(id).append(".visitArray(");
        appendConstant(buf, name);
        buf.append(");\n");
        text.add(buf.toString());
        ASMifier4JS a = createASMifier("av", id + 1);
        text.add(a.getText());
        text.add("}\n");
        return a;
    }

    @Override
    public void visitAnnotationEnd() {
        buf.setLength(0);
        buf.append("av").append(id).append(".visitEnd();\n");
        text.add(buf.toString());
    }

    // ------------------------------------------------------------------------
    // Fields
    // ------------------------------------------------------------------------

    @Override
    public ASMifier4JS visitFieldAnnotation(final String desc,
            final boolean visible) {
        return visitAnnotation(desc, visible);
    }

    @Override
    public void visitFieldAttribute(final Attribute attr) {
        visitAttribute(attr);
    }

    @Override
    public void visitFieldEnd() {
    }

    // ------------------------------------------------------------------------
    // Methods
    // ------------------------------------------------------------------------

    @Override
    public ASMifier4JS visitAnnotationDefault() {
        buf.setLength(0);
        buf.append("{\n").append("av0 = ").append(name)
                .append(".visitAnnotationDefault();\n");
        text.add(buf.toString());
        ASMifier4JS a = createASMifier("av", 0);
        text.add(a.getText());
        text.add("}\n");
        return a;
    }

    @Override
    public ASMifier4JS visitMethodAnnotation(final String desc,
            final boolean visible) {
        return visitAnnotation(desc, visible);
    }

    @Override
    public ASMifier4JS visitParameterAnnotation(final int parameter,
            final String desc, final boolean visible) {
        buf.setLength(0);
        buf.append("{\n").append("av0 = ").append(name)
                .append(".visitParameterAnnotation(").append(parameter)
                .append(", ");
        appendConstant(desc);
        buf.append(", ").append(visible).append(");\n");
        text.add(buf.toString());
        ASMifier4JS a = createASMifier("av", 0);
        text.add(a.getText());
        text.add("}\n");
        return a;
    }

    @Override
    public void visitMethodAttribute(final Attribute attr) {
        visitAttribute(attr);
    }

    @Override
    public void visitCode() {
        text.add(name + ".instructions.add(toInsnList(\n[\n");
    }

    @Override
    public void visitFrame(final int type, final int nLocal,
            final Object[] local, final int nStack, final Object[] stack) {
        buf.setLength(0);
        switch (type) {
        case Opcodes.F_NEW:
        case Opcodes.F_FULL:
            declareFrameTypes(nLocal, local);
            declareFrameTypes(nStack, stack);
            if (type == Opcodes.F_NEW) {
                buf.append("FrameNode(F_NEW, ");
            } else {
                buf.append("FrameNode(F_FULL, ");
            }
            buf.append(nLocal).append(", [");
            appendFrameTypes(nLocal, local);
            buf.append("], ").append(nStack).append(", [");
            appendFrameTypes(nStack, stack);
            buf.append(']');
            break;
        case Opcodes.F_APPEND:
            declareFrameTypes(nLocal, local);
            buf.append("FrameNode(F_APPEND, ").append(nLocal).append(", [");
            appendFrameTypes(nLocal, local);
            buf.append("], 0, null");
            break;
        case Opcodes.F_CHOP:
            buf.append("FrameNode(F_CHOP, ")
                    .append(nLocal).append(", null, 0, null");
            break;
        case Opcodes.F_SAME:
            buf.append("FrameNode(F_SAME, 0, null, 0, null");
            break;
        case Opcodes.F_SAME1:
            declareFrameTypes(1, stack);
            buf.append("FrameNode(F_SAME1, 0, null, 1, [");
            appendFrameTypes(1, stack);
            buf.append(']');
            break;
        }
        buf.append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitInsn(final int opcode) {
        buf.setLength(0);
        buf.append("InsnNode(").append(OPCODES[opcode]).append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitIntInsn(final int opcode, final int operand) {
        buf.setLength(0);
        buf.append("IntInsnNode(")
                .append(OPCODES[opcode])
                .append(", ")
                .append(opcode == Opcodes.NEWARRAY ? TYPES[operand] : Integer
                        .toString(operand)).append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitVarInsn(final int opcode, final int var) {
        buf.setLength(0);
        buf.append("VarInsnNode(").append(OPCODES[opcode])
                .append(", ").append(var).append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitTypeInsn(final int opcode, final String type) {
        buf.setLength(0);
        buf.append("TypeInsnNode(").append(OPCODES[opcode]).append(", ");
        appendConstant(type);
        buf.append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitFieldInsn(final int opcode, final String owner,
            final String name, final String desc) {
        buf.setLength(0);
        buf.append("FieldInsnNode(").append(OPCODES[opcode]).append(", ");
        appendConstant(owner);
        buf.append(", ");
        appendConstant(name);
        buf.append(", ");
        appendConstant(desc);
        buf.append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitMethodInsn(final int opcode, final String owner,
            final String name, final String desc) {
        buf.setLength(0);
        buf.append("MethodInsnNode(").append(OPCODES[opcode]).append(", ");
        appendConstant(owner);
        buf.append(", ");
        appendConstant(name);
        buf.append(", ");
        appendConstant(desc);
        buf.append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitInvokeDynamicInsn(String name, String desc, Handle bsm,
            Object... bsmArgs) {
        buf.setLength(0);
        buf.append("InvokeDynamicInsnNode(");
        appendConstant(name);
        buf.append(", ");
        appendConstant(desc);
        buf.append(", ");
        appendConstant(bsm);
        buf.append(", [");
        for (int i = 0; i < bsmArgs.length; ++i) {
            appendConstant(bsmArgs[i]);
            if (i != bsmArgs.length - 1) {
                buf.append(", ");
            }
        }
        buf.append("]),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitJumpInsn(final int opcode, final Label label) {
        buf.setLength(0);
        declareLabel(label);
        buf.append("JumpInsnNode(").append(OPCODES[opcode]).append(", ");
        appendLabel(label);
        buf.append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitLabel(final Label label) {
        buf.setLength(0);
        declareLabel(label);
        appendLabel(label);
        buf.append(",\n");
        text.add(buf.toString());
    }

    @Override
    public void visitLdcInsn(final Object cst) {
        buf.setLength(0);
        buf.append("LdcInsnNode(");
        appendConstant(cst);
        buf.append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitIincInsn(final int var, final int increment) {
        buf.setLength(0);
        buf.append("IincInsnNode(").append(var).append(", ")
                .append(increment).append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitTableSwitchInsn(final int min, final int max,
            final Label dflt, final Label... labels) {
        buf.setLength(0);
        for (int i = 0; i < labels.length; ++i) {
            declareLabel(labels[i]);
        }
        declareLabel(dflt);

        buf.append("TableSwitchInsnNode(").append(min)
                .append(", ").append(max).append(", ");
        appendLabel(dflt);
        buf.append(", [");
        for (int i = 0; i < labels.length; ++i) {
            buf.append(i == 0 ? " " : ", ");
            appendLabel(labels[i]);
        }
        buf.append(" ]),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitLookupSwitchInsn(final Label dflt, final int[] keys,
            final Label[] labels) {
        buf.setLength(0);
        for (int i = 0; i < labels.length; ++i) {
            declareLabel(labels[i]);
        }
        declareLabel(dflt);

        buf.append("LookupSwitchInsnNode(");
        appendLabel(dflt);
        buf.append(", [");
        for (int i = 0; i < keys.length; ++i) {
            buf.append(i == 0 ? " " : ", ").append(keys[i]);
        }
        buf.append(" ], [");
        for (int i = 0; i < labels.length; ++i) {
            buf.append(i == 0 ? " " : ", ");
            appendLabel(labels[i]);
        }
        buf.append(" ]),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitMultiANewArrayInsn(final String desc, final int dims) {
        buf.setLength(0);
        buf.append("MultiANewArrayInsnNode(");
        appendConstant(desc);
        buf.append(", ").append(dims).append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitTryCatchBlock(final Label start, final Label end,
            final Label handler, final String type) {
        buf.setLength(0);
        declareLabel(start);
        declareLabel(end);
        declareLabel(handler);
        buf.append("TryCatchBlockNode(");
        appendLabel(start);
        buf.append(", ");
        appendLabel(end);
        buf.append(", ");
        appendLabel(handler);
        buf.append(", ");
        appendConstant(type);
        buf.append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitLocalVariable(final String name, final String desc,
            final String signature, final Label start, final Label end,
            final int index) {
        buf.setLength(0);
        buf.append("LocalVariableNode(");
        appendConstant(name);
        buf.append(", ");
        appendConstant(desc);
        buf.append(", ");
        appendConstant(signature);
        buf.append(", ");
        appendLabel(start);
        buf.append(", ");
        appendLabel(end);
        buf.append(", ").append(index).append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitLineNumber(final int line, final Label start) {
        buf.setLength(0);
        buf.append("LineNumberNode(").append(line).append(", ");
        appendLabel(start);
        buf.append("),\n");
        text.add(buf.toString());
    }

    @Override
    public void visitMaxs(final int maxStack, final int maxLocals) {
        buf.setLength(0);
        buf.append("//Maxs(").append(maxStack).append(", ")
                .append(maxLocals).append(");\n");
        text.add(buf.toString());
    }

    @Override
    public void visitMethodEnd() {
        buf.setLength(0);
        buf.append("]\n));\n");
        text.add(buf.toString());
    }

    // ------------------------------------------------------------------------
    // Common methods
    // ------------------------------------------------------------------------

    public ASMifier4JS visitAnnotation(final String desc, final boolean visible) {
        buf.setLength(0);
        buf.append("{\n").append("av0 = ").append(name)
                .append(".visitAnnotation(");
        appendConstant(desc);
        buf.append(", ").append(visible).append(");\n");
        text.add(buf.toString());
        ASMifier4JS a = createASMifier("av", 0);
        text.add(a.getText());
        text.add("}\n");
        return a;
    }

    public void visitAttribute(final Attribute attr) {
        buf.setLength(0);
        buf.append("// ATTRIBUTE ").append(attr.type).append('\n');
        if (attr instanceof ASMifiable) {
            if (labelNames == null) {
                labelNames = new HashMap<Label, String>();
            }
            buf.append("{\n");
            ((ASMifiable) attr).asmify(buf, "attr", labelNames);
            buf.append(name).append(".visitAttribute(attr);\n");
            buf.append("}\n");
        }
        text.add(buf.toString());
    }

    // ------------------------------------------------------------------------
    // Utility methods
    // ------------------------------------------------------------------------

    protected ASMifier4JS createASMifier(final String name, final int id) {
        return new ASMifier4JS(Opcodes.ASM4, name, id);
    }

    /**
     * Appends a string representation of the given access modifiers to
     * {@link #buf buf}.
     * 
     * @param access
     *            some access modifiers.
     */
    void appendAccess(final int access) {
        boolean first = true;
        if ((access & Opcodes.ACC_PUBLIC) != 0) {
            buf.append("ACC_PUBLIC");
            first = false;
        }
        if ((access & Opcodes.ACC_PRIVATE) != 0) {
            buf.append("ACC_PRIVATE");
            first = false;
        }
        if ((access & Opcodes.ACC_PROTECTED) != 0) {
            buf.append("ACC_PROTECTED");
            first = false;
        }
        if ((access & Opcodes.ACC_FINAL) != 0) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_FINAL");
            first = false;
        }
        if ((access & Opcodes.ACC_STATIC) != 0) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_STATIC");
            first = false;
        }
        if ((access & Opcodes.ACC_SYNCHRONIZED) != 0) {
            if (!first) {
                buf.append(" + ");
            }
            if ((access & ACCESS_CLASS) == 0) {
                buf.append("ACC_SYNCHRONIZED");
            } else {
                buf.append("ACC_SUPER");
            }
            first = false;
        }
        if ((access & Opcodes.ACC_VOLATILE) != 0
                && (access & ACCESS_FIELD) != 0) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_VOLATILE");
            first = false;
        }
        if ((access & Opcodes.ACC_BRIDGE) != 0 && (access & ACCESS_CLASS) == 0
                && (access & ACCESS_FIELD) == 0) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_BRIDGE");
            first = false;
        }
        if ((access & Opcodes.ACC_VARARGS) != 0 && (access & ACCESS_CLASS) == 0
                && (access & ACCESS_FIELD) == 0) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_VARARGS");
            first = false;
        }
        if ((access & Opcodes.ACC_TRANSIENT) != 0
                && (access & ACCESS_FIELD) != 0) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_TRANSIENT");
            first = false;
        }
        if ((access & Opcodes.ACC_NATIVE) != 0 && (access & ACCESS_CLASS) == 0
                && (access & ACCESS_FIELD) == 0) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_NATIVE");
            first = false;
        }
        if ((access & Opcodes.ACC_ENUM) != 0
                && ((access & ACCESS_CLASS) != 0
                        || (access & ACCESS_FIELD) != 0 || (access & ACCESS_INNER) != 0)) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_ENUM");
            first = false;
        }
        if ((access & Opcodes.ACC_ANNOTATION) != 0
                && ((access & ACCESS_CLASS) != 0 || (access & ACCESS_INNER) != 0)) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_ANNOTATION");
            first = false;
        }
        if ((access & Opcodes.ACC_ABSTRACT) != 0) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_ABSTRACT");
            first = false;
        }
        if ((access & Opcodes.ACC_INTERFACE) != 0) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_INTERFACE");
            first = false;
        }
        if ((access & Opcodes.ACC_STRICT) != 0) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_STRICT");
            first = false;
        }
        if ((access & Opcodes.ACC_SYNTHETIC) != 0) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_SYNTHETIC");
            first = false;
        }
        if ((access & Opcodes.ACC_DEPRECATED) != 0) {
            if (!first) {
                buf.append(" + ");
            }
            buf.append("ACC_DEPRECATED");
            first = false;
        }
        if (first) {
            buf.append('0');
        }
    }

    /**
     * Appends a string representation of the given constant to the given
     * buffer.
     * 
     * @param cst
     *            an {@link Integer}, {@link Float}, {@link Long},
     *            {@link Double} or {@link String} object. May be <tt>null</tt>.
     */
    protected void appendConstant(final Object cst) {
        appendConstant(buf, cst);
    }

    /**
     * Appends a string representation of the given constant to the given
     * buffer.
     * 
     * @param buf
     *            a string buffer.
     * @param cst
     *            an {@link Integer}, {@link Float}, {@link Long},
     *            {@link Double} or {@link String} object. May be <tt>null</tt>.
     */
    static void appendConstant(final StringBuffer buf, final Object cst) {
        if (cst == null) {
            buf.append("null");
        } else if (cst instanceof String) {
            appendString(buf, (String) cst);
        } else if (cst instanceof Type) {
            buf.append("Type.getType(\"");
            buf.append(((Type) cst).getDescriptor());
            buf.append("\")");
        } else if (cst instanceof Handle) {
            buf.append("Handle(");
            Handle h = (Handle) cst;
            buf.append(HANDLE_TAG[h.getTag()]).append(", \"");
            buf.append(h.getOwner()).append("\", \"");
            buf.append(h.getName()).append("\", \"");
            buf.append(h.getDesc()).append("\")");
        } else if (cst instanceof Byte) {
            buf.append("Byte((byte)").append(cst).append(')');
        } else if (cst instanceof Boolean) {
            buf.append(((Boolean) cst).booleanValue() ? "Boolean.TRUE"
                    : "Boolean.FALSE");
        } else if (cst instanceof Short) {
            buf.append("Short((short)").append(cst).append(')');
        } else if (cst instanceof Character) {
            int c = ((Character) cst).charValue();
            buf.append("Character((char)").append(c).append(')');
        } else if (cst instanceof Integer) {
            buf.append("Integer(").append(cst).append(')');
        } else if (cst instanceof Float) {
            buf.append("Float(\"").append(cst).append("\")");
        } else if (cst instanceof Long) {
            buf.append("Long(").append(cst).append("L)");
        } else if (cst instanceof Double) {
            buf.append("Double(\"").append(cst).append("\")");
        } else if (cst instanceof byte[]) {
            byte[] v = (byte[]) cst;
            buf.append("new byte[] {");
            for (int i = 0; i < v.length; i++) {
                buf.append(i == 0 ? "" : ",").append(v[i]);
            }
            buf.append('}');
        } else if (cst instanceof boolean[]) {
            boolean[] v = (boolean[]) cst;
            buf.append("new boolean[] {");
            for (int i = 0; i < v.length; i++) {
                buf.append(i == 0 ? "" : ",").append(v[i]);
            }
            buf.append('}');
        } else if (cst instanceof short[]) {
            short[] v = (short[]) cst;
            buf.append("new short[] {");
            for (int i = 0; i < v.length; i++) {
                buf.append(i == 0 ? "" : ",").append("(short)").append(v[i]);
            }
            buf.append('}');
        } else if (cst instanceof char[]) {
            char[] v = (char[]) cst;
            buf.append("new char[] {");
            for (int i = 0; i < v.length; i++) {
                buf.append(i == 0 ? "" : ",").append("(char)")
                        .append((int) v[i]);
            }
            buf.append('}');
        } else if (cst instanceof int[]) {
            int[] v = (int[]) cst;
            buf.append("new int[] {");
            for (int i = 0; i < v.length; i++) {
                buf.append(i == 0 ? "" : ",").append(v[i]);
            }
            buf.append('}');
        } else if (cst instanceof long[]) {
            long[] v = (long[]) cst;
            buf.append("new long[] {");
            for (int i = 0; i < v.length; i++) {
                buf.append(i == 0 ? "" : ",").append(v[i]).append('L');
            }
            buf.append('}');
        } else if (cst instanceof float[]) {
            float[] v = (float[]) cst;
            buf.append("new float[] {");
            for (int i = 0; i < v.length; i++) {
                buf.append(i == 0 ? "" : ",").append(v[i]).append('f');
            }
            buf.append('}');
        } else if (cst instanceof double[]) {
            double[] v = (double[]) cst;
            buf.append("new double[] {");
            for (int i = 0; i < v.length; i++) {
                buf.append(i == 0 ? "" : ",").append(v[i]).append('d');
            }
            buf.append('}');
        }
    }

    private void declareFrameTypes(final int n, final Object[] o) {
        for (int i = 0; i < n; ++i) {
            if (o[i] instanceof Label) {
                declareLabel((Label) o[i]);
            }
        }
    }

    private void appendFrameTypes(final int n, final Object[] o) {
        for (int i = 0; i < n; ++i) {
            if (i > 0) {
                buf.append(", ");
            }
            if (o[i] instanceof String) {
                appendConstant(o[i]);
            } else if (o[i] instanceof Integer) {
                switch (((Integer) o[i]).intValue()) {
                case 0:
                    buf.append("TOP");
                    break;
                case 1:
                    buf.append("INTEGER");
                    break;
                case 2:
                    buf.append("FLOAT");
                    break;
                case 3:
                    buf.append("DOUBLE");
                    break;
                case 4:
                    buf.append("LONG");
                    break;
                case 5:
                    buf.append("NULL");
                    break;
                case 6:
                    buf.append("UNINITIALIZED_THIS");
                    break;
                }
            } else {
                appendLabel((Label) o[i]);
            }
        }
    }

    /**
     * Appends a declaration of the given label to {@link #buf buf}. This
     * declaration is of the form "Label lXXX = new Label();". Does nothing if
     * the given label has already been declared.
     * 
     * @param l
     *            a label.
     */
    protected void declareLabel(final Label l) {
        if (labelNames == null) {
            labelNames = new HashMap<Label, String>();
        }
        String name = labelNames.get(l);
        if (name == null) {
            name = "l" + labelNames.size();
            labelNames.put(l, name);
            buf.append("var ").append(name).append(" = LabelNode();\n");
        }
    }

    /**
     * Appends the name of the given label to {@link #buf buf}. The given label
     * <i>must</i> already have a name. One way to ensure this is to always call
     * {@link #declareLabel declared} before calling this method.
     * 
     * @param l
     *            a label.
     */
    protected void appendLabel(final Label l) {
        buf.append(labelNames.get(l));
    }
}
