require('dotenv').config();
const validUrl = require('valid-url');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env['PORT'] || 3000;
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


function isValidUrl(url) {
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}

let counter = 1;
const shortUrls = {};




app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;

  if (isValidUrl(url)){
    let short_url = counter++;

    shortUrls[short_url] = url;

    res.json({
      original_url: url,
      short_url: short_url
    });

    console.log(shortUrls);
    }else{
      res.json({error:'invalid url'})
    }


});

app.get("/api/shorturl/:shorturl?", (req, res)=>{
  const key = req.params.shorturl;
  const orgUrl = shortUrls[key];
  
  res.redirect(orgUrl);

})



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
