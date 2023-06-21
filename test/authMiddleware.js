const expect = require('chai').expect
const jwt = require('jsonwebtoken')
const sinon = require('sinon')
const authMiddleware = require('./../middleware/is-auth')

const { loadEnvironmentVariables } = require('./../config/env').default
loadEnvironmentVariables()

describe('Auth middleware', function () {
    afterEach(() => {
        sinon.restore(); // Restore stubs and spies after each test case
    })

    it('should throw error if no authorization header is provided', function () {
        const req = {
            get: sinon.stub().returns(null),
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not authenticated')
    })

    it('should throw error if authorization header contains only one string', function () {
        const req = {
            get: sinon.stub().returns('singleString'),
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()
    })

    it('should throw error if authorization header type is not Bearer', function () {
        const req = {
            get: sinon.stub().returns('NotBearer sampleToken'),
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw(Error, 'Invalid token type.')
            .with.property('statusCode', 403)
    })

    it('should throw 500 error if jwt exception', function () {
        const req = {
            get: sinon.stub().returns('Bearer sampleToken'),
        }
        const verifyStub = sinon.stub(jwt, 'verify')
        verifyStub.throws({
            statusCode: 500
        })
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()
            .with.property('statusCode', 500)
    })

    it('should throw 401 error if decoded jwt null', function () {
        const req = {
            get: sinon.stub().returns('Bearer sampleToken'),
        }
        const verifyStub = sinon.stub(jwt, 'verify')
        verifyStub.returns(null)

        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw(Error, 'Not authenticated.')
            .with.property('statusCode', 401)
    })

    it('should throw error if the token is invalid', function () {
        const token = jwt.sign(
            {
                email: 'test@example.com',
                userId: 'userId'
            },
            'foo',
            { expiresIn: '1h' }
        )
        const req = {
            get: function (headerName) {
                return 'Bearer ' + token
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()
    })

    it('should verify successfully if token is valid', () => {
        const token = jwt.sign(
            {
                email: 'test@example.com',
                userId: 'userId'
            },
            process.env.APP_SECRET_KEY,
            { expiresIn: '1h' }
        )
        const req = {
            get: function (headerName) {
                return 'Bearer ' + token
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.not.throw()
    })

    it('should throw error if token is expired', () => {
        const clock = sinon.useFakeTimers()
        const expiresIn = 1; // Set expiration time to 1 second
        const secretKey = process.env.APP_SECRET_KEY
        const token = jwt.sign(
            {
                email: 'test@example.com',
                userId: 'userId'
            },
            secretKey,
            { expiresIn }
        )
        clock.tick(2000)
        const req = {
            get: function (headerName) {
                return 'Bearer ' + token
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()
        clock.restore()
    })

    it('token after decode should contain userId', function () {
        const req = {
            get: function (headerName) {
                return 'Bearer abc123'
            }
        }
        sinon.stub(jwt, 'verify')
        jwt.verify.returns({
            userId: 'ok',
        })

        const nextSpy = sinon.spy()
        authMiddleware(req, {}, nextSpy)
        expect(req).to.have.property('userId')
        expect(req).to.have.property('userId', 'ok')
        expect(jwt.verify.called).to.be.true
        expect(nextSpy.calledOnce)
    })
})
