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
            <main className="bg-slate-50 min-h-screen">
                <Navbar />
                <section className="main-section flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-xl text-slate-600 font-medium animate-pulse">Loading your results...</p>
                    </div>
                </section>
            </main>
        );
    }

    if (error || !resumeData) {
        return (
            <main className="bg-slate-50 min-h-screen">
                <Navbar />
                <section className="main-section flex flex-col items-center justify-center gap-6 py-20 min-h-[60vh]">
                    <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-lg font-medium text-center">
                        {error}
                    </div>
                    <Link to="/upload" className="primary-button text-center w-fit">
                        Upload a new resume
                    </Link>
                </section>
            </main>
        );
    }

    const { companyName, jobTitle, feedback } = resumeData;

    return (
        <main className="bg-slate-50 min-h-screen pb-20">
            <Navbar />
            <section className="max-w-4xl mx-auto px-4 mt-8">
                <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8 border-b border-slate-100 pb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Analysis Result for {companyName}
                            </h1>
                            <p className="text-lg text-slate-600 font-medium">{jobTitle}</p>
                        </div>
                        <div className="flex-shrink-0">
                            <ScoreGauge score={feedback.overallScore} />
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Render each feedback section dynamically */}
                        {["ATS", "toneAndStyle", "content", "structure", "skills"].map((key) => {
                            const section = feedback[key];
                            if (!section) return null;
                            
                            const title = key === "toneAndStyle" ? "Tone & Style" : key.charAt(0).toUpperCase() + key.slice(1);

                            return (
                                <div key={key} className="pt-2">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-semibold text-slate-800">{title}</h3>
                                        <span className={clsx("font-bold text-sm px-4 py-1.5 rounded-full border", 
                                            section.score >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : section.score >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"
                                        )}>
                                            Score: {section.score}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        {section.tips && section.tips.map((tipObj: any, index: number) => (
                                            <div key={index} className={clsx("p-5 rounded-xl border shadow-sm", 
                                                tipObj.type === "good" ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                                            )}>
                                                <h4 className={clsx("font-semibold mb-2 text-lg flex items-center gap-2",
                                                    tipObj.type === "good" ? "text-emerald-800" : "text-red-800"
                                                )}>
                                                    {tipObj.type === "good" ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                    )}
                                                    {tipObj.tip}
                                                </h4>
                                                {tipObj.explanation && (
                                                    <p className="text-slate-700 leading-relaxed ml-7">{tipObj.explanation}</p>
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
