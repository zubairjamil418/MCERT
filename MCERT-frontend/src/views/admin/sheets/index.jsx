import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useSearchParams } from "react-router-dom";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import Card from "components/card";

const Sheets = () => {
  const { authFetch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [siteData, setSiteData] = useState([]);
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get("siteId");
  const [config, setConfig] = useState({});

  useEffect(() => {
    const fetchSiteData = async () => {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND_URL}sites/id/${siteId}`
      );
      const data = await response.json();
      setSiteData(data);
    };
    fetchSiteData();

    const onlyofficeConfig = async () => {
      // const res = await fetch(`https://34ac-108-170-33-178.ngrok-free.app/onlyoffice/config`, {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}onlyoffice/config`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            filename: "Inspection_Report_EDM.docx",
            userId: "1",
            userName: "Daniel",
          }),
        }
      );

      const config = await res.json();
      setConfig(config);
    };
    onlyofficeConfig();
  }, [siteId]);

  const onDocumentReady = (event) => {
    console.log("Document is loaded");
  };

  const onLoadComponentError = (errorCode, errorDescription) => {
    switch (errorCode) {
      case -1: // Unknown error loading component
        console.log(errorDescription);
        break;

      case -2: // Error load DocsAPI from http://documentserver/
        console.log(errorDescription);
        break;

      case -3: // DocsAPI is not defined
        console.log(errorDescription);
        break;
    }
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      <Card className="overflow-hidden p-0">
        <div style={{ height: "90vh" }}>
          <DocumentEditor
            id="docxEditor"
            documentServerUrl="https://sirisreports.xyz"
            config={config}
            events_onDocumentReady={onDocumentReady}
            onLoadComponentError={onLoadComponentError}
          />
        </div>
      </Card>
    </div>
  );
};

export default Sheets;
