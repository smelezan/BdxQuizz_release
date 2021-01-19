/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const Category = require('../models/Category');

const should = chai.should();

chai.use(chaiHttp);

describe('Categories', () => {
  beforeEach((done) => {
    Category.remove({}, () => {
      chai
        .request(app)
        .post('/api/categories/populate')
        .end(() => {
          done();
        });
    });
  });

  describe('get all categories', () => {
    it('it should GET all categories', (done) => {
      chai
        .request(app)
        .get('/api/categories')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('categories');
          res.body.categories.length.should.be.eql(22);
          done();
        });
    });
  });
  describe('Get one categorie', () => {
    it('it should get one category', (done) => {
      Category.findOne({ name: 'Ultimate' }, (err, category) => {
        chai
          .request(app)
          .get(`/api/categories/${category._id}`)
          .end((_, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('categorie');
            res.body.categorie.should.have.property('categoryId');
            done();
          });
      });
    });
  });
});
