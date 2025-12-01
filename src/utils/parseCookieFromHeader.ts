import Cookie from "../core/cookie.ts";

export default function parseCookiefromHeader(cookieHeader: string) {
  const cookieStore = new Cookie();
  cookieHeader.replace(" ", "").split(";").forEach((raw) => {
    const [key, value] = raw.split("=");
    cookieStore.set(key, value);
  });
  return cookieStore;
}
