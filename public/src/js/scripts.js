const $organisations    = $('#organisations');
const $newOrganisation  = $('.new-item');
const $editOrganisation  = $('.edit-item');

import organisation from './models/organisation.js';
import preference from './models/preference.js';

if($organisations) {
    organisation.getOrganisations();
    preference.getPreferences($('#selectPreferences'));

    var show = false;
    $('.addForm').on('click', () => {
        if(show) {
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

    $('.addOrganisation').on('click', organisation.newOrganisation.bind(organisation));
    $('#organisations').on('click', '.delete', organisation.removeOrganisation.bind(organisation));
    $('#organisations').on('click', '.edit', organisation.setUpdate);
    $('.editOrganisation').on('click', organisation.updateOrganisation.bind(organisation));
}


