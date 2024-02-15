const jwt = require('jsonwebtoken')
const {ADMIN_TOKEN_SECRET} = process.env

const verifyAdminToken = (secretKey) => (req, res, next) => {
    secretKey = ADMIN_TOKEN_SECRET
    const token = req.cookies['admin']
    if (!token) return res.json({message: "Unauthorized"})
    console.log(token)
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.json({message: "No token"})

        const {_id} = decoded
        req.user = {_id}
        next()
    })
}

module.exports = {verifyAdminToken}