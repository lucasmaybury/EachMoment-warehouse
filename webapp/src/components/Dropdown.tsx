import { ReactNode, useEffect, useRef } from "react";

interface DropdownProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  display: ReactNode;
  dropdown: ReactNode;
}

const Dropdown = ({ isOpen, setOpen, display, dropdown }: DropdownProps) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const handleSummaryClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen, detailsRef]);

  return (
    <details
      open={isOpen}
      ref={detailsRef}
      className="dropdown dropdown-bottom"
    >
      <summary
        onClick={handleSummaryClick}
        className="btn bg-transparent border-none m-0 p-0"
      >
        {display}
      </summary>
      {dropdown}
    </details>
  );
};

export default Dropdown;
