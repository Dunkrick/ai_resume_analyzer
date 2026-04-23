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

     const files = acceptedFiles[0] || null;

    return(
        <div {...getRootProps()} className={`uplader-drag-area w-full ${isDragActive ? 'border-blue-500 bg-blue-50' : ''}`}>
            <input {...getInputProps()} />
            <div className="space-y-4 cursor-pointer w-full">
                {!files && (
                    <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2 opacity-50">
                        <img src="/icons/info.svg" alt="upload" className="w-12 h-12"/>
                    </div>
                )}
                {files ? (
                    <div className="uploader-selected-file" onClick={(e) => {
                        e.stopPropagation();
                        onFileSelect(null);
                    }}>
                        <div className="flex items-center space-x-4 w-full">
                            <img src="/icons/pdf.svg" alt="pdf" className="w-10 h-10"/>
                            <div className="flex-1 text-left">
                                <p className="text-sm text-slate-800 font-semibold truncate max-w-xs">
                                    {files.name}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {formatSize(files.size)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFileSelect(null);
                                    acceptedFiles.pop(); // Clear the dropzone state
                                }}
                                className="text-slate-400 hover:text-red-500 transition-colors p-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ): (
                    <div>
                        <p className="text-slate-600 font-medium">
                            <span className="text-blue-600 font-semibold">Click to Upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-slate-400 mt-1">PDF (max 20 MB)
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
};


export default FileUploader