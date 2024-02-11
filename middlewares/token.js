const jwt = require("jsonwebtoken")

const generateAdminToken = (userCredential) => {
    return jwt.sign({_id: userCredential.user.uid}, process.env.ADMIN_TOKEN_SECRET)
}

module.exports = {generateAdminToken}
