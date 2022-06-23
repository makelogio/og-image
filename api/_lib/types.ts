export type FileType = "png" | "jpeg";

export interface ParsedRequest {
  fileType: FileType;
  fontSize: string;
  textWidth: string;
  pb: string;
  text: string;
  logoURL: string;
  bg: string;
  color: string;
}
