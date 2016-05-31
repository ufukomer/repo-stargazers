import * as couchbase from 'couchbase';
const config = require('./config');

export const bucket = (
  new couchbase.Cluster(config.couchbase.server)
).openBucket(config.couchbase.bucket);
