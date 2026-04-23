import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { usePuterStore } from "~/lib/puter"

export const meta = () => ([
    {title: "Resumenyzer | Auth"},
    {name: "description"},
    {content: "Log into your account"},
])

const Auth = () => {
    const { isLoading, auth  } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) {
            navigate(next)
        };
    }, [auth.isAuthenticated, next]);

    return (
        <main className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-10 max-w-lg w-full">
                <section className="flex flex-col gap-10">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <p className="text-blue-600 font-bold text-xl tracking-tight">Resumenyzer</p>
                        <h1 className="text-4xl">Welcome Back</h1>
                        <h2 className="text-slate-500">Log in to continue your career journey</h2>
                    </div>

                    <div className="w-full flex justify-center">
                        { isLoading?(
                            <button className="auth-button animate-pulse cursor-wait" disabled>
                                Signing you In...
                            </button>
                        ):(
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={auth.signOut}>
                                        Log Out
                                    </button>
                                ):(
                                    <button className="auth-button" onClick={auth.signIn}>
                                        Log In with Puter
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    
                    <p className="text-xs text-center text-slate-400">
                        Powered by Puter.js — Your data is stored securely in your own cloud.
                    </p>
                </section>
            </div>
        </main>
    )
}

export default Auth