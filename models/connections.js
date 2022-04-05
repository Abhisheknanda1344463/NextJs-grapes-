// const mongoose = require("mongoose");
// console.log(process.env.url);
// const db = mongoose.createConnection(process.env.url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// db.on("error", function (error) {
//   console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
//   db.close().catch(() =>
//     console.log(`MongoDB :: failed to close connection ${this.name}`)
//   );
// });

// db.on("connected", function () {
//   mongoose.set("debug", function (col, method, query, doc) {
//     console.log(
//       `MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(
//         query
//       )},${JSON.stringify(doc)})`
//     );
//   });
//   console.log(`MongoDB :: connected ${this.name}`);
// });

// db.on("disconnected", function () {
//   console.log(`MongoDB :: disconnected ${this.name}`);
// });

// module.exports = db;
