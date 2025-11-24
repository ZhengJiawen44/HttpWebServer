export type httpRequest = {
  url: string,
  headers: Map<string, string>,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "OPTIONS",
  body: string
}

export type httpResponse = {
  status: number,
  body: string,
  header: Record<string, string>
}
