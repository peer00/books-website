var index = "index.html";
var fs = require("fs");
var http = require("http");
var server = http.createServer(function(req,res){
  var path = req.url;
  var title = path.split("/");

  var bookFiles = [];

  var bookObjs = [];

  var html = [];


  var htmlGen = {
    books : function(obj) {
      var liArray = [];
      liArray.push("<li><a href=/" + obj.title + "/>" + obj.title + "</a></li>");
      return liArray.join("");
    },
  };


  var BookConstructor = function(title) {
    var gen = {
      title : title,
      file : title+".txt",
      pic : title+".jpg",
      html : "",
      bookText : "",
    }
    return gen;
  };


  var bookCheck = function(cb) {
    fs.readdir("books", function(err,files) {
      bookFiles = files.toString().split(".txt")

      bookFiles.forEach(function (bookFile) {
        var bookObj = BookConstructor(bookFile);
        var generatedHtml = htmlGen.books(bookObj);
        bookObj.html = generatedHtml;
        bookObjs.push(bookObj);
      });

      for (var i = 0; i < bookFiles.length; i++) {
        if (bookFiles[i] === title[1]) {
          return cb(true); //mycallback(true)
        }
      }
      cb(false)
    });
  }

  var mycallback = function(foundBook) {
  if ( foundBook ) {

      fs.readFile("index.source", function(err, data){

        var htmlText = data.toString();

        bookObjs.forEach(function(bookObj) {
          html.push(bookObj.html)
        });

        html.toString();

        htmlText = htmlText.replace("<REPLACEME>", html);

        res.end(htmlText);

        // fs.readFile("books/"+title[1]+".txt", function(err, data){
        //
        //   var bookText = data.toString().split("\n")
        //   var bookText2 = [];
        //
        //   bookText.forEach(function(x) {
        //     bookText2.push(x)
        //     bookText2.push("<br>")
        //
        //   });
        //
        //   htmlText = htmlText.replace("<REPLACEME>", bookText2.join("\n"))
        //
        //   res.end(htmlText);
        //
        // });



      });

    }

    else {
      res.end("Book does not exist")
    }
  }

  bookCheck(mycallback);



});

server.listen(2000);
