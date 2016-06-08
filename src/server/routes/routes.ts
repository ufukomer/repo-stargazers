import * as async from 'async';
import express = require('express');
import StarGazer from '../models/stargazer';
const Api = require('../helpers/api');

export = (app: express.Express) => {

  app.post('/api/saveAll', (req: express.Request, res: express.Response) => {
    const fetchQueue = async.queue(Api.fetchStarGazers, 1);
    const databaseQueue = async.queue(StarGazer.save, 1);

    const save = (user) => {
      databaseQueue.push(user, (error: any) => {
        if (error) {
          throw new Error(error);
        }
      });
    };

    const saveUserAction = (user) => {
      console.info(`User ${user.login} is saved with location ${user.location}`);
    };

    Api.fetchPageCount()
      .then((count) => {
        for (let i = 1; i <= count; i++) {
          fetchQueue.push({
            index: i,
            store: save,
            run: saveUserAction
          }, (error?: any, result?: string) => {
            if (error) {
              throw new Error(error);
            }
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(400).send(error);
      })
      .done(() => {
        res.status(200).send({ 'status': 'success', 'message': 'Successfully fetching.' });
      });
  });

  app.post('/api/save', (req: express.Request, res: express.Response) => {
    if (!req.body.login) {
      return res.status(400).send({ 'status': 'error', 'message': 'A login is required' });
    }
    StarGazer.save(req.body, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

  app.get('/api/get', (req: express.Request, res: express.Response) => {
    if (!req.query.location) {
      return res.status(400).send({ 'status': 'error', 'message': 'A location is required' });
    }
    StarGazer.getByLocation(req.query.location, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

  app.post('/api/delete', (req: express.Request, res: express.Response) => {
    if (!req.body.id) {
      return res.status(400).send({ 'status': 'error', 'message': 'A document id is required' });
    }
    StarGazer.delete(req.body.id, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

  app.get('/api/getAll', (req: express.Request, res: express.Response) => {
    StarGazer.getAll((error, result) => {
      if (error) {
        console.error(error);
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

  app.get('/api/getCount', (req: express.Request, res: express.Response) => {
    StarGazer.getCount((error, result) => {
      if (error) {
        console.error(error);
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

};
