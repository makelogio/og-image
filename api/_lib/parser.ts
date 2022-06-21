import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { pathname, query } = parse(req.url || "/", true);
  const { branding } = query || {};

  if (!branding) {
    throw new Error("Expected org branding info");
  }

  const { logoURL, bg, color } = JSON.parse(
    Buffer.from(branding as string, "base64").toString("binary")
  );

  const arr = (pathname || "/").slice(1).split(".");
  let extension = "";
  let text = "";
  if (arr.length === 0) {
    text = "";
  } else if (arr.length === 1) {
    text = arr[0];
  } else {
    extension = arr.pop() as string;
    text = arr.join(".");
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    text: decodeURIComponent(text),
    fontSize:
      text.length > 40
        ? "72px"
        : text.length > 30
        ? "96px"
        : text.length > 24
        ? "120px"
        : "142px",
    bg,
    color,
    logoURL,
  };

  return parsedRequest;
}
