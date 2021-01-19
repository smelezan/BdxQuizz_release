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

chai.use(chaiHttp);

describe('Categories', () => {
  beforeEach((done) => {
    Room.remove({}, () => {
      Category.remove({}, () => {
        chai
          .request(app)
          .post('/api/categories/populate')
          .end(() => {
            done();
          });
      });
    });
  });

  //   describe('Create a room ', () => {
  //     it('it should Create a room', (done) => {
  //       const user = new User({
  //         username: 'admin',
  //         password: 'admin',
  //       });
  //       user.save((err, userSaved) => {
  //         const roomParams = {
  //           host: userSaved._id,
  //           mode: 'ZEN',
  //           category: 0,
  //           difficulty: 'easy',
  //         };
  //         chai
  //           .request(app)
  //           .post('/api/auth/login')
  //           .send({ username: userSaved.username, password: userSaved.password })
  //           .end((_, res) => {
  //             res.should.have.status(200);
  //             res.body.should.be.a('object');
  //             res.body.should.have.property('');
  //             done();
  //           });
  //       });
  //     });
  //   });
});
