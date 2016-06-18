const promise = require('bluebird');
const mongoose = require('mongoose');

/**
 * Schema for model
 * 
 * @type {*|Schema}
 */
const ItemSchema = new mongoose.Schema({
   request: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Request'
   },
   category: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Category'
   },
   parent: {
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
     * Get user by id
     * @param {ObjectId} id - The objectId of requestCategory.
     * @returns {promise<requestCategory>}
     */
    get(id) {
        return this.findById(id)
            .execAsync().then((requestCategory) => {
                if (requestCategory) {
                    return requestCategory;
                }
                const err = 'No such requestCategory exists!';
                return promise.reject(err);
            });
    },

    /**
     * List categories in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of categories to be skipped.
     * @param {number} limit - Limit number of categories to be returned.
     * @returns {promise<User[]>}
     */
    list() {
        return this.find()
            .sort({ createdAt: -1 })
            .execAsync();
    },

    getByRequestId(requestId, categoryId) {
        let filter = {
            request: requestId
        };
        if(typeof categoryId != 'undefined') {
            filter.category = categoryId;
        }
        return this.find(filter)
            .execAsync().then(requestCategory => {
                if(requestCategory) {
                    return requestCategory
                }
                return false;
            })
    }
    
};

module.exports = mongoose.model('RequestCategory', ItemSchema);