<script lang="ts">
	import Tiptap from '$lib/Tiptap.svelte'
	import { contest_test } from '$lib/dataStore';
	import { noteList } from '$lib/noteStore';

	// add in the switcher to pick which note you're on 
	// maybe figure out a better data structure for saving the note

	console.log($noteList)

  </script>
  
  <main>

<div class="grid grid-cols-2">
	<div>
		{#each $noteList as note}
			{note.title}
		{/each}
	</div>
	<div class="flex flex-col m-4 p-2 items-center">
		<Tiptap bind:content={$contest_test} />
	</div>
</div>
  </main>