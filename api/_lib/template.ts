import { readFileSync } from "fs";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";

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

function getCss(bg: string, color: string, fontSize = "96px", pb: string) {
  let background = bg;
  let foreground = color;

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

    body {
        background: ${background};
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
      width: 100%;

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
    .heading-wrapper {
      max-width: 50%;
      text-align: start;
        align-items: center;
        justify-content: center;
        word-break: break-word;
        padding-left: 104px; 
        padding-bottom: ${pb};
    }


    .heading {
        font-family: 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        font-weight: 500;
        color: ${foreground};
        line-height: 1.8;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, bg, logoURL, color, fontSize, pb } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(bg, color, fontSize, pb)}
    </style>
    <body>
        <div class="content-wrapper">
            <div class="logo-wrapper">
                ${getImage(logoURL)}
            </div>
            <div class="heading-wrapper">
            <div class="heading">${sanitizeHtml(text)}
            </div>
            </div>

        </div>
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
