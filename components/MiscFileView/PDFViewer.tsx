import React from "react";
import PdfReader from "rn-pdf-reader-js";

type IPDFViewerProps = {
    fileURI: string;
}

const PDFViewer = ({ fileURI }: IPDFViewerProps) => {
    return (
        <PdfReader source={{uri: fileURI}}/>
    )
}

export default PDFViewer