import { useState } from "react";
import { useDropzone } from "react-dropzone";

export function UploadFiles({ choose }: { choose: (file: File) => void }) {
    const [files, setFiles] = useState<File[]>([]);

    function onDrop(files: File[]) {
        setFiles(prev => prev.concat(files));
    }
    const { getInputProps, getRootProps} = useDropzone({ onDrop });

    return <div {...getRootProps()}>
        <input {...getInputProps()} />
        Drop files here
        <div>
            <ul>
            {files.map(file => (
                <li key={file.name}>
                    {file.name} ({file.size} bytes)
                    <button onClick={(e) => { choose(file); e.stopPropagation(); }}>Drucken</button>
                </li>
            ))}
            </ul>
            
        </div>
    </div>
}