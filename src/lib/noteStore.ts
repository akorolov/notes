import { persisted } from "svelte-persisted-store";
import { get } from "svelte/store";

export class Note {
    "title": string;
    "content": string;
    "plaintext": string;
    "created": Date;
    "updated": Date;
    "tags": string[];
    "id": number;
}

export const maxID = persisted("maxNoteID6", 0)
export const noteList = persisted("notelist6", CreateNewNote([]))


export function CreateNewNote(notelist: Note[]) {
    let new_note = new Note()
    new_note.content = "New note"
    new_note.title = "New note"
    new_note.plaintext = "New note"
    new_note.created = new Date()
    new_note.updated = new Date()
    new_note.tags = []
    new_note.id = get(maxID) + 1
    maxID.set(new_note.id)
    return [new_note, ...notelist]
}

export function UpdateNote(note_id: number, notelist: Note[], title?: string, content?: string, tags?: string[], plaintext?:string) {
    let new_note_list: Note[] = []
    for (let note of notelist) {
        if (note.id == note_id) {
            if (title) {
                note.updated = new Date()
                note.title = title
            }
            if (content) {
                note.updated = new Date()
                note.content = content
            }
            if (tags) {
                note.updated = new Date()
                note.tags = tags
            }
            if (plaintext) {
                note.updated = new Date()
                note.plaintext = plaintext
            }
        }
        new_note_list.push(note)
    }
    return new_note_list
}


export function DeleteNote(note_id: number, notelist: Note[]) {
    let new_note_list: Note[] = []
    notelist.forEach(note => {
        if (note.id !== note_id) new_note_list.push(note)
    })
    if (new_note_list.length == 0) {
        new_note_list = CreateNewNote(new_note_list)
    }
    return new_note_list
}


export function GetNotesByUpdatedDate(date: Date, notelist: Note[]) {
    let new_note_list: Note[] = []
    notelist.forEach(note => {
        (typeof(note.updated) == "string") ? note.updated = new Date(Date.parse(note.updated)) : null
        if (note.updated.getFullYear() == date.getFullYear() && note.updated.getMonth() == date.getMonth() && note.updated.getDate() == date.getDate()) new_note_list.push(note)
    })
    return new_note_list
}


export function GetNotesByCreatedDate(date: Date, notelist: Note[]) {
    let new_note_list: Note[] = []
    notelist.forEach(note => {
        if (note.created.getFullYear() == date.getFullYear() && note.created.getMonth() == date.getMonth() && note.created.getDate() == date.getDate()) new_note_list.push(note)
    })
    return new_note_list
}

