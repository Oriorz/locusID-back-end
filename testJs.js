
const fs = require('fs');
let jsonString = fs.readFileSync('./config/userlist.json', 'utf-8');
let jsonObject = JSON.parse(jsonString);
const createSerial = require('./pdfSerial')

/* jsonObject.forEach((user) => {
  user.link = "http://itap.world/profile/" + user.id
});
jsonString = JSON.stringify(jsonObject);
fs.writeFileSync('./config/userlist.json', jsonString); */

/* console.log(jsonObject.at(2).link) */

/* let emptyIndex = jsonObject.findIndex((user)=> {
  return user.isbinded == false
})
jsonObject.at(emptyIndex).cardNumber = "04:6C:9A:74:39:61:80"
jsonObject.at(emptyIndex).isbinded = true
//console.log("first empty index is : ", emptyIndex, " and the user is ", jsonObject.at(emptyIndex))
console.log(jsonObject)

let emptyUser = jsonObject.filter((user)=>{
  return user.isbinded === false
})
console.log("total empty card is now: ", emptyUser.length, " out of " , jsonObject.length)
jsonString = JSON.stringify(jsonObject);
fs.writeFileSync('./config/userlist.json', jsonString); */

//find max serial number
/* var result = jsonObject.reduce(function(a, b) {
  return Math.max(a, b.serial);
},   Number.NEGATIVE_INFINITY);
let newuser = {...jsonObject[2], serial : result +1}
jsonObject.push(newuser)
fs.writeFileSync('./config/userlist.json', JSON.stringify(jsonObject)); */

/* console.log(result) */

//createSerial({name:"1929", email: "a27vt2wpij", pw: "i7q13lbt6r", sn: "1929", folderpath:"./pdf/serial/"})


console.log("jsonObject count ", jsonObject.length)
jsonObject.forEach(file => {
  createSerial({name:file.serial, pw: file.password, sn: file.serial, folderpath:"./pdf/serial/"})
});