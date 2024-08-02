type Props = {
  label: string;
  value?: string | number | readonly string[] | undefined;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
};

const Field = ({ label, value, onChange, children }: Props) => {
  return (
    <div className="w-full">
      <span className="flex flex-row justify-between align-baseline m-2">
        <span className="w-full my-auto">{label}</span>
        {!onChange && !children && (
          <span className="w-full bg-white p-2 rounded-lg">{value || "-"}</span>
        )}
        {!value && children && (
          <span className="w-full">{children || "-"}</span>
        )}

        {value !== undefined && onChange && (
          <input
            type="text"
            className="input input-bordered"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </span>
    </div>
  );
};
export default Field;
