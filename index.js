const express = require('express')
const app = express()
const port = 8080;
const path=require('path');
const fs = require('fs');
const morgan = require('morgan')
app.use(express.json());
app.use((req, res, next)=>{
 console.log(req.method)
 console.log(req.url)
 next()
})

app.post('/api/files', (req, res) => {
    try{
      let regExp = new RegExp(/^[A-z1-9.]+\.(txt|log|json|xml|js|yaml)$/);
      if (!regExp.test(req.body.filename)) {
        res.status(400).json({
          message: `Please specify 'content' parameter`
        });
        } else{
            fs.writeFile(`./api/files/${req.body.filename}`, `${req.body.content}` , function (err) {
            if (err) return console.log(err);
        });
        res.status(200).json({
          message: 'File created successfully'
        });
        }
    } catch(error){
                res.status(500).json({
                message: 'Server error'
                });
    }
  
})


app.get('/api/files', (req, res) =>{
  let files = fs.readdirSync('./api/files/')
  try{
    fs.stat('./api/files', function(err) {
      if (!err) {
        res.status(200).json({
          message: "Success",
          files: files
        });
      }
      else if (err.code === 'ENOENT') {
        res.status(400).json({
          message: "Client error",
        });
      }
  });
  } catch(error){
    res.status(500).json({
      message: "Server error",
    });
  }
        
})



app.get(`/api/files/:filename`, (req, res) => {
  const filename = path.basename(req.url);
  const stats = fs.statSync(`./api/files/${filename}`);
  let stat = `${stats.birthtime}`
  let readFile = fs.readFileSync(`./api/files/${filename}`, "utf8")
  const path = `./${filename}`

try {
  if (fs.existsSync(path)) {
    console.error('ooooooo')
  }
} catch(err) {
  console.error(err)
}
  

  res.status(200).json(
    {
      message: readFile,
      "message": "Success",
      "filename": filename,
      "content":  readFile,
      "extension": path.extname(req.url),
      "uploadedDate": stat ,
    }
     )
})





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
  
