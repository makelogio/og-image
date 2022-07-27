import core from "puppeteer-core";
import { getOptions } from "./options";
import { FileType } from "./types";
let _page: core.Page | null;

async function getPage(isDev: boolean) {
  if (_page) {
    return _page;
  }
  const options = await getOptions(isDev);
  const browser = await core.launch(options);
  _page = await browser.newPage();
  return _page;
}

export async function getScreenshot(
  html: string,
  type: FileType,
  isDev: boolean
) {
  const page = await getPage(isDev);

  await page.setViewport({ width: 2048, height: 1170 });
  await page.setContent(html);

  const scaledImage = await page.$(".featured-image");

  if (scaledImage) {
    const imageTooBig = await scaledImage.evaluate((el) => {
      const divEl = el as HTMLDivElement;

      const imageWidth = divEl.getBoundingClientRect().width;
      const imageHeight = divEl.getBoundingClientRect().height;

      if (imageWidth > 2048 || imageHeight > 1170) {
        return true;
      }
      return false;
    });

    const imageScaler = await page.$(".featured-image-scale");
    if (imageScaler && imageTooBig) {
      await imageScaler.evaluate((el) => {
        const divEl = el as HTMLDivElement;
        divEl.style.transform = "scale(1)";
      });
    }
  }
  const file = await page.screenshot({ type });
  return file;
}
