import { deleteFile } from "~/apiEndpoints/frontend/deleteFile";
import FileTree from "../fileTree/fileTreeModel";
import { FileModelProps } from "tmp/types";

export default class FileModel {
  loading: boolean;
  docName: string;
  url: string;
  size?: number;
  parentFileTree: FileTree;
  sourceFile?: File;
  chatId: string;
  updateFiles: (chatId: string) => Promise<void>;
  isDeleted: boolean;
  isUrl: boolean;

  constructor(props: FileModelProps, parentFileTree: FileTree) {
    this.sourceFile = props.sourceFile;
    this.chatId = props.chatId;
    this.updateFiles = props.updateFiles;
    this.docName = props.docName;
    this.url = props.url;

    this.parentFileTree = parentFileTree;
    this.loading = true;
    this.size = 0;
    this.isDeleted = false;
    this.isUrl = props.sourceFile ? true : false;
  }

  addUrl(url: string) {
    this.url = url;
  }

  async deleteFile() {
    this.isDeleted = true;
    await deleteFile({
      url: this.url,
      chatId: this.chatId,
      updateFiles: this.updateFiles,
      successCallback: async () => {},
      clientErrorCallback: async () => {},
      serverErrorCallback: async () => {},
    });
    this.parentFileTree.fileMap.delete(this.docName);
  }

  finishLoading() {
    this.loading = false;
  }
}
