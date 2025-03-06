// components/ButtonList.js
import "../styles/index.css";

export default function ButtonList({ buttons }) {
  return (
    <div className="buttons">
      {buttons.map((button, index) => (
        <form key={index} action={button.href} method="get">
          <button type="submit">{button.name}</button>
        </form>
      ))}
    </div>
  );
}
