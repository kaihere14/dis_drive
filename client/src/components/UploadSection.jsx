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
import { FileUpload } from "./animatedUpload";
import { useRef, useEffect } from "react";

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
  const fileUploadRef = useRef(null);

  // Reset upload field after successful upload
  useEffect(() => {
    if (uploadResult && !uploading) {
      // Reset the FileUpload component
      fileUploadRef.current?.reset();
    }
  }, [uploadResult, uploading]);

  // Wrapper to handle FileUpload component's onChange
  const handleFileUploadChange = (files) => {
    // Create a synthetic event object that matches what the parent expects
    const syntheticEvent = {
      target: {
        files: files,
      },
    };
    onFileChange(syntheticEvent);
  };

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
          <FileUpload ref={fileUploadRef} onChange={handleFileUploadChange} />

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
