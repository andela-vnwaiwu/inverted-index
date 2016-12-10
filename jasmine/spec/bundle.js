/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* global InvertedIndex */
	var jsonFile = __webpack_require__(1);
	var jsonFile1 = __webpack_require__(2);
	var emptyJson = __webpack_require__(3);
	var badJson = __webpack_require__(4);
	var deepFile = __webpack_require__(5);
	
	describe('Inverted Index', function () {
	  var invertedIndex = new InvertedIndex();
	  var books = jsonFile;
	  var books1 = jsonFile1;
	  var empty = emptyJson;
	  var badFile = badJson;
	
	  afterEach(function () {
	    invertedIndex.indexes = {};
	  });
	
	  it('should be truthy for the instance of the class', function () {
	    var indexInstance = invertedIndex;
	    expect(invertedIndex instanceof InvertedIndex).toBeTruthy();
	  });
	
	  it('should return zero for the length of indexes', function () {
	    var indexInstance = invertedIndex;
	    expect(Object.keys(invertedIndex.indexes).length).toBe(0);
	  });
	
	  describe('Read book data', function () {
	    it('should read the content of a json file and return false if the file is empty', function () {
	      var book = [];
	      var isValid = invertedIndex.readFileData(book);
	      expect(isValid).toBe(false);
	    });
	    it('should read the content of a json file and return true if the file matches the format', function () {
	      var isValid = invertedIndex.readFileData(books);
	      expect(isValid).toBe(true);
	    });
	    it('should return false if the content of the file is not an array of object', function () {
	      var isValid = invertedIndex.readFileData(badFile);
	      expect(isValid).toBe(false);
	    });
	    it('should return false if the content of the file is a multi-dimensional array', function () {
	      var wrongFormat = invertedIndex.readFileData(deepFile);
	      expect(wrongFormat).toBe(false);
	    });
	  });
	
	  describe('Populate index', function () {
	    beforeEach(function () {
	      invertedIndex.createIndex('books', books);
	    });
	
	    it('should create the index once the file has been read', function () {
	      expect(invertedIndex.indexes.books).toBeDefined();
	    });
	    it('should return an object of all created index', function () {
	      var bookIndex = invertedIndex.indexes.books;
	      var bookKeys = Object.keys(bookIndex);
	      bookKeys.forEach(function (key) {
	        expect({}.hasOwnProperty.call(bookIndex, key)).toBeTruthy();
	      });
	    });
	    it('should return an array that contains the indexes of a word', function () {
	      expect(invertedIndex.indexes.books.and).toEqual([0, 1]);
	      expect(invertedIndex.indexes.books.of).toEqual([0, 1]);
	    });
	    it('should return false if the file Content is Empty', function () {
	      var emptyIndex = invertedIndex.createIndex('empty', empty);
	      expect(emptyIndex).toBe(false);
	    });
	    it('should not create the index again if the file has been uploaded before', function () {
	      invertedIndex.createIndex('books', books);
	      expect(Object.keys(invertedIndex.indexes).length).toBe(1);
	    });
	  });
	
	  describe('Get Index', function () {
	    it('should get the indexes of a particular uploaded file', function () {
	      invertedIndex.createIndex('books', books);
	      var getIndex = invertedIndex.getIndex('books');
	      expect(getIndex).toBeDefined();
	    });
	    it('should return an empty object for an uploaded file that has not been indexed', function () {
	      var getIndex = invertedIndex.getIndex('books');
	      expect(getIndex).toEqual({});
	    });
	    it('should the length of all indexed file', function () {
	      invertedIndex.createIndex('books', books);
	      invertedIndex.createIndex('books1', books1);
	      var getIndex = invertedIndex.getIndex();
	      expect(Object.keys(getIndex).length).toBe(2);
	    });
	    it('should return undefined if no index has been created for a file', function () {
	      invertedIndex.createIndex('books', books);
	      var getIndex = invertedIndex.getIndex('book3');
	      expect(getIndex).toBeUndefined();
	    });
	  });
	
	  describe('Search Index', function () {
	    it('should return an array containing the index of a word', function () {
	      invertedIndex.createIndex('books', books);
	      var searchIndex = invertedIndex.searchIndex('books', 'and');
	      expect(searchIndex[0].books.and).toEqual([0, 1]);
	    });
	    it('should return null for a word not found in the file', function () {
	      invertedIndex.createIndex('books', books);
	      var searchIndex = invertedIndex.searchIndex('books', 'because');
	      expect(searchIndex[0].books.because).toBe(null);
	    });
	    it('should return an array of Objects with keys of all the files searched', function () {
	      invertedIndex.createIndex('books', books);
	      invertedIndex.createIndex('books1', books1);
	      var fileList = ['books', 'books1'];
	      var searchIndex = invertedIndex.searchIndex('all', 'and');
	      searchIndex.forEach(function (file) {
	        expect(fileList).toContain(Object.keys(file)[0]);
	      });
	      expect(Array.isArray(searchIndex)).toBeTruthy();
	    });
	    it('should return null if a word is not found in a file', function () {
	      invertedIndex.createIndex('books', books);
	      invertedIndex.createIndex('books1', books1);
	      var searchIndex = invertedIndex.searchIndex('all', 'because');
	      expect(searchIndex[0].books.because).toBe(null);
	      expect(searchIndex[1].books1.because).toBe(null);
	    });
	    it('should return search results for a number of arguments', function () {
	      invertedIndex.createIndex('books', books);
	      invertedIndex.createIndex('books1', books1);
	      var searchIndex = invertedIndex.searchIndex('all', 'because', ['angela', 'Nigeria', 'and'], 'alice');
	      expect(searchIndex[0].books.because).toBe(null);
	      expect(searchIndex[1].books1.because).toBe(null);
	      expect(searchIndex[0].books.and).toEqual([0, 1]);
	    });
	    it('should return an array containing the indexes of the search parameter in the selected file', function () {
	      invertedIndex.createIndex('books', books);
	      invertedIndex.createIndex('books1', books1);
	      var searchIndex = invertedIndex.searchIndex('books', 'and');
	      var searchIndex2 = invertedIndex.searchIndex('books1', 'and');
	      expect(searchIndex[0].books.and).toEqual([0, 1]);
	      expect(Object.keys(searchIndex[0]).length).toBe(1);
	      expect(searchIndex2[0].books1.and).toEqual([0, 1]);
	      expect(Object.keys(searchIndex2[0]).length).toBe(1);
	    });
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = [
		{
			"title": "Alice in Wonderland",
			"text": "Alice falls into a rabbit hole and enters a world full of imagination."
		},
		{
			"title": "The Lord of the Rings: The Fellowship of the Ring.",
			"text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
		}
	];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = [
		{
			"title": "Harry Porter and the prisoner of azkaban",
			"text": "Harry porter tries to eat rice and beans in the prisoner of azkaban."
		},
		{
			"title": "The wizard of OZ.",
			"text": "A wizard comes to town with a powerful ring and falls into a rabbit hole."
		}
	];

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = [];

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
		"file1": {
			"title": "Alice in Wonderland",
			"text": "Alice falls into a rabbit hole and enters a world full of imagination."
		},
		"file2": {
			"title": "The Lord of the Rings: The Fellowship of the Ring.",
			"text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
		}
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = [
		[
			{
				"file1": {
					"title": "Alice in Wonderland",
					"text": "Alice falls into a rabbit hole and enters a world full of imagination."
				}
			}
		],
		[
			{
				"file2": {
					"title": "The Lord of the Rings: The Fellowship of the Ring.",
					"text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
				}
			}
		]
	];

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map