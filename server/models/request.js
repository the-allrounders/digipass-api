const promise = require('bluebird'),
    mongoose = require('mongoose'),
    Organisation = require('./organisation'),
    Permission = require('./permission'),
    Preference = require('./preference'),
    Category = require('./category'),
    RequestCategory = require('./requestCategory');

/**
 * Schema for model
 *
 * @type {*|Schema}
 */
const ItemSchema = new mongoose.Schema({
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
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
   * @returns {promise<item[]>}
   * @param userId
   */
    list(userId) {
        var requestModel = this;

        function getRequests(requestModel, userId) {
            return requestModel.find({user: userId})
        .execAsync().then((req) => {
            return req;
        });
        }

        function getPermissions(request) {
            const requestId = mongoose.Types.ObjectId(request.id);
            return Permission.getByRequestId(requestId).map(p => {
                const preferenceId = mongoose.Types.ObjectId(p.preference);
                return getPreference(preferenceId).then(pref => {
                    return {
                        _id: p.id,
                        preference: pref,
                        status: p.status,
                        parent: p.parent
                    };
                });
            });
        }

        function getPreference(preferenceId) {
            return Preference.get(preferenceId)
        .then(p => {
            return {
                _id: p.id,
                title: p.title,
                description: p.description,
                category: p.category,
                type: p.type,
                values: p.values,
                icon: p.icon
            };
        });
        }

        function getOrganisation(organisationId) {
            return Organisation.get(organisationId)
        .then((o) => {
            return {
                _id: o.id,
                title: o.title,
                icon: o.icon
            };
        });
        }

        function getCategories(request) {
            const requestId = mongoose.Types.ObjectId(request.id);
            return RequestCategory.getByRequestId(requestId)
        .then(requestCategory => {
            const maps = requestCategory.map(req => {
                return Category.get(req.category)
              .then(category => {
                  if(category) {
                      const cat = {
                          title: category.title,
                          id: category.id,
                          icon: category.icon
                      };
                      return {
                          _id: req.id,
                          category: cat,
                          parent: req.parent,
                          request: req.request
                      };
                  } else {
                      return {
                          remove: true
                      };
                  }
              });
            });
            return promise.all(maps).then((data) => {
                return data.filter((category) => {
                    return !category.remove;
                });
            });
        });
        }

        userId = mongoose.Types.ObjectId(userId);

        return getRequests(requestModel, userId).then(request => {
            return promise.all(request.map((req) => {
                const organisationId = mongoose.Types.ObjectId(req.organisation);
                const organisation = getOrganisation(organisationId);
                const permissions = getPermissions(req);
                const categories = getCategories(req);
                return organisation
          .then(dataOrganisation => {
              return promise.all(permissions)
              .then(dataPermissions => {
                  return promise.all(categories)
                  .then(dataCategories => {
                      dataPermissions = dataPermissions.concat(dataCategories);
                      dataPermissions = dataPermissions.map(item => {
                          if (item.category) { // Only check children when item is a category
                              const children = [];
                              let parent_array = []; // Array with all item id's that are children. Gets reset after one getChildren call to represent all newly found children.

                              while(getChildren()) {} // While there are new children found, execute getChildren

                              function getChildren() {
                                  const temp_parent_array = []; // Array to store newly found children in to replace the parent_array array with when forEach below is done, because in the next getChildren call those children should be checked as parent.

                                  dataPermissions.forEach(temp_item => { // Loop through all of the data items to find children
                                      if(children.indexOf(temp_item._id) == -1 && (temp_item.parent == item._id || parent_array.indexOf(temp_item.parent ? temp_item.parent.toString() : '') > -1)) { // True if the child is not already added as child AND (if current temp_item has the current item as parent OR the current temp_item has an item of the parent_array as parent)
                                          children.push(temp_item._id); // Add temp_item as child
                                          if (item._id != temp_item._id) { // True if the current temp_item is not the same as the current item
                                              temp_parent_array.push(temp_item._id); // Add the temp_item to the temp_parent_array to be a parent the next time getChildren gets called.
                                          }
                                      }
                                  });

                                  parent_array = temp_parent_array; // Replace the parent_array with temp_parent_array to use the newly found children as parent the next time getChildren gets called.
                                  return temp_parent_array.length; // Returns true if there are new children found, to perform getChildren another time and false if there are no children found to stop looping.
                              }

                              item.children = children;
                          }
                          return item;
                      });
                      return {
                          id: req.id,
                          permissions: dataPermissions,
                          organisation: dataOrganisation
                      };
                  });
              });
          });
            }));
        });
    }
};

module.exports = mongoose.model('Request', ItemSchema);
