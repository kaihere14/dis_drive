import {
  File,
  FileImage,
  FileText,
  FileArchive,
  FileAudio,
  FileVideo,
  FileCode,
} from "lucide-react";

const FileTypeIcon = ({ fileType, className }) => {
  const getIcon = () => {
    if (fileType.startsWith("image/")) {
      return <FileImage className="text-pink-500 group-hover:text-pink-600" />;
    }
    if (fileType.startsWith("video/")) {
      return <FileVideo className="text-purple-500 group-hover:text-purple-600" />;
    }
    if (fileType.startsWith("audio/")) {
      return <FileAudio className="text-blue-500 group-hover:text-blue-600" />;
    }
    if (fileType === "application/pdf") {
      return <FileText className="text-red-500 group-hover:text-red-600" />;
    }
    if (
      fileType === "application/zip" ||
      fileType === "application/x-rar-compressed"
    ) {
      return <FileArchive className="text-yellow-500 group-hover:text-yellow-600" />;
    }
    if (fileType.startsWith("text/") || fileType.includes("javascript")) {
      return <FileCode className="text-green-500 group-hover:text-green-600" />;
    }
    return <File className="text-slate-500 group-hover:text-slate-600" />;
  };

  return <div className={className}>{getIcon()}</div>;
};

export default FileTypeIcon;
