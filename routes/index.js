var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  req.send({
    status: 200,
  });
});
router.get("/api/custom-settingss", function (req, res, next) {
  res.json({
    status: 200,
  });
});

module.exports = router;
