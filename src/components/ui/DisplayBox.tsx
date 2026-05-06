export interface DisplayBoxProps {
  content: string | number;
  className?: string;
}

const DisplayBox = ({ content = "", className = "" }: DisplayBoxProps) => {
  return (
    <div
      className={`bg-light border-primary box-border flex items-center justify-center rounded-tr-xl rounded-bl-xl border-2 shadow-md ${className}`}
    >
      <span className="text-primary font-medium">{content}</span>
    </div>
  );
};

export default DisplayBox;
