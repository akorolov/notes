import Database from "tauri-plugin-sql-api";

async function main() {
    const db = await Database.load("sqlite:test.db");

    // use db.execute for inserts and updates
    let result1 = await db.execute("INSERT INTO users (name) VALUES ('Alice'), ('Bob'), ('Charlie');");

    // use db.select for selects
    let result = await db.select("select * from users;");

    console.log("database: ", db);
    console.log("result1", result1)
    console.log("result", result)
}

main();