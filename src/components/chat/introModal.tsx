import { isMobile } from 'react-device-detect';

const IntroModal = (props: { setToolTipString: (s: string) => void }) => {
  if (isMobile) {
    return (
      <div className="">
        <label id="introModal" htmlFor="IntroModal" className="btn invisible" />
        <input type="checkbox" id="IntroModal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box relative">
            <label
              htmlFor="IntroModal"
              className="btn-circle btn-lg btn absolute right-2 top-2 text-3xl"
              onClick={() => {
                props.setToolTipString('tooltip-open tooltip-primary');
              }}
            >
              ✕
            </label>
            <br />
            <br />
            <h3 className="text-6xl font-bold">
              👋 Hey there! Welcome to BobaChat!
            </h3>
            <p className="py-4 text-4xl">
              Chat with anything! 🤩 From PDFs and DOCX files to CSVs and news
              articles, Wikipedia, and YouTube videos, we&apos;ve got you
              covered! 🙌 So come join the fun and create the most amazing chat
              experience ever! 🚀
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="h-[0px]">
      <label id="introModal" htmlFor="IntroModal" className="btn invisible" />
      <input type="checkbox" id="IntroModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="IntroModal"
            className="btn-sm btn-circle btn absolute right-2 top-2"
            onClick={() => {
              props.setToolTipString(' tooltip-open tooltip-primary');
            }}
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">
            👋 Hey there! Welcome to BobaChat!
          </h3>
          <p className="py-4">
            Chat with anything! 🤩 From PDFs and DOCX files to CSVs and news
            articles, Wikipedia, and YouTube videos, we&apos;ve got you covered!
            🙌 So come join the fun and create the most amazing chat experience
            ever! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroModal;
