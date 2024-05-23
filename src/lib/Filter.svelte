<script lang="ts">

    import { filter } from "@skeletonlabs/skeleton";
import { GetAllTags, type Note } from "./noteStore";

export let filter_tags: string[] = []
export let notelist: Note[] = []
export let has_list: string[] = []

let input_tag = ''

let all_tags: string[] = GetAllTags(notelist)

</script>

<div class="flex flex-col p-2 gap-2">
    <span class="flex flex-row gap-4 justify-between mb-1">
        <span class="h5">Contains: </span>
        <span>
            <button class="chip variant-soft">Todo</button>
            <button class="chip variant-soft">Table</button>
            <button class="chip variant-soft">Email</button>
            <button class="chip variant-soft">Link</button>
        </span>
    </span>
    <span class="flex flex-row gap-4 items-start mb-1">
        <span class="flex flex-col items-start gap-2">
            <span class="h5">Tags: </span>
            
        </span>
        <span class="flex flex-row flex-wrap w-full gap-2 max-h-32 overflow-auto justify-start">
            {#each all_tags as tag}
                <button class="chip {filter_tags.includes(tag) ? 'variant-filled' : 'variant-soft'}" on:click={() => (filter_tags.includes(tag) ? filter_tags = filter_tags.filter((word) => word != tag) : filter_tags = [...filter_tags, tag])}>{tag}</button>
            {/each}
        </span>

    </span>
    {#if filter_tags.length > 0}
        <button class="chip variant-ghost" on:click={() => filter_tags = []}>
            <span>✕</span>
            <span>clear</span>
        </button>
    {/if} 

    <hr />
</div>