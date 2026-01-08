import { ExternalLink } from "lucide-react";

function Header() {
  return (
    <header className="relative z-20 border-b border-slate-200/50 backdrop-blur-xl bg-white/80">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Discord Storage
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Powered by Discord CDN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-600">
                Server Status: Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
