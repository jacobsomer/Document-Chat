export interface Props {
  isMobile: boolean;
}

export const AddDataHeader = (props: Props) => {
  return (
    <>
      {props.isMobile ? (
        <>
          <label
            htmlFor="my-modal-2"
            className="btn-circle btn-lg btn absolute right-2 top-2 text-3xl"
            id="closeModal"
          >
            ✕
          </label>

          <h3 className="font-base-content text-3xl">Press To Add Data</h3>
        </>
      ) : (
        <>
          <label
            htmlFor="my-modal-2"
            className="btn-sm btn-circle btn absolute right-2 top-2"
            id="closeModal"
          >
            ✕
          </label>
          <h3 className="font-base-content text-lg">Add Data</h3>
        </>
      )}
    </>
  );
};
