const LoadingComponent = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
      <img src="/labsquire-loading.svg" alt="Loading" className="w-36 h-36" />
      <p className="text-blue-900">Loading...</p>
    </div>
  );
};

export default LoadingComponent;
