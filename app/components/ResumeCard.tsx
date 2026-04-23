import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({resume : {id, jobTitle, companyName, feedback, imagePath}}: {resume: Resume}) => {
    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-1 w-2/3">
                    <h2 className="text-slate-900 font-bold break-words line-clamp-1" title={companyName}>
                        {companyName}
                    </h2>
                    <h3 className="text-sm font-medium text-slate-500 break-words line-clamp-1" title={jobTitle}>
                        {jobTitle} 
                    </h3>
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            <div className="w-full h-full rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shadow-inner">
                <img src={imagePath} 
                    alt="resume"
                    className="w-full h-[320px] max-sm:h-[200px] object-cover object-top hover:scale-105 transition-transform duration-500"
                />
            </div>
        </Link>
    )
};

export default ResumeCard;