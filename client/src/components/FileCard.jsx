import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";

function FileCard({ file, onDownload, formatFileSize, formatDate }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white border border-slate-200 rounded-2xl p-4 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/50 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex-shrink-0 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="text-sm font-bold text-slate-700 truncate group-hover:text-indigo-900 transition-colors">
            {file.fileName}
          </h3>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
              {formatFileSize(file.fileSize)}
            </span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              {formatDate(file.uploadDate)}
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase">
              {file.totalChunks} Chunks
            </span>
          </div>
        </div>
        <button
          onClick={() => onDownload(file._id)}
          className="flex-shrink-0 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all duration-200 flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>
    </motion.div>
  );
}

export default FileCard;
