/*
* func to construct a header object from an array of string key value pairs 
* */
export default function parseHeaders(headerList: string[]) {
  let headerStore = new Map();
  headerList.forEach((header) => {
    const [key, value] = header.split(":");
    headerStore.set(key, value);
  });
  return headerStore;
}
