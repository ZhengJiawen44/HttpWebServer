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
  parseAcceptEncoding(headerStore);
  return headerStore;
}

function parseAcceptEncoding(headerStore: Map<string, string | string[]>) {
  const encodingTypes = headerStore.get("Accept-Encoding");
  if (encodingTypes && typeof encodingTypes == "string") {
    headerStore.set("Accept-Encoding", parseEncodingTypes(encodingTypes));
  }
}

export function parseEncodingTypes(unparsedEncodingTypes: string): string[] {
  const encodings = unparsedEncodingTypes.replace(/\s+/g, "").split(",");
  encodings.sort((a, b) => {
    const weightA = a.split(";")[1]?.split("=")[1] ?? 1.0;
    const weightB = b.split(";")[1]?.split("=")[1] ?? 1.0;
    return +weightB - +weightA;
  })
  return encodings.map((e) => e.split(";")[0].toLowerCase());
}

