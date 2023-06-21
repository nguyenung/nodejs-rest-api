const expect = require('chai').expect
const sinon = require('sinon')
const assert = require('assert')

const User = require('./../models/user').default
const AuthController = require('./../controllers/auth')

describe('AuthController - Login', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('should throw 500 error when access database fails', async () => {
        const req = {
            body: {
                email: 'foo@bar.com',
                password: 'password'
            }
        }
        sinon.stub(User, 'findOne')
        User.findOne.throws()

        try {
            const result = await AuthController.login(req, {}, () => { })
            expect(result).to.be.an('error')
            expect(result).to.have.property('statusCode', 500)
        } catch (error) {
            assert.fail(error)
        }
    })
})