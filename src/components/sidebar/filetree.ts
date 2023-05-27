import { File } from '~/types/types';
import FileMetadata from './fileMetadata';

export default class FileTree {
  name: string;
  children: FileTree[];
  childrenMap: Map<string, FileTree>;
  files: FileMetadata[]; 

  constructor(name: string) {
    this.name = name;
    this.children = new Array<FileTree>(); 
    this.childrenMap = new Map<string, FileTree>(); // TODO: look into hashmapping this?
    this.files = new Array<FileMetadata>(); 
  }

  addFile(file: File, options?: any) {
    const metadata: FileMetadata = new FileMetadata(file.docName, file.url);
    const names: string[] = file.docName.split("/");
    if (names.length == 1) {
      this.files.push(metadata);
      return this;

    } else if (names.length > 1) {
      const dirName: string = names[0] ? names[0] : "formatting error";
      var directory: FileTree | undefined = this.childrenMap.get(dirName);
      if (!this.childrenMap.get(dirName)) {
        directory = new FileTree(dirName);
        this.children.push(directory);
        this.childrenMap.set(dirName, directory);  
      } 
      directory?.addFile({
        docId: file.docId,
        url: file.url,
        docName: names.slice(1).join("/"),
      });
    }
    return this;
  }
}
