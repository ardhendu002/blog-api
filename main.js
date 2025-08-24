const express = require("express");
const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://ardhendumishra2006:subham002@cluster0.pdhy5so.mongodb.net/");

const schema = new mongoose.Schema({
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
    catch(err){
        res.status(400).json({
            msg: "Sorry some error occured"
        })
    }
})

app.get("/api/articles/:id", async(req,res)=>{
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
    catch(err){
        res.json(500).json({msg: "some error occured"})
    }
})

app.post("/api/articles", async(req,res)=>{
    try{
        const newarticle = new article(req.body);
        const savedarticle = await newarticle.save();
        res.status(201).json(savedarticle);
    }
    catch(err){
        res.status(500).json({msg:"couldnt save the article"})
    }
})

app.put("/api/articles/:id", async(req,res)=>{
    try{
        const toupdate = await article.findOneAndUpdate(
            {Id: req.params.id},
            req.body,
            {new: true , runValidators:true}
        )
        if(!toupdate){
            res.status(400).json({msg:"some err occ"})
        }
        else{
        res.status(202).json(toupdate)
        }
    }
    catch(err){
        res.status(500).json({msg: "some error occured"});
    }
})

app.delete("/api/article/:id",async(req,res)=>{
    try{
        const todelete = await article.findOneAndDelete(
            {ID : req.params.id},
        )
        if(!todelete)
        {
            res.status(400).json({msg: "please pass correct id"})
        }
        else
        {
            res.status(200).json({msg: "your article is deleted"});
        }
    }
    catch(err){
        res.status(500).json({msg: "some err occured"});
    }
})

app.listen(3000);