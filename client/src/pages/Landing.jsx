import React from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Layers,
  ShieldCheck,
  Zap,
  Globe,
  Github,
  Command,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// --- Sub-components for a cleaner architecture ---

const NavLink = ({ children, to = "#" }) => (
  <a
    href={to}
    className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
  >
    {children}
  </a>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="group p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-34 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium tracking-wider uppercase text-slate-400 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Network status: Optimized
              </div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9]">
                Storage for the <br />
                <span className="text-slate-500">Modern Engineer.</span>
              </h1>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto">
                Upload files of any size and store them for free using Discord's
                cloud infrastructure. Your files are automatically split into
                chunks and securely stored.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/login"
                  className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="#"
                  className="flex items-center gap-2 px-6 py-3 bg-transparent border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all"
                >
                  <Github className="w-5 h-5" />
                  Star on GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof / Tech Stack */}
      <section className="border-y border-white/5 py-12 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Command className="w-6 h-6" /> ARCHITECTURE
            </div>
            <div className="flex items-center gap-2 font-bold text-xl">
              <Zap className="w-6 h-6" /> DISCORD_CDN
            </div>
            <div className="flex items-center gap-2 font-bold text-xl">
              <ShieldCheck className="w-6 h-6" /> AES_256
            </div>
            <div className="flex items-center gap-2 font-bold text-xl font-mono">
              NODE_JS
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-4">
              Engineered for Reliability
            </h2>
            <p className="text-slate-400 max-w-md">
              Bypassing platform limitations through advanced binary
              fragmentation and stream reassembly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Layers}
              title="Parallel Chunking"
              description="Automatic 8MB payload splitting allows for multi-GB file uploads via standard webhooks."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Private Infrastructure"
              description="Metadata is stored in your private cluster, while Discord handles the heavy lifting of raw data."
            />
            <FeatureCard
              icon={Globe}
              title="Edge Delivery"
              description="Files are served via Discord’s global backbone, ensuring lightning-fast downloads worldwide."
            />
          </div>
        </div>
      </section>

      {/* The "Code" Section - Very Professional touch */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 italic">
              Simple Integration.
            </h2>
            <p className="text-slate-400 mb-8">
              Deploy your own file storage node in minutes. Our architecture
              ensures that even if Discord modifies its CDN, your fragmentation
              logic remains intact.
            </p>
            <ul className="space-y-4">
              {[
                "Low-latency chunk streaming",
                "Automated rate-limit handling",
                "End-to-end binary integrity",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm font-medium text-slate-300"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-1 shadow-2xl">
            <div className="bg-black rounded-xl p-6 font-mono text-xs leading-relaxed overflow-x-auto">
              <div className="flex gap-2 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <p className="text-blue-400">
                const <span className="text-white">nova</span> ={" "}
                <span className="text-blue-400">new</span>{" "}
                <span className="text-yellow-200">NovaDrive</span>({"{"}
              </p>
              <p className="pl-4 text-slate-400">
                apiKey:{" "}
                <span className="text-green-400">'nd_live_...2026'</span>,
              </p>
              <p className="pl-4 text-slate-400">
                chunkSize:{" "}
                <span className="text-orange-400">8 * 1024 * 1024</span>,
              </p>
              <p className="pl-4 text-slate-400">
                strategy: <span className="text-green-400">'parallel'</span>
              </p>
              <p className="text-white">{"}"});</p>
              <p className="mt-4 text-slate-500">// Initialize upload stream</p>
              <p className="text-white">
                <span className="text-blue-400">await</span> nova.
                <span className="text-yellow-200">upload</span>(fileBuffer);
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              NovaDrive
            </span>
          </div>
          <p className="text-slate-500 text-[11px] font-mono">
            © 2026 ARMAN_THAKUR // OPEN_SOURCE_PROJECT
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-slate-500 hover:text-white transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
