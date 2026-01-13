import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import axios from "axios";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

export default function CvipForm({ totalPages = 4, onClose, selectedUnit }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showPdf, setShowPdf] = useState(false);
  const canvasRef = useRef(null);
  const pdfDocRef = useRef(null);
  const [vinChars, setVinChars] = useState(Array(17).fill(""));
  const [pdfUrl, setPdfUrl] = useState(null);

  // -----------------------------
  // Load template CVIP PDF
  // -----------------------------
  const handleLoadPdf = async () => {
    setShowPdf(true);

    const arrayBuffer = await fetch("/cvip.pdf").then((res) =>
      res.arrayBuffer()
    );

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    pdfDocRef.current = pdf;

    setCurrentPage(0);
    await renderPage(0);
  };

useEffect(() => {
  // load pdf from powerUnitList (This currently is non functional)
  const fetchCvipPdf = async (vin) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/powerunits/cvip/getPdf/${vin}`,
            {responseType: "blob"} // key for binary data
        );

        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Set state or directly assign to iframe src
        setPdfUrl(pdfUrl);
    } catch (err) {
        console.error("Failed to fetch PDF nikkuh:", err);
    }
  }; 
  fetchCvipPdf();
}, []);



  // Render page on page change
  useEffect(() => {
    if (pdfDocRef.current) renderPage(currentPage);
  }, [currentPage]);

  const renderPage = async (pageNumber) => {
    const pdf = pdfDocRef.current;
    const page = await pdf.getPage(pageNumber + 1);

    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    context.clearRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
  };

  // -----------------------------
  // SAVE: upload PDF + VIN
  // -----------------------------
  const handleUpload = async () => {
    const vin = vinChars.join("").trim();
    console.log("[" + vin + "]");

    if (vin.length !== 17) {
      alert("VIN must be 17 characters.");
      return;
    }

    const payload = {
        vin: vinChars.join(""),
        fields: [
            {
                key: "vin",
                text: vinChars.join(""),
                x: 92,
                y: 308,
                fontSize: 14
            }
        ]
    };
    try {
        await axios.post(
            "http://localhost:8080/api/powerunits/cvip/saveFields", payload
        );
        alert("Yeah it actually worked. I can't believe I was so stupid earlier with that message. I... apologize for my language.");
    } catch (err) {
        console.error("PDF Payload failed: ", err);
        alert("Upload failed, keep troubleshooting bitch.");
    }

  };

  return (
    <div className="cvip-container">
      <h2 className="cvip-title">CVIP Form</h2>
        <div className="cvip-buttons">
      <button onClick={handleLoadPdf}>Load CVIP</button>
        </div>
      {showPdf && (
        <div className="cvip-overlay">
          <button
            onClick={() => {
              setShowPdf(false);
              setCurrentPage(0);
              pdfDocRef.current = null;
            }}
          >
            Cancel
          </button>

          <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
            Save CVIP
          </button>

          <canvas
            ref={canvasRef}
            style={{ display: "block", border: "1px solid #ccc" }}
          />

          {/* VIN Overlay */}
          {currentPage === 0 && (
            <div
              style={{
                position: "absolute",
                top: 308,
                left: 92,
                pointerEvents: "auto",
              }}
            >
              <div style={{ display: "flex", gap: "0" }}>
                {vinChars.map((c, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    value={c}
                    onChange={(e) => {
                      const updated = [...vinChars];
                      updated[i] = e.target.value.toUpperCase().slice(0, 1);
                      setVinChars(updated);
                    }}
                    style={{
                      width: "40.58px",
                      height: "35px",
                      textAlign: "center",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Page nav */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous Page
            </button>

            <span>
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages - 1}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
