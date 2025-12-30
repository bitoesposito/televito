import type { TitleBoxProps, TelevideoColor, TelevideoSize } from "../../types/televideo";

export default function TitleBox({
  color = "blue",
  size = "md",
  title,
  centerText = false,
  className = "",
  onClick,
}: TitleBoxProps) {
  
  function getSize(size: TelevideoSize) {
    switch (size) {
      case "md":
        return "px-2 py-1";
      case "lg":
        return "px-2 py-2 text-3xl";
    }
  }

  function getBgColor(color: TelevideoColor): string {
    switch (color) {
      case "white":
        return "var(--white)";
      case "yellow":
        return "var(--yellow)";
      case "blue":
        return "var(--blue)";
      case "green":
        return "var(--green)";
      case "red":
        return "var(--red)";
      case "cyan":
        return "var(--cyan)";
    }
  }

  function getTextColor(color: TelevideoColor): string {
    switch (color) {
      case "white":
        return "var(--black)";
      case "yellow":
        return "var(--black)";
      case "blue":
        return "var(--white)";
      case "green":
        return "var(--black)";
      case "red":
        return "var(--white)";
      case "cyan":
        return "var(--black)";
    }
  }

  return (
    <div
      className={`
        ${className ?? ""}
        ${getSize(size)}
        ${centerText ? "text-center" : ""}
        uppercase font-bold min-w-[8rem]
      `}
      style={{ backgroundColor: getBgColor(color), color: getTextColor(color), lineHeight: '1' }}
      onClick={onClick}
    >
      <h2 className="m-0 p-0">{title}</h2>
    </div>
  );
}
