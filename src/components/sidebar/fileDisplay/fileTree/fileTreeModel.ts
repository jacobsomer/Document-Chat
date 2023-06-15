import { File } from '~/types/types';
import FileMetadata from '../file/fileModel';
import formidable from 'formidable';

export default class FileTree {
  name: string;
  parent: FileTree | null;
  children: FileTree[];
  childrenMap: Map<string, FileTree>;
  files: FileMetadata[]; 
  isDeleted: boolean;

  constructor(name: string, parent?: FileTree) {
    this.name = name;
    this.parent = parent ? parent : null;
    this.children = new Array<FileTree>(); 
    this.childrenMap = new Map<string, FileTree>(); // TODO: look into hashmapping this?
    this.files = new Array<FileMetadata>(); 
    this.isDeleted = false;
  }

  addFile(file: File, options?: any) {
    const names: string[] = file.docName.split("/");
    const metadata: FileMetadata = new FileMetadata(file.docName, file.url, this);

    if (names.length == 1) {
      this.files.push(metadata);
      return metadata;
      // TODO: possible edge case of re-adding a file with the same name of a deleted one. Just
      // ensure that the objects don't interfere and that isDeleted is fully implemented.
      
    } else if (names.length > 1) {
      const dirName: string = names[0] ? names[0] : "formatting error";
      var directory: FileTree | undefined = this.childrenMap.get(dirName);
      if (!this.childrenMap.get(dirName)) {
        directory = new FileTree(dirName, this);
        this.children.push(directory);
        this.childrenMap.set(dirName, directory); 
      } 
      if (directory) {
        return directory.addFile({
          docId: file.docId,
          url: file.url,
          docName: names.slice(1).join("/"),
        });  
      } else {
        return metadata;
      }
    }
  }

  delete() {
    this.isDeleted = true;
  }

  getSize() {
    var total: number = 0;
    this.files.forEach((file) => {total += file.size ? file.size : 0;})
    this.children.forEach((filetree) => {total += filetree.getSize();})
    return total;
  }

  isLoading() {
    var loading = false;
    this.files.forEach((file: FileMetadata) => {
      if (file.loading) loading = true;
    })
    this.children.forEach((filetree: FileTree) => {
      if (filetree.isLoading()) loading = true;
    })
    return loading;
  }

  reconstruct() {
    // TODO: actually delete files that are marked with a DeleteFlag, it is better to wait for
    // a bunch of these to batch-delete cron job style. This would also be an entry point to
    // "reset" Langchain's embeddings after figuring out which files to delete.
  }
}
