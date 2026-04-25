"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useEffect, useCallback } from "react";
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Link2, Link2Off, Undo, Redo,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ label, value, onChange, placeholder = "Write your content here…", className }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline underline-offset-2 hover:text-primary-dark" },
      }),
      Placeholder.configure({ placeholder }),
      Typography,
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[220px] px-4 py-3 text-neutral-800",
      },
    },
  });

  // Sync external value changes (e.g. when opening edit modal)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    cn(
      "w-7 h-7 flex items-center justify-center rounded transition-colors",
      active
        ? "bg-primary text-white"
        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
    );

  return (
    <div className={cn("", className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      )}
      <div className="border border-neutral-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-neutral-50 border-b border-neutral-200">
          {/* History */}
          <button type="button" title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btn(false) + " disabled:opacity-30"}>
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btn(false) + " disabled:opacity-30"}>
            <Redo className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-neutral-200 mx-1" />

          {/* Headings */}
          <button type="button" title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive("heading", { level: 1 }))}>
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))}>
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))}>
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-neutral-200 mx-1" />

          {/* Inline marks */}
          <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))}>
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))}>
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive("strike"))}>
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()} className={btn(editor.isActive("code"))}>
            <Code className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-neutral-200 mx-1" />

          {/* Lists */}
          <button type="button" title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))}>
            <List className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))}>
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-neutral-200 mx-1" />

          {/* Blocks */}
          <button type="button" title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))}>
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btn(editor.isActive("codeBlock"))}>
            <Code2 className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)}>
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-neutral-200 mx-1" />

          {/* Link */}
          <button type="button" title="Set link" onClick={setLink} className={btn(editor.isActive("link"))}>
            <Link2 className="w-3.5 h-3.5" />
          </button>
          {editor.isActive("link") && (
            <button type="button" title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()} className={btn(false)}>
              <Link2Off className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Editor area */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
