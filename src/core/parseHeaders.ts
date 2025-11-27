/*
* func to construct a header object from an array of string key value pairs 
*/
export default function parseHeaders(headerList: string[]): Map<string, string | string[]> {
  const headerStore = new Map<string, string | string[]>();

  headerList.forEach(header => {
    const idx = header.indexOf(":");
    const key = header.slice(0, idx);
    const value = header.slice(idx + 1).trim();
    headerStore.set(key, value);
  });
  if (!headerStore.has("Accept-Encoding")) {
    return headerStore;
  }

  let encodingTypes = headerStore.get("Accept-Encoding");
  if (typeof encodingTypes == "string") {
    headerStore.set("Accept-Encoding", parseEncodingTypes(encodingTypes));
  }
  return headerStore;
}


/*
 * Parse Accept-Encoding into an array of encodings
 */
export function parseEncodingTypes(unparsedEncodingTypes: string): string[] {
  const encodings = unparsedEncodingTypes.replace(/\s+/g, "").split(",");
  return encodings
}

