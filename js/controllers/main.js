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


    Settings.loadSettings().then(() => {
      updateAddresses();
      i18n.load(Settings.settings.language, ['common', 'keys']);
      for (let i in $scope.addressCategories) {
        const category = $scope.addressCategories[i];
        $scope.addressCategories[i].title = i18n.getCategoryTitle(category.name);
      }
      $scope.strings = i18n.strings;
      $scope.$apply();
    }, err => {
      Relief.log.error(err.stack || err);
    });


    function updateAddresses() {
      User.getUserData().then(() => {
        $scope.addresses = User.userData.addresses;
        $scope.$apply();
      }, err => {
        Relief.log.error(err.stack || err);
      });
    };

    function getCategoryByName(cat) {
      for (var i in $scope.addressCategories) {
        if ($scope.addressCategories[i].name === cat) {
          return $scope.addressCategories[i];
        }
      }
      return {};
    };


    $scope.getIconClass = category => {
      for (let i in $scope.addressCategories) {
        const cat = $scope.addressCategories[i];
        if (cat.name === category) {
          return cat.icon;
        }
      }
    };


    $scope.generatePassphrase = () => {
      Relief.crypto.generatePassphrase(12).then(phrase => {
        $scope.forms.createAddress.passphrase = phrase;
        $scope.$apply();
      });
    };


    $scope.copyToClipboard = string => Relief.clipboard.writeText(string);


    $scope.createAddress = () => {
      const form = $scope.forms.createAddress;
      if (form.type === 'nxt') {
        const addr = Relief.nxt.generateAddress(form.passphrase);
        form.address = addr.address;
        form.addressNumeric = addr.numeric;
        form.publicKey = addr.publicKey;
      }
      $scope.forms.createAddress.step++;
    };


    $scope.saveAddress = () => {
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
      User.addAddress(form.addressNumeric, address).then(() => {
        angular.element('#modalCreateAccount').modal('hide');
        $scope.forms.createAddress = {
          step: 1,
          type: 'nxt',
          category: $scope.addressCategories[0],
          label: '',
          passphrase: '',
        };
        updateAddresses();
      }, err => {
        Relief.log.error(err.stack || err);
      });
    };


    $scope.setAddressToEdit = address => {
      $scope.forms.editAddress = angular.copy(address);
      $scope.forms.editAddress.category = getCategoryByName(address.category);
    };


    $scope.saveEditedAddress = () => {
      let addr = $scope.forms.editAddress;
      addr.category = addr.category.name;
      User.updateAddress(addr).then(() => {
        angular.element('#modalEditAccount').modal('hide');
        $scope.forms.editAddress = {};
        updateAddresses();
      }, err => {
        Relief.log.error(err.stack || err);
      });
    };


    $scope.setAddressToDelete = address => $scope.addressToDelete = address;


    $scope.deleteAddress = () => {
      User.deleteAddress($scope.addressToDelete)
      .then(() => {
        angular.element('#modalDeleteAccount').modal('hide');
        updateAddresses();
      }, err => {
        Relief.log.error(err.stack || err);
      });
    };


    $scope.exportKeys = () => {
      const format = $scope.forms.exportKeys.format;
      const targetFile = $scope.forms.exportKeys.targetFile;
      Relief.user.exportKeys(format, targetFile).then(() => {
        alert($scope.strings.EXPORT_SUCCESS);
        angular.element('#modalExportKeys').modal('hide');
      }, err => {
        alert('Error: ' + err.message);
        Relief.log.error(err.stack || err);
      });
    };


    $scope.importKeys = () => {
      const data = $scope.forms.importKeys.file;
      Relief.user.importKeys(data).then(() => {
        alert($scope.strings.IMPORT_SUCCESS);
        angular.element('#modalImportKeys').modal('hide');
        updateAddresses();
      }, err => {
        alert('Error: ' + err.message);
        Relief.log.error(err.stack || err);
      });
    };


    $scope.fileNameChanged = element => {
      const reader = new FileReader();
      reader.onload = () => {
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
