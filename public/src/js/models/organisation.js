import config from './settings.js';
import modal from './modal.js';
import preference from './preference.js';

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
        const preferences = [];
        const devices = organisation.devices.map((device) => {
            device.preferences.forEach((v) => {
               preferences.push('<li class="preference" data-id="'+v+'" data-deviceId="'+device._id+'">'+v+'</li>');
            });
            return '<li class="device" data-id="'+device._id+'" data-title="'+device.title+'" data-bluetooth="'+device.bluetooth+'">'+device._id+'</li>';
        });

        let tableElement = '<tr class="organisation"><td class="icon" data-url="'+organisation.icon+'"><img src="'+organisation.icon+'" alt=""></td><td class="title" data-id="'+organisation._id+'" data-title="'+organisation.title+'">'+organisation.title+'</td><td class="devices"><ul>'+devices.join('')+'</ul></td><td><ul>'+preferences.join('')+'</ul></td><td><button type="button" class="btn btn-block btn-primary delete" data-id="'+organisation._id+'">Delete</button><button type="button" class="btn btn-block btn-primary edit" data-id="'+organisation._id+'">Edit</button></td></tr>';
        $org.find('tbody').append(tableElement);
    },
    newOrganisation() {
        const $newOrganisation  = $('.new-item');
        const title = $newOrganisation.find('#inputTitle').val(),
            iconUrl = $newOrganisation.find('#inputUrl').val(),
            preferences = $newOrganisation.find('select[name=selector]').val(),
            bluetooth = $newOrganisation.find('#inputCrownstoneId').val(),
            crownstoneName = $newOrganisation.find('#inputCrownstoneName').val();

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
    setUpdate(e) {
        $('.new-item').hide();
        const $editOrganisation  = $('.edit-item');
        $editOrganisation.find('.deviceManager').remove();
        const $title = $editOrganisation.find('#inputTitle'),
            $iconUrl = $editOrganisation.find('#inputUrl'),
            $id = $editOrganisation.find('#inputId');
        const $parent = $(e.target).parent().parent();

        const title = $parent.find('.title').data('title'),
            iconUrl = $parent.find('.icon').data('url'),
            id = $parent.find('.title').data('id');
        const devices = [];
        $parent.find('.devices .device').each((k,v) => {
            let obj = {
                id: $(v).data('id'),
                title: $(v).data('title'),
                bluetooth: $(v).data('bluetooth'),
                preferences: []
            };
            $parent.find('.preference').each((prefk,prefv) => {
                if($(prefv).data('deviceid') == obj.id) {
                    obj.preferences.push($(prefv).data('id'));
                }
            });
            devices.push(obj);
        });


        $title.val(title);
        $iconUrl.val(iconUrl);
        $id.val(id);
        console.log(devices);
        devices.forEach((v) => {
           $editOrganisation.find('.box-body').append('<div class="box-group deviceManager"><div class="box"><div class="box-header"><h3 class="box-title">'+v.title+'</h3></div><div class="box-body"><div class="row"><div class="col-md-6"><div class="form-group"><label for="deviceTitle">Device Title</label><input type="text" class="form-control" id="deviceTitle" placeholder="Enter device title" value="'+v.title+'" data-id="'+v.id+'"></div><div class="form-group"><label for="inputCrownstoneId">Bluetooth id</label><input type="text" class="form-control" id="inputCrownstoneId" placeholder="Enter bluetooth id" value="'+v.bluetooth+'"></div></div><div class="col-md-6"></div></div></div></div></div>');
        });

        $editOrganisation.find('#box-title').html('Edit organisation');
        $editOrganisation.show();
    },
    updateOrganisation() {
        const $editOrganisation  = $('.edit-item');
        const title = $editOrganisation.find('#inputTitle').val(),
            iconUrl = $editOrganisation.find('#inputUrl').val(),
            id = $editOrganisation.find('#inputId').val();
        const devices = $editOrganisation.find('.deviceManager');
        const devicess = [];
        devices.each((k, device) => {
            devicess.push({
                id: $(device).find('#deviceTitle').data('id'),
                title: $(device).find('#deviceTitle').val(),
                bluetooth: $(device).find('#deviceTitle').val()
            });
        });

        console.log(id,title, iconUrl, devicess);
        $.ajax({
            url: config.url+ '/organisations/'+id,
            method: 'put',
            data: {
                title: title,
                icon: iconUrl,
                devices: devicess
            },
            success: () => {
                this.getOrganisations();
            }
        })
    }
};

export default organisation;