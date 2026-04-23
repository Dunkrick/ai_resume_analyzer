import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface FileUploaderProps {
    onFileSelect: (file: File | null) => void;
}

const FileUploader = ({onFileSelect}: FileUploaderProps) => {
    const [file, setfile] = useState(false);
    const onDrop = useCallback((acceptedFiles: File[]) => {
            const file = acceptedFiles[0] || null;
            onFileSelect?.(file);
    }, [onFileSelect]);
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ 
        onDrop,
        multiple: false,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxSize: 20 * 1024 * 1024,
     })

     const files = acceptedFiles[0] || null



    return(
        <div {...getRootProps()} className="w-full gradient-border">
            <input {...getInputProps()} />
            <div className="space-y-4 cursor-pointer">
                <div className="mx-auto w-16 h-16 flex items-center justify-center">
                    <img src="/icons/info.svg" alt="upload" className="size-20"/>
                </div>
                {file?(
                    <div className="uploader-selected-file" onClick={(e) => {
                        e.stopPropagation();
                        onFileSelect(null);
                    }}>
                        <div className="flex items-center space-x-3">
                        <img src="/icons/pdf.svg" alt="pdf" className="size-10"/>
                        <div>
                            <p className="text-sm text-gray-700 font-medium truncate max-w-xs">
                                {files.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {formatSize(files.size)}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onFileSelect(null);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <img src="/icons/info.svg" alt="remove" className="size-6"/>
                        </button>
                    </div>
                    </div>
                ): (
                    <div>
                        <p className="text-lg text-gray-500">
                            <span className="font-semibold">Click to Upload</span> or drag and drop
                        </p>
                        <p className="text-lg text-gray-500">PDF (max 20 MB)
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
};


export default FileUploader