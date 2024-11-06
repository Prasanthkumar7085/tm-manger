export const getHistoURL = () => {
  const histoUrl = process.env.NEXT_PUBLIC_HISTO_URL;
  return histoUrl ? histoUrl : "";
};
