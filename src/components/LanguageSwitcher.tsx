"use client";

import { useLang } from "@/components/LanguageContext";
import { LANGS, type Lang } from "@/lib/i18n";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// SVG 国旗图标，避免 Windows 将 emoji 国旗退化成字母（GB/CN 等）
import GB from "country-flag-icons/react/3x2/GB";
import CN from "country-flag-icons/react/3x2/CN";
import FR from "country-flag-icons/react/3x2/FR";
import DE from "country-flag-icons/react/3x2/DE";
import ES from "country-flag-icons/react/3x2/ES";
import PT from "country-flag-icons/react/3x2/PT";
import IT from "country-flag-icons/react/3x2/IT";
import RU from "country-flag-icons/react/3x2/RU";
import SI from "country-flag-icons/react/3x2/SI";
import TR from "country-flag-icons/react/3x2/TR";
import IL from "country-flag-icons/react/3x2/IL";
import SA from "country-flag-icons/react/3x2/SA";

const FLAG_MAP: Record<string, React.FC<{ className?: string }>> = {
  GB, CN, FR, DE, ES, PT, IT, RU, SI, TR, IL, SA,
};

function FlagIcon({ code, className }: { code: string; className?: string }) {
  const Flag = FLAG_MAP[code];
  if (!Flag) return null;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: { xs: 12, md: 14 },
        lineHeight: 0,
      }}
    >
      <Flag className={className} />
    </Box>
  );
}

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <Select
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      size="small"
      IconComponent={KeyboardArrowDownIcon}
      renderValue={(value) => {
        const l = LANGS.find((x) => x.code === value) ?? LANGS[0];
        return (
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: { xs: 0.75, md: 1 },
              fontWeight: 600,
              fontSize: { xs: "0.75rem", md: "0.8125rem" },
              color: "primary.main",
              lineHeight: 1,
              height: "100%",
            }}
          >
            <FlagIcon code={l.flag} className="h-3.5 w-auto rounded-none" />
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              {l.code.toUpperCase()}
            </Box>
          </Box>
        );
      }}
      sx={{
        bgcolor: "transparent",
        color: "primary.main",
        border: 1,
        borderColor: "primary.main",
        borderRadius: 0,
        minHeight: { xs: 28, md: "auto" },
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          py: { xs: 0.4, md: 0.5 },
          pr: "32px !important",
          pl: { xs: 1, md: 1.5 },
        },
        "& .MuiSelect-icon": {
          right: 6,
          fontSize: "1.1rem",
          top: "50%",
          transform: "translateY(-50%)",
        },
        "& fieldset": { border: "none" },
        "&:hover": { bgcolor: "rgba(36,135,202,0.05)" },
      }}
      MenuProps={{
        slotProps: {
          paper: { sx: { mt: 0.5, maxHeight: 320, minWidth: 200 } },
        },
      }}
    >
      {LANGS.map((l) => (
        <MenuItem
          key={l.code}
          value={l.code}
          sx={{
            fontSize: "0.875rem",
            gap: 1.5,
            "&.Mui-selected": {
              bgcolor: "rgba(36,135,202,0.08)",
              color: "primary.main",
              fontWeight: 600,
            },
          }}
        >
          <FlagIcon code={l.flag} className="h-4 w-auto rounded-none" />
          <Box component="span" sx={{ flex: 1 }}>
            {l.name}
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
}
