import React, { useState } from "react";
import pdfFile from "../../assets/CSC_110_PPIT_CDF.pdf";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "../Document/Document.css";
import { decryptLink } from "../../helpers/hashing";
import { useLocation } from "react-router-dom";

const DocumentComp = () => {
  const newPlugin = defaultLayoutPlugin();
  const location = useLocation()
  const originalLink = decryptLink(location.state.urlFile);

  return (
    <div className="pdfContainer">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        {pdfFile && (
          <>
            <Viewer fileUrl={originalLink} plugins={[newPlugin]} />
          </>
        )}
        {!pdfFile && <>No PDF</>}
      </Worker>
    </div>
  );
};

export default DocumentComp;
