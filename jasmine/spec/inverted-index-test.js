/* global InvertedIndex */
const jsonFile = require('../books');
const jsonFile1 = require('../books1');
const emptyJson = require('../empty');
const badJson = require('../bad');
const deepFile = require('../multi-array');

describe('Inverted Index', () => {
  const invertedIndex = new InvertedIndex();
  const books = jsonFile;
  const books1 = jsonFile1;
  const empty = emptyJson;
  const badFile = badJson;

  afterEach(() => {
    invertedIndex.indexes = {};
  });

  it('should be truthy for the instance of the class', () => {
    const indexInstance = invertedIndex;
    expect(invertedIndex instanceof InvertedIndex).toBeTruthy();
  });

  it('should return zero for the length of indexes', () => {
    const indexInstance = invertedIndex;
    expect(Object.keys(invertedIndex.indexes).length).toBe(0);
  });

  describe('Read book data', () => {
    it('should read the content of a json file and return false if the file is empty', () => {
      const book = [];
      const isValid = invertedIndex.readFileData(book);
      expect(isValid).toBe(false);
    });
    it('should read the content of a json file and return true if the file matches the format', () => {
      const isValid = invertedIndex.readFileData(books);
      expect(isValid).toBe(true);
    });
    it('should return false if the content of the file is not an array of object', () => {
      const isValid = invertedIndex.readFileData(badFile);
      expect(isValid).toBe(false);
    });
    it('should return false if the content of the file is a multi-dimensional array', () => {
      const wrongFormat = invertedIndex.readFileData(deepFile);
      expect(wrongFormat).toBe(false);
    });
  });

  describe('Populate index', () => {
    beforeEach(() => {
      invertedIndex.createIndex('books', books);
    });

    it('should create the index once the file has been read', () => {
      expect(invertedIndex.indexes.books).toBeDefined();
    });
    it('should return an object of all created index', () => {
      const bookIndex = invertedIndex.indexes.books;
      const bookKeys = Object.keys(bookIndex);
      bookKeys.forEach((key) => {
        expect({}.hasOwnProperty.call(bookIndex, key)).toBeTruthy();
      });
    });
    it('should return an array that contains the indexes of a word', () => {
      expect(invertedIndex.indexes.books.and).toEqual([0, 1]);
      expect(invertedIndex.indexes.books.of).toEqual([0, 1]);
    });
    it('should return false if the file Content is Empty', () => {
      const emptyIndex = invertedIndex.createIndex('empty', empty);
      expect(emptyIndex).toBe(false);
    });
    it('should not create the index again if the file has been uploaded before', () => {
      invertedIndex.createIndex('books', books);
      expect(Object.keys(invertedIndex.indexes).length).toBe(1);
    });
  });

  describe('Get Index', () => {
    it('should get the indexes of a particular uploaded file', () => {
      invertedIndex.createIndex('books', books);
      const getIndex = invertedIndex.getIndex('books');
      expect(getIndex).toBeDefined();
    });
    it('should return an empty object for an uploaded file that has not been indexed', () => {
      const getIndex = invertedIndex.getIndex('books');
      expect(getIndex).toEqual({});
    });
    it('should the length of all indexed file', () => {
      invertedIndex.createIndex('books', books);
      invertedIndex.createIndex('books1', books1);
      const getIndex = invertedIndex.getIndex();
      expect(Object.keys(getIndex).length).toBe(2);
    });
    it('should return undefined if no index has been created for a file', () => {
      invertedIndex.createIndex('books', books);
      const getIndex = invertedIndex.getIndex('book3');
      expect(getIndex).toBeUndefined();
    });
  });

  describe('Search Index', () => {
    it('should return an array containing the index of a word', () => {
      invertedIndex.createIndex('books', books);
      const searchIndex = invertedIndex.searchIndex('books', 'and');
      expect(searchIndex[0].books.and).toEqual([0, 1]);
    });
    it('should return null for a word not found in the file', () => {
      invertedIndex.createIndex('books', books);
      const searchIndex = invertedIndex.searchIndex('books', 'because');
      expect(searchIndex[0].books.because).toBe(null);
    });
    it('should return an array of Objects with keys of all the files searched', () => {
      invertedIndex.createIndex('books', books);
      invertedIndex.createIndex('books1', books1);
      const fileList = ['books', 'books1'];
      const searchIndex = invertedIndex.searchIndex('all', 'and');
      searchIndex.forEach((file) => {
        expect(fileList).toContain(Object.keys(file)[0]);
      });
      expect(Array.isArray(searchIndex)).toBeTruthy();
    });
    it('should return null if a word is not found in a file', () => {
      invertedIndex.createIndex('books', books);
      invertedIndex.createIndex('books1', books1);
      const searchIndex = invertedIndex.searchIndex('all', 'because');
      expect(searchIndex[0].books.because).toBe(null);
      expect(searchIndex[1].books1.because).toBe(null);
    });
    it('should return search results for a number of arguments', () => {
      invertedIndex.createIndex('books', books);
      invertedIndex.createIndex('books1', books1);
      const searchIndex = invertedIndex.searchIndex('all', 'because', ['angela', 'Nigeria', 'and'], 'alice');
      expect(searchIndex[0].books.because).toBe(null);
      expect(searchIndex[1].books1.because).toBe(null);
      expect(searchIndex[0].books.and).toEqual([0, 1]);
    });
    it('should return an array containing the indexes of the search parameter in the selected file', () => {
      invertedIndex.createIndex('books', books);
      invertedIndex.createIndex('books1', books1);
      const searchIndex = invertedIndex.searchIndex('books', 'and');
      const searchIndex2 = invertedIndex.searchIndex('books1', 'and');
      expect(searchIndex[0].books.and).toEqual([0, 1]);
      expect(Object.keys(searchIndex[0]).length).toBe(1);
      expect(searchIndex2[0].books1.and).toEqual([0, 1]);
      expect(Object.keys(searchIndex2[0]).length).toBe(1);
    });
  });
});
