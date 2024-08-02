import LoadingSpinner from "./LoadingSpinner";

const LoadingSpinnerFull = () => {
  return (
    <div className="flex items-center justify-center h-full w-full p-auto">
      <div className="absolute h-16 w-16">
        <LoadingSpinner />
      </div>
    </div>
  );
};

export default LoadingSpinnerFull;
