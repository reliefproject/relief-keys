(function() {


  const mainController = function(
    $scope, i18n, Settings, User
  ) {


    $scope.strings = {};
    $scope.addresses = [];
    $scope.addressCategories = Relief.env.addressCategories;
    $scope.forms = {
      createAddress: {
        step: 1,
        type: 'nxt',
        category: $scope.addressCategories[0],
        label: '',
        passphrase: '',
      },
      editAddress: {},
      exportKeys: {
        format: 'json',
        targetFile: Relief.app.getPath('desktop') + '/' + Relief.env.exportFilename,
      },
    };


    Settings.loadSettings(function(err) {
      if (err) {
        return Relief.log.error(err);
      }
      i18n.loadStrings(Settings.settings.language, function(err) {
        if (err) {
          return Relief.log.error(err);
        }
        for (let i in $scope.addressCategories) {
          const category = $scope.addressCategories[i];
          $scope.addressCategories[i].title = i18n.getCategoryTitle(category.name);
        }
        $scope.strings = i18n.strings;
        $scope.$apply();
      });
      updateAddresses();
    });


    const updateAddresses = function() {
      User.getUserData(function(err) {
        if (err) {
          return Relief.log.error(err);
        }
        $scope.addresses = User.userData.addresses;
        $scope.$apply();
      });
    };


    const getCategoryByName = function(cat) {
      for (var i in $scope.addressCategories) {
        if ($scope.addressCategories[i].name === cat) {
          return $scope.addressCategories[i];
        }
      }
      return {};
    };


    $scope.getIconClass = function(category) {
      for (let i in $scope.addressCategories) {
        const cat = $scope.addressCategories[i];
        if (cat.name === category) {
          return cat.icon;
        }
      }
    };


    $scope.generatePassphrase = function() {
      Relief.crypto.generatePassphrase(12, function(phrase) {
        $scope.forms.createAddress.passphrase = phrase;
        $scope.$apply();
      });
    };


    $scope.copyToClipboard = function(string) {
      Relief.clipboard.writeText(string);
    };


    $scope.createAddress = function() {
      const form = $scope.forms.createAddress;
      if (form.type === 'nxt') {

        const addr = Relief.nxt.generateAddress(form.passphrase);
        form.address = addr.address;
        form.addressNumeric = addr.numeric;
        form.publicKey = addr.publicKey;

      }
      $scope.forms.createAddress.step++;
    };


    $scope.saveAddress = function() {
      const form = $scope.forms.createAddress;
      const privKey = form.type === 'nxt'
        ? form.passphrase
        : form.privateKey;
      const address = {
        type: form.type,
        label: form.label,
        category: form.category.name,
        address: form.address,
        publicKey: form.publicKey,
        privateKey: privKey,
      };
      User.addAddress(form.addressNumeric, address, function(err) {
        if (err) {
          return Relief.log.error(err);
        }
        angular.element('#modalCreateAccount').modal('hide');
        $scope.forms.createAddress = {
          step: 1,
          type: 'nxt',
          category: $scope.addressCategories[0],
          label: '',
          passphrase: '',
        };
        updateAddresses();
      });
    };


    $scope.setAddressToEdit = function(address) {
      $scope.forms.editAddress = angular.copy(address);
      $scope.forms.editAddress.category = getCategoryByName(address.category);
    };


    $scope.saveEditedAddress = function() {
      let addr = $scope.forms.editAddress;
      addr.category = addr.category.name;
      User.updateAddress(addr, function(err) {
        if (err) {
          return Relief.log.error(err);
        }
        angular.element('#modalEditAccount').modal('hide');
        $scope.forms.editAddress = {};
        updateAddresses();
      });
    };


    $scope.setAddressToDelete = function(address) {
      $scope.addressToDelete = address.address;
    };


    $scope.deleteAddress = function() {
      User.deleteAddress($scope.addressToDelete, function(err) {
        if (err) {
          return Relief.log.error(err);
        }
        angular.element('#modalDeleteAccount').modal('hide');
        updateAddresses();
      });
    };


    $scope.exportKeys = function() {
      const format = $scope.forms.exportKeys.format;
      const targetFile = $scope.forms.exportKeys.targetFile;
      Relief.user.exportKeys(format, targetFile, function(err) {
        if (err) {
          alert('Error: ' + err.message);
          return Relief.log.error(err);
        }
        alert($scope.strings.EXPORT_SUCCESS);
        angular.element('#modalExportKeys').modal('hide');
      });
    };


  };


  app.controller(
    'MainCtrl',
    [
      '$scope',
      'i18n',
      'Settings',
      'User',
      mainController,
    ]
  );


})();
