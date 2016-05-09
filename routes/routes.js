var StarGazer = require("../models/stargazer");
var Api = require('../helpers/api');
var async = require('async');

var appRouter = function (app) {

  app.post("/api/saveAll", function (req, res) {
    var fetchQueue = async.queue(Api.fetchStarGazers, 1);
    var databaseQueue = async.queue(StarGazer.save, 1);

    var save = function (user) {
      console.log(user.login);
      databaseQueue.push(user, function (error) {
        if (error) {
          throw new Error(error);
        }
      })
    };

    Api.fetchPageCount()
      .then((count) => {
        for (var i = 1; i < count; i++) {
          fetchQueue.push({
            index: i,
            store: save
          }, function (error) {
            if (error) {
              throw new Error(error);
            }
          })
        }
      })
      .catch(function (error) {
        return res.status(400).send(error);
      })
      .done(function () {
        res.status(200).send({ "status": "success", "message": "Successfully fetching." })
      });
  });

  app.post("/api/save", function (req, res) {
    if (!req.body.login) {
      return res.status(400).send({ "status": "error", "message": "A login is required" });
    }
    StarGazer.save(req.body, function (error, result) {
      if (error) {
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

  app.get("/api/get", function (req, res) {
    if (!req.query.location) {
      return res.status(400).send({ "status": "error", "message": "A location is required" });
    }
    StarGazer.getByLocation(req.query.location, function (error, result) {
      if (error) {
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

  app.post("/api/delete", function (req, res) {
    if (!req.body.id) {
      return res.status(400).send({ "status": "error", "message": "A document id is required" });
    }
    StarGazer.delete(req.body.id, function (error, result) {
      if (error) {
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

  app.get("/api/getAll", function (req, res) {
    StarGazer.getAll(function (error, result) {
      if (error) {
        console.error(error);
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

  app.get("/api/getCount", function (req, res) {
    StarGazer.getCount(function (error, result) {
      if (error) {
        console.error(error);
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

};

module.exports = appRouter;
