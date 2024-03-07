import { MdArrowBack } from "react-icons/md";
import { useState } from "react";

const TitleText = () => {
  return (
    <h1 className="text-title absolute bottom-0 w-screen">
      <span className="text-dark-magenta">Rapid</span>ity
    </h1>
  );
};

const Button1 = ({ label, onClick, styles }) => {
  return (
    <button
      className={"text-xl lg:text-2xl border-2 px-7 py-2 " + styles}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const SubjectTile = ({ subject, icon, styles, onClick }) => {
  return (
    <button
      className={
        "text-2xl lg:text-4xl border-2 p-10 w-60 h-full lg:w-80 lg:h-4/6 min-h-min transition " +
        styles
      }
      onClick={onClick}
    >
      {subject}
      <br />
      <span className="text-5xl lg:text-ixl inline-block w-full flex justify-center">
        {icon}
      </span>
    </button>
  );
};

const Checkbox = ({ name, count, id, onClick }) => {
  return (
    <>
      <input
        type="checkbox"
        id={id}
        name={name}
        value={name}
        onClick={onClick}
        className="h-4 w-4 lg:h-8 lg:w-8 appearance-none checked:bg-yellow bg-gray"
      />
      <label for={id} className="text-xl lg:text-4xl ml-5 select-none">
        {name} ({count} term{ count > 0?"s":"" })
      </label>
      <br />
    </>
  );
};

const SubjectHeading = ({ text }) => {
  return <h1 className="text-5xl relative my-5">{text}</h1>;
};

const BackButton = ({ label, onClick }) => {
  return (
    <button className="text-xl p-2 align-middle" onClick={onClick}>
      <span className="text-2xl align-middle inline-block h-full">
        <MdArrowBack />
      </span>{" "}
      {label}
    </button>
  );
};

const QuestionText = ({ text }) => {
  return (
    <p className="w-full border-2 p-5 text-md lg:text-2xl grow flex-1">
      {text}
    </p>
  );
};

const FlashCardFront = ({ text }) => {
  return (
    <p className="select-none pointer-events-none fc-front h-full w-full border-2 p-5 text-md lg:text-2xl grow flex-1 absolute t-0">
      {text}
    </p>
  );
};

const FlashCardBack = ({ text }) => {
  return (
    <h1 className="select-none pointer-events-none fc-back h-full w-full border-2 p-5 text-md lg:text-2xl grow flex-1 absolute t-0">
      {text}
    </h1>
  );
};

const AnswerBox = ({ value, onChange }) => {
  return (
    <input
      className="AnswerBox mt-3 w-full p-2 border-2 text-white bg-transparent focus:outline-none flex-none"
      type="text"
      name="Answer Box"
      id=""
      placeholder="Type answer and ENTER"
      value={value}
      onChange={onChange}
    />
  );
};

const TimerText = ({ text }) => {
  return <h3 className="TimerText text-5xl">{text}</h3>;
};

const ScoreWidget = ({ correct, incorrect, skipped }) => {
  return (
    <h3 className="ScoreWidget text-5xl">
      <span className="text-green">{correct}</span>/
      <span className="text-red">{incorrect}</span>/
      <span className="text-yellow">{skipped}</span>
    </h3>
  );
};

const GameModeSelectCard = ({ subject, icon, styles, onClick }) => {
  return (
    <button
      className={
        "text-2xl lg:text-4xl border-2 w-full h-2/6 lg:w-80 lg:h-4/6 p-5 flex-none min-h-min transition " +
        styles
      }
      onClick={onClick}
    >
      {subject}
      <br />
      <span className="text-5xl lg:text-ixl inline-block w-full flex justify-center">
        {icon}
      </span>
    </button>
  );
};

const Link = ({ href, text }) => {
  return (
    <a href={href} className="text-blue">
      {text}
    </a>
  );
};

const UploadArea = ({ change }) => {
  const [color, setColor] = useState("white");
  return (
    <label for="custom-sheet" className={"text-" + color}>
      Click to Upload a File
      <input
        onChange={(f) => {
          change(f);
          setColor(f.target.value !== "" ? "red" : "white");
        }}
        id="custom-sheet"
        className="hidden"
        type="file"
        name="custom-sheet"
      />
    </label>
  );
};

const SelectionContainer = ({children, name, click, downIcon, upIcon}) => {
    children = Object.keys(children).map((unit, index, arr) => (
        <Checkbox
          name={unit}
          count={children[unit]}
          id={name + "-" + unit}
          onClick={(e) => click(e, name)}
        />
    ));
    if (name === ""){
        return <>{children}</>
    }
    return (
      <div className="category-container">
        <h1 
          className="box-title text-xl lg:text-4xl relative before:absolute before:w-full before:h-full hover:before:bg-white before:opacity-5" 
          onClick={(e)=>e.target.parentElement.classList.toggle("active")}
        >
          <div className="down-icon inline mr-2">{downIcon}</div>
          <div className="up-icon inline mr-2">{upIcon}</div>
          {name}
        </h1>
        {children}
      </div>
    )
}

export {
  TitleText,
  Button1,
  SubjectTile,
  Checkbox,
  SubjectHeading,
  BackButton,
  QuestionText,
  AnswerBox,
  FlashCardFront,
  FlashCardBack,
  TimerText,
  ScoreWidget,
  GameModeSelectCard,
  Link,
  UploadArea,
  SelectionContainer,
};
