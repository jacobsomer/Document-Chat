import { FiUpload } from 'react-icons/fi';

interface Props {
  isMobile: boolean;
  directoryUpload: boolean | undefined;
  setToolTipString: (tooltip: string) => void;
}

export const AddMediaButton = (props: Props) => {
  return (
    <div>
      {props.isMobile ? (
        <label
          htmlFor="my-modal-2"
          className="btn-lg avatar btn btn mb-10 rounded-md px-4  py-2 text-2xl"
          onClick={() => {
            props.setToolTipString('');
          }}
        >
          <FiUpload />
          &nbsp;&nbsp;Add Media
        </label>
      ) : (
        <label
          htmlFor="my-modal-2"
          className="btn-ghost avatar btn text-base-content"
          onClick={() => {
            props.setToolTipString('');
          }}
        >
          <FiUpload />
          &nbsp;&nbsp;Add {props.directoryUpload ? 'Folder' : 'Files'}
        </label>
      )}
    </div>
  );
};
