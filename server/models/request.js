const promise = require('bluebird'),
    mongoose = require('mongoose'),
    Organisation = require('./organisation'),
    Permission = require('./permission');

/**
 * Schema for model
 * 
 * @type {*|Schema}
 */
const ItemSchema = new mongoose.Schema({
   organisation: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Organisation'
   },
   user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
   }, 
   permissions: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Permission'
   }],
   status: {
       type: String
   }
},
{
    timestamps: true
});

/**
 * Statics
 */
ItemSchema.statics = {

    /**
     * Get item by id
     * @param {ObjectId} id - The objectId of item.
     * @returns {promise<item>}
     */
    get(id) {
        return this.findById(id)
            .execAsync().then((item) => {
                if (item) {
                    return item;
                }
                const err = 'No such item exists!';
                return promise.reject(err);
            });
    },

    /**
     * List items in descending order of 'createdAt' timestamp.
     * @returns {promise<item[]>}
     * @param userId
     */
    list(userId) {
        const requestArray = [];
        var requests;

        return this.find({user: userId})
            .execAsync().then((req) => {
            requests = req;

            requests.forEach((v) => {
                var object = {
                    permissions: []
                };
                const organisationId = mongoose.Types.ObjectId('575973a6ff62aa884c18e466');
                console.log(organisationId);
                return Organisation.get(organisationId).then((o) => {
                    object.organisation = {
                        title: o.title
                    };
                    console.log(object);

                    v.permissions.forEach((p) => {
                        const permissionId = mongoose.Types.ObjectId('5759d1252ad723567a35ef1d');
                        return Permission.get(permissionId).then((p) => {
                            const permission = {
                                preference: mongoose.Types.ObjectId(p.preference),
                                status: p.status
                            };
                            object.permissions.push(permission);

                            console.log(object);

                            requestArray.push(object);

                            console.log(requestArray);

                        })
                    });
                });
            });
            return requestArray;
        });
    }
};

module.exports = mongoose.model('Request', ItemSchema);
