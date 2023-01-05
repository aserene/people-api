require("dotenv").config()
const { PORT = 3000, DATABASE_URL } = process.env
// or const PORT = process.env.PORT || 3000
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express()
const mongoose = require("mongoose")
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
mongoose.connection
.on("open", () => console.log("Mongoose connected"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})
const People = mongoose.model("People", PeopleSchema)
//middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
//routes
app.get("/", (req, res) =>{
    res.send("Hello")
})
app.get("/people", async(req, res) => {
    try{
        res.json(await People.find({}))
    }catch(error){
        res.status(400).json(error)
    }
})
app.post("/people", async (req, res) => {
    try{
        res.json(await People.create(req.body))
    }catch(error){
        res.status(400).json(error)
    }
})
app.put("/people/:id", async (req, res) => {
    try{
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new:true}))
    }catch(error){
        res.status(400).json(error)
    }
})
app.delete("/people/:id", async(req, res) => {
    try{
        res.json( await People.findByIdAndRemove(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})
app.get("/people/:id", async (req, res) => {
    try{
        res.json( await People.findById(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})
app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`))