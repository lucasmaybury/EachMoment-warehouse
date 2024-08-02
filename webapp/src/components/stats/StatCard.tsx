type StatCardProps = {
  className?: string;
  children: React.ReactNode;
};

const StatCard = ({ className, children }: StatCardProps) => {
  return (
    <>
      <div className={`p-2 ${className}`}>
        <div className="flex flex-row justify-between items-center w-full h-full px-3 py-2 rounded-lg bg-blue-100 border-2 border-blue-200 shadow-sm">
          {children}
        </div>
      </div>
    </>
  );
};
export default StatCard;
