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

var _preference = require('./preference.js');

var _preference2 = _interopRequireDefault(_preference);

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
        var preferences = [];
        var devices = organisation.devices.map(function (device) {
            device.preferences.forEach(function (v) {
                preferences.push('<li class="preference" data-id="' + v + '" data-deviceId="' + device._id + '">' + v + '</li>');
            });
            return '<li class="device" data-id="' + device._id + '" data-title="' + device.title + '" data-bluetooth="' + device.bluetooth + '">' + device._id + '</li>';
        });

        var tableElement = '<tr class="organisation"><td class="icon" data-url="' + organisation.icon + '"><img src="' + organisation.icon + '" alt=""></td><td class="title" data-id="' + organisation._id + '" data-title="' + organisation.title + '">' + organisation.title + '</td><td class="devices"><ul>' + devices.join('') + '</ul></td><td><ul>' + preferences.join('') + '</ul></td><td><button type="button" class="btn btn-block btn-primary delete" data-id="' + organisation._id + '">Delete</button><button type="button" class="btn btn-block btn-primary edit" data-id="' + organisation._id + '">Edit</button></td></tr>';
        $org.find('tbody').append(tableElement);
    },
    newOrganisation: function newOrganisation() {
        var _this2 = this;

        var $newOrganisation = $('.new-item');
        var title = $newOrganisation.find('#inputTitle').val(),
            iconUrl = $newOrganisation.find('#inputUrl').val(),
            preferences = $newOrganisation.find('select[name=selector]').val(),
            bluetooth = $newOrganisation.find('#inputCrownstoneId').val(),
            crownstoneName = $newOrganisation.find('#inputCrownstoneName').val();

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
    setUpdate: function setUpdate(e) {
        $('.new-item').hide();
        var $editOrganisation = $('.edit-item');
        $editOrganisation.find('.deviceManager').remove();
        var $title = $editOrganisation.find('#inputTitle'),
            $iconUrl = $editOrganisation.find('#inputUrl'),
            $id = $editOrganisation.find('#inputId');
        var $parent = $(e.target).parent().parent();

        var title = $parent.find('.title').data('title'),
            iconUrl = $parent.find('.icon').data('url'),
            id = $parent.find('.title').data('id');
        var devices = [];
        $parent.find('.devices .device').each(function (k, v) {
            var obj = {
                id: $(v).data('id'),
                title: $(v).data('title'),
                bluetooth: $(v).data('bluetooth'),
                preferences: []
            };
            $parent.find('.preference').each(function (prefk, prefv) {
                if ($(prefv).data('deviceid') == obj.id) {
                    obj.preferences.push($(prefv).data('id'));
                }
            });
            devices.push(obj);
        });

        $title.val(title);
        $iconUrl.val(iconUrl);
        $id.val(id);
        console.log(devices);
        devices.forEach(function (v) {
            $editOrganisation.find('.box-body').append('<div class="box-group deviceManager"><div class="box"><div class="box-header"><h3 class="box-title">' + v.title + '</h3></div><div class="box-body"><div class="row"><div class="col-md-6"><div class="form-group"><label for="deviceTitle">Device Title</label><input type="text" class="form-control" id="deviceTitle" placeholder="Enter device title" value="' + v.title + '" data-id="' + v.id + '"></div><div class="form-group"><label for="inputCrownstoneId">Bluetooth id</label><input type="text" class="form-control" id="inputCrownstoneId" placeholder="Enter bluetooth id" value="' + v.bluetooth + '"></div></div><div class="col-md-6"></div></div></div></div></div>');
        });

        $editOrganisation.find('#box-title').html('Edit organisation');
        $editOrganisation.show();
    },
    updateOrganisation: function updateOrganisation() {
        var _this4 = this;

        var $editOrganisation = $('.edit-item');
        var title = $editOrganisation.find('#inputTitle').val(),
            iconUrl = $editOrganisation.find('#inputUrl').val(),
            id = $editOrganisation.find('#inputId').val();
        var devices = $editOrganisation.find('.deviceManager');
        var devicess = [];
        devices.each(function (k, device) {
            devicess.push({
                id: $(device).find('#deviceTitle').data('id'),
                title: $(device).find('#deviceTitle').val(),
                bluetooth: $(device).find('#deviceTitle').val()
            });
        });

        console.log(id, title, iconUrl, devicess);
        $.ajax({
            url: _settings2.default.url + '/organisations/' + id,
            method: 'put',
            data: {
                title: title,
                icon: iconUrl,
                devices: devicess
            },
            success: function success() {
                _this4.getOrganisations();
            }
        });
    }
};

exports.default = organisation;

},{"./modal.js":1,"./preference.js":3,"./settings.js":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _settings = require('./settings.js');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var preference = {
    getPreferences: function getPreferences(element) {
        var _this = this;

        $.ajax({
            url: _settings2.default.url + '/preferences',
            method: 'get',
            success: function success(data) {
                _this.createInstance(data, element);
            }
        });
    },
    createInstance: function createInstance(preference, element) {
        var pref = preference.map(function (pref) {
            return '<option value="' + pref._id + '">' + pref.title + '</option>';
        });
        element.append(pref);
    }
};

exports.default = preference;

},{"./settings.js":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    url: 'http://localhost:3000/api'
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
var $editOrganisation = $('.edit-item');

if ($organisations) {
    _organisation2.default.getOrganisations();
    _preference2.default.getPreferences($('#selectPreferences'));

    var show = false;
    $('.addForm').on('click', function () {
        if (show) {
            $editOrganisation.hide();
            $newOrganisation.hide();
            show = false;
        } else {
            $editOrganisation.hide();
            $newOrganisation.find('#box-title').html('New organisation');
            $newOrganisation.show();
            show = true;
        }
    });

    $('.addOrganisation').on('click', _organisation2.default.newOrganisation.bind(_organisation2.default));
    $('#organisations').on('click', '.delete', _organisation2.default.removeOrganisation.bind(_organisation2.default));
    $('#organisations').on('click', '.edit', _organisation2.default.setUpdate);
    $('.editOrganisation').on('click', _organisation2.default.updateOrganisation.bind(_organisation2.default));
}

},{"./models/organisation.js":2,"./models/preference.js":3}]},{},[5]);
