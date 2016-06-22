const $organisations    = $('#organisations');
const $newOrganisation  = $('.new-item');

import organisation from './models/organisation.js';
import preference from './models/preference.js';

if($organisations) {
    organisation.getOrganisations();
    preference.getPreferences();

    var show = false;
    $('.addForm').on('click', () => {
        if(show) {
            $newOrganisation.hide();
            show = false;
        } else {
            $newOrganisation.show();
            show = true;
        }
    });
    
    $('.addOrganisation').on('click', organisation.newOrganisation);
}

