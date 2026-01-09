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
    if (
      fileType.includes("pdf") ||
      fileType.includes("msword") ||
      fileType.includes("vnd.openxmlformats-officedocument.wordprocessingml.document") ||
      fileType.includes("vnd.ms-excel") ||
      fileType.includes("vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
      fileType.includes("vnd.ms-powerpoint") ||
      fileType.includes("vnd.openxmlformats-officedocument.presentationml.presentation")
    ) {
      return <FileText className="text-red-500 group-hover:text-red-600" />;
    }
    if (
      fileType.includes("zip") ||
      fileType.includes("x-rar-compressed") ||
      fileType.includes("x-7z-compressed")
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
