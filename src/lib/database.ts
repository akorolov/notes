import Database from "tauri-plugin-sql-api";
import type { Note } from "./noteStore";

// const db = await Database.load("sqlite:notes2.db");


async function main(db: Database) {


    try {
        let table_create = await db.execute("CREATE TABLE notes ( id INTEGER PRIMARY KEY, title TEXT, content TEXT, plaintext TEXT, tags TEXT NOT NULL, created TEXT NOT NULL, updated TEXT NOT NULL);")
    } catch {
        null
    }

    UpdateNote(db, 1, "new title44444", "test", "test", [])


    // use db.execute for inserts and updates
    // use db.select for selects
    let notes: any[] = await db.select("select * from notes;");

    // CreateNote(db, "test1", "test2", "test3", [])

    console.log("result", notes)
}

async function CreateNewNote(db: Database, title: string, html: string, plaintext: string, tags: string[]  ) {
    console.log("trying to create note")
    let result: any[] = await db.select("SELECT MAX(id) AS max_id FROM notes;")
    console.log("max id", result)
    if (result[0].max_id) {
        db.execute("insert into notes (id, title, content, plaintext, tags, created, updated) values ("
            + (result[0].max_id+1) + ", '"
            + title + "', '"
            + html + "', '"
            + plaintext + "', '"
            + tags.toString() + "', '"
            + new Date() + "', '"
            + new Date() + 
        "');")
    }
}

export async function WriteRecords(db: Database, records: Note[]) {
    let sql_query = "insert into notes (id, title, content, plaintext, tags, created, updated) values "
    for (let record of records) {
        let values = "(" + record.id + ", '" + record.title + "', '" + record.content + "', '" + record.plaintext + "', '" + record.tags.toString() + "', '" + record.created + "', '" + (new Date()) + ")"
        sql_query += values + ", "
        
    }
    sql_query = sql_query.slice(0, -2) + ";"
    console.log(sql_query)
    db.execute(sql_query)
}

async function UpdateNote(db: Database, note_id: number, title: string, html: string, plaintext: string, tags: string[]) {
    db.execute("update notes set title='" + title + "', content='" + html + "', plaintext='" + plaintext + "', tags='" + tags.toString() + "', updated='" + new Date() + "' where id=" + note_id + ";")
}

async function DeleteNote(db: Database, note_id: number) {
    db.execute("delete from notes where id=" + note_id + ";")
}

export async function PullAllFromDatabase(db: Database) {
    return db.select("select * from notes");
}

async function PullNoteFromDatabaseByID(db: Database, note_id: number) {
    return db.select("select * from notes where id=" + note_id + ";")
}



// CreateNote()
