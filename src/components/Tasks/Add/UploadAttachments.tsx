import React, { useState } from 'react';


function UploadAttachments() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 w-80 mx-auto">
      <div className="flex flex-col items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v12a2 2 0 002 2h6l2 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <label className="block text-sm font-medium text-gray-700">Drag & Drop your file here Or Click</label>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => document.querySelector('input[type="file"]').click()}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Files
        </button>
      </div>
      {file && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between text-gray-700">
          <span className="text-sm">{file.name}</span>
          <span className="text-xs">{(file.size / 1024).toFixed(2)} KB</span>
        </div>
      )}
    </div>
  );
}

export default UploadAttachments;
