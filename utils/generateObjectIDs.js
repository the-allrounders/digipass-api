var mongoose = require('mongoose');

var i = 0;
while(i <= 500){
    console.log(mongoose.Types.ObjectId());
    i++;
}