import { useState, useEffect } from "react";
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [fileId, setFileId] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    setSelectedFile(e.target.files[0]);
    setUploadResult(null);
    setError(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const totalChunks = Math.ceil(selectedFile.size / CHUNK_SIZE);
      const initResponse = await axios.post(
        `${API_URL}/api/files/upload/init`,
        {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          totalChunks: totalChunks,
        }
      );

      const fileId = initResponse.data.fileId;

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, selectedFile.size);
        const chunk = selectedFile.slice(start, end);

        const formData = new FormData();
        formData.append("chunk", chunk, `chunk_${i + 1}`);
        formData.append("fileId", fileId);
        formData.append("chunkIndex", i + 1);
        formData.append("totalChunks", totalChunks);

        await axios.post(`${API_URL}/api/files/upload/chunk`, formData);
        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      setUploadResult({ fileId, message: "Upload completed successfully" });
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setSelectedFile(null);
      setUploadProgress(0);
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
            selectedFile={selectedFile}
            uploading={uploading}
            uploadProgress={uploadProgress}
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
            allFiles={allFiles}
            loadingFiles={loadingFiles}
            onRefresh={fetchAllFiles}
            onDownload={handleDownload}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
          />
        </div>
      </main>
    </div>
  );
}

export default Home;
