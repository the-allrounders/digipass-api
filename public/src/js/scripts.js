const url               = 'localhost:3000/api';
const $organisations    = $('#organisations');

const organisation = {
  getOrganisations() {
      $.ajax({
          url: url + '/organisations',
          method: 'get',
          success: (data) => {
              console.log(data);
          }
      });
  }
};

if($organisations) {
    organisation.getOrganisations();
}