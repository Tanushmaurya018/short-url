const express=require("express");

const urlRoute=require("./routes/url")
const {connectToMongoDB}=require("./connect")
const URL=require("./models/url")
const path =require("path");
const { render } = require("ejs");
const staticRouter=require("./routes/staticRouter")
const app=express();
const PORT=3001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url-3")
.then(console.log("MongoDB Connected"));



// app.use("/test",(req,res)=>{
//         return res.send("<h1>hwehwhwhh</h1>");
// });

app.use("/",staticRouter);

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended: false}))


// app.get("/test",async (req,res)=>{
//     const allUrls=await URL.find({})
//     res.render('home',{
//         urls:allUrls,
//     })
// })

app.use("/url",urlRoute);

app.get("/:shortId",async(req,res)=>{
    const shortId=req.params.shortId;
   const entry= await URL.findOneAndUpdate(
        {
        shortId,
        },
        {
            $push:{
                visitHistory:{
                    timestamp:Date.now()
                }
            },
        }
    );
    res.redirect(entry?.redirectURL);
})


app.listen(PORT,()=>console.log(`Server Connected at ${PORT}`));
