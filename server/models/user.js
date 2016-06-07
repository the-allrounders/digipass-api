import promise from 'bluebird';
import mongoose from 'mongoose';

/**
 * Schema for model
 * 
 * @type {*|Schema}
 */
const ItemSchema = new mongoose.Schema({
   userName: {
       type: String,
       required: true
   },
   email: {
       type: String,
       validate: {
           validator: (v) => {
               return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
           }
       },
       match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
       required: [true, 'Email is required']
   },
   password: {
       type: String,
       required: true
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
                const err = 'No such item exists!';
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

export default mongoose.model('User', ItemSchema);
