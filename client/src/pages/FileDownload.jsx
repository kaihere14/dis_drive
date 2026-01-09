import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Calendar,
  HardDrive,
  Layers,
  ArrowLeft,
  Loader2,
  Video,
  FileCode,
  FileImage,
  FileArchive,
  FileAudio,
  ShieldCheck,
  AlertTriangle,
  Info,
} from "lucide-react";

const FileDownload = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/api/files/filedata`, {
          fileId: fileId,
        });
        setFileData(response.data.fileDetails);
      } catch (err) {
        setError("The requested file could not be retrieved. It may have expired or been deleted.");
      } finally {
        setLoading(false);
      }
    };
    fetchFileDetails();
  }, [fileId]);

  const handleDownload = async () => {
    if (!fileData) return;
    setDownloading(true);
    try {
      const response = await axios.get(`${API_URL}/api/files/download/${fileId}`, { responseType: "blob" });
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileData.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Download protocol failed. Please check your connection.");
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getFileIcon = (fileType) => {
    const props = { className: "w-10 h-10 text-violet-400" };
    if (fileType?.startsWith("video/")) return <Video {...props} />;
    if (fileType?.startsWith("image/")) return <FileImage {...props} />;
    if (fileType?.startsWith("audio/")) return <FileAudio {...props} />;
    if (fileType?.includes("zip") || fileType?.includes("rar")) return <FileArchive {...props} />;
    if (fileType?.includes("code") || fileType?.includes("json")) return <FileCode {...props} />;
    return <FileText {...props} />;
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <Loader2 className="w-8 h-8 text-violet-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="mt-6 text-zinc-400 font-mono text-sm tracking-widest uppercase">Initializing Secure Link...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500/30">
      {/* Structural Backdrop */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <nav className="relative z-20 border-b border-zinc-800/50 backdrop-blur-md bg-zinc-950/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/home")} className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-tighter">Gateway</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Protocol Active</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: File Identity */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex p-4 bg-zinc-900 border border-zinc-800 rounded-3xl">
                {getFileIcon(fileData?.fileType)}
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none break-all">
                {fileData?.fileName}
              </h1>
              <p className="text-zinc-500 text-lg max-w-md">
                Securely sharded into {fileData?.totalChunks} chunks and distributed via Discord Storage Mesh.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Capacity", value: formatFileSize(fileData?.fileSize), icon: HardDrive },
                { label: "Timestamp", value: new Date(fileData?.uploadDate).toLocaleDateString(), icon: Calendar },
                { label: "Mime-Type", value: fileData?.fileType?.split('/')[1] || "Binary", icon: Layers },
                { label: "Verification", value: "SHA-256 Check", icon: ShieldCheck },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-4">
                  <item.icon className="w-5 h-5 text-violet-500" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{item.label}</p>
                    <p className="text-sm font-semibold text-zinc-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-5 pt-[17vh]"
          >
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Download className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Download className="w-5 h-5 text-violet-500" />
                  Download Assets
                </h3>

                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full relative group overflow-hidden bg-white text-black py-5 rounded-2xl font-black text-lg transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-violet-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10 group-hover:text-white transition-colors flex items-center justify-center gap-3">
                    {downloading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Start Download
                        <ArrowLeft className="w-6 h-6 rotate-[135deg]" />
                      </>
                    )}
                  </span>
                </button>

                <div className="mt-8 space-y-4">
                  <div className="flex gap-3 p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl">
                    <Info className="w-5 h-5 text-blue-400 shrink-0" />
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Files are reconstructed client-side from encrypted chunks. 
                      Ensure you have sufficient disk space before starting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Toast */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400"
                >
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default FileDownload;