"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "@mui/material/Link";
import { useLang } from "@/components/LanguageContext";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();
  const { t } = useLang();
  const { login } = useAuth();

  async function attemptLogin() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (data.user) login(data.user);
      router.push("/");
      return true;
    }
    setError(data.error || t.loginErrorFailed);
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError(t.loginErrorEmpty);
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        if (password.length < 8) {
          setError(t.registerErrorPassword);
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError(t.registerErrorMismatch);
          setLoading(false);
          return;
        }
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, confirmPassword }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          await attemptLogin();
        } else {
          setError(data.error || t.registerErrorFailed);
        }
      } else {
        await attemptLogin();
      }
    } catch {
      setError(isRegister ? t.registerErrorFailed : t.loginErrorNetwork);
    } finally {
      setLoading(false);
    }
  }

  const primaryColor = isRegister ? "#7C3AED" : "#0D9488";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: { xs: "column", lg: "row" } }}>
      {/* ===== 左侧渐变区 (40%) ===== */}
      <Box
        className="fluid-gradient"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          px: { xs: 3, lg: 5 },
          py: { xs: 4, lg: 6 },
          width: { lg: "40%" },
        }}
      >
        <Box className="fluid-blob" />

        {/* Logo - 移动端 */}
        <Box sx={{ position: "relative", zIndex: 10, display: { xs: "flex", lg: "none" }, alignItems: "center", gap: 1.5 }}>
          <Image
            src="/hiwe.png"
            alt="HIWE"
            width={1206}
            height={334}
            style={{ height: 32, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
        </Box>

        {/* 主标题 - 桌面端 */}
        <Box sx={{ position: "relative", zIndex: 10, display: { xs: "none", lg: "block" }, textAlign: "left" }}>
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontFamily: "Arial, sans-serif",
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: 2,
              lineHeight: 1.1,
            }}
          >
            HAIWEN MIX
          </Typography>
          <Typography
            sx={{
              color: "#fff",
              fontFamily: "Arial, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 3,
              mt: 0.5,
            }}
          >
            {t.brandSlogan}
          </Typography>
        </Box>

        {/* 底部官网链接 */}
        <Box sx={{ position: "relative", zIndex: 10, display: { xs: "none", lg: "block" } }}>
          <Link
            href="https://www.hiwe.com"
            target="_blank"
            rel="noopener noreferrer"
            underline="always"
            sx={{
              color: "#fff",
              fontFamily: "Arial, sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              textUnderlineOffset: 3,
              "&:hover": { opacity: 0.8 },
            }}
          >
            {t.officialWebsite} www.hiwe.com
          </Link>
        </Box>
      </Box>

      {/* ===== 右侧表单区 (60%) ===== */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff",
          px: { xs: 3, lg: 5 },
          py: { xs: 5, lg: 0 },
        }}
      >
        {/* 注册模式返回箭头 */}
        {isRegister && (
          <Button
            onClick={() => {
              setIsRegister(false);
              setError("");
              setConfirmPassword("");
            }}
            startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
            sx={{
              position: "absolute",
              left: { xs: 16, lg: 40 },
              top: { xs: 16, lg: 40 },
              color: "text.secondary",
              fontSize: "0.8125rem",
              textTransform: "none",
            }}
          >
            {t.backToLogin}
          </Button>
        )}

        <Box sx={{ width: "100%", maxWidth: 360 }}>
          {/* 主标题与副标题 */}
          <Box sx={{ mb: 5, display: { xs: "none", lg: "block" }, textAlign: "center" }}>
            <Image
              src="/hiwe.png"
              alt="HIWE"
              width={1206}
              height={334}
              style={{ height: 64, width: "auto", objectFit: "contain", margin: "0 auto 24px" }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {isRegister ? t.registerWelcome : t.loginWelcome}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              {isRegister ? t.registerSubtitle : t.loginSubtitle}
            </Typography>
          </Box>

          {/* Logo 移动端 */}
          <Box sx={{ mb: 4, display: { xs: "block", lg: "none" } }}>
            <Image
              src="/hiwe.png"
              alt="HIWE"
              width={1206}
              height={334}
              style={{ height: 40, width: "auto", objectFit: "contain", marginBottom: 16 }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {isRegister ? t.registerWelcome : t.loginMobileTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              {isRegister ? t.registerSubtitle : t.panelTitle}
            </Typography>
          </Box>

          {/* 表单 */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              type="text"
              label={t.loginEmail}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.loginPlaceholderEmail}
              autoFocus
              fullWidth
              autoComplete="off"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#9CA3AF", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: primaryColor },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: primaryColor },
              }}
            />

            <TextField
              type={showPassword ? "text" : "password"}
              label={t.loginPassword}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.loginPlaceholderPassword}
              fullWidth
              autoComplete={isRegister ? "new-password" : "current-password"}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#9CA3AF", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: primaryColor },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: primaryColor },
              }}
            />

            {isRegister && (
              <TextField
                type={showConfirmPassword ? "text" : "password"}
                label={t.registerConfirmLabel}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.registerConfirmPlaceholder}
                fullWidth
                autoComplete="new-password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: "#9CA3AF", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: primaryColor },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: primaryColor },
                }}
              />
            )}

            {error && (
              <Alert severity="error" variant="outlined" sx={{ fontSize: "0.8125rem" }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                bgcolor: primaryColor,
                "&:hover": { bgcolor: isRegister ? "#6D28D9" : "#0F766E" },
                fontSize: "0.8125rem",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : isRegister ? (
                t.registerButton
              ) : (
                t.loginButton
              )}
            </Button>

            <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
              {isRegister ? (
                <Button
                  onClick={() => {
                    setIsRegister(false);
                    setError("");
                    setConfirmPassword("");
                  }}
                  sx={{
                    color: primaryColor,
                    fontWeight: 500,
                    textTransform: "none",
                    fontSize: "0.8125rem",
                    "&:hover": { color: isRegister ? "#6D28D9" : "#0F766E" },
                  }}
                >
                  {t.registerLoginLink}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsRegister(true);
                    setError("");
                  }}
                  sx={{
                    color: primaryColor,
                    fontWeight: 500,
                    textTransform: "none",
                    fontSize: "0.8125rem",
                    "&:hover": { color: isRegister ? "#6D28D9" : "#0F766E" },
                  }}
                >
                  {t.loginRegisterLink}
                </Button>
              )}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
