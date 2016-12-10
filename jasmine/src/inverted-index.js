/* eslint class-methods-use-this: "off" */

/**
 *  InvertedIndex class constructor
 *  @class
 */

class InvertedIndex {
  /**
   *  class constructor
   *  @constructor
   */
  constructor() {
    this.indexes = {};
  }


  /**
   * converts the string provided to lower case, strips the string of all
   * special characters, extra spaces and converts the result into an Array
   * @param {string} text the text to be converted
   * @returns {Array} the result that will be returned after function call
   */
  textToArray(text) {
    const result = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    return result;
  }

  /**
   * check the documents in the uploaded file and returns
   * the content of the file in a tokenized format
   * @param {Array} file the content of the file
   * @returns {Array} returns array
   */
  tokenizeFile(file) {
    const fileContent = [];
    for (let i = 0; i < file.length; i += 1) {
      if (file[i].title && file[i].text) {
        const text = `${file[i].title} ${file[i].text}`;
        const fileDoc = this.textToArray(text);
        fileContent.push(fileDoc);
      }
    }
    return fileContent;
  }

  /**
   * checks the content of the uploaded json file and returns
   * true if the file follows the allowed format
   * @param {Array} file the content of the file
   * @returns {boolean} returns a boolean
   */
  readFileData(file) {
    if (!Array.isArray(file) || file.length < 1) {
      return false;
    }
    for (let i = 0; i < file.length; i += 1) {
      if (!file[i].title || !file[i].text) {
        return false;
      }
    }
    return true;
  }

  /**
   * loops through an array and removes duplicate elements
   * @param {string} bookName the name of the file to index
   * @param {Array} items the array to loop through
   * @param {number} element the index of the word of the Array
   * @returns {Array}
   */
  sortDocument(bookName, items, element) {
    element = parseInt(element, 10);
    for (let item = 0; item < items.length; item += 1) {
      if (!this.indexes[bookName][items[item]]) {
        this.indexes[bookName][items[item]] = [];
        this.indexes[bookName][items[item]].push(element);
      } else if (
        this.indexes[bookName][items[item]] &&
        !this.indexes[bookName][items[item]].includes(element)) {
        this.indexes[bookName][items[item]].push(element);
      }
    }
  }

  /**
   * @function takes a file path as argument and read the contents of the file
   * @param {string} name the name of the file
   * @param {array} content the content of the file
   * @returns {object}
   */
  createIndex(name, fileContent) {
    const readFile = this.readFileData(fileContent);
    if (!readFile) {
      return false;
    }
    if (!this.indexes[name]) {
      const tokenize = this.tokenizeFile(fileContent);
      this.indexes[name] = {};
      for (let i = 0; i < tokenize.length; i += 1) {
        const textIndex = tokenize[i];
        this.sortDocument(name, textIndex, i);
      }
    } else {
      return 'You have uploaded this file before';
    }
  }


  /**
   * @function takes an indexed file as argument and return the indexes of the
   * file
   * @param {string} name the name of the file to get the index for
   * @returns {Object}
   */
  getIndex(name) {
    name = name || null;
    if (Object.keys(this.indexes).length < 1) {
      return {};
    } else if (name === null) {
      return this.indexes;
    }
    return this.indexes[name];
  }

  /**
   * @function searches for the given word(s) in a given file
   * @param {Object} file an Object with token as keys and array of index as values
   * @param {Array} terms an Array of word(s) to be searched for
   * @returns {Object}
   */
  searchAFile(file, terms, name) {
    let files = {};
    files[name] = {};
    for (let j = 0; j < terms.length; j += 1) {
      if (file[terms[j]]) {
        files[name][terms[j]] = file[terms[j]];
      } else {
        files[name][terms[j]] = null;
      }
    }
    return files;
  }

  /**
   * @function return an object that contains the index of the search
   * word and the files they can be found.
   * @param {Object} searchFile the objects of Object
   * @param {Array} terms an Array of word(s) to be searched for
   * @returns {Array}
   */
  searchAllFiles(searchFiles, terms) {
    const result = [];
    let file = {};
    let fileResult = {};
    const fileNames = Object.keys(searchFiles);
    for (let i = 0; i < fileNames.length; i += 1) {
      file = searchFiles[fileNames[i]];
      fileResult = this.searchAFile(file, terms, fileNames[i]);
      result.push(fileResult);
    }
    return result;
  }

  /**
   * @function takes an array and returns a sanitized version of the array
   * @param {string} terms
   * @returns {Array}
   */
  sortSearchTerms(searchTerms) {
    let searchTerm = [];
    for (let i = 0; i < searchTerms.length; i += 1) {
      if (Array.isArray(searchTerms[i])) {
        searchTerm = searchTerm.concat(searchTerms[i]);
      } else {
        searchTerm.push(searchTerms[i]);
      }
    }
    searchTerm = searchTerm.join(' ');
    const terms = this.textToArray(searchTerm);
    return terms;
   }

  /**
   * @function takes an array of arguments and returns an array of numbers that
   * represents the index of the words
   * @param {string} terms
   * @returns {Array}
   */
  searchIndex(name, ...searchTerms) {
    const terms = this.sortSearchTerms(searchTerms);
    name = name || 'all';
    let result = [];
    if (name === 'all') {
      const searchFiles = this.indexes;
      result = this.searchAllFiles(searchFiles, terms);
      return result;
    }
    const searchFile = this.indexes[name];
    const file = this.searchAFile(searchFile, terms, name);
    result.push(file);
    return result;
  }
}
