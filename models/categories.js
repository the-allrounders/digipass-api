const
    mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
        title: {type: 'string', required: true},
        description: {type: 'string'},
        parent: [ ItemSchema ]
    },
    {
        timestamps: true
    });

const Item = mongoose.model('Categories', ItemSchema);

module.exports = {
    Item: Item
};