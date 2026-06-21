import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className=" bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm text-white">
        <p>© {new Date().getFullYear()} MyWebsite</p>

        <div className="flex gap-4">
          <Link to ="/privacy" className="hover:text-cyan-300">
            Privacy
          </Link>

          <Link to="/terms" className="hover:text-cyan-300">
            Terms
          </Link>

          <Link to="/contact" className="hover:text-cyan-300">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}