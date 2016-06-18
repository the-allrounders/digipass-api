const promise = require('bluebird'),
    mongoose = require('mongoose'),
    Organisation = require('./organisation'),
    Permission = require('./permission'),
    Preference = require('./preference'),
    Category = require('./category'),
    RequestCategory = require('./requestCategory');

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
        var requestModel = this;

        function getRequests(requestModel, userId) {
            return requestModel.find({user: userId})
                .execAsync().then((req) => {
                return req;
            })
        }

        function getPermissions(request) {
            const requestId = mongoose.Types.ObjectId(request.id);
            return Permission.getByRequestId(requestId).map(p => {
                const preferenceId = mongoose.Types.ObjectId(p.preference);
                return getPreference(preferenceId).then(pref => {
                    return {
                        _id: p.id,
                        preference: pref,
                        status: p.status,
                        parent: p.parent
                    }
                });
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

        function getCategories(request) {
            const requestId = mongoose.Types.ObjectId(request.id);
            return RequestCategory.getByRequestId(requestId)
                .then(requestCategory => {
                    return requestCategory.map(req => {
                        return Category.get(req.category)
                            .then(category => {
                                if(category) {
                                    const cat = {
                                        title: category.title,
                                        id: category.id,
                                        icon: category.icon
                                    };
                                    return {
                                        _id: req.id,
                                        category: cat,
                                        parent: req.parent,
                                        request: req.request
                                    };
                                } else {
                                    return {
                                        remove: true
                                    }
                                }
                            });
                    }).filter((category) => {
                        return !category.remove;
                    });
                });
        }

        userId = mongoose.Types.ObjectId(userId);

        return getRequests(requestModel, userId).then(request => {
            return promise.all(request.map((req) => {
                const organisationId = mongoose.Types.ObjectId(req.organisation);
                const organisation = getOrganisation(organisationId);
                const permissions = getPermissions(req);
                const categories = getCategories(req);
                return organisation
                    .then(dataOrganisation => {
                    return promise.all(permissions)
                        .then(dataPermissions => {
                            return promise.all(categories)
                                .then(dataCategories => {
                                    dataPermissions = dataPermissions.concat(dataCategories);
                                    dataPermissions = dataPermissions.map(p => {
                                        const children = [];

                                        let tempParentArray = [0];
                                        let i = 0;

                                        while(getChildren() && i < 15) {
                                            i++;
                                        }

                                        function getChildren() {
                                            const tempTempParentArray = [];

                                            dataPermissions.forEach(permission => {
                                                if(tempParentArray.indexOf(permission.parent) > -1 || (tempParentArray[0] == 0 && !permission.parent)) {
                                                    children.push(permission._id);
                                                    tempTempParentArray.push(permission._id);
                                                }
                                            });

                                            tempParentArray = tempTempParentArray;
                                            return tempTempParentArray.length;
                                        }

                                        p.children = children;
                                        return p;
                                    });
                                    return {
                                        id: req.id,
                                        permissions: dataPermissions,
                                        organisation: dataOrganisation
                                    }
                                })
                        })
                });
            }));
        });
    }
};

module.exports = mongoose.model('Request', ItemSchema);
