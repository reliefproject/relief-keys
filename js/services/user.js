(function() {


  app.service('User', function() {
    let service = {
      userData: {},
      balances: {},


      getUserData: function() {
        return Relief.db.user.getDoc().then(function(doc) {
          service.userData = doc;
        });
      },


      addAddress: function(id, address) {
        const type = address.type;
        let addresses = angular.copy(service.userData.addresses);
        addresses[type][id] = address;
        return Relief.db.user.update({
          addresses: addresses,
        });
      },


      updateAddress: function(address) {
        const type = address.type;
        let addresses = angular.copy(service.userData.addresses);
        for (let i in addresses[type]) {
          if (addresses[type][i].address === address.address) {
            addresses[type][i] = address;
          }
        }
        return Relief.db.user.update({
          addresses: addresses,
        });
      },


      deleteAddress: function(address) {
        const type = address.type;
        let addresses = angular.copy(service.userData.addresses);
        for (let i in addresses[type]) {
          if (addresses[type][i].address === address.address) {
            delete addresses[type][i];
          }
        }
        return Relief.db.user.update({
          addresses: addresses,
        });
      },


    };

    return service;

  });

})();
