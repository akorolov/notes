<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { Editor } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import { InputChip } from '@skeletonlabs/skeleton';
  
    let element: Element
    let editor: Editor
    export let content: string
    export let tags: string[]
    export let plain_text: string
    export let title: string


    let paragraph_style = "P"

    let paragraph_styles = ["H1", "H2", "H3", "H4", "P"]

    let styles_readable = {
        "H1": "Heading 1",
        "H2": "Heading 2",
        "H3": "Heading 3",
        "H4": "Heading 4",
        "P": "Paragraph",
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
        }
    }

    function updateParagraphStyle() {
        if (editor.isActive("heading", { level: 1 })) paragraph_style = "H1";
        if (editor.isActive("heading", { level: 2 })) paragraph_style = "H2";
        if (editor.isActive("heading", { level: 3 })) paragraph_style = "H3";
        if (editor.isActive("heading", { level: 4 })) paragraph_style = "H4";
        if (editor.isActive("paragraph")) paragraph_style = "P";
    }

  </script>

  <div class="w-full card rounded p-2 bg-surface-200 flex flex-col gap-2">
    <input class="input bg-surface-50 h3 mb-1" type="text" bind:value={title} placeholder="Title" />

    <div id="editor-buttons" class="flex flex-row gap-1">
  
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

        {/if}

    </div>
  
  <div id="editor-body" class="textarea p-2 bg-surface-50 overflow-auto" style="max-height: 70vh;" bind:this={element} />
  <InputChip bind:value={tags} name="tags" placeholder="Add a tag..." />

</div>
  
  <style>

    #editor-body {

    }



  </style>