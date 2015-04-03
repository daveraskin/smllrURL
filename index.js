var express = require('express');
var app = express();
var db = require('./models');
var bodyParser = require('body-parser');
var Hashids = require("hashids"),
    hashids = new Hashids("Daves URl Encoder");

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", function(req,res){
  res.render("index");
});


app.post("/links", function(req,res){
  var longUrl = req.body.hash;
  var newHash;
  db.url.findOrCreate({where: { url: longUrl}}).spread(function(url, created) {
    console.log(url)
    newHash = hashids.encode(url.id);
    console.log("***********************************************", newHash);
  }).then(function(url){
      db.url.find({ where: { url: longUrl } }).then(function(url){
      url.hash = newHash;
      url.save().then(function() {var hashObject = {hash: newHash};
      res.render("show", hashObject);});
    })
  })
});

app.get("/:id", function(req, res){
  var id = req.params.id;
  db.url.find({where: {hash: id}}).then(function(link){
   res.redirect("http://"+link.dataValues.url)
  });

})


// app.get("/:hash", function(req,res){

// })




app.listen(process.env.PORT || 3000, function(){
  console.log("Server Running on Port 3000");
})