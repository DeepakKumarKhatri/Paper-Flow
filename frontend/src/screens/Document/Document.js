import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import style from "../Document/Document.module.css";
import { decryptLink } from "../../helpers/hashing";
import { useLocation } from "react-router-dom";
import noDocumentImage from "../../assets/images/doucment-404.jpg";

const DocumentComp = () => {
  const newPlugin = defaultLayoutPlugin();
  const location = useLocation();
  const originalLink = location?.state?.urlFile
    ? decryptLink(location.state.urlFile)
    : null;

  return (
    <div className={style["pdfContainer"]}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        {originalLink && (
          <Viewer
            theme={"auto"}
            fileUrl={originalLink}
            plugins={[newPlugin]}
          />
        )}
        {!originalLink && (
          <div className={style["noDocumentContainer"]}>
            <img
              src={noDocumentImage}
              alt="No Document Found"
              className={style["noDocumentImage"]}
            />
            <h1 className={style["noDocumentMessage"]}>
              No document found.
            </h1>
            <p className={style["noDocumentExplanation"]}>
              The document you are trying to access is not available. Please
              check back later or contact support for assistance.
            </p>
          </div>
        )}
      </Worker>
    </div>
  );
};

export default DocumentComp;
