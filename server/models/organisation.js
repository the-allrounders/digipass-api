const promise = require('bluebird'),
    mongoose = require('mongoose');

/**
 * Schema for model
 * 
 * @type {*|Schema}
 */
const ItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        icon: String,
        devices: [{
            title: String,
            bluetooth: String,
            preferences: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Preference'
            }]
        }],
        token: String
    },
    {
        timestamps: true
    }
);

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
                const err = 'No such Organisation exists!';
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
    }
};

module.exports =  mongoose.model('Organisation', ItemSchema);