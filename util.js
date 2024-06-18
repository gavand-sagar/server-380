import { MongoClient } from "mongodb";

export async function getDB() {
    let client = new MongoClient("mongodb+srv://admin:123@cluster0.nva7yak.mongodb.net/")
    let connection = await client.connect();
    let db = connection.db("superman");
    return db;
}

