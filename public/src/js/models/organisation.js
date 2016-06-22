import config from './settings.js';

const organisation = {
    getOrganisations() {
        $.ajax({
            url: config.url + '/organisations',
            method: 'get',
            success: (data) => {
                if(data) {
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
        const devices = organisation.devices.map((device) => {
            return '<li class="device" data-id="'+device._id+'">'+device._id+'</li>';
        });

        const tableElement = '<tr class="organisation" data-id="'+organisation._id+'"><td><img src="'+organisation.icon+'" alt=""></td><td>'+organisation.title+'</td><td><ul>'+devices+'</ul></td><td><button type="button" class="btn btn-block btn-primary delete">Delete</button><button type="button" class="btn btn-block btn-primary edit">Edit</button></td></tr>';
        $('#organisations').find('tbody').append(tableElement);
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
            }
        })
    }
};

export default organisation;