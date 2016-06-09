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

        var pref = [];
        var preferences;
        var uPreferences;
        return Preference.find().execAsync().then((pref) => {
            preferences = pref;
            return self.find({user: userId}).sort({ createdAt: -1 }).execAsync()
        }).then((userPreferences) => {
            preferences.forEach(function (v) {
                const el = {};
                el._id = v.id;
                el.title = v.title;
                el.description = v.description;
                el.category = v.category;
                el.values = v.values;
                el.filled = false;
                el.createdAt = v.createdAt;
                el.updatedAt = v.updatedAt;
                userPreferences.forEach(function (uv) {
                    if(v._id.equals(uv.preference)) {
                        el.values = uv.values;
                        el.filled = true;
                    }
                });
                pref.push(el);
            });
            return pref;
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