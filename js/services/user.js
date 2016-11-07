(function() {

  app.service('User', function() {
    var service = {
      userData: {},
      balances: {},


      getUserData: function(callback) {
        Relief.db.user.getDoc(function(err, doc) {
          if (err) {
            return callback(err);
          }
          service.userData = doc;
          callback();
        });
      },


      addAddress: function(id, address, callback) {
        const type = address.type;
        let addresses = angular.copy(service.userData.addresses);
        addresses[type][id] = address;
        Relief.db.user.update(
          { addresses: addresses },
          callback
        );
      },


      updateAddress: function(address, callback) {
        const type = address.type;
        let addresses = angular.copy(service.userData.addresses);
        for (var i in addresses[type]) {
          if (addresses[type][i].address === address.address) {
            addresses[type][i] = address;
          }
        }
        Relief.db.user.update(
          { addresses: addresses },
          callback
        );
      },


      deleteAddress: function(address, callback) {
        const type = address.type;
        let addresses = angular.copy(service.userData.addresses);
        for (let i in addresses[type]) {
          if (addresses[type][i].address === address) {
            delete addresses[type][i];
          }
        }
        Relief.db.user.update(
          { addresses: addresses },
          callback
        );
      },


    };

    return service;

  });

})();
