(function() {

  app.service('Settings', function() {
    let service = {
      settings: {},
      loadSettings: () => {
        return Relief.db.app.getDoc().then(data => {
          service.settings = data;
        });
      },
    };
    return service;
  });

})();
