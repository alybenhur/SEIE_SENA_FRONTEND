<template>
  <div class="wysiwyg-wrapper border border-gray-300 rounded-md overflow-hidden focus-within:border-teal-500">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
      <button type="button" @click="editor?.chain().focus().toggleBold().run()"
        :class="{ 'bg-teal-100 text-teal-700': editor?.isActive('bold') }"
        class="toolbar-btn font-bold">B</button>
      <button type="button" @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ 'bg-teal-100 text-teal-700': editor?.isActive('italic') }"
        class="toolbar-btn italic">I</button>
      <button type="button" @click="editor?.chain().focus().toggleUnderline().run()"
        :class="{ 'bg-teal-100 text-teal-700': editor?.isActive('underline') }"
        class="toolbar-btn underline">U</button>
      <div class="w-px h-5 bg-gray-300 mx-1"></div>
      <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-teal-100 text-teal-700': editor?.isActive('heading', { level: 2 }) }"
        class="toolbar-btn text-xs">H2</button>
      <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'bg-teal-100 text-teal-700': editor?.isActive('heading', { level: 3 }) }"
        class="toolbar-btn text-xs">H3</button>
      <div class="w-px h-5 bg-gray-300 mx-1"></div>
      <button type="button" @click="editor?.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-teal-100 text-teal-700': editor?.isActive('bulletList') }"
        class="toolbar-btn">≡</button>
      <button type="button" @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-teal-100 text-teal-700': editor?.isActive('orderedList') }"
        class="toolbar-btn">1.</button>
      <div class="w-px h-5 bg-gray-300 mx-1"></div>
      <button type="button" @click="editor?.chain().focus().setTextAlign('left').run()"
        :class="{ 'bg-teal-100 text-teal-700': editor?.isActive({ textAlign: 'left' }) }"
        class="toolbar-btn text-xs">⬅</button>
      <button type="button" @click="editor?.chain().focus().setTextAlign('center').run()"
        :class="{ 'bg-teal-100 text-teal-700': editor?.isActive({ textAlign: 'center' }) }"
        class="toolbar-btn text-xs">↔</button>
      <button type="button" @click="editor?.chain().focus().setTextAlign('right').run()"
        :class="{ 'bg-teal-100 text-teal-700': editor?.isActive({ textAlign: 'right' }) }"
        class="toolbar-btn text-xs">➡</button>
      <div class="w-px h-5 bg-gray-300 mx-1"></div>
      <button type="button" @click="editor?.chain().focus().undo().run()" class="toolbar-btn text-xs">↩</button>
      <button type="button" @click="editor?.chain().focus().redo().run()" class="toolbar-btn text-xs">↪</button>
    </div>
    <!-- Editor content -->
    <EditorContent :editor="editor" class="wysiwyg-content" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [val: string] }>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val, false)
  }
})

onBeforeUnmount(() => editor.value?.destroy())
</script>

<style>
.toolbar-btn {
  @apply px-2 py-1 text-sm rounded hover:bg-gray-200 text-gray-700 transition-colors min-w-[28px] text-center;
}
.wysiwyg-content .tiptap {
  @apply min-h-[140px] px-3 py-2 text-sm text-gray-800 outline-none;
}
.wysiwyg-content .tiptap h2 { @apply text-lg font-bold mb-2; }
.wysiwyg-content .tiptap h3 { @apply text-base font-semibold mb-1; }
.wysiwyg-content .tiptap p { @apply mb-2; }
.wysiwyg-content .tiptap ul { @apply list-disc pl-5 mb-2; }
.wysiwyg-content .tiptap ol { @apply list-decimal pl-5 mb-2; }
.wysiwyg-content .tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  @apply text-gray-400 pointer-events-none float-left h-0;
}
</style>
