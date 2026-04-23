import { type FormEvent, useState } from "react";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { prepareInstructions, AIResponseFormat } from "../../constants";
import { generatePDFPreview } from "~/lib/pdfPreview";

const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const puterStore = usePuterStore();

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            alert("Please upload a resume");
            return;
        }

        const formData = new FormData(e.currentTarget);
        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;

        setIsProcessing(true);

        try {
            setStatusText("Uploading Resume...");
            // 1. Upload to Puter FS
            const uploadResult = await puterStore.fs.upload([file]);
            
            if (!uploadResult) {
                throw new Error("Failed to upload file");
            }

            // Handle whether puter returns a single item or an array of items
            const uploadedFile = Array.isArray(uploadResult) ? uploadResult[0] : uploadResult;
            const filePath = uploadedFile?.path;

            if (!filePath) {
                throw new Error("Could not determine uploaded file path");
            }

            setStatusText("AI is analyzing your resume...");
            // 2. Prepare Prompt
            const prompt = prepareInstructions({
                jobTitle,
                jobDescription,
                AIResponseFormat,
            });

            // 3. Send to Puter AI Feedback
            const aiResponse = await puterStore.ai.feedback(filePath, prompt);
            
            if (!aiResponse) {
                throw new Error("Failed to get AI response");
            }

            setStatusText("Saving results...");
            
            // Extract the actual JSON string from the response
            let feedbackData;
            try {
                let content = aiResponse.message.content;
                
                // If Claude/Puter returns an array of content blocks instead of a string
                if (Array.isArray(content)) {
                    content = content.map((block: any) => block.text || '').join('');
                }

                if (typeof content !== 'string') {
                    content = JSON.stringify(content);
                }

                // AI sometimes adds extra conversational text before or after the JSON
                // This reliably extracts the main JSON object between the first { and last }
                const firstBrace = content.indexOf('{');
                const lastBrace = content.lastIndexOf('}');
                
                if (firstBrace !== -1 && lastBrace !== -1) {
                    content = content.substring(firstBrace, lastBrace + 1);
                }

                feedbackData = JSON.parse(content);
            } catch (err) {
                console.error("Failed to parse AI response:", aiResponse.message.content);
                throw new Error("Failed to parse AI response. The AI might not have returned valid JSON.");
            }

            // Generate PDF Preview Image
            setStatusText("Generating preview...");
            const previewDataUrl = await generatePDFPreview(file);

            // 4. Create the final Resume object
            const resumeId = Date.now().toString(); // Generate a simple ID
            const resumeObj = {
                id: resumeId,
                companyName,
                jobTitle,
                imagePath: previewDataUrl, 
                resumePath: filePath,
                feedback: feedbackData
            };

            // 5. Save to Puter KV store
            await puterStore.kv.set(resumeId, JSON.stringify(resumeObj));

            // 6. Redirect to the result page
            navigate(`/resume/${resumeId}`);

        } catch (error: any) {
            console.error(error);
            alert("An error occurred: " + (error.message || "Unknown error"));
            setIsProcessing(false);
            setStatusText("");
        }
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
         <Navbar/>
        <section className="main-section">
            <div className="page-heading py-16">
                <h1>Smart Feedback for your dream Job</h1>
                { isProcessing?(
                    <>
                    <h2>{statusText}</h2>
                    <img src="/images/resume-scan.gif" alt="resume-scan" className="w-full"/>
                    </>
                ):(
                    <h2>Drop your resume for ATS score and improvement tips</h2>
                )}
                {
                    !isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name"></input>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title"></input>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description"></textarea>
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>
                            <button className="primary-button" type="submit" >
                                <p>Analyze Resume</p>
                            </button>
                        </form>
                    )
                }
            </div>
        </section>
        </main>
    )
}   

export default Upload;