/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const Category = require('../models/Category');
const User = require('../models/User');

const should = chai.should();

chai.use(chaiHttp);
let token;

describe('Categories', () => {
  beforeEach((done) => {
    User.deleteMany({}, () => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send({ username: 'test', password: 'test' })
        .end((err, res) => {
          token = JSON.parse(res.text).token;
          done();
        });
    });
  });

  describe('User Stats', () => {
    it("it should get a user's stats", (done) => {
      chai
        .request(app)
        .get('/api/stats/user')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          const { stats } = JSON.parse(res.text);
          done();
        });
    });
  });
});
