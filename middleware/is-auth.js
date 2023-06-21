import jwt from 'jsonwebtoken'

export default function(req, res, next) {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        const error = new Error('Not authenticated.')
        error.statusCode = 401
        throw error
    }
    const token = authHeader.split(' ')[1]
    const prefixToken = authHeader.split(' ')[0]
    if (prefixToken !== 'Bearer') {
        const error = new Error('Invalid token type.')
        error.statusCode = 403
        throw error
    }

    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.APP_SECRET_KEY)
    } catch (err) {
        err.statusCode = 500
        throw err
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.')
        error.statusCode = 401
        throw error
    }
    req.userId = decodedToken.userId
    next()
}
