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

  const encodingsWithWeight: [string, number][] = encodings.map((e) => {
    const weight = e.split(";")[1]?.split("=")[1] ?? 1.0;
    const encoding = e.split(";")[0];
    return [encoding, +weight] as [string, number];
  }).sort((a, b) => {
    return b[1] - a[1];
  });

  const sortedEncodings = encodingsWithWeight.map(([encoding, weight]) => {
    if (weight != 0) return encoding.toLowerCase();
  })


  return sortedEncodings;
}

