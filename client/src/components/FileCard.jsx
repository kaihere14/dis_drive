import { motion } from "framer-motion";
import { Download, Trash2 } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal";
import FileTypeIcon from "./icons/FileTypeIcon";

function FileCard({
  file,
  onDownload,
  onDelete,
  formatFileSize,
  formatDate,
  isSelected,
  onToggleSelection,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const truncateFileName = (name, maxLength = 40) => {
    if (name.length <= maxLength) return name;
    const extension = name.split(".").pop();
    const nameWithoutExt = name.slice(0, name.lastIndexOf("."));
    const truncated = nameWithoutExt.slice(
      0,
      maxLength - (extension?.length || 0) - 4
    );
    return `${truncated}...${extension}`;
  };

  const handleDelete = () => {
    onDelete(file._id);
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`group border rounded-xl p-4 transition-all duration-300 flex flex-col min-h-full hover:scale-105 ${
          isSelected
            ? "bg-indigo-50 border-indigo-200 shadow-md shadow-indigo-50/50"
            : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/50"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 transition-colors">
              <FileTypeIcon fileType={file.fileType} className="w-5 h-5" />
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelection}
            className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500"
          />
        </div>

        <div className="flex-1 mt-3">
          <h3
            className="text-sm font-bold text-slate-700 group-hover:text-indigo-900 transition-colors break-all"
            title={file.fileName}
          >
            {truncateFileName(file.fileName)}
          </h3>
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              {formatFileSize(file.fileSize)}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              {formatDate(file.uploadDate)}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[8px] font-black uppercase w-fit">
              {file.totalChunks} Chunks
            </span>
          </div>
        </div>

        {/* Buttons always visible on mobile, only on hover for larger screens */}
        <div className="mt-4 flex items-center gap-2 transition-opacity duration-200 opacity-100 group-hover:opacity-100">
          <button
            onClick={() => onDownload(file._id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center h-9 w-9 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Are you sure?"
      >
        <p>
          You are about to delete the file{" "}
          <span className="font-bold">{file.fileName}</span>. This action cannot
          be undone.
        </p>
      </Modal>
    </>
  );
}

export default FileCard;
