import React, { useState, useEffect, useRef, useCallback } from "react";
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

  // load pdf from powerUnitList


const fetchCvipPdf = useCallback(async () => {
  if (!selectedUnit?.cvipPath) return;
  const res = await fetch(`http://localhost:8080/${selectedUnit.cvipPath}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const pdf = await pdfjsLib.getDocument({ url }).promise;
  pdfDocRef.current = pdf;
  setShowPdf(true);
  renderPage(0);
}, [selectedUnit]);

 useEffect(() => {
  fetchCvipPdf();
}, [fetchCvipPdf]);



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

  // Convert canvas to file
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

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

    if (!canvasRef.current) {
      alert("Load the PDF first.");
      return;
    }

    // Convert canvas → file
    const dataUrl = canvasRef.current.toDataURL("application/pdf");
    const file = dataURLtoFile(dataUrl, `cvip-${vin}.pdf`);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("vin", vin);

    try {
      await axios.post(
        "http://localhost:8080/api/powerunits/cvip/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      

      alert("CVIP saved and attached to correct Power Unit!");
      
      onClose?.();

    } catch (err) {
      console.error("Upload failed:", err);

      if (err.response?.status === 404) {
        alert("VIN not found in database.");
      } else {
        alert("Upload failed.");
      }
    }
  };

  return (
    <div className="cvip-container">
      <h2 className="cvip-title">CVIP Form</h2>

      <button onClick={handleLoadPdf}>Load PDF</button>

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
