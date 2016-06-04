import Joi from 'joi';

export default {
    // POST /api/categories
    createCategory: {
        body: {
            title: Joi.string().required(),
            description: Joi.string(),
            parent: Joi.array().items(Joi.object().keys({
                _id: Joi.string()
            }))
        }
    },

    // UPDATE /api/categories/:categoryId
    updateCategory: {
        body: {
            title: Joi.string().required(),
            description: Joi.string()
        },
        params: {
            categoryId: Joi.string().hex().required()
        }
    }
};
