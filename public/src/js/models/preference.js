import config from './settings.js';

const preference = {
    getPreferences() {
        $.ajax({
            url: config.url + '/preferences',
            method: 'get',
            success: (data) => {
                this.createInstance(data);
            }
        });
    },
    createInstance(preference) {
        const element = preference.map((pref) => {
            return '<option data-id="'+pref._id+'">'+pref.title+'</option>'
        });
        $('#selectPreferences').append(element);
    }
};

export default preference;