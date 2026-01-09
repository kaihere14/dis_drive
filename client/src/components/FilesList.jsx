import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  FileCode,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import FileCard from "./FileCard";
import Modal from "./Modal";
import { useSelection } from "../hooks/useSelection";
import { useEffect, useState, useMemo } from "react";

function FilesList({
  allFiles,
  loadingFiles,
  onRefresh,
  onDownload,
  onDelete,
  onDeleteMultiple,
  formatFileSize,
  formatDate,
  fileTypes,
  onFilterChange,
  filterType,
  deletingFileId,
  deletingMultiple,
  downloadingFileId,
}) {
  const {
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isAllSelected,
  } = useSelection(allFiles);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 6 files per page on mobile
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);

  useEffect(() => {
    clearSelection();
    setCurrentPage(1); // Reset to page 1 when files change
  }, [allFiles, clearSelection]);

  // Pagination calculations
  const totalPages = Math.ceil(allFiles.length / itemsPerPage);
  const paginatedFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allFiles.slice(startIndex, endIndex);
  }, [allFiles, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteMultiple = async () => {
    setIsDeleteModalOpen(false);
    setIsDeletingMultiple(true);
    try {
      await onDeleteMultiple([...selectedItems]);
      clearSelection();
    } finally {
      setIsDeletingMultiple(false);
    }
  };

  return (
    <div className="lg:col-span-8 lg:h-full flex flex-col lg:min-h-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:h-full lg:min-h-0"
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
        {allFiles.length > 0 && (
          <div className="px-6 py-3 border-b border-slate-200 bg-slate-50/70">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={selectAll}
                  className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-slate-600">
                  {selectedItems.size > 0
                    ? `${selectedItems.size} selected`
                    : "Select All"}
                </span>
                <select
                  onChange={onFilterChange}
                  value={filterType}
                  className="pl-3 pr-8 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-sm appearance-none cursor-pointer
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                             bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.2rem]
                             "
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23334155' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`,
                  }}
                >
                  {fileTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={selectedItems.size === 0 || isDeletingMultiple}
                className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full sm:w-auto"
              >
                {isDeletingMultiple ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>
                  {isDeletingMultiple ? "Deleting..." : "Delete Selected"}
                </span>
              </button>
            </div>
          </div>
        )}

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
            <>
              {/* Desktop: Show all files, Mobile: Show paginated */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {/* Mobile: paginated files */}
                  <div className="contents lg:hidden">
                    {paginatedFiles.map((file) => (
                      <FileCard
                        key={file._id}
                        file={file}
                        onDownload={onDownload}
                        onDelete={onDelete}
                        formatFileSize={formatFileSize}
                        formatDate={formatDate}
                        isSelected={selectedItems.has(file._id)}
                        onToggleSelection={() => toggleSelection(file._id)}
                        isDeleting={deletingFileId === file._id}
                        isDownloading={downloadingFileId === file._id}
                      />
                    ))}
                  </div>
                  {/* Desktop: all files */}
                  <div className="contents hidden lg:contents">
                    {allFiles.map((file) => (
                      <FileCard
                        key={file._id}
                        file={file}
                        onDownload={onDownload}
                        onDelete={onDelete}
                        formatFileSize={formatFileSize}
                        formatDate={formatDate}
                        isSelected={selectedItems.has(file._id)}
                        onToggleSelection={() => toggleSelection(file._id)}
                        isDeleting={deletingFileId === file._id}
                        isDownloading={downloadingFileId === file._id}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              </div>

              {/* Mobile Pagination Controls */}
              {allFiles.length > itemsPerPage && (
                <div className="lg:hidden mt-6 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-semibold text-slate-700">
                    Page <span className="text-indigo-600">{currentPage}</span>{" "}
                    of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteMultiple}
        title="Delete Multiple Files?"
      >
        <p>
          You are about to delete{" "}
          <span className="font-bold">
            {selectedItems.size} file{selectedItems.size > 1 ? "s" : ""}
          </span>
          . This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default FilesList;
