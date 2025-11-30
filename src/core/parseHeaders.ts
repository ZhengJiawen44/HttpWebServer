/*
* func to construct a header object from an array of string key value pairs 
*/
export default function parseHeaders(headerList: string[]): Map<string, string | string[]> {
  const ACCEPT_HEADERS = ["Accept-Language", "Accept-Encoding", "Accept"]
  const headerStore = new Map<string, string | string[]>();
  headerList.forEach(header => {
    const idx = header.indexOf(":");
    const key = header.slice(0, idx);
    const value = header.slice(idx + 1).trim();
    headerStore.set(key, value);
  });
  ACCEPT_HEADERS.forEach((header) => parseAcceptTypes(headerStore, header));
  return headerStore;
}

function parseAcceptTypes(headerStore: Map<string, string | string[]>, targetHeader: string) {
  const rawTypes = headerStore.get(targetHeader);
  if (rawTypes && typeof rawTypes == "string") {
    headerStore.set(targetHeader, sortTypes(rawTypes.replace(/\s+/g, "").split(",")));
  }
}

function sortTypes(types: string[]): string[] {
  const typesWithWeight: [string, number][] = types.map((e) => {
    const weight = e.split(";")[1]?.split("=")[1] ?? 1.0;
    const type = e.split(";")[0];
    return [type, +weight] as [string, number];
  }).sort((a, b) => {
    return b[1] - a[1];
  });
  const sortedTypes = typesWithWeight.filter(([_, weight]) => weight !== 0).map(([type, _]) => type);
  return sortedTypes;
}



