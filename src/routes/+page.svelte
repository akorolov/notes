<script lang="ts">
	import Calendar from '$lib/Calendar.svelte';
    import Settings from '$lib/Settings.svelte';
	import Tiptap from '$lib/Tiptap.svelte'
	import { noteList, CreateNewNote, UpdateNote, DeleteNote, GetNotesByUpdatedDate, GetNotesByCreatedDate, FilterNotesByTags, TestNotes } from '$lib/noteStore';
	import type { Note } from '$lib/noteStore';
    import { ListBox, ListBoxItem, filter } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import Fuse from 'fuse.js'
	import { calendar_setting } from '$lib/settingStore';
    import Filter from '$lib/Filter.svelte';
    import Database from 'tauri-plugin-sql-api';
    import { onMount } from 'svelte';


	async function TestF() {
		console.log("test function here")
		const db = await Database.load("sqlite:notes2.db");
		TestNotes(db, notes_shown)
	}

	TestF();


	let notes_shown = $noteList
	let active_note: Note = notes_shown[0]


	

	let editor_open = true
	let calendar_open = false
	let filter_open = false
	let settings_open = false
	let note_option_id = 0
	let search_value = ""
	let filter_tags: string[] = []

	const options = {
		includeScore: true,
		ignoreLocation: true,
		keys: ['title', 'plaintext', 'tags']
	}

	let fuse = new Fuse($noteList, options)

	let selected_date: Date = new Date()

	$: selected_date, (calendar_open) ? (($calendar_setting == "updated") ? notes_shown = GetNotesByUpdatedDate(selected_date, $noteList) : notes_shown = GetNotesByCreatedDate(selected_date, $noteList)) : null
	$: calendar_open, (!calendar_open) ? notes_shown = $noteList : null
	$: filter_open, (!filter_open) ? notes_shown = $noteList : null
	$: filter_open, (!filter_open) ? filter_tags = [] : null
	$: filter_tags, (filter_open) ? notes_shown = FilterNotesByTags(filter_tags, $noteList) : null

	$: active_note, UpdateMaybe()

	$: search_value, Search(search_value)

	function UpdateMaybe() {
		let newList = UpdateNote(active_note.id, $noteList, active_note.title, active_note.content, active_note.tags, active_note.plaintext)
		$noteList = newList
		if (search_value == "" && !calendar_open && !filter_open) {
			notes_shown = $noteList
			fuse = new Fuse($noteList, options)
		}
		if (filter_open) {
			notes_shown = FilterNotesByTags(filter_tags, $noteList)
			fuse = new Fuse(notes_shown, options)
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
		let new_list: Note[] = []
		for (let x of result) {
			new_list.push(x.item)
		}
		notes_shown = new_list
		active_note = notes_shown[0]
	}

</script>
  
<main>

	<div class="grid grid-cols-3 card m-4">
		<div class="col-span-1 p-2">

			<div class="card p-0 max-w-sm z-50" data-popup="popupCloseQuery">
				<div class="flex flex-col gap-0 z-40">
					<button id="will-close" class="btn variant-glass-surface" on:click={() => {}}> <span class="material-symbols-outlined mr-1">
						keep
						</span> Pin</button>
					<button id="will-close" class="btn variant-glass-surface" on:click={() => {$noteList = DeleteNote(note_option_id, $noteList); (active_note.id == note_option_id) ? active_note = notes_shown[0] : null}}><span class="material-symbols-outlined mr-1">
						delete
						</span> Delete</button>
				</div>
				<div class="arrow bg-surface-300-600-token variant-glass-surface z-30" />
			</div>

			<input type="search" class="input variant-glass-surface rounded-full mt-2 ml-1" bind:value={search_value} placeholder="Search..." />

				<div id="nav_buttons" class="my-2 flex flex-row justify-end gap-1">
						<!-- <div class=""><span class="material-symbols-outlined p-0">
							search
							</span></div> -->
						
					<button class="btn-icon rounded {(filter_open) ? 'variant-filled' : 'bg-transparent hover:variant-soft'}" on:click={() => {filter_open = !filter_open; settings_open = false; calendar_open = false;}}><span class="material-symbols-outlined">
						tune
						</span></button>
					<button class="btn-icon rounded {(calendar_open) ? 'variant-filled' : 'bg-transparent hover:variant-soft'}" on:click={() => {calendar_open = !calendar_open; settings_open = false; filter_open = false;}}><span class="material-symbols-outlined">
						calendar_month
						</span></button>
					<button class="btn-icon rounded {(settings_open) ? 'variant-filled' : 'bg-transparent hover:variant-soft'}" on:click={() => {settings_open = !settings_open; calendar_open = false; filter_open = false;}}><span class="material-symbols-outlined">
						settings
						</span></button>
					<button class="btn-icon rounded bg-transparent hover:variant-soft" on:click={NewNote}><span class="material-symbols-outlined">
						note_stack_add
						</span></button>
				</div>
				{#if calendar_open}
					<Calendar bind:selected_date={selected_date} />
				{:else if filter_open}
					<Filter notelist={notes_shown} bind:filter_tags={filter_tags} />
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
										<span class="italic text-xs">{note.plaintext.substring(0,48)}{(note.plaintext.length > 48) ? '...' : ''}</span>
										<span class="italic text-xs mt-1 opacity-75">{(note.updated instanceof Date) ? note.updated.toLocaleString([], {hour: '2-digit', minute:'2-digit', month: 'numeric', year: '2-digit', day: '2-digit'}) : new Date(Date.parse(note.updated)).toLocaleString([], {hour: '2-digit', minute:'2-digit', month: 'numeric', year: '2-digit', day: '2-digit'})}</span>
									</div>
									<div class="flex flex-col justify-center">
										<button class="btn-icon bg-transparent hover:variant-filled rounded-full h-8" use:popup={popupCloseQuery} on:click={() => OpenNoteOptions(note.id)}><span class="material-symbols-outlined">
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
				<Tiptap bind:content={active_note.content} bind:tags={active_note.tags} bind:plain_text={active_note.plaintext} bind:title={active_note.title} created={(active_note.created instanceof Date) ? active_note.created : new Date(Date.parse(active_note.created))} updated={(active_note.updated instanceof Date) ? active_note.updated : new Date(Date.parse(active_note.updated))} />
			{:else}
				<Tiptap content={''} tags={[]} plain_text={''} title={''} created={new Date()} updated={new Date()} />
			{/if}
		</div>
	</div>



</main>

