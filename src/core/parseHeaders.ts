/*
* func to construct a header object from an array of string key value pairs 
* */
export default function parseHeaders(headerList: string[]): Map<string, string> {
  let headerStore = new Map();
  headerList.forEach((header) => {
    let separator = header.indexOf(":");
    const key = header.slice(0, separator);
    const value = header.slice(separator + 1);
    headerStore.set(key, value);
  });
  return headerStore;
}
