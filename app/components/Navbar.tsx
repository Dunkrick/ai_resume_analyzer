import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
    const { kv } = usePuterStore();

    const handleWipeData = async () => {
        if (window.confirm("Are you sure you want to delete all uploaded resumes? This cannot be undone.")) {
            try {
                await kv.flush();
                window.location.href = "/"; // Reload and redirect to home
            } catch (err) {
                console.error("Failed to wipe data", err);
                alert("Failed to wipe data.");
            }
        }
    };

    return (
        <nav className="navbar">
            <Link to="/" >
                <p className="text-2xl font-bold text-slate-900 tracking-tight hover:text-blue-600 transition-colors">Resumenyzer</p>
            </Link>
            <div className="flex gap-6 items-center">
                <button onClick={handleWipeData} className="text-red-500 text-sm font-medium hover:text-red-700 transition cursor-pointer">
                    Wipe Data
                </button>
                <Link to="/upload" className="primary-button w-fit">
                    Upload Resume
                </Link>
            </div>
        </nav>
    )
}

export default Navbar;