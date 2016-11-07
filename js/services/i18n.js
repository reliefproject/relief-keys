(function() {

  app.service('i18n', function() {
    var service = {
      strings: {},
      loadStrings: function(language, callback) {
        Relief.i18n.loadStrings(language, 'keys', function(err, strings) {
          if (err) {
            return callback(err);
          }
          service.strings = strings.keys;
          callback();
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
