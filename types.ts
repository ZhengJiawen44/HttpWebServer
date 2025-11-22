type httpRequest = {
  url: string,
  headers: Map<string, string>,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "OPTIONS",
  body: string
}

type httpResponse = {
  status: number,
  body: string,
  header: Record<string, string>
}
