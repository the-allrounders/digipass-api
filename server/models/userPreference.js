import promise from 'bluebird';
import mongoose from 'mongoose';

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
            .execAsync().then((category) => {
                if (category) {
                    return category;
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
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .execAsync();
    },

    getPreferenceById(id) {
        return this.findOne({preference: id})
            .execAsync().then((userPreference) => {
                if(userPreference) {
                    return userPreference;
                }
                return promise.reject('error');
            });






            // {_id: { $eq: id, $exists: true, $ne: null }})
            // .execAsync().then((userPreference) => {
            //     if(userPreference) {
            //         return userPreference;
            //     }
            // });

            // .execAsync().then((userPreference) => {
            //     if(userPreference) {
            //         console.log('gevonden: ', userPreference);
            //         return userPreference;
            //     }
            //     const err = 'No such userPreference exists';
            //     return promise.reject(err);
            // })
    }
};

export default mongoose.model('UserPreference', ItemSchema);