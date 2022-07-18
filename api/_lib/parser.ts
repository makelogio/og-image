import { IncomingMessage } from "http";
import { parse } from "url";
import { FeaturedImageRequest, TextImageRequest } from "./types";

const textImageRequestParser = (
  pathname: string,
  encodedQuery: string
): TextImageRequest => {
  const { logoURL, bg, color } = JSON.parse(
    Buffer.from(encodedQuery, "base64").toString("binary")
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

  let pb = "275px";
  if (text.length > 70) {
    pb = "200px";
  }

  const parsedRequest: TextImageRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    textInfo: {
      text: decodeURIComponent(text),
      fontSize,
      pb,
    },
    brandingInfo: {
      bg,
      color,
      logoURL,
    },
  };

  return parsedRequest;
};

const featuredImageRequestParser = (
  encodedQuery: string
): FeaturedImageRequest => {
  const { imageURL, bg } = JSON.parse(
    Buffer.from(encodedQuery, "base64").toString("binary")
  );

  const parsedRequest: FeaturedImageRequest = {
    fileType: "png",
    imageURL,
    bg,
  };

  return parsedRequest;
};

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { pathname, query } = parse(req.url || "/", true);
  if (!query) {
    throw new Error("Expected query params");
  }

  const { branding, featuredImage } = query as {
    branding?: string;
    featuredImage?: string;
  };

  if (featuredImage) {
    return featuredImageRequestParser(featuredImage);
  } else if (branding) {
    return textImageRequestParser(pathname ?? "", branding);
  }

  return null;
}
