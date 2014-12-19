var index = "index.html";
var fs = require("fs");
var http = require("http");

var bookFiles = [];
var bookObjs = [];
var html = [];

var server = http.createServer(function(req,res){

  var path = req.url;
  var title = path.split("/");

  var htmlGen = {
    books : function(obj) {
      var string = "<li><img src=" + obj.pic + "><a href=" + obj.file + ">" + obj.title + "</a></li>";
      return string;
    },
  };


  var BookConstructor = function(title) {
    var gen = {
      title : title.slice(0,title.length-4),
      file : title,
      pic : title.slice(0,title.length-4)+".jpg",
      html : "",
      bookText : "",
    }
    return gen;
  };


  var bookCheck = function(cb) {
    fs.readdir("books", function(err,files) {
      bookFiles = files.toString().split(".txt")
      var bookFilesFull = files
      bookFilesFull.forEach(function (bookFile) {
        var bookObj = BookConstructor(bookFile);
        var generatedHtml = htmlGen.books(bookObj);
        bookObj.html = generatedHtml;
        bookObjs.push(bookObj);
      });
    });
    return cb(true);
  }

  var mycallback = function(foundBook) {
  if ( foundBook ) {

      fs.readFile("index.source", function(err, data){

        var htmlText = data.toString();

        bookObjs.forEach(function(bookObj) {
          html.push(bookObj.html)
        });

        htmlText = htmlText.replace("<REPLACELI>", html.join(" "));

        res.end(htmlText);
      });
    }

    else {
      res.end("Book does not exist")
    }
  }

  if (path === "/") {
  bookCheck(mycallback);
  }


  else if (path.slice(path.length-4,path.length) === ".txt") {

    fs.readFile("index.source", function(err, data){

      var htmlText = data.toString();

      fs.readFile("books/"+title[1], function(err, data){
        var bookText = data.toString().split("\n")
        var bookText2 = [];

        bookText.forEach(function(x) {
          bookText2.push(x)
          bookText2.push("<br>")
        });

        var htmlTextBook = htmlText.replace("<REPLACEME>", bookText2.join("\n"));
        var htmlLi = htmlTextBook.replace("<REPLACELI>", html.join(" "));

        res.end(htmlLi);

      });
    });
  }

  else if (path.slice(path.length-4,path.length) === ".css") {
    fs.readFile("css/"+path.slice(1), function (err, data) {
      res.end(data);
    });
  }


  else {
    fs.readFile("pics/"+path.slice(1), function (err, data) {
      res.end(data);
    });
  }

});

server.listen(2000);
