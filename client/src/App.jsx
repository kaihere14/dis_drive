import { Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OAuthSuccess from "./pages/OAuthSuccess";
import FileDownload from "./pages/FileDownload";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/home" element={<Home />} />
      <Route path="/file-download/:fileId" element={<FileDownload />} />
    </Routes>
  );
}

export default App;
