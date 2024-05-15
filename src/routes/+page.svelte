<script lang="ts">
	import Calendar from '$lib/Calendar.svelte';
    import Settings from '$lib/Settings.svelte';
	import Tiptap from '$lib/Tiptap.svelte'
	import { noteList, CreateNewNote, UpdateNote, DeleteNote, GetNotesByUpdatedDate } from '$lib/noteStore';
	import type { Note } from '$lib/noteStore';
    import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import Fuse from 'fuse.js'

	let notes_shown = $noteList
	let active_note: Note = notes_shown[0]

	let editor_open = true
	let calendar_open = false
	let settings_open = false
	let note_option_id = 0
	let search_value = ""

	const options = {
		includeScore: true,
		keys: ['title', 'plaintext', 'tags']
	}

	let fuse = new Fuse($noteList, options)

	$: console.log("notes shown just changed", notes_shown)

	let selected_date: Date = new Date()

	$: selected_date, (calendar_open) ? notes_shown = GetNotesByUpdatedDate(selected_date, $noteList) : null
	$: calendar_open, (!calendar_open) ? notes_shown = $noteList : null

	$: active_note, UpdateMaybe()

	$: search_value, Search(search_value)

	$: notes_shown, console.log("test")

	function UpdateMaybe() {
		console.log("updating maybe")
		let newList = UpdateNote(active_note.id, $noteList, active_note.title, active_note.content, active_note.tags, active_note.plaintext)
		console.log("newlist", newList)
		$noteList = newList
		if (search_value == "") {
			notes_shown = $noteList
			fuse = new Fuse($noteList, options)
		}
	}


	function NewNote() {
		$noteList = CreateNewNote($noteList)
		active_note = $noteList[0]
		SwitchNote()
	}

	function SwitchNote() {
		editor_open = false;
		setTimeout(() => editor_open = true, 0);
	}

	function OpenNoteOptions(note_id: number) {
		note_option_id = note_id;
	}

	const popupCloseQuery: PopupSettings = {
		event: 'click',
		target: 'popupCloseQuery',
		placement: 'right',
		closeQuery: '#will-close',
		state: (e: Record<string, boolean>) => console.log(e)
	};

	function Search(search_term: string) {
		if (!search_term) {
			notes_shown = $noteList
			return;
		}
		const result = fuse.search(search_term);
		console.log("result: ", result)
		let new_list: Note[] = []
		for (let x of result) {
			new_list.push(x.item)
		}
		notes_shown = new_list
		active_note = notes_shown[0]
		console.log("notes shown: ", notes_shown)
	}

</script>
  
<main>

	<div class="grid grid-cols-3 card m-4">
		<div class="col-span-1 p-2">

			<div class="card p-3 max-w-sm z-50" data-popup="popupCloseQuery">
				<div class="grid grid-cols-1 gap-2">
					<button id="will-close" class="btn variant-soft-error" on:click={() => {$noteList = DeleteNote(note_option_id, $noteList); (active_note.id == note_option_id) ? active_note = notes_shown[0] : null}}>Delete Note</button>
				</div>
				<div class="arrow bg-surface-100-800-token" />
			</div>

			
				<div id="nav_buttons" class="my-2 flex flex-row justify-end gap-1">
						<!-- <div class=""><span class="material-symbols-outlined p-0">
							search
							</span></div> -->
						<input type="search" class="input" bind:value={search_value} placeholder="Search..." />
					<button class="btn-icon rounded {(calendar_open) ? 'variant-filled' : 'bg-transparent hover:variant-soft'}" on:click={() => {calendar_open = !calendar_open; settings_open = false;}}><span class="material-symbols-outlined">
						calendar_month
						</span></button>
					<button class="btn-icon rounded {(settings_open) ? 'variant-filled' : 'bg-transparent hover:variant-soft'}" on:click={() => {settings_open = !settings_open; calendar_open = false;}}><span class="material-symbols-outlined">
						settings
						</span></button>
					<button class="btn-icon rounded bg-transparent hover:variant-soft" on:click={NewNote}><span class="material-symbols-outlined">
						note_stack_add
						</span></button>
				</div>
				{#if calendar_open}
					<Calendar bind:selected_date={selected_date} />
				{:else if settings_open}
					<Settings />
				{/if}
				<div style="max-height: 88vh; overflow: scroll;">
				<ListBox>
					{#each notes_shown as note}
						<ListBoxItem bind:group={active_note} on:click={SwitchNote} name="note" value={note}>
							<div class="flex flex-row justify-between">
								<div class="flex flex-col">
									{note.title} 
									<span class="italic text-xs">{note.plaintext.substring(0,48)}...</span>
									<span class="italic text-xs mt-1 opacity-75">{(note.updated instanceof Date) ? note.updated.toDateString() : new Date(Date.parse(note.updated)).toDateString()}</span>
								</div>
								<div class="flex flex-col justify-center">
									<button class="btn-icon bg-transparent hover:variant-filled rounded h-6" use:popup={popupCloseQuery} on:click={() => OpenNoteOptions(note.id)}><span class="material-symbols-outlined">
										more_horiz
										</span></button>
								</div>
								
							</div>
						</ListBoxItem>
					{/each}
					
				</ListBox>
			</div>
			
		</div>
		<div class="flex flex-col col-span-2 p-2 items-center">
			{#if editor_open && active_note.content}
				<Tiptap bind:content={active_note.content} bind:tags={active_note.tags} bind:plain_text={active_note.plaintext} bind:title={active_note.title} />
			{:else}
				<Tiptap content={''} tags={[]} plain_text={''} title={''} />
			{/if}
		</div>
	</div>



</main>

