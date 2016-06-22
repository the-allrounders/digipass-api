(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _settings = require('./settings.js');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modal = {
    promptModal: function promptModal(callback) {
        var $modal = $('.modal').show();
        var $yes = $modal.find('.yes');
        var $no = $modal.find('.no');

        $yes.on('click', function () {
            $modal.hide();
            callback();
        });

        $no.on('click', function () {
            $modal.hide();
        });
    }
};

exports.default = modal;

},{"./settings.js":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _settings = require('./settings.js');

var _settings2 = _interopRequireDefault(_settings);

var _modal = require('./modal.js');

var _modal2 = _interopRequireDefault(_modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var organisation = {
    getOrganisations: function getOrganisations() {
        var _this = this;

        $.ajax({
            url: _settings2.default.url + '/organisations',
            method: 'get',
            success: function success(data) {
                if (data) {
                    $('#organisations').find('tbody').html('');
                    data.forEach(function (organisation) {
                        _this.createInstance(organisation);
                    });
                    return data;
                }
                return false;
            }
        });
    },
    createInstance: function createInstance(organisation) {
        var $org = $('#organisations');
        var devices = organisation.devices.map(function (device) {
            return '<li class="device" data-id="' + device._id + '">' + device._id + '</li>';
        });

        var tableElement = '<tr class="organisation"><td><img src="' + organisation.icon + '" alt=""></td><td>' + organisation.title + '</td><td><ul>' + devices + '</ul></td><td><button type="button" class="btn btn-block btn-primary delete" data-id="' + organisation._id + '">Delete</button><button type="button" class="btn btn-block btn-primary edit" data-id="' + organisation._id + '">Edit</button></td></tr>';
        $org.find('tbody').append(tableElement);
    },
    newOrganisation: function newOrganisation() {
        var _this2 = this;

        var title = $('#inputTitle').val(),
            iconUrl = $('#inputUrl').val(),
            preferences = $('select[name=selector]').val(),
            bluetooth = $('#inputCrownstoneId').val(),
            crownstoneName = $('#inputCrownstoneName').val();

        $.ajax({
            url: _settings2.default.url + '/organisations',
            method: 'post',
            data: {
                title: title,
                icon: iconUrl,
                devices: [{
                    bluetooth: bluetooth,
                    preferences: preferences,
                    title: crownstoneName
                }]
            },
            success: function success() {
                _this2.getOrganisations();
            }
        });
    },
    removeOrganisation: function removeOrganisation(e) {
        var _this3 = this;

        var id = $(e.target).data('id');
        _modal2.default.promptModal(function () {
            $.ajax({
                url: _settings2.default.url + '/organisations/' + id,
                method: 'delete',
                success: function success(data) {
                    _this3.getOrganisations();
                },
                error: function error(data) {
                    console.log(data);
                }
            });
        });
    },
    setUpdate: function setUpdate() {
        var title = $('#inputTitle'),
            iconUrl = $('#inputUrl'),
            preferences = $('select[name=selector]'),
            bluetooth = $('#inputCrownstoneId'),
            crownstoneName = $('#inputCrownstoneName');
    }
};

exports.default = organisation;

},{"./modal.js":1,"./settings.js":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _settings = require('./settings.js');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var preference = {
    getPreferences: function getPreferences() {
        var _this = this;

        $.ajax({
            url: _settings2.default.url + '/preferences',
            method: 'get',
            success: function success(data) {
                _this.createInstance(data);
            }
        });
    },
    createInstance: function createInstance(preference) {
        var element = preference.map(function (pref) {
            return '<option value="' + pref._id + '">' + pref.title + '</option>';
        });
        $('#selectPreferences').append(element);
    }
};

exports.default = preference;

},{"./settings.js":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    url: 'http://digipass-api.herokuapp.com/api'
};

exports.default = config;

},{}],5:[function(require,module,exports){
'use strict';

var _organisation = require('./models/organisation.js');

var _organisation2 = _interopRequireDefault(_organisation);

var _preference = require('./models/preference.js');

var _preference2 = _interopRequireDefault(_preference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $organisations = $('#organisations');
var $newOrganisation = $('.new-item');

if ($organisations) {
    _organisation2.default.getOrganisations();
    _preference2.default.getPreferences();

    var show = false;
    $('.addForm').on('click', function () {
        if (show) {
            $newOrganisation.hide();
            show = false;
        } else {
            $newOrganisation.show();
            show = true;
        }
    });

    $('.addOrganisation').on('click', _organisation2.default.newOrganisation.bind(_organisation2.default));
    $('#organisations').on('click', '.delete', _organisation2.default.removeOrganisation.bind(_organisation2.default));
    $('#organisations').on('click', '.edit', _organisation2.default.setUpdate);
}

},{"./models/organisation.js":2,"./models/preference.js":3}]},{},[5]);
