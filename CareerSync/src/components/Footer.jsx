import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm text-slate-600 dark:text-white">
        <p>© {new Date().getFullYear()} MyWebsite</p>

        <div className="flex gap-4">
          <Link to ="/privacy" className="transition-colors hover:text-sky-500 dark:hover:text-cyan-300">
            Privacy
          </Link>

          <Link to="/terms" className="transition-colors hover:text-sky-500 dark:hover:text-cyan-300">
            Terms
          </Link>

          <Link to="/contact" className="transition-colors hover:text-sky-500 dark:hover:text-cyan-300">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}