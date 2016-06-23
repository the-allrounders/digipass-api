import config from './settings.js';

const preference = {
    getPreferences(element) {
        $.ajax({
            url: config.url + '/preferences',
            method: 'get',
            success: (data) => {
                this.createInstance(data, element);
            }
        });
    },
    createInstance(preference, element) {
        const pref = preference.map((pref) => {
            return '<option value="'+pref._id+'">'+pref.title+'</option>'
        });
        element.append(pref);
    }
};

export default preference;