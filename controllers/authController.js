const express = require('express');
const {generateAdminToken} = require("../middlewares/token")
const fauth = require('../firebase').fauth;

exports.login = async function (req, res, next) {
    let r = { r: 0 };
    const {email, password} =req.body
    console.log(email)
    console.log(password)

    try {
        await fauth.signInWithEmailAndPassword(fauth.getAuth(), email, password).then((userCredential) => {
            const token = generateAdminToken(userCredential)
            console.log(token)
            res.cookie('admin', token, {maxAge: process.env.TOKEN_EXPIRE * 100000})
            res.header('Authorization', `Bearer ${token}`)
            r['r'] = 1;
            res.json({token})
        }).catch((e) => {
            console.log(e);

            if (e.code == 'auth/invalid-email') {
                r['r'] = 2;
            }
            ;
            if (e.code == 'auth/missing-password') {
                r['r'] = 3;
            }
            ;
            if (e.code == 'auth/invalid-credential') {
                r['r'] = 4;
            }
            ;
            if (e.code == 'auth/too-many-requests') {
                r['r'] = 5
            }
            res.send(r);
        })
    } catch (err) {
        console.log(err);
        r['r'] = 6;
        res.send(r);
    }
}