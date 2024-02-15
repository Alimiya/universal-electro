const express = require('express');
const {generateAdminToken} = require("../middlewares/token")
const fauth = require('../firebase').fauth;

exports.login = async function (req, res, next) {
    let r = { r: 0 };
    const {email, password} = req.body;
    try {
        fauth.signInWithEmailAndPassword(fauth.getAuth(), email, password).then((userCredential) => {
          const user_id = userCredential.user.uid;
            const token = generateAdminToken(userCredential)
            res.cookie('admin', token, {maxAge: process.env.TOKEN_EXPIRE * 100000})
            res.header('Authorization', `Bearer ${token}`)
            r['r'] = 1;
            res.send(r)
        }, (err) => {
            console.log(err);
            if (err.code == 'auth/user-not-found') {
              r['r'] = 2;
            } else if (err.code == 'auth/wrong-password') {
              r['r'] = 0;
            } else if (err.code == 'auth/too-many-requests') {
              r['r'] = 3;
            } else if (err.code == 'auth/invalid-credential') {
              r['r'] = 4;
            }
            res.send(JSON.stringify(r));
          });
    } catch (err) {
        console.log(err);
        r['r'] = 6;
        res.send(r);
    }
}