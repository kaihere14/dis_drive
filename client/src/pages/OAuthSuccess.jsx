import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Layers, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth, login } = useAuth();
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
        const accessToken = hashParams.get("accessToken");
        if (accessToken) {
          await login({ accessToken });
        }

        // Clean up the URL fragment to avoid leaking tokens
        if (window.history.replaceState) {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }

        await checkAuth();
        setStatus("success");
        // Redirect to home after 1 second
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("error");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };
    verifyUser();
  }, [navigate, checkAuth, login, location.hash]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Verification Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-12 shadow-2xl text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center">
              <Layers className="w-9 h-9 text-black" />
            </div>
          </div>

          {/* Status Content */}
          {status === "verifying" && (
            <>
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
              <h1 className="text-2xl font-bold mb-3">
                Verifying your account
              </h1>
              <p className="text-slate-400">
                Please wait while we verify your credentials...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <CheckCircle className="w-16 h-16 mx-auto text-green-400" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-3">
                Successfully verified!
              </h1>
              <p className="text-slate-400">
                Redirecting you to your dashboard...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-3">Verification failed</h1>
              <p className="text-slate-400">
                Unable to verify your account. Redirecting to login...
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
