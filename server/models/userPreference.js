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
        type: String
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
        return Preference.find().execAsync().then((pref) => {
            preferences = pref;
            return self.find({user: userId}).sort({ createdAt: -1 }).execAsync()
        }).then((userPreferences) => {
            preferences.forEach(function (v) {
                var userP;
                userPreferences.forEach(function (uv) {
                    if(v._id.equals(uv.preference)) {
                        userP = uv;
                    }
                });

                const el = {
                    _id: v._id,
                    title: v.title,
                    description: v.description,
                    category: v.category,
                    createdAt: v.createdAt,
                    updatedAt: v.updatedAt
                };

                const values = [];
                v.values.forEach((obj) => {
                    console.log(obj);
                    const val = {
                        title: obj.title,
                        value: obj.value
                    };
                    const i = userP.values.indexOf(obj.title);
                    if (i > -1) {
                       val.value = userP.values[i].value;
                    }
                    values.push(val);
                });

                el.values = values;

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