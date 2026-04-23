import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";
import ScoreGauge from "~/components/ScoreCircle";
import clsx from "clsx";

const ResumeResult = () => {
    const { id } = useParams<{ id: string }>();
    const puterStore = usePuterStore();
    const [resumeData, setResumeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            try {
                const dataStr = await puterStore.kv.get(id);
                if (dataStr) {
                    setResumeData(JSON.parse(dataStr));
                } else {
                    setError("Resume not found.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch resume data.");
            } finally {
                setLoading(false);
            }
        };

        if (puterStore.puterReady) {
            fetchResult();
        }
    }, [id, puterStore.puterReady]);

    if (loading) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <section className="main-section flex items-center justify-center">
                    <p className="text-xl mt-20 text-gray-600 font-medium">Loading your results...</p>
                </section>
            </main>
        );
    }

    if (error || !resumeData) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <section className="main-section flex flex-col items-center justify-center gap-4 py-20">
                    <p className="text-xl text-red-500">{error}</p>
                    <Link to="/upload" className="primary-button text-center w-fit">
                        <p>Upload a new resume</p>
                    </Link>
                </section>
            </main>
        );
    }

    const { companyName, jobTitle, feedback } = resumeData;

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen pb-20">
            <Navbar />
            <section className="max-w-4xl mx-auto px-4 mt-8">
                <div className="bg-white/80 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Analysis Result for {companyName}
                            </h1>
                            <p className="text-xl text-gray-600">Position: {jobTitle}</p>
                        </div>
                        <div className="flex-shrink-0">
                            <ScoreGauge score={feedback.overallScore} />
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Render each feedback section dynamically */}
                        {["ATS", "toneAndStyle", "content", "structure", "skills"].map((key) => {
                            const section = feedback[key];
                            if (!section) return null;
                            
                            const title = key === "toneAndStyle" ? "Tone & Style" : key.charAt(0).toUpperCase() + key.slice(1);

                            return (
                                <div key={key} className="border-t border-gray-200 pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
                                        <span className={clsx("font-bold text-lg", 
                                            section.score >= 80 ? "text-green-500" : section.score >= 50 ? "text-yellow-500" : "text-red-500"
                                        )}>
                                            Score: {section.score}/100
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        {section.tips && section.tips.map((tipObj: any, index: number) => (
                                            <div key={index} className={clsx("p-4 rounded-xl border", 
                                                tipObj.type === "good" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                                            )}>
                                                <h4 className={clsx("font-semibold mb-1",
                                                    tipObj.type === "good" ? "text-green-800" : "text-red-800"
                                                )}>
                                                    {tipObj.tip}
                                                </h4>
                                                {tipObj.explanation && (
                                                    <p className="text-gray-700">{tipObj.explanation}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ResumeResult;
