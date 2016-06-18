const promise = require('bluebird'),
    mongoose = require('mongoose'),
    Preference = require('./preference');

/**
 * Schema for model
 * 
 * @type {*|Schema}
 */
const ItemSchema = new mongoose.Schema({
    preference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Preference'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    values: [{
        title: {
            type: String
        },
        value: {
            type: String
        }
    }]
},
{
    timestamps: true
});


ItemSchema.index({preference: 1, user: 1}, {unique: true});


/**
 * Statics
 */
ItemSchema.statics = {

    /**
     * Get user by id
     * @param {ObjectId} id - The objectId of category.
     * @returns {promise<category>}
     */
    get(id) {
        return this.findById(id)
            .execAsync().then((preference) => {
                if (preference.length > 0) {
                    return preference;
                }
                const err = 'No such userPreference exists!';
                return promise.reject(err);
            });
    },

    /**
     * List categories in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of categories to be skipped.
     * @param {number} limit - Limit number of categories to be returned.
     * @returns {promise<User[]>}
     */
    list(userId) {
        var self = this;

        function getPreferences() {
            return Preference.find().execAsync()
                .then(pref => {
                    return pref;
                })
        }
        
        function getUserPreferences(userId) {
            return self.find({user: userId}).sort({ createdAt: -1 }).execAsync()
                .then(userPref => {
                    console.log(userPref);
                    return userPref;
                })
        }
        
        return getPreferences().then(dataPreferences => {
            return promise.all(dataPreferences.map(preference => {
                return getUserPreferences(userId).then(dataUserPreferences => {
                    if(dataUserPreferences.length > 0) {
                        return promise.all(dataUserPreferences.map(userPreference => {
                            const el = {
                                _id: preference._id,
                                title: preference.title,
                                description: preference.description,
                                category: preference.category,
                                createdAt: preference.createdAt,
                                updatedAt: preference.updatedAt
                            };

                            const values = [];
                            if (preference._id.equals(userPreference.preference)) {
                                if (preference.type === 'checkbox') {
                                    preference.values.forEach(val => {
                                        const value = {
                                            title: val.title,
                                            value: false
                                        };
                                        userPreference.values.forEach(uVal => {
                                            if(uVal.title == val.title) {
                                                value.value = true;
                                            }
                                        });
                                        values.push(value);
                                    })
                                }
                            } else {
                                preference.values.forEach(val => {
                                    const value = {
                                        title: val.title,
                                        value: false
                                    };
                                    values.push(value);
                                });
                            }
                            el.value = values;

                            return el;
                        })).error(e => {
                            console.log(e);
                            return e;
                        });
                    } else {
                        const el = {
                            _id: preference._id,
                            title: preference.title,
                            description: preference.description,
                            category: preference.category,
                            createdAt: preference.createdAt,
                            updatedAt: preference.updatedAt
                        };

                        const values = [];
                        preference.values.forEach(val => {
                            const value = {
                                title: val.title,
                                value: false
                            };
                            values.push(value);
                        });
                        el.values = values;

                        return el;
                    }
                }).error(e => {
                    console.log(e);
                })
            }))
        });
    },

    getPreferenceById(id, userId) {
        return this.find({preference: id, user: userId})
            .execAsync().then((userPreference) => {
                if(userPreference) {
                    return userPreference;
                }
                return promise.reject('error');
            });
    }
};

module.exports = mongoose.model('UserPreference', ItemSchema);