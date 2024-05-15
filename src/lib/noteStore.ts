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

export const noteList = persisted("notelist1", [new Note()])
export const maxID = persisted("maxNoteID1", 0)

export function CreateNewNote(title: string, content: string, tags: string[], plaintext: string, notelist: Note[]) {
    let new_note = new Note()
    new_note.content = content
    new_note.title = title
    new_note.plaintext = plaintext
    new_note.created = new Date()
    new_note.updated = new Date()
    new_note.tags = tags
    new_note.id = get(maxID) + 1
    maxID.set(new_note.id + 1)
    return [...notelist, new_note]
}

export function UpdateNote(note_id: number, notelist: Note[], title?: string, content?: string, tags?: string[], plaintext?:string) {
    let new_note_list: Note[] = []
    notelist.forEach(note => {
        if (note.id == note_id) {
            if (title) note.title = title
            if (content) note.content = content
            if (tags) note.tags = tags
            if (plaintext) note.plaintext = plaintext
            note.updated = new Date()
            new_note_list.push(note)
        } else {
            new_note_list.push(note)
        }
    });
    return new_note_list
}


export function DeleteNote(note_id: number, notelist: Note[]) {
    let new_note_list: Note[] = []
    notelist.forEach(note => {
        if (note.id !== note_id) new_note_list.push(note)
    })
    return new_note_list
}


export function GetNotesByUpdatedDate(date: Date, notelist: Note[]) {
    let new_note_list: Note[] = []
    notelist.forEach(note => {
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

