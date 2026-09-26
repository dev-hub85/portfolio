import { ArrowUp } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer__bar">
        <span className="label">© {new Date().getFullYear()} Abdul Rehman</span>
        <span className="label">Built in Pakistan</span>
        <a href="#top" className="text-link">
          Back to top <ArrowUp size={14} />
        </a>
      </div>
    </footer>
  );
}
