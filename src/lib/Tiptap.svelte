<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { Editor } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import { InputChip } from '@skeletonlabs/skeleton';
    import Highlight from '@tiptap/extension-highlight'
    import TextAlign from '@tiptap/extension-text-align'
    import TaskItem from '@tiptap/extension-task-item'
    import TaskList from '@tiptap/extension-task-list'
    import OrderedList from '@tiptap/extension-ordered-list';
    import BulletList from '@tiptap/extension-bullet-list';
    import ListItem from '@tiptap/extension-list-item';
    import Blockquote from '@tiptap/extension-blockquote';
    import Subscript from '@tiptap/extension-subscript';
    import Superscript from '@tiptap/extension-superscript';
    import Underline from '@tiptap/extension-underline';
    import CodeBlock from '@tiptap/extension-code-block';

  
    let element: Element
    let editor: Editor
    export let content: string
    export let tags: string[]
    export let plain_text: string
    export let title: string
    export let updated: Date
    export let created: Date



    let paragraph_style = "P"

    let paragraph_styles = ["H1", "H2", "H3", "H4", "P", "Code"]

    let styles_readable = {
        "H1": "Heading 1",
        "H2": "Heading 2",
        "H3": "Heading 3",
        "H4": "Heading 4",
        "P": "Paragraph",
        "Code": "Code",
    }
  
    onMount(() => {
      editor = new Editor({
        element: element,
        editorProps: {
            attributes: {
                class: 'p-2 focus:outline-none',
            },
        },
        extensions: [
            StarterKit,
            Highlight,
            Subscript,
            Superscript,
            Underline,
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'bg-surface-900 text-surface-50 px-3 py-3 rounded-lg text-sm mb-3',
                }
            }),
            Blockquote.configure({
                HTMLAttributes: {
                    class: 'border-l-4 border-surface-300 bg-surface-100 pl-4 italic text-surface-500 my-4 py-1',
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'list-decimal ml-4',
                }
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: 'list-disc ml-4',
                }
            }),
            ListItem,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: 'checklistHere',
                },
            }),
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: 'flex flex-row gap-2',
                },
            }),
        ],
        content: content,
        onTransaction: () => {
          // force re-render so `editor.isActive` works as expected
          editor = editor
        },

        onUpdate: () => {
            // when content has changed
            content = editor.getHTML()
            plain_text = editor.getText()
        },


        onSelectionUpdate: () => {
            // when the selection has changed
            updateParagraphStyle()
        }
      })
    })
  
    onDestroy(() => {
      if (editor) {
        editor.destroy()
      }
    })

    function setParagraphStyle(style: string) {
        paragraph_style = style
        switch (style) {
            case "H1":
                editor.chain().focus().toggleHeading({ level: 1}).run()
                break
            case "H2":
                editor.chain().focus().toggleHeading({ level: 2}).run()
                break
            case "H3":
                editor.chain().focus().toggleHeading({ level: 3}).run()
                break
            case "H4":
                editor.chain().focus().toggleHeading({ level: 4}).run()
                break
            case "P":
                editor.chain().focus().setParagraph().run()
                break
            case "Code":
                editor.chain().focus().toggleCodeBlock().run()
                break
        }
    }

    function updateParagraphStyle() {
        if (editor.isActive("heading", { level: 1 })) paragraph_style = "H1";
        if (editor.isActive("heading", { level: 2 })) paragraph_style = "H2";
        if (editor.isActive("heading", { level: 3 })) paragraph_style = "H3";
        if (editor.isActive("heading", { level: 4 })) paragraph_style = "H4";
        if (editor.isActive("paragraph")) paragraph_style = "P";
        if (editor.isActive("codeBlock")) paragraph_style = "Code";
    }

    function clearStyles() {
        editor.chain().focus().toggleHeading({ level: 4}).run();
        editor.chain().focus().setParagraph().run();
        editor.chain().focus().unsetBlockquote().run();
    }

  </script>

  <div class="w-full card rounded p-2 bg-surface-200 flex flex-col gap-2">
    <input class="input bg-surface-50 h3" type="text" bind:value={title} placeholder="Title" />
    <div class="text-xs italic mb-1 ml-1">Created {created.toLocaleString([], {hour: '2-digit', minute:'2-digit', day: '2-digit', month: 'numeric', year: '2-digit'})} <span class="divider-vertical h-1" /> Updated {updated.toLocaleString([], {hour: '2-digit', minute:'2-digit', month: 'numeric', year: '2-digit', day: '2-digit'})}</div>

    <div id="editor-buttons" class="flex flex-row flex-wrap gap-1">
  
        {#if editor}

            <select class="select variant-form-material w-32" bind:value={paragraph_style} on:change={() => setParagraphStyle(paragraph_style)}>
                {#each paragraph_styles as ps}
                <option value={ps}>{styles_readable[ps]}</option>
                {/each}
            </select>

            <!-- {#each paragraph_styles as c}
                <button
                    class="chip {paragraph_style == c ? 'variant-filled' : 'variant-soft'}" style="margin: 1px; border-radius: 1px;"
                    on:click={() => { setParagraphStyle(c) }}
                    on:keypress
                >
                    <span>{c}</span>
                </button>
            {/each} -->

            <button class="chip p-1 {editor.isActive("bold") ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => editor.chain().focus().toggleBold().run()} > <span class="material-symbols-outlined text-2xl">
                    format_bold
                    </span>
            </button>
            <button class="chip p-1 {editor.isActive("italic") ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => editor.chain().focus().toggleItalic().run()} > <span class="material-symbols-outlined text-2xl">
                    format_italic
                    </span>
            </button>
            <button class="chip p-1 {editor.isActive("underline") ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => editor.chain().focus().toggleUnderline().run()} > <span class="material-symbols-outlined text-2xl">
                    format_underlined
                    </span>
            </button>
            <button class="chip p-1 {editor.isActive("subscript") ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => editor.chain().focus().toggleSubscript().run()} > <span class="material-symbols-outlined text-2xl">
                    subscript
                    </span>
            </button>
            <button class="chip p-1 {editor.isActive("superscript") ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => editor.chain().focus().toggleSuperscript().run()} > <span class="material-symbols-outlined text-2xl">
                    superscript
                    </span>
            </button>
            <button class="chip p-1 {editor.isActive("highlight") ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => editor.chain().focus().toggleHighlight().run()} > <span class="material-symbols-outlined text-2xl">
                    format_ink_highlighter
                    </span>
            </button>
            <!-- <button class="chip p-1 {editor.isActive("highlight") ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => editor.chain().focus().toggleHighlight().run()} > <span class="material-symbols-outlined text-2xl">
                    format_color_text
                    </span>
            </button> -->
            <span class="divider-vertical h-10 m-1" />
            <button class="chip p-1 {editor.isActive({ textAlign: 'left' }) ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => editor.chain().focus().setTextAlign('left').run()} > <span class="material-symbols-outlined text-2xl">
                    format_align_left
                    </span>
            </button>
            <button class="chip p-1 {editor.isActive({ textAlign: 'center' }) ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => editor.chain().focus().setTextAlign('center').run()} > <span class="material-symbols-outlined text-2xl">
                    format_align_center
                    </span>
            </button>
            <button class="chip p-1 {editor.isActive({ textAlign: 'right' }) ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => editor.chain().focus().setTextAlign('right').run()} > <span class="material-symbols-outlined text-2xl">
                    format_align_right
                    </span>
            </button>
            <span class="divider-vertical h-10 m-1" />
            <button class="chip p-1 {editor.isActive("bulletList") ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => {clearStyles(); editor.chain().focus().toggleBulletList().run()}} > <span class="material-symbols-outlined text-2xl">
                    format_list_bulleted
                    </span>
            </button>
            <button class="chip p-1 {editor.isActive("orderedList") ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => {clearStyles(); editor.chain().focus().toggleOrderedList().run()}} > <span class="material-symbols-outlined text-2xl">
                    format_list_numbered
                    </span>
            </button>
            <button class="chip p-1 {editor.isActive("taskList") ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => {clearStyles(); editor.chain().focus().toggleTaskList().run()}} > <span class="material-symbols-outlined text-2xl">
                    checklist
                    </span>
            </button>
            <button class="chip p-1 {editor.isActive("blockquote") ? 'variant-filled' : 'variant-soft'}" style="margin: 0px; border-radius: 1px;"
                on:click={() => {clearStyles(); editor.chain().focus().toggleBlockquote().run()}} > <span class="material-symbols-outlined text-2xl">
                    format_quote
                    </span>
            </button>

        {/if}

    </div>
  
  <div id="editor-body" class="textarea p-2 bg-surface-50 overflow-auto" style="max-height: 70vh;" bind:this={element} />
  <InputChip bind:value={tags} name="tags" placeholder="Add a tag..." />

</div>
  