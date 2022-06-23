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

  let fontSize = "";
  if (text.length > 40) {
    fontSize = "82px";
  } else if (text.length > 26) {
    fontSize = "96px";
  } else if (text.length > 12) {
    fontSize = "120px";
  } else {
    fontSize = "142px";
  }

  let textWidth = "75%";
  if (text.length > 45) {
    textWidth = "75%";
  }
  let pb = "275px";
  if (text.length > 70) {
    pb = "200px";
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    text: decodeURIComponent(text),
    fontSize,
    textWidth,
    pb,
    bg,
    color,
    logoURL,
  };

  return parsedRequest;
}
