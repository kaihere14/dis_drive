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
  selectedFiles,
  uploading,
  uploadProgress,
  uploadStats,
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
    <div className="lg:col-span-4 flex flex-col lg:h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:h-full overflow-y-auto"
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
              <input
                type="file"
                className="hidden"
                onChange={onFileChange}
                multiple
              />
            </label>
          </div>

          <AnimatePresence>
            {selectedFiles.map((file) => (
              <motion.div
                key={file.name}
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
                    {file.name}
                  </p>
                  <p className="text-[11px] text-indigo-600 uppercase font-bold">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={onUpload}
            disabled={selectedFiles.length === 0 || uploading}
            className="w-full relative overflow-hidden group bg-indigo-600 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-indigo-200 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {uploading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <UploadCloud className="w-5 h-5" />
              )}
              {uploading
                ? `Uploading (${uploadStats.currentFileNumber}/${uploadStats.totalFiles}) ${uploadProgress}%`
                : "Deploy to Discord"}
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
    </div>
  );
}

export default UploadSection;
