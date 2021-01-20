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
                });
            chai
                .request(app)
                .post('/api/auth/signup')
                .send({ username: 'toto', password: 'toto' })
                .end((err, res) => {
                    done();
                });
        });
    });

    describe('GET User Stats', () => {
        it("it should get a user's stats", (done) => {
            chai
                .request(app)
                .get('/api/stats/user')
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    let stats = JSON.parse(res.text).stats;
                    res.should.have.status(200);
                    stats.should.have.property('nbQuizzWon');
                    stats.should.have.property('nbQuizzLost');
                    stats.should.have.property('nbQuizzPlayed');
                    stats.should.have.property('bestScore');
                    stats.should.have.property('averageScore');
                    stats.should.have.property('scores');
                    stats.should.have.property('times');
                    stats.should.have.property('bestTime');
                    stats.should.have.property('averageTime');
                    done();
                });
        });
    });
    describe('UPDATE User Endless Stats', () => {
        it('it should update user endless stats', (done) => {
            chai
                .request(app)
                .put('/api/stats/user/endless')
                .set({ Authorization: `Bearer ${token}` })
                .send({ category: 'Mathematics', score: 20 })
                .end((err, res) => {
                    res.should.have.status(200);
                    let stats = JSON.parse(res.text);
                    let categoryStats = JSON.parse(res.text).category.Mathematics;

                    stats.should.have.property('nbQuizzPlayed').eql(1);
                    stats.should.have.property('bestScore').eql(20);
                    categoryStats.should.have.property('nbQuizzPlayed').eql(1);
                    categoryStats.should.have.property('bestScore').eql(20);
                    done();
                });
        });
    });
    describe('GET Top Player', () => {
        it('it should get top player', (done) => {
            User.updateOne(
                { username: 'test' },
                {
                    $set: {
                        'stats.nbQuizzWon': 5,
                    },
                }
            ).then((res) => { });
            User.updateOne(
                { username: 'toto' },
                {
                    $set: {
                        'stats.nbQuizzWon': 8,
                    },
                }
            ).then((res) => { });
            chai
                .request(app)
                .get('/api/stats/topPlayer')
                .end((err, res) => {
                    res.should.have.status(200);
                    let firstPlace = JSON.parse(res.text).descendingOrder[0];
                    let secondPlace = JSON.parse(res.text).descendingOrder[1];
                    firstPlace.should.have.property('username').eql('toto');
                    secondPlace.should.have.property('username').eql('test');
                    done();
                });
        });
    });
});
