import setting from './settings.js';

const modal = {
    promptModal(callback) {
        const $modal    = $('.modal').show();
        const $yes      = $modal.find('.yes');
        const $no       = $modal.find('.no');

        $yes.on('click', () => {
            $modal.hide();
            callback();
        });

        $no.on('click', () => {
            $modal.hide();
        });
    }
};

export default modal;