<script>
	import Tiptap from '$lib/Tiptap.svelte'
	import { contest_test } from '$lib/dataStore';


  </script>
  
  <main>

	<div class="flex flex-col m-4 p-2 items-center">
		<Tiptap bind:content={$contest_test} />
	</div>
  </main>