export type FileType = "png" | "jpeg";

export interface ParsedRequest {
  fileType: FileType;
  fontSize: string;
  text: string;
  logoURL: string;
  bg: string;
  color: string;
}
