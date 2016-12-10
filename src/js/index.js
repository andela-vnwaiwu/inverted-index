/* global InvertedIndex */
// import the angular package and other components

const angular = require('angular');

angular.module('indexApp', [])
  .controller('InvertedIndexController', ['$scope', ($scope) => {
    const index = new InvertedIndex();

    $scope.files = {};
    $scope.fileNames = [];
    $scope.searchText = '';
    $scope.showIntro = true;
    $scope.hideTable = true;
    $scope.showResult = false;

    function findWrongFormat(element) {
      if (!{}.hasOwnProperty.call(element, 'title') || !{}.hasOwnProperty.call(element, 'text')) {
        return true;
      }
      return false;
    }

    function isJson(file) {
      if (file && file.name.replace(/\s+/, '').match(/\.json$/i)) {
        return true;
      }
    }

    function validate(file, fileName) {
      if (file.find(findWrongFormat)) {
        $scope.$apply(() => {
          $scope.error = `The .json file did not follow
          the required format`;
        });
        return;
      } else if ($scope.fileNames.includes(fileName)) {
        $scope.$apply(() => {
          $scope.error = 'The file has been uploaded before';
        });
        return;
      } else if (file.length < 1 || Array.isArray(file === false)) {
        $scope.$apply(() => {
          $scope.error = 'This file is empty or not an Array of object';
        });
        return;
      }
      $scope.$apply(() => {
        $scope.fileNames.push(fileName);
        $scope.files[fileName] = file;
        $scope.success = 'The file has been successfully uploaded';
      });
    }

    $scope.uploadFile = () => {
      $scope.error = '';
      $scope.success = '';
      const file = document.forms['upload-form']['json-file'].files[0];
      const fileName = file.name.replace(/\s+/, '');
      if (isJson(file)) {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (evt) => {
          try {
            const jsonData = JSON.parse(evt.target.result);
            validate(jsonData, fileName);
          } catch (error) {
            $scope.$apply(() => {
              $scope.error = 'Invalid .json file';
            });
          }
        };
      }
    };

    $scope.createIndex = (obj) => {
      const fileData = $scope.files[obj];
      index.createIndex(obj, fileData);
    };

    $scope.getIndex = (title) => {
      $scope.indexed = index.getIndex(title);
      $scope.document = $scope.files[title];
      $scope.title = title;
      $scope.showIntro = false;
      $scope.hideTable = false;
      $scope.showResult = false;
    };

    $scope.searchIndex = () => {
      const searchItem = $scope.searchText;
      const file = $scope.selected;

      if (file === undefined) {
        $scope.success = '';
        $scope.error = 'You are searching an unindexed file';
      } else {
        $scope.searchResult = index.searchIndex(file, searchItem);
        $scope.searchTerms = searchItem;
        $scope.showResult = true;
        $scope.hideTable = true;
      }
    };
  }]);
