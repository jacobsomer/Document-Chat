export default class FileMetadata {
  loading: boolean;
  name: string;
  url: string;
  deleteFile: (url: string) => Promise<void>;
  size?: number;

  constructor() {
    this.loading = false;
    this.name = '';
    this.url = '';
    this.deleteFile = async () => {};
    this.size = 0;
  }

  finishLoading() {
    this.loading = true;
  }
}
