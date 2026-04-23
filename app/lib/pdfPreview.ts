export const generatePDFPreview = async (file: File): Promise<string> => {
    return new Promise(async (resolve) => {
        try {
            // Dynamically import to prevent SSR crashes (DOMMatrix is not defined on server)
            const pdfjsLib = await import('pdfjs-dist');
            
            // Configure the worker for pdfjs-dist
            pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
                'pdfjs-dist/build/pdf.worker.min.mjs',
                import.meta.url
            ).toString();

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target?.result as ArrayBuffer;

                    // Load the PDF
                    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                    const pdf = await loadingTask.promise;

                    // Fetch the first page
                    const pageNumber = 1;
                    const page = await pdf.getPage(pageNumber);

                    // Set the scale and viewport for preview quality
                    const scale = 1.0;
                    const viewport = page.getViewport({ scale });

                    // Create a canvas element
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    if (!context) {
                        throw new Error("Could not create canvas context");
                    }

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Render PDF page into canvas context
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                        canvas: canvas
                    };
                    const renderTask = page.render(renderContext);

                    await renderTask.promise;

                    // Get the base64 data URL
                    const dataUrl = canvas.toDataURL('image/png');
                    resolve(dataUrl);

                } catch (error) {
                    console.error('Error generating PDF preview:', error);
                    // Return a fallback image if generation fails
                    resolve('/images/resume-1.png');
                }
            };

            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                resolve('/images/resume-1.png');
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Failed to load pdfjs-dist:', error);
            resolve('/images/resume-1.png');
        }
    });
};
