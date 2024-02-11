const express = require('express');
const fauth = require('../firebase').fauth;

exports.login = async function (req, res, next) {
    var r = { r: 0 };
    let email = req.body.email;
    let password = req.body.password;

    await fauth.signInWithEmailAndPassword(fauth.getAuth(), email, password).then((userCredential) => {
        console.log(userCredential);
        r['r'] = 1;
        res.send(r);
    }).catch((e) => {
        console.log(e);

        if(e.code == 'auth/invalid-email') {
            r['r'] = 2;
        };
        if(e.code == 'auth/missing-password') {
            r['r'] = 3;
        };
        if(e.code == 'auth/invalid-credential') {
            r['r'] = 4;
        };
        if (e.code == 'auth/too-many-requests') {
            r['r'] = 5
        }
        res.send(r);
    })
}