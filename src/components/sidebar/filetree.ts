import { File } from '~/types/types';
import FileMetadata from './fileMetadata';
import formidable from 'formidable';

export default class FileTree {
  name: string;
  parent: FileTree | null;
  children: FileTree[];
  childrenMap: Map<string, FileTree>;
  files: FileMetadata[]; 

  constructor(name: string, parent?: FileTree) {
    this.name = name;
    this.parent = parent ? parent : null;
    this.children = new Array<FileTree>(); 
    this.childrenMap = new Map<string, FileTree>(); // TODO: look into hashmapping this?
    this.files = new Array<FileMetadata>(); 
  }

  addFile(file: File, options?: any) {
    const names: string[] = file.docName.split("/");
    const metadata: FileMetadata = new FileMetadata(file.docName, file.url, this);

    if (names.length == 1) {
      this.files.push(metadata);
      // TODO: possible edge case of re-adding a file with the same name of a deleted one. Just
      // ensure that the objects don't interfere and that isDeleted is fully implemented.
      
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
    return metadata;
  }

  reconstruct() {
    // TODO: actually delete files that are marked with a DeleteFlag, it is better to wait for
    // a bunch of these to batch-delete cron job style. This would also be an entry point to
    // "reset" Langchain's embeddings after figuring out which files to delete.
  }
}
