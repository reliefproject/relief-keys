(function() {


  app.service('User', function() {

    let service = {
      userData: {},
      balances: {},


      getUserData: () => {
        return Relief.db.user.getDoc().then(doc => {
          service.userData = doc;
        });
      },


      addAddress: (id, address) => {
        const type = address.type;
        let addresses = angular.copy(service.userData.addresses);
        addresses[type][id] = address;
        return Relief.db.user.update({
          addresses: addresses,
        });
      },


      updateAddress: address => {
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


      deleteAddress: address => {
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
