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
        description: {
            type: String
        },
        category: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }],
        type: {
            type: String,
            required: true
        },
        values: [{
            title: {
                type: String
            },
            value: {
                type: String
            }
        }],
        icon: {
            type: String
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
                const err = 'No such preference exists!';
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
    }
};

module.exports = mongoose.model('Preference', ItemSchema);
