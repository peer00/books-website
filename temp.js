var strTest = "aNiceTitle";


var niceTitle = function(str){

  newArray = [];

  newArray.push(str[0].toUpperCase())

  for(var i = 1; i < str.length; i++){
    if(str[i] === str[i].toUpperCase()) {
      newArray.push( " " + str[i] )
    }
    else {
    newArray.push(str[i] )
    }
  }
  return newArray.join("")
}


console.log(niceTitle(strTest));
