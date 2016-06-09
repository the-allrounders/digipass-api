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
    values: [
        {
            type: String
        }
    ]
},
{
    timestamps: true
});


ItemSchema.index({preference: 1, user: 1}, {unique: true})


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

        var preferences = Array;
        Preference.find((err,pref) => console.log(pref));

        console.log(preferences);

        const userPreferences = this.find({user: userId})
            .sort({ createdAt: -1 })
            .execAsync().then((uPref => {return uPref}));

        const pref = Array;
        preferences.foreach(function (k,v) {
            userPreferences.foreach(function (uk,uv) {
                if(uv.preference = v._id) {
                    v.values = uv.values;
                }
            })
        })

        return preferences;
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