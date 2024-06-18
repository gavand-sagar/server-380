import { MongoClient } from "mongodb";

export async function getDB() {
    let client = new MongoClient("mongodb://127.0.0.1:27017/")
    let connection = await client.connect();
    let db = connection.db("superman");
    return db;
}

