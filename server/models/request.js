const promise = require('bluebird'),
    mongoose = require('mongoose'),
    Organisation = require('./organisation'),
    Permission = require('./permission'),
    Preference = require('./preference');

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
        var requestModel = this;

        function getRequests(requestModel, userId) {
            return requestModel.find({user: userId})
                .execAsync().then((req) => {
                return req;
            })
        }

        function getPermissions(request) {
            return request.permissions.map(p => {
                const permissionId = mongoose.Types.ObjectId(p.id);
                return Permission.get(permissionId).then((p) => {
                    const preferenceId = mongoose.Types.ObjectId(p.preference);
                    return pref = getPreference(preferenceId).then(pref => {
                        return {
                            preference: pref,
                            status: p.status
                        }
                    });
                })
            });
        }

        function getPreference(preferenceId) {
            return Preference.get(preferenceId)
                .then(p => {
                    return {
                        _id: p.id,
                        title: p.title,
                        description: p.description,
                        category: p.category,
                        type: p.type,
                        values: p.values,
                        icon: p.icon
                    };
                })
        }

        function getOrganisation(organisationId) {
            return Organisation.get(organisationId)
                .then((o) => {
                    return {
                        _id: o.id,
                        title: o.title,
                        icon: o.icon
                    };
                });
        }

        userId = mongoose.Types.ObjectId(userId);

        return getRequests(requestModel, userId).then(data => {
            return promise.all(data.map((req) => {
                const organisationId = mongoose.Types.ObjectId(req.organisation);
                const organisation = getOrganisation(organisationId);
                const permissions = getPermissions(req);
                return organisation
                    .then(dataOrganisation => {
                    return promise.all(permissions)
                        .then(dataPermissions => {
                            return {
                                permissions: dataPermissions,
                                organisation: dataOrganisation
                            }
                        })
                });
            }));
        });
    }
};

module.exports = mongoose.model('Request', ItemSchema);
