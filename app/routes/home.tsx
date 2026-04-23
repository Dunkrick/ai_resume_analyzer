import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumenyzer" },
    { name: "description", content: "Welcome to Resumenyzer!" },
  ];
}
 
export default function Home() {
    const { auth, kv, puterReady } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.isAuthenticated && puterReady) {
            navigate('/auth?next=/');
        }
    }, [auth.isAuthenticated, puterReady, navigate]);

    useEffect(() => {
        const fetchResumes = async () => {
            if (!puterReady || !auth.isAuthenticated) return;
            
            try {
                // Fetch all KV items. Return values as true to get the payload immediately
                const items = await kv.list("*", true) as any[];
                
                // Parse them to Resume objects
                if (items && items.length > 0) {
                    const parsedResumes = items.map((item: any) => {
                        try {
                            return JSON.parse(item.value);
                        } catch (e) {
                            return null;
                        }
                    }).filter(Boolean); // remove any that failed to parse
                    
                    setResumes(parsedResumes);
                } else {
                    setResumes([]);
                }
            } catch (err) {
                console.error("Failed to fetch resumes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchResumes();
    }, [puterReady, auth.isAuthenticated, kv]);

  return <main className="bg-slate-50 min-h-screen pb-20">
    <Navbar/>
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track your Applications and Resume Ratings</h1>
        <h2>Review your submissions and check AI-powered feedback.</h2>
      </div>
      
      {loading ? (
        <div className="text-center text-xl text-gray-500 mt-10">Loading your resumes...</div>
      ) : resumes.length > 0 ? (
          <div className="resumes-section">
            {resumes.map((resume)=>(<ResumeCard key={resume.id} resume={resume} />))}
          </div>
      ) : (
          <div className="text-center mt-10">
              <p className="text-xl text-gray-500 mb-4">You haven't uploaded any resumes yet.</p>
          </div>
      )}
    </section>
  </main>
}
