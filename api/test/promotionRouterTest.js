var config = require("../../config/config"),
  mongoose = require('mongoose'),
  request = require('supertest'),
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  should = chai.should(),
  expect = chai.expect,
  app = require('../../app'),
  agent = request.agent(app),
  Promotion = require('../models/PromotionModel.js'),
  dbURI = config.mongo_uri.test,
  clearDB = require('mocha-mongoose')(dbURI, {
    noClear: true
  });

chai.use(chaiHttp);
