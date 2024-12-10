const express = require("express")
const cors = require("cors")
const dns = require("dns");
const path = require("path")

const { type } = require("os");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let originalUrls = []
let shortUrls = []
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
app.post("/api/shorturl",(req,res)=>{
    try{
        let url = req.body.url
        if (!url.includes("https://") && !url.includes("http://")){
            return res.json({error: "invalid url"})
        }
        if (originalUrls.indexOf(url) < 0){
            originalUrls.push(url)
            shortUrls.push(originalUrls.length - 1)
            data = {
                original_url : url,
                short_url : shortUrls[originalUrls.indexOf(url)]
            }
            res.send(data)
        }
        else {
            data = {
                original_url : url,
                short_url : shortUrls[originalUrls.indexOf(url)]
            }
            res.setHeader("Content-Type", "application/json")
            res.json(data)
        }
    
    
    }
    catch(err){
        res.send({ error: 'invalid Url' })
    }
})

app.get("/api/shorturl/:id",(req,res) => {
    let { id } = req.params;
    if (typeof shortUrls[id]  === "undefined"){
        data = {
            error : "not found"
        }
        
        res.send(data)
    } else{
        url = originalUrls[id]
        res.redirect(url)
    }
})



app.listen(9521);