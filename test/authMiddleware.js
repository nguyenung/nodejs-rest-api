const expect = require('chai').expect
const jwt = require('jsonwebtoken')
const sinon = require('sinon')
const authMiddleware = require('./../middleware/is-auth')

const { loadEnvironmentVariables } = require('./../config/env')
loadEnvironmentVariables()

describe('Auth middleware', function () {
    it('Should throw error if no authorization header is provided', function () {
        const req = {
            get: function (headerName) {
                return null
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not authenticated')
    })

    it('Should throw error if authorization header contains only one string', function () {
        const req = {
            get: function (headerName) {
                return 'singleString'
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()
    })

    it('Should throw error if the token is invalid', function () {
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

    it('Token after decode should contain userId', function () {
        const req = {
            get: function (headerName) {
                return 'Bearer abc123'
            }
        }
        sinon.stub(jwt, 'verify')
        jwt.verify.returns({
            userId: 'ok',
        })
        authMiddleware(req, {}, () => {})
        expect(req).to.have.property('userId')
        expect(req).to.have.property('userId', 'ok')
        expect(jwt.verify.called).to.be.true
        jwt.verify.restore()
    })
})