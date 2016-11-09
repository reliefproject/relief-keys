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
      importKeys: {
        file: '',
      },
    };


    Settings.loadSettings()
    .then(function() {
      updateAddresses();
      return i18n.loadStrings(Settings.settings.language);
    })
    .then(function() {
      for (let i in $scope.addressCategories) {
        const category = $scope.addressCategories[i];
        $scope.addressCategories[i].title = i18n.getCategoryTitle(category.name);
      }
      $scope.strings = i18n.strings;
      $scope.$apply();
    },
      // Error handler
      Relief.log.error
    );


    const updateAddresses = function() {
      User.getUserData().then(function() {
        $scope.addresses = User.userData.addresses;
        $scope.$apply();
      },
        // Error handler
        Relief.log.error
      );
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
      Relief.crypto.generatePassphrase(12)
      .then(function(phrase) {
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
      User.addAddress(form.addressNumeric, address)
      .then(function() {
        angular.element('#modalCreateAccount').modal('hide');
        $scope.forms.createAddress = {
          step: 1,
          type: 'nxt',
          category: $scope.addressCategories[0],
          label: '',
          passphrase: '',
        };
        updateAddresses();
      },
        // Error handler
        Relief.log.error
      );
    };


    $scope.setAddressToEdit = function(address) {
      $scope.forms.editAddress = angular.copy(address);
      $scope.forms.editAddress.category = getCategoryByName(address.category);
    };


    $scope.saveEditedAddress = function() {
      let addr = $scope.forms.editAddress;
      addr.category = addr.category.name;
      User.updateAddress(addr)
      .then(function() {
        angular.element('#modalEditAccount').modal('hide');
        $scope.forms.editAddress = {};
        updateAddresses();
      },
        // Error handler
        Relief.log.error
      );
    };


    $scope.setAddressToDelete = function(address) {
      $scope.addressToDelete = address;
    };


    $scope.deleteAddress = function() {
      User.deleteAddress($scope.addressToDelete)
      .then(function() {
        angular.element('#modalDeleteAccount').modal('hide');
        updateAddresses();
      },
        // Error handler
        Relief.log.error
      );
    };


    $scope.exportKeys = function() {
      const format = $scope.forms.exportKeys.format;
      const targetFile = $scope.forms.exportKeys.targetFile;
      Relief.user.exportKeys(format, targetFile)
      .then(function() {
        alert($scope.strings.EXPORT_SUCCESS);
        angular.element('#modalExportKeys').modal('hide');
      }, function(err) {
        alert('Error: ' + err.message);
        Relief.log.error(err);
      });
    };


    $scope.importKeys = function() {
      const data = $scope.forms.importKeys.file;
      Relief.user.importKeys(data)
      .then(function() {
        alert($scope.strings.IMPORT_SUCCESS);
        angular.element('#modalImportKeys').modal('hide');
        updateAddresses();
      }, function(err) {
        alert('Error: ' + err.message);
        Relief.log.error(err);
      });
    };


    $scope.fileNameChanged = function(element) {
      var reader = new FileReader();
      reader.onload = function() {
        $scope.forms.importKeys.file = reader.result;
        $scope.$apply();
      };
      reader.readAsText(element.files[0]);
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
