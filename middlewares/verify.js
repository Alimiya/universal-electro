const jwt = require('jsonwebtoken')

const verifyAdminToken = (secretKey) => (req, res, next) => {
    const token = req.cookies['admin']
    if (!token) return res.json({message: "Unauthorized"})

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.json({message: "No token"})

        const {_id} = decoded
        req.user = {_id}
        next()
    })
}

module.exports = {verifyAdminToken}