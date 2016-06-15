"use strict";

var hooks = require('hooks');
var bearer;
var userId;

hooks.after('Authentication > Log in > Create new token', function(transaction){
    try{
        const body = JSON.parse(transaction.real.body);
        bearer = body.Bearer;
        userId = body.User.id;
        hooks.log('Bearer = ' + bearer);
        hooks.log('UserID = ' + userId);
    }
    catch(e){
        hooks.log('Can\'t get bearer, not valid json');
        console.log(transaction.real.body);
    }
});

hooks.beforeEach(function(transaction){
    if(bearer){
        transaction.request.headers['Authorization'] = "Bearer " + bearer;
    }
});