"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import LanguageIcon from "@mui/icons-material/Language";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

// 全站共享 Footer：品牌 logo + 社交链接
// 首页透明浮于背景图底部，非首页常规白底流
// isLightBackground：毛玻璃激活时背景变白，图标/Logo 需切换为深色
export default function Footer({ isLightBackground = false }: { isLightBackground?: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // 首页：透明底 + 高对比度图标
  // 非首页：白底 + 主题蓝图标
  // 毛玻璃激活时（白底）：Logo + 图标转为深色主题蓝
  const footerBg = isHome ? "transparent" : "#ffffff";
  const footerPosition = isHome ? "absolute" : "relative";
  const iconColor = isLightBackground
    ? "primary.main"
    : isHome
      ? "rgba(255,255,255,0.7)"
      : "primary.main";
  const iconHoverColor = isLightBackground
    ? "primary.dark"
    : isHome
      ? "#ffffff"
      : "primary.dark";
  const logoFilter = isLightBackground
    ? "none"
    : isHome
      ? "brightness(0) invert(1)"
      : "none";

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: footerBg,
        position: footerPosition,
        bottom: isHome ? 0 : undefined,
        left: isHome ? 0 : undefined,
        right: isHome ? 0 : undefined,
        zIndex: 10,
        color: isHome ? "#ffffff" : "primary.main",
        py: { xs: 2, md: 1.5 },
        borderTop: isHome ? "none" : "1px solid",
        borderColor: isHome ? "transparent" : "divider",
        transition: "all 1.5s ease-in-out",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1.5, md: 3 }}
        sx={{ alignItems: "center", justifyContent: "space-between", mx: { xs: 1.5, sm: 3, md: "60px" } }}
      >
          {/* 品牌 Logo */}
          <Image
            src="/hiwe.png"
            alt="HIWE"
            width={1206}
            height={334}
            style={{
              height: 16,
              width: "auto",
              objectFit: "contain",
              filter: logoFilter,
              transition: "filter 1.5s ease-in-out",
            }}
          />
          {/* 社交媒体链接 */}
          <Stack direction="row" spacing={{ xs: 0.5, md: 1.5 }} sx={{ alignItems: "center" }}>
            <IconButton
              component="a"
              href="https://www.hiwe.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              size="small"
              sx={{
                color: iconColor,
                minWidth: 36,
                minHeight: 36,
                transition: "color 1.5s ease-in-out",
                "&:hover": { color: iconHoverColor },
              }}
            >
              <LanguageIcon fontSize="small" />
            </IconButton>
            <IconButton
              component="a"
              href="https://api.whatsapp.com/send?phone=8615819205996"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              size="small"
              sx={{
                color: iconColor,
                minWidth: 36,
                minHeight: 36,
                transition: "color 1.5s ease-in-out",
                "&:hover": { color: iconHoverColor },
              }}
            >
              <WhatsAppIcon fontSize="small" />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.facebook.com/profile.php?id=61550592422623"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              size="small"
              sx={{
                color: iconColor,
                minWidth: 36,
                minHeight: 36,
                transition: "color 1.5s ease-in-out",
                "&:hover": { color: iconHoverColor },
              }}
            >
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.instagram.com/haiwenduan?igsh=eGd2c2Fkbnplazl1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              size="small"
              sx={{
                color: iconColor,
                minWidth: 36,
                minHeight: 36,
                transition: "color 1.5s ease-in-out",
                "&:hover": { color: iconHoverColor },
              }}
            >
              <InstagramIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
    </Box>
  );
}
