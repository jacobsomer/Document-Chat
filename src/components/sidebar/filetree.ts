import FileMetadata from './fileMetadata';

export default class FileTree {
  name: string;
  isDirectory: boolean;
  children: Map<string, FileTree>;
  fileMetadata: FileMetadata;

  constructor() {
    this.isDirectory = false;
    this.children = new Map<string, FileTree>();
    this.fileMetadata = new FileMetadata();
  }

  addDirectory(name: string) {

  }

  addFileMetadata(splitPath: Array<string>, fileMetadata: FileMetadata) {
    // 1. Split the path name

    // 2. If path name is in this.children, call 
  }
}
