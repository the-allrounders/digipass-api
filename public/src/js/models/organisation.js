import config from './settings.js';
import modal from './modal.js';

const organisation = {
    getOrganisations() {
        $.ajax({
            url: config.url + '/organisations',
            method: 'get',
            success: (data) => {
                if(data) {
                    $('#organisations').find('tbody').html('');
                    data.forEach((organisation) => {
                        this.createInstance(organisation);
                    });
                    return data;
                }
                return false;
            }
        });
    },
    createInstance(organisation) {
        const $org = $('#organisations');
        let devices = organisation.devices.map((device) => {
            return '<li class="device" data-id="'+device._id+'">'+device._id+'</li>';
        });

        let tableElement = '<tr class="organisation"><td><img src="'+organisation.icon+'" alt=""></td><td>'+organisation.title+'</td><td><ul>'+devices+'</ul></td><td><button type="button" class="btn btn-block btn-primary delete" data-id="'+organisation._id+'">Delete</button><button type="button" class="btn btn-block btn-primary edit" data-id="'+organisation._id+'">Edit</button></td></tr>';
        $org.find('tbody').append(tableElement);
    },
    newOrganisation() {
        const title = $('#inputTitle').val(),
            iconUrl = $('#inputUrl').val(),
            preferences = $('select[name=selector]').val(),
            bluetooth = $('#inputCrownstoneId').val(),
            crownstoneName = $('#inputCrownstoneName').val();

        $.ajax({
            url: config.url+ '/organisations',
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
            success: () => {
                this.getOrganisations();
            }
        })
    },
    removeOrganisation(e) {
        const id = $(e.target).data('id');
        modal.promptModal(() => {$.ajax({
            url: config.url+ '/organisations/'+id,
            method: 'delete',
            success: (data) => {
                this.getOrganisations();
            },
            error: (data) => {
                console.log(data);
            }
        })});
    },
    setUpdate() {
        const title = $('#inputTitle'),
            iconUrl = $('#inputUrl'),
            preferences = $('select[name=selector]'),
            bluetooth = $('#inputCrownstoneId'),
            crownstoneName = $('#inputCrownstoneName');
    }
};

export default organisation;