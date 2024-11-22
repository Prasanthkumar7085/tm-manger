interface LoadingComponentProps {
  loading: boolean;
  message?: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  loading,
  message,
}) => {
  if (!loading) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
      <img src="/labsquire-loading.svg" alt="Loading" className="w-36 h-36" />
      <div>{/* <span className="text-blue-900">Loading...</span> */}</div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingComponent;
