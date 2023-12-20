/* const {socials} = require('./config/socialslist.json') */
const fs = require("fs");
const user = require("./config/userlist.json");

/* fs.writeFileSync("./config/userlist.csv", userString); */
console.log("try", user.length);

function jsonToCsv(items) {
  const header = Object.keys(items[0]);
  const headerString = header.join(",");
  // handle null or undefined values here
  const replacer = (key, value) => value ?? "";
  const rowItems = items.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(",")
  );
  // join header and body, and break into separate lines
  const csv = [headerString, ...rowItems].join("\r\n");
  return csv;
}

const csv = jsonToCsv(user);
/* console.log(csv); */
fs.writeFileSync("./config/userlist.csv", csv);
