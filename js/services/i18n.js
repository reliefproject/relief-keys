(function() {

  app.service('i18n', function() {
    let service = {
      strings: {},

      loadStrings: function(language) {
        return Relief.i18n.loadStrings(language, 'keys')
        .then(function(strings) {
          service.strings = strings.keys;
        });
      },

      getCategoryTitle: function(cat) {
        const key = 'CATEGORY_' + cat.toUpperCase();
        return service.strings[key];
      },

    };
    return service;
  });

})();
