/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const Room = require('../models/Room');
const Category = require('../models/Category');
const User = require('../models/User');

const should = chai.should();
let token = '';
let userId = '';
chai.use(chaiHttp);

describe('Categories', () => {
  beforeEach((done) => {
    Room.remove({}, () => {
      Category.remove({}, () => {
        chai
          .request(app)
          .post('/api/categories/populate')
          .end(() => {
            chai
              .request(app)
              .post('/api/auth/signup')
              .send({ username: 'test', password: 'test' })
              .end((err, res) => {
                token = JSON.parse(res.text).token;
                userId = JSON.parse(res.text).userId;
                done();
              });
          });
      });
    });
  });

  describe('Create a room ', () => {
    it('it should Create a room', (done) => {
      const roomParams = {
        host: userId,
        mode: 'ZEN',
        category: 'Ultimate',
        difficulty: 'easy',
        userId,
      };
      chai
        .request(app)
        .post('/api/room/')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...roomParams })
        .end((eer, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('roomCode');
          done();
        });
    });
  });
});
