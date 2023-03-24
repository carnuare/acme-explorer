import app from '../app.js'
import chai from 'chai'
import chaiHttp from 'chai-http'
import sinon from 'sinon'
import Question from '../api/models/QuestionModel.js'
import Actor from '../api/models/ActorModel.js'
import Trip from '../api/models/TripModel.js'
import { ObjectId } from 'mongodb';
import RoleEnum from '../api/enum/RoleEnum.js'

const question1 = {
  _id: ObjectId('63ed27e9820b1504a034abb2'),
  user: ObjectId('63ed27e9db335a31d53ee505'),
  trip: ObjectId('63ed27e9db335a31d53ee506'),
  text: 'TEST',
  replies: [],
  createdAt: new Date('2023-02-15T18:44:54.375Z'),
  updatedAt: new Date('2023-02-15T18:44:54.375Z')
}
const actor1 = {
  _id: ObjectId('63ed27e9db335a31d53ee505'),
  name: 'Dionne',
  surname: 'Aguilar',
  email: 'dionneaguilar@gmail.com',
  password: 'e11ae82c-488e',
  phone: '+666 224536329',
  address: '100 Drew Street, Sutton, Indiana',
  role: RoleEnum.MANAGER,
  __v: 0,
  createdAt: new Date('2023-02-15T18:44:54.374Z'),
  updatedAt: new Date('2023-02-15T18:44:54.374Z')
}
const trip1 = {
  _id: ObjectId('63f38c8febcc5d77c3637ba6'),
  creator: ObjectId('63ed27e96f6eb8680cc0b162'),
  title: 'Trip Title',
  description: 'description2',
  price: 500,
  requirements: 'reequirements2',
  startDate: new Date('2023-07-10T00:00:00.000Z'),
  endDate: new Date('2023-07-15T00:00:00.000Z'),
  publicationDate: null,
  cancellationDate: null,
  cancellationReason: null,
  pictures: [],
  stages: [],
  sponsorships: [],
  createdAt: '2023-02-20T15:06:55.168Z',
  updatedAt: '2023-02-20T15:06:55.168Z',
  ticker: '230220-CWLW',
  __v: 0
}

const { expect } = chai
chai.use(chaiHttp)

describe('Questions', () => {

  describe('GET /trips/:id/questions', () => {
    const endpoint = '/v1/trips/'
    it('Should return OK', done => {
      sinon.stub(Question, 'find').returns(Promise.resolve([question1]))
      chai
        .request(app)
        .get(endpoint + '63ed27e9db335a31d53ee506/questions')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.length).to.be.eq(1)
          done()
        })
    })
  })

  describe('POST /trips/:id/questions', () => {
    const endpoint = '/v1/trips/'
    it('Should return OK', done => {
      sinon.stub(Question.prototype, 'save').returns(Promise.resolve(question1))
      chai
        .request(app)
        .post(endpoint + '63ed27e9db335a31d53ee506/questions')
        .send({ text: 'TEST' })
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.trip).to.be.eq('63ed27e9db335a31d53ee506')
          done()
        })
    })
  })

  describe('GET /questions', () => {
    const endpoint = '/v1/questions'
    it('Should return OK', done => {
      sinon.stub(Question, 'find').returns(Promise.resolve([question1]))
      chai
        .request(app)
        .get(endpoint)
        .set({ actor: actor1._id.toString()})
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.length).to.be.eq(1)
          done()
        })
    })
  })

  afterEach(() => {
    sinon.reset()
    sinon.restore()
  })
})