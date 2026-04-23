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
        <nav className="navbar flex justify-between items-center py-4 px-8 border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-50">
            <Link to="/" >
                <p className="text-2xl font-bold text-gradient">Resumenyzer</p>
            </Link>
            <div className="flex gap-6 items-center">
                <button onClick={handleWipeData} className="text-red-500 font-medium hover:text-red-700 transition cursor-pointer">
                    Wipe Data
                </button>
                <Link to="/upload" className="primary-button w-fit">
                    <p>Upload Resume</p>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar;