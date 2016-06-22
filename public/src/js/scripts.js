const url               = 'http://digipass-api.herokuapp.com/api';
const $organisations    = $('#organisations');

import organisation from './models/organisation.js';
import preference from './models/preference.js';

if($organisations) {
    organisation.getOrganisations();
    preference.getPreferences();

    $organisations.find()
}