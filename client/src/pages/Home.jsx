import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import UploadSection from "../components/UploadSection";
import FilesList from "../components/FilesList";

function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [fileId, setFileId] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState({
    currentFileNumber: 0,
    totalFiles: 0,
  });
  const [filterType, setFilterType] = useState("all");

  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const CHUNK_SIZE = 8 * 1024 * 1024; // 8MB

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllFiles();
    }
  }, [isAuthenticated]);

  const fetchAllFiles = async () => {
    setLoadingFiles(true);
    try {
      const response = await axios.get(`${API_URL}/api/files/list`);
      setAllFiles(response.data.files);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setUploadResult(null);
    setError(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one file");
      return;
    }
    setUploading(true);
    setError(null);
    setUploadProgress(0);
    setUploadStats({
      currentFileNumber: 0,
      totalFiles: selectedFiles.length,
    });

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const currentFile = selectedFiles[i];
        setUploadStats((prev) => ({ ...prev, currentFileNumber: i + 1 }));
        setUploadProgress(0);

        const totalChunks = Math.ceil(currentFile.size / CHUNK_SIZE);
        const initResponse = await axios.post(
          `${API_URL}/api/files/upload/init`,
          {
            fileName: currentFile.name,
            fileSize: currentFile.size,
            fileType: currentFile.type,
            totalChunks: totalChunks,
          }
        );

        const fileId = initResponse.data.fileId;

        for (let j = 0; j < totalChunks; j++) {
          const start = j * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, currentFile.size);
          const chunk = currentFile.slice(start, end);

          const formData = new FormData();
          formData.append("chunk", chunk, `chunk_${j + 1}`);
          formData.append("fileId", fileId);
          formData.append("chunkIndex", j + 1);
          formData.append("totalChunks", totalChunks);

          await axios.post(`${API_URL}/api/files/upload/chunk`, formData);
          setUploadProgress(Math.round(((j + 1) / totalChunks) * 100));
        }
      }

      setUploadResult({ message: "All files uploaded successfully" });
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setSelectedFiles([]);
      setUploadProgress(0);
      setUploadStats({ currentFileNumber: 0, totalFiles: 0 });
      fetchAllFiles();
    } catch (err) {
      setError("Failed to upload file: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (downloadFileId) => {
    const idToDownload = downloadFileId || fileId;
    if (!idToDownload.trim()) {
      setDownloadError("Please enter a file ID");
      return;
    }
    setDownloading(true);
    setDownloadError(null);

    try {
      const response = await axios.get(
        `${API_URL}/api/files/download/${idToDownload}`,
        { responseType: "blob" }
      );

      const contentDisposition = response.headers["content-disposition"];
      let filename = "downloaded_file";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename\*=UTF-8''(.+)/
        );
        if (filenameMatch) filename = decodeURIComponent(filenameMatch[1]);
      }

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      if (!downloadFileId) setFileId("");
    } catch (err) {
      setDownloadError("Failed to download file: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/files/delete`, {
        data: { fileIds: [id] },
      });
      setAllFiles((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
  };

  const handleDeleteMultiple = async (ids) => {
    try {
      await axios.delete(`${API_URL}/api/files/delete`, {
        data: { fileIds: ids },
      });
      setAllFiles((prev) => prev.filter((f) => !ids.includes(f._id)));
    } catch (err) {
      console.error("Failed to delete multiple files:", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const getFileType = (mimeType) => {
    if (!mimeType) return "other";
    if (mimeType.includes("pdf")) return "pdf";
    if (
      mimeType.includes("msword") ||
      mimeType.includes("vnd.openxmlformats-officedocument.wordprocessingml.document") ||
      mimeType.includes("vnd.ms-excel") ||
      mimeType.includes("vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
      mimeType.includes("vnd.ms-powerpoint") ||
      mimeType.includes("vnd.openxmlformats-officedocument.presentationml.presentation")
    )
      return "document";
    if (
      mimeType.includes("zip") ||
      mimeType.includes("x-rar-compressed") ||
      mimeType.includes("x-7z-compressed")
    )
      return "archive";
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.startsWith("text/")) return "text";
    if (mimeType.startsWith("application/")) return "application";
    return "other";
  };

  const availableFileTypes = useMemo(() => {
    const types = new Set(allFiles.map((file) => getFileType(file.fileType)));
    return ["all", ...Array.from(types)];
  }, [allFiles]);

  const filteredFiles = useMemo(() => {
    if (filterType === "all") {
      return allFiles;
    }
    return allFiles.filter((file) => getFileType(file.fileType) === filterType);
  }, [allFiles, filterType]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-purple-50 blur-[100px]" />
      </div>

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          style={{ height: "calc(100vh - 200px)" }}
        >
          <UploadSection
            selectedFiles={selectedFiles}
            uploading={uploading}
            uploadProgress={uploadProgress}
            uploadStats={uploadStats}
            error={error}
            uploadResult={uploadResult}
            fileId={fileId}
            downloading={downloading}
            downloadError={downloadError}
            onFileChange={handleFileChange}
            onUpload={handleUpload}
            onFileIdChange={(e) => setFileId(e.target.value)}
            onDownload={() => handleDownload()}
            formatFileSize={formatFileSize}
          />

          <FilesList
            allFiles={filteredFiles}
            loadingFiles={loadingFiles}
            onRefresh={fetchAllFiles}
            onDownload={handleDownload}
            onDelete={handleDelete}
            onDeleteMultiple={handleDeleteMultiple}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
            fileTypes={availableFileTypes}
            onFilterChange={handleFilterChange}
            filterType={filterType}
          />
        </div>
      </main>
    </div>
  );
}

export default Home;
