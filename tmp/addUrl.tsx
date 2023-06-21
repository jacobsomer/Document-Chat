export interface Props {
    isMobile: boolean,
    input: string;
    handleUrlUpload: (e: Event) => void;
    setInput: (e: string) => void;
}

export const AddUrl = (props: Props) => {
  return (
    <>
      {props.isMobile ? (
        <>
          <p className="text-3xl">Enter URL:</p>
          <div className="flex gap-x-4">
            <input
              placeholder="ex. https://www.youtube.com/watch?v=qbIk7-JPB2c"
              className="input-bordered input w-full"
              type="text"
              value={props.input}
              onInput={(e) => props.setInput((e.target as HTMLTextAreaElement).value)}
            />
            <button
              type="submit"
              className="btn-primary btn"
              onClick={(e) => void props.handleUrlUpload(e)}
            >
              Submit
            </button>
          </div>
          <p className="text-xl">
            Supported URLs include, youtube videos, wikipedia articles, news,
            and more.
          </p>
        </>
      ) : (
        <>
          <p>Enter URL </p>
          <div className="flex gap-x-4">
            <input
              placeholder="ex. https://www.youtube.com/watch?v=qbIk7-JPB2c"
              className="input-bordered input w-full"
              type="text"
              value={props.input}
              onInput={(e) => props.setInput((e.target as HTMLTextAreaElement).value)}
            />
            <button
              type="submit"
              className="btn-primary btn"
              onClick={(e) => void props.handleUrlUpload(e)}
            >
              Submit
            </button>
          </div>
          <p className="text-sm">
            Supported URLs include, youtube videos, wikipedia articles, news,
            and more.
          </p>
        </>
      )}
    </>
  );
};
