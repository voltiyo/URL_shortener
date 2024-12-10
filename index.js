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
        let url = new URL(req.body.url)
        dns.lookup(url.hostname, (err, address, family) => {
            if (err) {
                res.send({ error: 'Invalid url' })
            } else {
                if (originalUrls.indexOf(url.hostname) < 0){
                    originalUrls.push(url.hostname)
                    shortUrls.push(originalUrls.length - 1)
                    data = {
                        originalUrl : url.hostname,
                        shorturl : shortUrls[originalUrls.indexOf(url.hostname)]
                    }
                    res.send(data)
                }
                else {
                    data = {
                        originalUrl : url.hostname,
                        shorturl : shortUrls[originalUrls.indexOf(url.hostname)]
                    }
                    res.setHeader("Content-Type", "application/json")
                    res.json(data)
                }
            };
        });
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
        res.redirect("https://" + url)
    }
})



app.listen(9521);