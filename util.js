import { MongoClient } from "mongodb";

export async function getDB() {
    let client = new MongoClient(process.env.DB_URL)
    let connection = await client.connect();
    let db = connection.db("superman");
    return db;
}

