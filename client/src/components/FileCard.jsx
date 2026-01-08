import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";

function FileCard({ file, onDownload, formatFileSize, formatDate }) {
  const truncateFileName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    const extension = name.split(".").pop();
    const nameWithoutExt = name.slice(0, name.lastIndexOf("."));
    const truncated = nameWithoutExt.slice(0, maxLength - extension.length - 4);
    return `${truncated}...${extension}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white border border-slate-200 rounded-xl p-3 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/50 transition-all duration-300"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <h3
              className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-indigo-900 transition-colors truncate"
              title={file.fileName}
            >
              <span className="sm:hidden">
                {truncateFileName(file.fileName, 25)}
              </span>
              <span className="hidden sm:inline">{file.fileName}</span>
            </h3>
            <button
              onClick={() => onDownload(file._id)}
              className="flex-shrink-0 w-7 h-7 sm:hidden bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-all duration-200"
              aria-label="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              {formatFileSize(file.fileSize)}
            </span>
            <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              {formatDate(file.uploadDate)}
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[8px] font-black uppercase">
              {file.totalChunks} Chunks
            </span>
          </div>
        </div>
        <button
          onClick={() => onDownload(file._id)}
          className="hidden sm:flex flex-shrink-0 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all duration-200 items-center gap-1.5"
        >
          <Download className="w-3 h-3" />
          <span>Download</span>
        </button>
      </div>
    </motion.div>
  );
}

export default FileCard;
