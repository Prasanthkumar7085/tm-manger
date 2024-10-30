import { useState } from "react";

const UploadFiles = () => {
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setDocumentFile(event.target.files[0]);
      event.target.value = ""; // Reset input value
    }
  };

  const removeFile = () => {
    setDocumentFile(null);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2">
        Upload Attachments
      </label>
      <div className="relative">
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept="application/pdf, text/csv"
        />
        <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-blue-50 transition-colors">
          <p className="text-gray-500 text-sm">
            Drag & Drop your file here or click to add files
          </p>
        </div>
        {documentFile && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-700">
              {documentFile.name.length > 50
                ? `${documentFile.name.slice(0, 50)}...`
                : documentFile.name}
            </p>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={removeFile}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
