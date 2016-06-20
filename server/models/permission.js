const promise = require('bluebird'),
    mongoose = require('mongoose');

/**
 * Schema for model
 * 
 * @type {*|Schema}
 */
const ItemSchema = new mongoose.Schema(
    {
        preference: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Preference'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organisation'
        },
        status: {
            type: String
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RequestCategory'
        }
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
                const err = 'No such Permission exists!';
                return promise.reject(err);
            });
    },

    /**
     * List items in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of items to be skipped.
     * @param {number} limit - Limit number of items to be returned.
     * @returns {promise<item[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .execAsync();
    },

    getByRequestId(id) {
        return this.find({request: id})
            .execAsync().then((permissions => {
                if (permissions) {
                    return permissions;
                }
                const err = 'No permission by Request Id.';
                return promise.reject(err);
            }));
    }
};

module.exports = mongoose.model('Permission', ItemSchema);
