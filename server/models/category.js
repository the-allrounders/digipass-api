import promise from 'bluebird';
import mongoose from 'mongoose';

/**
 * Schema for model
 * 
 * @type {*|Schema}
 */
const ItemSchema = new mongoose.Schema({
   title: {
       type: String,
       required: true
   },
   description: {
       type: String
   },
   parent: [
       {
           _id: {
               type: String
           }
       }
   ],
   icon: {
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
     * @param {ObjectId} id - The objectId of category.
     * @returns {promise<category>}
     */
    get(id) {
        return this.findById(id)
            .execAsync().then((category) => {
                if (category) {
                    return category;
                }
                const err = 'No such category exists!';
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

export default mongoose.model('Category', ItemSchema);