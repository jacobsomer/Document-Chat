import React from 'react';
import FileMetadata from './fileMetadata';
import FileComponent from '../drawer/fileComponent';
import { FileProgressDisplay } from '../drawer/fileProgressDisplay';

// A component to show
export const FileEntry = (props: { metadata: FileMetadata }) => {
  return (
    <div>
      <FileComponent
        name={props.metadata.docName}
        url={props.metadata.url}
        deleteFile={async () => {}}
        size={props.metadata.size}
      />
      <FileProgressDisplay loading={props.metadata.loading} />
    </div>
  );
};
