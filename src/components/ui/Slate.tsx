import React from 'react'
import dynamic from "next/dynamic";

// Since client components get prerenderd on server as well hence importing
// the excalidraw stuff dynamically with ssr false

const ExcalidrawWrapper = dynamic(
    async () => (await import("./Wrapper")).default,
    {
        ssr: false,
    },
);


const Slate = () => {
    return (
        <div style={{ height: "100%" }}>
            <ExcalidrawWrapper />
        </div>
    )
}

export default Slate
