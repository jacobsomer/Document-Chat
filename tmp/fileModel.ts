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
    this.parentFileTree.fileMap.delete(this.docName);
  }

  finishLoading() {
    this.loading = false;
  }
}
