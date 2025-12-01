import Cookie from "./cookie"

export type httpRequest = {
  url: string,
  headers: Map<string, string>,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "OPTIONS",
  body: string
  cookie: Cookie
}

export type httpResponse = {
  status: number,
  body: string,
  header: Record<string, string>
}
