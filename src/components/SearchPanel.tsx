"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { COLOR_TYPE_OPTIONS } from "@/lib/constants";
import { useLang } from "@/components/LanguageContext";
import type { CarMake, SearchParams, AppSettings } from "@/types";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

export interface SearchPanelProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
  onSubmitRef?: React.MutableRefObject<(() => void) | null>;
}

export default function SearchPanel({
  onSearch,
  isLoading,
  onSubmitRef,
}: SearchPanelProps) {
  const { t } = useLang();

  const [makeId, setMakeId] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [colorName, setColorName] = useState("");
  const [colorType, setColorType] = useState("");
  const [year, setYear] = useState("");
  const [carMakes, setCarMakes] = useState<CarMake[]>([]);
  const [colorTypeOptions, setColorTypeOptions] =
    useState<{ value: string; label: string }[]>(COLOR_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label })));

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: CarMake[]) => setCarMakes(data))
      .catch(() => setCarMakes([]));
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: AppSettings | null) => {
        if (data?.finishes?.length) {
          setColorTypeOptions([
            { value: "", label: t.colorTypeAll },
            ...data.finishes.map((f: string) => ({ value: f.toLowerCase(), label: f })),
          ]);
        }
      })
      .catch(() => {});
  }, [t.colorTypeAll]);

  const isCodeTooLong = colorCode.replace(/\s/g, "").length > 10;

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      if (e) e.preventDefault();
      const params: SearchParams = {};
      if (makeId) params.make_id = makeId;
      if (colorCode.trim()) params.color_code = colorCode.replace(/\s/g, "");
      if (colorName.trim()) params.color_name = colorName.trim();
      if (colorType) params.color_type = colorType;
      if (year.trim()) params.year = year.trim();
      onSearch(params);
    },
    [makeId, colorCode, colorName, colorType, year, onSearch],
  );

  useEffect(() => {
    if (onSubmitRef) {
      onSubmitRef.current = () => handleSubmit();
    }
    return () => {
      if (onSubmitRef) onSubmitRef.current = null;
    };
  }, [onSubmitRef, handleSubmit]);

  function handleReset() {
    setMakeId("");
    setColorCode("");
    setColorName("");
    setColorType("");
    setYear("");
  }

  function handleColorCodeChange(value: string) {
    setColorCode(value.replace(/\s/g, "").toUpperCase());
  }

  const labelMap: Record<string, string> = {
    "": t.colorTypeAll,
    solid: t.colorTypeSolid, metallic: t.colorTypeMetallic,
    pearl: t.colorTypePearl, matte: t.colorTypeMatte,
    candy: t.colorTypeCandy,
  };

  return (
    <Box component="form" onSubmit={(e) => handleSubmit(e)}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            select
            value={makeId}
            onChange={(e) => setMakeId(e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ minWidth: 0 }}>
                    <Box component="span" sx={{ fontSize: "0.75rem", color: "text.secondary", mr: 1 }}>
                      {t.make}
                    </Box>
                    <Box sx={{ width: 1, height: 16, bgcolor: "grey.200", mr: 1 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ "& .MuiSelect-select": { pt: 1, pb: 1 } }}
          >
            <MenuItem value="">All</MenuItem>
            {carMakes.map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            value={colorCode}
            onChange={(e) => handleColorCodeChange(e.target.value)}
            placeholder={t.colorCodePlaceholder}
            fullWidth
            size="small"
            slotProps={{
              htmlInput: { maxLength: 20 },
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ minWidth: 0 }}>
                    <Box component="span" sx={{ fontSize: "0.75rem", color: "text.secondary", mr: 1 }}>
                      {t.colorCode}
                    </Box>
                    <Box sx={{ width: 1, height: 16, bgcolor: "grey.200", mr: 1 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            placeholder={t.colorNamePlaceholder}
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ minWidth: 0 }}>
                    <Box component="span" sx={{ fontSize: "0.75rem", color: "text.secondary", mr: 1 }}>
                      {t.colorName}
                    </Box>
                    <Box sx={{ width: 1, height: 16, bgcolor: "grey.200", mr: 1 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder={t.yearPlaceholder}
            fullWidth
            size="small"
            slotProps={{
              htmlInput: { maxLength: 9 },
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ minWidth: 0 }}>
                    <Box component="span" sx={{ fontSize: "0.75rem", color: "text.secondary", mr: 1 }}>
                      {t.year}
                    </Box>
                    <Box sx={{ width: 1, height: 16, bgcolor: "grey.200", mr: 1 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      {isCodeTooLong && (
        <Box sx={{ mt: 1, fontSize: "0.6875rem", fontWeight: 500, color: "warning.main" }}>
          {t.codeTooLong}
        </Box>
      )}

      <Box sx={{ mt: 2.5, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {colorTypeOptions.map((opt) => {
            const isSelected = colorType === opt.value;
            return (
              <Chip
                key={opt.value}
                label={labelMap[opt.value] ?? opt.label}
                onClick={() => setColorType(opt.value)}
                variant={isSelected ? "filled" : "outlined"}
                color={isSelected ? "primary" : "default"}
                size="small"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.8125rem",
                  borderRadius: 1.5,
                  ...(isSelected
                    ? {}
                    : { borderColor: "grey.300", color: "text.secondary", "&:hover": { borderColor: "primary.main" } }),
                }}
              />
            );
          })}
        </Stack>

        <Button
          type="submit"
          disabled={isLoading}
          variant="contained"
          startIcon={<SearchIcon />}
          sx={{
            borderRadius: 999,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8125rem",
            minWidth: 100,
          }}
        >
          {isLoading ? t.searching : t.search}
        </Button>

        <Button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          variant="outlined"
          startIcon={<RefreshIcon />}
          sx={{
            borderRadius: 999,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8125rem",
            color: "text.secondary",
            borderColor: "grey.300",
            "&:hover": { borderColor: "primary.main", color: "primary.main" },
          }}
        >
          {t.reset}
        </Button>
      </Box>
    </Box>
  );
}
