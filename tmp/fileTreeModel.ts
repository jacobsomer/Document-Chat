import { FileModelProps } from '~/types/types';
import FileModel from '../file/fileModel';

export default class FileTree {
  name: string;
  parent: FileTree | null;
  childrenMap: Map<string, FileTree>;
  childrenList: FileTree[];
  fileMap: Map<string, FileModel>;
  fileList: FileModel[];
  isDeleted: boolean;
  isFilesCached: boolean;
  isDirectoriesCached: boolean;

  constructor(name: string, parent?: FileTree) {
    this.name = name;
    this.parent = parent ? parent : null;
    this.childrenList = new Array<FileTree>(); 
    this.childrenMap = new Map<string, FileTree>(); 
    this.fileList = new Array<FileModel>(); 
    this.fileMap = new Map<string, FileModel>(); 
    this.isFilesCached = false;
    this.isDirectoriesCached = false;

    this.isDeleted = false;
  }

  // Return a list for easy file iteration
  getFiles(): Array<FileModel> {
    if (!this.isFilesCached) {
      this.fileList = new Array<FileModel>();
      this.fileMap.forEach((value, key) => {
        this.fileList.push(value);
      })
      this.isFilesCached = true;
    } 
    return this.fileList;
  }

  // Return a list for easy file iteration
  getDirectories(): Array<FileTree> {
    if (!this.isDirectoriesCached) {
      this.childrenList = new Array<FileTree>();
      this.childrenMap.forEach((value, key) => {
        this.childrenList.push(value);
      })
      this.isDirectoriesCached = true;
    } 
    return this.childrenList;
  }

  getSize(): number {
    var total: number = 0;
    this.getFiles().forEach((file) => {total += file.size ? file.size : 0;})
    this.getDirectories().forEach((filetree) => {total += filetree.getSize();})
    return total;
  }

  isLoading(): boolean {
    var loading = false;
    this.getFiles().forEach((file: FileModel) => {
      if (file.loading) loading = true;
    })
    this.getDirectories().forEach((filetree: FileTree) => {
      if (filetree.isLoading()) loading = true;
    })
    return loading;
  }

  addFile(fileModelProps: FileModelProps, options?: any): FileModel {
    const names: string[] = fileModelProps.docName.split("/");
    const metadata: FileModel = new FileModel(fileModelProps, this);
    const dirName: string = names[0] ? names[0] : "formatting error"; // TODO: handle this error better

    if (names.length == 1) {
      this.fileMap.set(dirName, metadata);
      this.isFilesCached = false;
      return metadata; 

    } else {
      var directory: FileTree | undefined = this.childrenMap.get(dirName) || this.addDirectory(dirName);
      return directory ? directory.addFile({
        docId: fileModelProps.docId,
        url: fileModelProps.url,
        docName: names.slice(1).join("/"),
        sourceFile: fileModelProps.sourceFile,
        chatId: fileModelProps.chatId,
        updateFiles: fileModelProps.updateFiles,
      },) : metadata;
    }
  }

  addDirectory(dirName: string, options?: any): FileTree {
    const directory = new FileTree(dirName, this);
    this.childrenMap.set(dirName, directory); 
    this.isDirectoriesCached = false;
    return directory;
  }

  async deleteSelf(): Promise<boolean> {
    if (this.parent) {
      this.parent.childrenMap.delete(this.name);
      this.parent.isDirectoriesCached = false;
    }
    for (const file of this.getFiles()) {
      await file.deleteFile();
    }
    this.isDeleted = true;
    this.isFilesCached = false;
    this.isDirectoriesCached = false;
    return true;
  }
}
