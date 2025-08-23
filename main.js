const { time } = require("console");
const express = require("express");
const moongose = require("mongoose");


mongoose.connect("");

const schema = new moongose.schema({
    tittle: String,
    author: String,
    content: String,
    tags: [String],
    Id: String,
    time: {type: Date , default: Date.now}
})

const article = mongoose.model("article" , schema);

const app = express();
app.use(express.json());

app.get("/api/articles", async (req,res)=>{
    const filter = {};
    try{
    if(req.query.tags)
    {
        filter.tag = req.query.tag
    }
    if(req.query.time)
    {
        filter.timedetails = {$gte : new Date(req.query.time)}
    }
    const articles = await article.find(filter).sort({time: -1})
    res.json(articles);
    }
    catch{
        res.status(400).json({
            msg: "Sorry some error occured"
        })
    }
})

app.get("api/articles/:id", async(req,res)=>{
    try{
        const findarticle = article.findOne({Id: req.params.id});
        if(!findarticle)
        {
            res.status(400).json({msg: "data not fetched"});
        }
        else{
            res.json(findarticle);
        }
    }
    catch{
        res.json(500).json({msg: "some error occured"})
    }
})