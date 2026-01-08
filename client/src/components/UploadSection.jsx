import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileCode,
} from "lucide-react";

function UploadSection({
  selectedFile,
  uploading,
  uploadProgress,
  error,
  uploadResult,
  fileId,
  downloading,
  downloadError,
  onFileChange,
  onUpload,
  onFileIdChange,
  onDownload,
  formatFileSize,
}) {
  return (
    <div
      className="lg:col-span-4 space-y-6 flex flex-col mt-8"
      style={{ maxHeight: "calc(100vh - 200px)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex-1 overflow-y-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <UploadCloud className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Upload</h2>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileCode className="w-8 h-8 mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <p className="text-sm text-slate-500 font-medium">
                  Click to browse
                </p>
              </div>
              <input type="file" className="hidden" onChange={onFileChange} />
            </label>
          </div>

          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-3"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <FileText className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-indigo-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-indigo-600 uppercase font-bold">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={onUpload}
            disabled={!selectedFile || uploading}
            className="w-full relative overflow-hidden group bg-indigo-600 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-indigo-200 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {uploading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <UploadCloud className="w-5 h-5" />
              )}
              {uploading ? `Uploading ${uploadProgress}%` : "Deploy to Discord"}
            </span>
            {uploading && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-indigo-400"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
              />
            )}
          </button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-xs border border-red-100"
              >
                <AlertCircle className="w-4 h-4" /> {error}
              </motion.div>
            )}
            {uploadResult && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-1 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs border border-emerald-100"
              >
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Success!
                </div>
                <span className="font-mono opacity-70 break-all">
                  {uploadResult.fileId}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Quick Download */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6"
      >
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Download className="w-4 h-4 text-slate-400" /> Remote Access
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={fileId}
            onChange={onFileIdChange}
            placeholder="Paste File ID..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-mono"
          />
          <button
            onClick={onDownload}
            disabled={!fileId.trim() || downloading}
            className="px-5 bg-emerald-600 disabled:bg-slate-300 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md hover:shadow-emerald-200 active:scale-95"
          >
            {downloading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
          </button>
        </div>
        {downloadError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-xs text-red-600 flex items-center gap-2"
          >
            <AlertCircle className="w-3 h-3" /> {downloadError}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default UploadSection;
