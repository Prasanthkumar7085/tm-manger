const API_BASE_URL = "https://api.example.com";

export const getData = async (urlPath: string) => {
  const response = await fetch(`${API_BASE_URL}/${urlPath}`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Unknown Error");
  }
  return result;
};

export const postData = async (urlPath: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/${urlPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Unknown Error");
  }
  return result;
};
