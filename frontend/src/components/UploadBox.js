import React from "react";

import {
  FaFilePdf
} from "react-icons/fa";

function UploadBox({
  setFile,
  uploadFile
}) {

  return (

    <div className="uploadCard">

      <FaFilePdf className="pdfIcon" />

      <h3>Upload Knowledge</h3>

      <p>
        Drag & drop or select PDFs.
      </p>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="uploadButton"
        onClick={uploadFile}
      >
        Upload PDF
      </button>

    </div>
  );
}

export default UploadBox;