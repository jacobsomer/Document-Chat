export default class FileMetadata {
  loading: boolean;
  docName: string;
  url: string;
  deleteFile: (url: string) => Promise<void>;
  size?: number;

  constructor(docName: string, url: string) {
    this.loading = true;
    this.docName = docName;
    this.url = url;
    this.deleteFile = async () => {};
    this.size = 0;
  }

  finishLoading() {
    console.log("finished loading")
    this.loading = false;
  }
}
