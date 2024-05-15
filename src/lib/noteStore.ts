import { persisted } from "svelte-persisted-store";

export class Note {
    "title": string;
    "content": string;
    "updated": Date;
    "tags": string[];
    "id": number;
}

export const noteList = persisted("notelist1", [new Note()])