import FileTree from "../fileTree/fileTreeModel";

export default class FileMetadata {
  loading: boolean;
  docName: string;
  url: string;
  size?: number;
  parentFileTree: FileTree;
  isDeleted: boolean;

  constructor(docName: string, url: string, parentFileTree: FileTree) {
    this.loading = true;
    this.docName = docName;
    this.url = url;
    this.size = 0;
    this.parentFileTree = parentFileTree;
    this.isDeleted = false;
  }

  deleteFile() {
    this.isDeleted = true;
  }

  // TODO: figure out if we want to "delete" the file and have options to recover it,
  // or if we are going to try to deeply remove it from Langchain.
  undeleteFile() {
    this.isDeleted = false;
  }

  finishLoading() {
    console.log("loading finished");
    this.loading = false;
  }
}
