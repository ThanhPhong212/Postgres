//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
const { User } = require('../models/index');
let server = require('../index');
let should = chai.should();
var expect = require('chai').expect;

chai.use(chaiHttp);
describe('Users', () => {
  before(async (done) => {
    done();
  });
  after(async (done) => {
    await User.destroy(
      {
        where: { email: 'justice@gmail.com' },
        truncate: { cascade: true },
      },
      done()
    );
  });
  describe('/Test users', () => {
    let userSuccess = {
      email: 'justice@gmail.com',
      password: '12345678',
      fullName: 'Biện Thanh Phong',
      roleId: 1,
    };

    it('POST user success', (done) => {
      chai
        .request(server)
        .post('/api/user/register')
        .send(userSuccess)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', true);
          res.body.should.have.property('message', '');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('roleId');
          done();
        });
    });
    //Test đăng ký tài khoản thành fail
    let userErr = {
      email: 'justice@gmail.com',
      password: '12345678',
      fullName: 'Biện Thanh Phong',
      roleId: 1,
    };
    it('POST user fail', (done) => {
      chai
        .request(server)
        .post('/api/user/register')
        .send(userErr)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status', false);
          res.body.should.have.property('message');
          done();
        });
    });

    let query = {
      page: 2,
      limit: 10,
      createAt: '2022-10-11',
    };
    var a = Object.keys(query)
      .map((key) => key + '=' + query[key])
      .join('&');
    it('list user', (done) => {
      chai
        .request(server)
        .get('/api/users' + '?' + a)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('total_page');
          res.body.should.have.property('data');
          res.body.should.have.property('page');
          res.body.should.have.property('limit');
          res.body.should.have.property('isNext', false);
          res.body.data.should.be.a('array').length(0, 10);
          done();
        });
    });
  });
});
