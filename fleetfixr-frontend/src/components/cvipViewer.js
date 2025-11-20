import React, { useEffect, useState } from "react";
import axios from "axios";

function CvipViewer({ vin, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/powerunits/cvip/getPdf/${vin}`,
          { responseType: "blob" }
        );

        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (err) {
        console.error("Error loading CVIP PDF:", err);
      }
    };

    fetchPDF();
  }, [vin]);

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onClose}>Close</button>

      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="800"
          height="1000"
          title="CVIP PDF"
        ></iframe>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
}

export default CvipViewer;
