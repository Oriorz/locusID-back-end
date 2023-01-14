
const fs = require('fs');
let jsonString = fs.readFileSync('./config/userlist.json', 'utf-8');
let jsonObject = JSON.parse(jsonString);

/* jsonObject.forEach((user) => {
  user.link = "http://itap.world/profile/" + user.id
});
jsonString = JSON.stringify(jsonObject);
fs.writeFileSync('./config/userlist.json', jsonString); */

console.log(jsonObject.at(2).link)

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
