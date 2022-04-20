const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = process.env.PORT || 3860;
const development = process.env.NODE_ENV !== "production";
const app = next({ dev: development });
const api = require("./routes/api.js");
const path = require("path");
var serveStatic = require("serve-static");
const redis = require("redis");
const NextRedisCache = require("next-redis-cache");
const client = redis.createClient();

//////KEEP THIS PART FOR FUTER
// const { MongoClient } = require("mongodb");
// const handler = app.getRequestHandler();
// const url = "mongodb://localhost:27017";
// const MongoConnection = new MongoClient(url);
require("dotenv").config({ path: ".env" });
// // Database Name
// // const dbName = "myProject";

async function main(databaseName) {
  // Use connect method to connect to the server
  await MongoConnection.connect();
  console.log("Connected successfully to server " + databaseName);
  MongoConnection.db(databaseName);
  // const collection = db.collection("documents");

  // the following code examples can be pasted here...
}

app.prepare().then((request) => {
  const server = express();

  const nextRedisCache = new NextRedisCache(client, app, {
    includes: [
      "/_next",
      "/.next",
      "/cache",
      "/storage",
      "/themes",
      "/vendor",
      "/public",
      "/images",
      "/node_modules",
      ///"/api",
    ],
  });
  server.use(serveStatic(path.join(__dirname, "public")));
  server.use(bodyParser.json());
  server.use("/db", api);
  server.get("*", (request, response) => {
    ///// REMEMBER IMPORTANT CLOSE CONNECTION EVRY TIME BEFORE OPEN CONNECTION
    const dbName = request.headers["x-forwarded-host"];

    response.set({
      "Cache-Control": "public, max-age=86400",
      Expires: new Date(Date.now() + 86400000).toUTCString(),
    });

    //// REMEBER GETTING DB NAME URL FULL DOMAIN
    var databaseName;
    ////   console.log(dbName.includes(".zegashop.com"));
    if (dbName.includes(".zegashop.com")) {
      var dataName = dbName.split(".zegashop.com");
      //// console.log(dataName);
      databaseName = dataName[0];
      process.env.domainName = dbName;

      process.env.databaseName = databaseName;
    } else {
      process.env.domainName = dbName;
      databaseName = dbName.split(".")[0];

      process.env.databaseName = databaseName;
    }

    //////TODO USE ONLY FOR DEBUG CONNECT SINGLE DB
    /// const url = "mongodb://localhost:27017/demo-zega-purple";

    const url = "mongodb://localhost:27017/" + databaseName;

    ///// REMEMBER IMPORTANT CLOSE CONNECTION EVRY TIME BEFORE OPEN CONNECTION
    //// TODO THINK ABOUT THIS PART TO OPTIMIZE

    // Connection URL

    // ///  .then(console.log)
    // .catch(console.error)
    // .finally(() => MongoConnection.close());

    // main()
    //   .then(console.log)
    //   .catch(console.error)
    //   .finally(() => client.close());
    mongoose.connection.close();
    // if (Mongoose.connection.readyState === 0) {
    mongoose
      .connect(
        url,
        //// TODO CHECK THIS PARAMETR FOR OPTIMIZATION
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,

          autoIndex: false,

          connectTimeoutMS: 0,
          socketTimeoutMS: 0,
          family: 4,
        }
      )
      .then(() => {
        console.log("database connected!");
      })
      .catch((err) => console.log(err));
    // }
    /////REDIS CACHE
    // mongoose.connection.close();
    request.domainName = databaseName;
    nextRedisCache.handler(request, response);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${port}`);
  });
});

///// TRY get reqeust with out express

// const express = require("express");
// const next = require("next");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const port = process.env.PORT || 3000;
// const development = process.env.NODE_ENV !== "production";
// const app = next({ dev: development });
// const api = require("./routes/api.js");
// const path = require("path");
// var serveStatic = require("serve-static");
// const redis = require("redis");
// const NextRedisCache = require("next-redis-cache");
// const client = redis.createClient();

// //////KEEP THIS PART FOR FUTER
// // const { MongoClient } = require("mongodb");
// // const handler = app.getRequestHandler();
// // const url = "mongodb://localhost:27017";
// // const MongoConnection = new MongoClient(url);

// // // Database Name
// // // const dbName = "myProject";

// // async function main(databaseName) {
// //   // Use connect method to connect to the server
// //   await MongoConnection.connect();
// //   console.log("Connected successfully to server " + databaseName);
// //   MongoConnection.db(databaseName);
// //   // const collection = db.collection("documents");

// //   // the following code examples can be pasted here...
// // }

// // Connect to MongoDB database

// const dbName = request.headers["x-forwarded-host"];
// var databaseName;
// ////   console.log(dbName.includes(".zegashop.com"));
// if (dbName.includes(".zegashop.com")) {
//   var dataName = dbName.split(".zegashop.com");
//   console.log(dataName);
//   databaseName = dataName[0];
//   process.env.domainName = dbName;
// } else {
//   process.env.domainName = dbName;
//   databaseName = dbName.split(".")[0];
// }
// const url = "mongodb://localhost:27017/" + databaseName;
// process.env.databaseName = databaseName;
// mongoose.connect(url, { useNewUrlParser: true }).then(() => {
//   app.prepare().then((request) => {
//     const server = express();

//     const nextRedisCache = new NextRedisCache(client, app, {
//       includes: [
//         "/_next",
//         "/.next",
//         "/cache",
//         "/storage",
//         "/themes",
//         "/vendor",
//         "/public",
//         "/images",
//         "/node_modules",
//         ///"/api",
//       ],
//     });
//     server.use(serveStatic(path.join(__dirname, "public")));
//     server.use(bodyParser.json());
//     server.use("/db", api);
//     server.get("*", (request, response) => {
//       ///// REMEMBER IMPORTANT CLOSE CONNECTION EVRY TIME BEFORE OPEN CONNECTION

//       response.set({
//         "Cache-Control": "public, max-age=86400",
//         Expires: new Date(Date.now() + 86400000).toUTCString(),
//       });

//       //// REMEBER GETTING DB NAME URL FULL DOMAIN

//       //////TODO USE ONLY FOR DEBUG CONNECT SINGLE DB
//       /// const url = "mongodb://localhost:27017/demo-zega-purple";

//       ///// REMEMBER IMPORTANT CLOSE CONNECTION EVRY TIME BEFORE OPEN CONNECTION
//       //// TODO THINK ABOUT THIS PART TO OPTIMIZE

//       // Connection URL

//       // ///  .then(console.log)
//       // .catch(console.error)
//       // .finally(() => MongoConnection.close());

//       // main()
//       //   .then(console.log)
//       //   .catch(console.error)
//       //   .finally(() => client.close());
//       /// mongoose.connection.close();
//       // if (Mongoose.connection.readyState === 0) {

//       // }
//       /////REDIS CACHE
//       // mongoose.connection.close();
//       request.domainName = databaseName;
//       nextRedisCache.handler(request, response);
//     });

//     server.listen(port, (err) => {
//       if (err) throw err;
//       console.log(`Ready on http://localhost:${port}`);
//     });
//   });
// });
