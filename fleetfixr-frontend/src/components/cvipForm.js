import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// CDN worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";


export default function CvipForm({ pdfUrl = "/cvip.pdf", totalPages = 4 }) {
  const [currentPage, setCurrentPage] = useState(0);
  const canvasRef = useRef(null);
  const pdfDocRef = useRef(null);
  const [showPdf, setShowPdf] = useState(false);
  const [vinChars, setVinChars] = useState(Array(17).fill(""));

  useEffect(() => {
    if (!showPdf) return; 
    const loadPdf = async () => {
        const arrayBuffer = await fetch("/cvip.pdf").then((res) => res.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        pdfDocRef.current = pdf;
        await renderPage(0);
        }
    
    loadPdf();
  }, [showPdf]);

  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(currentPage);
    }
  }, [currentPage]);

  const renderPage = async (pageNumber) => {
    const pdf = pdfDocRef.current;
    const page = await pdf.getPage(pageNumber + 1);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas size to PDF page size
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    // Clear canvas before rendering
    context.clearRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
  };

  return (
    
    <div style={{ position: "relative", width: "100%", maxWidth: "1050px" }}>
        <button onClick={() => setShowPdf(true)}>
        Load PDF
        </button>
      {/* PDF Canvas */}
      <canvas
        ref={canvasRef}
        style={{ display: "block",  border: "1px solid #ccc" }}
      />

      {/* Overlay inputs */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 239,
            left: 72,
            pointerEvents: "auto",
          }}
        >
          <div style={{ display: "flex", gap: "0px" }}>
            {vinChars.map((char, i) => (
              <input
                key={i}
                value={char}
                onChange={(e) => {
                  const newVin = [...vinChars];
                  newVin[i] = e.target.value.toUpperCase().slice(0, 1);
                  setVinChars(newVin);
                }}
                maxLength={1}
                style={{
                  width: "40.58px",
                  height: "35px",
                  textAlign: "center",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Page navigation */}
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
  );
}
