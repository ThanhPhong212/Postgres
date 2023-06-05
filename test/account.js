//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
const { InvestAccount } = require('../models/index');
let server = require('../index');
let should = chai.should();
var expect = require('chai').expect;

chai.use(chaiHttp);
describe('InvestAccounts', () => {
    before(async (done) => {
        done();
    });
    after(async (done) => {
        // await User.destroy(
        //   {
        //     where: { email: 'justice@gmail.com' },
        //     truncate: { cascade: true },
        //   },
        //   done()
        // );
        done()
    });

    describe('/Test account', () => {
        let token = null;
        it('POST login success', (done) => {
            chai
                .request(server)
                .post('/api/login')
                .send({
                    userName: "phong@gmail.com",
                    password: "Admin@123"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status', true);
                    res.body.should.have.property('message', 'login success');
                    res.body.should.have.property('token');
                    token = res.body.token;
                    done();
                });
        });
        let userSuccess = {
            accountName: 'Trần Quốc Phong',
            accountNumber: "1234567890",
            surplus: 4555000000,
            stockExchangeCode: 'SCB',
            userId: 4,
            stockPortfolio: [
                {
                    stockCode: 'VJC',
                    amount: 2000,
                    price: 2000
                },
                {
                    stockCode: 'ACB',
                    amount: 2000,
                    price: 3000
                },
                {
                    stockCode: 'VPB',
                    amount: 2000,
                    price: 5000
                },
                {
                    stockCode: 'NVL',
                    amount: 2000,
                    price: 100000
                }
            ]
        };

        it('POST user success', (done) => {
            chai
                .request(server)
                .post('/api/account/create')
                .set('authorization', 'Bearer ' + token)
                .send(userSuccess)
                .end((err, res) => {
                    console.log(token);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status', true);
                    res.body.should.have.property('message', '');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    done();
                });
        });

        let userSuccess1 = {
            accountName: 'Trần Quốc Phong1',
            accountNumber: 987654321,
            surplus: 4555000000,
            stockExchangeCode: 'SCB',
            userId: 4,
            stockPortfolio: [
                {
                    stockCode: 'VJC',
                    amount: 2000,
                    price: 2000
                },
                {
                    stockCode: 'ACB',
                    amount: 2000,
                    price: 3000
                },
                {
                    stockCode: 'VPB',
                    amount: 2000,
                    price: 5000
                },
                {
                    stockCode: 'NVL',
                    amount: 2000,
                    price: 100000
                }
            ]
        };

        it('POST user success 1', (done) => {
            chai
                .request(server)
                .post('/api/account/create')
                .set('authorization', 'Bearer ' + token)
                .send(userSuccess1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status', true);
                    res.body.should.have.property('message', '');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    done();
                });
        });

        let userSuccess2 = {
            accountName: 'Trần Quốc Phong2',
            accountNumber: 555555511111,
            surplus: 4555000000,
            stockExchangeCode: 'SCB',
            userId: 4,
            stockPortfolio: [
                {
                    stockCode: 'VJC',
                    amount: 2000,
                    price: 2000
                },
                {
                    stockCode: 'ACB',
                    amount: 2000,
                    price: 3000
                },
                {
                    stockCode: 'VPB',
                    amount: 2000,
                    price: 5000
                },
                {
                    stockCode: 'NVL',
                    amount: 2000,
                    price: 100000
                }
            ]
        };

        it('POST user success 2', (done) => {
            chai
                .request(server)
                .post('/api/account/create')
                .set('authorization', 'Bearer ' + token)
                .send(userSuccess2)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status', true);
                    res.body.should.have.property('message', '');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    done();
                });
        });

        let userSuccess3 = {
            accountName: 'Trần Quốc Phong3',
            accountNumber: 4123123412,
            surplus: 4555000000,
            stockExchangeCode: 'SCB',
            userId: 4,
            stockPortfolio: [
                {
                    stockCode: 'VJC',
                    amount: 2000,
                    price: 2000
                },
                {
                    stockCode: 'ACB',
                    amount: 2000,
                    price: 3000
                },
                {
                    stockCode: 'VPB',
                    amount: 2000,
                    price: 5000
                },
                {
                    stockCode: 'NVL',
                    amount: 2000,
                    price: 100000
                }
            ]
        };

        it('POST user success 3', (done) => {
            chai
                .request(server)
                .post('/api/account/create')
                .set('authorization', 'Bearer ' + token)
                .send(userSuccess3)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status', true);
                    res.body.should.have.property('message', '');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    done();
                });
        });

    });
});
