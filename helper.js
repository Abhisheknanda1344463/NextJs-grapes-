exports.url = process.env.domainName
  ? `https://${process.env.domainName}`
  : `/`;
exports.megaUrl = process.env.domainName
  ? `https://${process.env.domainName}`
  : ``;
exports.urlWithoutLocal = process.env.domainName ? `/` : ``;
exports.urlLink = process.env.domainName
  ? `https://${process.env.domainName}`
  : `https://pic.zegashop.com`;

const phpPath = process.env.domainName
  ? `https://${process.env.domainName}`
  : `https://pic.zegashop.com`;
exports.apiImageUrl = ``;
exports.apiUrl = phpPath;
exports.storeName = process.env.domainName
  ? process.env.domainName.split(".")[0]
  : "";
////const { databaseName } = require("./app.js");
// import store from "./store";
exports.apiUrlWithStore = function (string) {
  // const { general } = store.getState();
  let specialUrl = `${string}`;
  // console.log(process.env.themeFolder);
  // if (string.indexOf("?") != -1) {
  //   specialUrl = phpPath + string ; // ${general.domain}
  // } else {
  //   specialUrl = phpPath + string + `?store=${process.env.storeDomain}`; // ${general.domain}
  // }

  return specialUrl;
};

exports.domainUrl = function (string) {
  // const { general } = store.getState();
  let specialUrl = `https://${string}`;
  // console.log(process.env.themeFolder);
  // if (string.indexOf("?") != -1) {
  //   specialUrl = phpPath + string ; // ${general.domain}
  // } else {
  //   specialUrl = phpPath + string + `?store=${process.env.storeDomain}`; // ${general.domain}
  // }

  return specialUrl;
};
