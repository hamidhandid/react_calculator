const Key = ({ onClick, text, wide, blue, small }) => {
  return (
    <button
      onClick={onClick}
      className={["key", wide && "wide", blue && "blue", small && "small"].join(" ")}
    >
      {text}
    </button>
  );
};

export default Key;
