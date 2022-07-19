import { readFileSync } from "fs";
import { sanitizeHtml } from "./sanitizer";
import {
  BrandingInfo,
  FeaturedImageRequest,
  ParsedRequest,
  TextImageRequest,
  TextInfo,
} from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(
  `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString("base64");

const medium = readFileSync(
  `${__dirname}/../_fonts/Inter-Medium.woff2`
).toString("base64");
const semibold = readFileSync(
  `${__dirname}/../_fonts/Inter-SemiBold.woff2`
).toString("base64");
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
  "base64"
);
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  "base64"
);

interface CssOptions {
  textInfo?: TextInfo;
  brandingInfo?: BrandingInfo;
  gradient?: string;
}

function getCss({ textInfo, brandingInfo, gradient }: CssOptions) {
  let background = brandingInfo?.bg ?? "";
  let foreground = brandingInfo?.color ?? "";

  let textInfoCSS = "";
  if (textInfo) {
    textInfoCSS = `
      .heading-wrapper {
        max-width: 75%;
        text-align: start;
        align-items: center;
        justify-content: center;
        word-break: break-word;
        padding-left: 104px; 
        padding-bottom: ${textInfo.pb};
      }

    .heading {
        font-family: 'Inter', sans-serif;
        font-size: ${sanitizeHtml(textInfo.fontSize)};
        font-style: normal;
        font-weight: 500;
        color: ${foreground};
        line-height: 1.8;
    }`;
  }

  return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
      font-family: 'Inter';
      font-style:  normal;
      font-weight: 500;
      src: url(data:font/woff2;charset=utf-8;base64,${medium}) format('woff2');
  }

    @font-face {
      font-family: 'Inter';
      font-style:  normal;
      font-weight: 600;
      src: url(data:font/woff2;charset=utf-8;base64,${semibold}) format('woff2');
  }
    
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

      * {
      border-width: 0;
      border-style: solid;
      box-sizing: border-box;
      }

    body {
      background: ${background};
      background-image: ${gradient};
      height: 100vh;
      display: flex;
      width: 100%;
      margin: 0px;
    }

    .content-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      position: relative;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
      position: absolute;
      left: 96px;
      top: 148px;
      max-width: 30%;
    }

    .logo {
      height: auto; 
      width: 450px; 
    }


    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
      margin: 175px;
    }    

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    ${textInfoCSS}

    .featured-image-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 48px 96px;
    }

    .featured-image {
      object-fit: contain;
      width: 100%;
      height: auto;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
  let textImageReq: TextImageRequest | undefined;
  let featuredImageReq: FeaturedImageRequest | undefined;

  if ("textInfo" in parsedReq) {
    textImageReq = parsedReq as TextImageRequest;
  } else {
    featuredImageReq = parsedReq as FeaturedImageRequest;
  }

  let textImageReqHTML = "";

  if (textImageReq) {
    textImageReqHTML = `
      <div class="content-wrapper">

          <div class="logo-wrapper">
            ${getImage(textImageReq.brandingInfo.logoURL)}
          </div>

          <div class="heading-wrapper">
            <div class="heading">
            ${emojify(sanitizeHtml(textImageReq.textInfo.text))}
            </div>
          </div>
      </div>

  `;
  }

  let featuredImageReqHTML = "";

  if (featuredImageReq) {
    featuredImageReqHTML = `
      <div class="featured-image-wrapper">
      
      <img src=${featuredImageReq.imageURL} class="featured-image"/>
      </div>
  `;
  }

  return `
  <!DOCTYPE html>
      <html>
        <meta charset="utf-8">
        <title>Generated Image</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            ${getCss({
              textInfo: textImageReq?.textInfo,
              brandingInfo: textImageReq?.brandingInfo,
              gradient: featuredImageReq?.bg,
            })}
        </style>
        <body>
           
            ${textImageReqHTML}

            ${featuredImageReqHTML}
        </body>
    </html>`;
}

function getImage(src: string, width = "auto", height = "90px") {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}
