import { Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-success/verify" element={<OAuthSuccess />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
