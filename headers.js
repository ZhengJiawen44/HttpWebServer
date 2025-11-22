
/*
* class to construct a header object from an array of string key value pairs 
* */
export default class Headers {
  constructor(headerList) {
    this.headerStore = new Map();
    headerList.forEach((header) => {
      const [key, value] = header.split(":");
      this.headerStore.set(key, value);
    });
    return this.headerStore;
  }
}
