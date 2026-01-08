import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, FileCode } from "lucide-react";
import FileCard from "./FileCard";

function FilesList({
  allFiles,
  loadingFiles,
  onRefresh,
  onDownload,
  onDelete,
  formatFileSize,
  formatDate,
}) {
  return (
    <div className="lg:col-span-8 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Your Files</h2>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">
              {allFiles.length} objects stored
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          >
            <RefreshCw
              className={`w-5 h-5 ${loadingFiles ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
          {loadingFiles ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-sm text-slate-400 animate-pulse font-medium">
                Syncing with Discord...
              </p>
            </div>
          ) : allFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-12">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4">
                <FileCode className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-slate-800 font-bold">No files found</h3>
              <p className="text-sm text-slate-500 max-w-[200px] mt-1">
                Upload your first file to see it appear in this list.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {allFiles.map((file, idx) => (
                  <motion.div key={file._id} transition={{ delay: idx * 0.05 }}>
                    <FileCard
                      file={file}
                      onDownload={onDownload}
                      onDelete={onDelete}
                      formatFileSize={formatFileSize}
                      formatDate={formatDate}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default FilesList;
