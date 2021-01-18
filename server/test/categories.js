/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const Room = require('../models/Room');
const app = require('../../index');

const should = chai.should();

chai.use(chaiHttp);

describe('Issues', () => {
  beforeEach((done) => {
    Room.remove({}, (err) => {
      done();
    });
  });

  describe('get all issues', () => {
    it('it should GET all issues', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          done();
        });
    });
  });
});
