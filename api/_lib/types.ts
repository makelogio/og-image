export type FileType = "png" | "jpeg";

export interface TextInfo {
  fontSize: string;
  pb: string;
  text: string;
}

export interface BrandingInfo {
  logoURL: string;
  bg: string;
  color: string;
}

export type TextImageRequest = {
  fileType: FileType;
  textInfo: TextInfo;
  brandingInfo: BrandingInfo;
};

export type FeaturedImageRequest = {
  fileType: FileType;
  imageURL: string;
  bg?: string;
};

export type ParsedRequest = TextImageRequest | FeaturedImageRequest;
