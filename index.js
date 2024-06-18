import express from 'express'
import jwt from 'jsonwebtoken';
import { getDB } from './util.js';

const SECRET_KEY = "this is something that should not be known to anyone (ANYONE)"

const app = express();
// adding a global middleware
app.use(express.json());

const authMiddleware = async (req, res, next) => {
    // check the token sent from user, if it is authentic
    // means created by this server only
 
    try {
        jwt.verify(req.headers.token,SECRET_KEY)
        next()
    } catch (error) {
        res.json({message:"un authorized"})
    }

}


// one api to create a token from username and password
// one middle that will check if token is correct or not

app.get("/generate-token",async (req,res)=>{
    let db = await getDB();
    let query = {
        username: req.headers.username,
        password: req.headers.password
    }
    let userEntry = await db.collection("users").find(query).toArray();
    if (userEntry && userEntry.length > 0) {
        // generate the token
        let token = jwt.sign({username: req.headers.username},SECRET_KEY,{expiresIn:'30s'});
        res.json({token:token})

    }else{
        res.json({message:"user not found"})
    }
})


app.get("/get-all-categories", authMiddleware, async (req, res) => {

    let db = await getDB();
    let items = await db.collection("categories").find().toArray();
    res.json(items)
});

app.post("/add-category", authMiddleware, async (req, res) => {

    let obj = req.body;

    let db = await getDB();
    let result = await db.collection("categories").insertOne(obj);
    res.json(result)

});


app.post("/add-users", async (req, res) => {

    let obj = req.body;  // { username:""};
    if (!obj.username) {
        res.json({ message: "username required" })
        return;
    }

    if (!obj.password) {
        res.json({ message: "password required" })
        return;
    }

    let db = await getDB();
    let query = {
        username: req.body.username
    }
    let userEntry = await db.collection("users").find(query).toArray();
    if (userEntry && userEntry.length > 0) {
        res.json({ message: "username is already taken, kindly use diffrent one." })
        return;
    }


    let result = await db.collection("users").insertOne(obj);
    res.json(result)

})



app.get("/hi", authMiddleware, (req, res) => {

    res.json({ message: "Hello world" })
})

app.get("/whatsupp", authMiddleware, (req, res) => {
    res.send("I am fine...")
})

app.get("/to-dance", (req, res) => {
    res.send("🕺🕺🕺🕺🕺🕺")
})

app.listen(5000)