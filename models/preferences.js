const
    categories = require('categories.js'),
    mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
        title: {type: 'string', required: true},
        description: {type: 'string'},
        field_type: {type: 'string', required: true},
        field_category: [ categories ]
    },
    {
        timestamps: true
    });

const Item = mongoose.model('Preference', ItemSchema);

module.exports = {
    Item: Item
};

// "field_field_type": "Checkbox",
//     "description": "",
//     "id": "7",
//     "title": "Allergie",
//     "field_category": [
//     "6"
// ],
//     "created": "1464814954",
//     "changed": "1464815093",
//     "field_values": [
//     {
//         "title": "Gluten allergie",
//         "id": "5",
//         "value": false
//     },
//     {
//         "title": "Koolhydraten allergie",
//         "id": "6",
//         "value": false
//     }
// ]
// },