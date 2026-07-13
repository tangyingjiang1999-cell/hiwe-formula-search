"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/LanguageContext";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { TONERS, TONER_CATEGORIES } from "@/data/toners";
import type { TonerCategory } from "@/types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

function TonerCard({ code, tradeName, hex }: { code: string; tradeName: string; hex: string }) {
  const swatchStyle: React.CSSProperties = {
    backgroundColor: hex,
    backgroundImage:
      "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.16) 8%, rgba(0,0,0,0.04) 18%, rgba(255,255,255,0.08) 28%, rgba(255,255,255,0.28) 38%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.28) 62%, rgba(255,255,255,0.08) 72%, rgba(0,0,0,0.04) 82%, rgba(0,0,0,0.16) 92%, rgba(0,0,0,0.30) 100%)",
  };

  return (
    <Card sx={{ cursor: "pointer", transition: "all 0.15s", "&:hover": { borderColor: "primary.main", boxShadow: 1 } }}>
      <Box sx={{ height: 80, borderTopLeftRadius: "inherit", borderTopRightRadius: "inherit" }} style={swatchStyle} />
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography variant="caption" sx={{ fontFamily: "monospace", fontWeight: 600, color: "text.primary" }}>
          {code}
        </Typography>
        <Typography variant="body2" noWrap sx={{ fontWeight: 500, mt: 0.25 }}>
          {tradeName}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function TonerPage() {
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState<TonerCategory>("2K_BASECOAT");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredToners = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return TONERS.filter((toner) => {
      if (toner.category !== activeCategory) return false;
      if (!q) return true;
      return toner.code.toLowerCase().includes(q) || toner.tradeName.toLowerCase().includes(q) || toner.nameZh.includes(q);
    });
  }, [activeCategory, searchQuery]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      <SiteHeader />

      <Box sx={{ bgcolor: "#fff", borderBottom: 1, borderColor: "divider", pt: 10, pb: 0, px: { xs: 2, lg: 3 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Toner</Typography>
      </Box>

      <Box
        sx={{
          position: "sticky", top: 64, zIndex: 30, bgcolor: "#fff", borderBottom: 1, borderColor: "divider",
          px: { xs: 2, lg: 3 }, py: 2,
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {TONER_CATEGORIES.map((cat) => (
              <Chip
                key={cat.key}
                label={`${cat.label} ${cat.count}`}
                onClick={() => setActiveCategory(cat.key)}
                variant={activeCategory === cat.key ? "filled" : "outlined"}
                color={activeCategory === cat.key ? "primary" : "default"}
                size="small"
              />
            ))}
          </Stack>

          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code or name..."
            size="small"
            sx={{ width: { xs: "100%", sm: 256 } }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "text.disabled" }} /></InputAdornment> } }}
          />
        </Stack>
      </Box>

      <Box sx={{ flex: 1, px: { xs: 2, lg: 3 }, py: 3 }}>
        {filteredToners.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 10, color: "text.disabled" }}>
            <Typography variant="body2">No toners found</Typography>
            <Typography variant="caption" sx={{ mt: 0.5 }}>Try a different search or category</Typography>
          </Box>
        ) : (
          <Grid container spacing={1.5}>
            {filteredToners.map((toner) => (
              <Grid key={toner.code} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <TonerCard code={toner.code} tradeName={toner.tradeName} hex={toner.hex} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Footer />
    </Box>
  );
}
