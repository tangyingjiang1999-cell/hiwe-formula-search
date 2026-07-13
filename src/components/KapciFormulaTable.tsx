"use client";

import { useState, useEffect } from "react";
import type { Formula, FormulaComponent } from "@/types";
import { useLang } from "@/components/LanguageContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const UNIT_OPTIONS = ["g", "kg", "ml", "liter"] as const;
type Unit = (typeof UNIT_OPTIONS)[number];

const UNIT_MULTIPLIER: Record<Unit, number> = { g: 1, kg: 1000, ml: 1, liter: 1000 };

interface KapciFormulaTableProps {
  formula: Formula;
}

function calcWeight(gramsPer100g: number, totalGrams: number): number {
  return Math.round((gramsPer100g / 100) * totalGrams * 10) / 10;
}

function parsePositiveNumber(raw: string): number | null {
  if (raw === "") return null;
  const num = Number(raw);
  if (isNaN(num) || num < 0) return null;
  return Math.round(num * 10) / 10;
}

function massToneColor(comp: FormulaComponent): string {
  const { rgb_r, rgb_g, rgb_b } = comp;
  if (rgb_r != null && rgb_g != null && rgb_b != null) {
    return `rgb(${rgb_r}, ${rgb_g}, ${rgb_b})`;
  }
  return "#E2E8F0";
}

export default function KapciFormulaTable({ formula }: KapciFormulaTableProps) {
  const { t } = useLang();
  const [volume, setVolume] = useState(1);
  const [unit, setUnit] = useState<Unit>("kg");
  const [weights, setWeights] = useState<number[]>([]);

  const totalGrams = volume * UNIT_MULTIPLIER[unit];

  useEffect(() => {
    const next = formula.components.map((c) => calcWeight(c.grams_per_100g, totalGrams));
    setWeights(next);
  }, [formula.id, totalGrams]);

  function handleVolumeChange(raw: string) {
    const num = parsePositiveNumber(raw);
    if (num === null) return;
    setVolume(Math.max(0.1, Math.round(num * 10) / 10));
  }

  function handleWeightChange(idx: number, raw: string) {
    const num = parsePositiveNumber(raw);
    if (num === null) return;
    setWeights((prev) => {
      const next = [...prev];
      next[idx] = num;
      return next;
    });
  }

  const totalWeight = weights.reduce((a, b) => a + b, 0);

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 1.5, p: 1.5, borderRadius: 1, bgcolor: "grey.50", flexWrap: "wrap", alignItems: "center" }}
      >
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
          {t.volume}
        </Typography>
        <TextField
          type="number"
          value={volume}
          onChange={(e) => handleVolumeChange(e.target.value)}
          size="small"
          slotProps={{ htmlInput: { min: 0.1, step: 0.1 } }}
          sx={{ width: 90, "& input": { textAlign: "center", fontSize: "0.8125rem" } }}
        />
        <Typography variant="caption" sx={{ color: "text.disabled" }}>×</Typography>
        <TextField
          select
          value={unit}
          onChange={(e) => setUnit(e.target.value as Unit)}
          size="small"
          sx={{ width: 80, "& .MuiSelect-select": { fontSize: "0.8125rem" } }}
        >
          {UNIT_OPTIONS.map((u) => (
            <MenuItem key={u} value={u}>{u}</MenuItem>
          ))}
        </TextField>
        <Typography variant="caption" sx={{ color: "text.secondary", ml: 1 }}>
          = {totalGrams.toLocaleString()} g total
        </Typography>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 500, color: "text.secondary", fontSize: "0.6875rem" }}>{t.tonerCode}</TableCell>
              <TableCell sx={{ fontWeight: 500, color: "text.secondary", fontSize: "0.6875rem" }}>{t.tonerName}</TableCell>
              <TableCell sx={{ fontWeight: 500, color: "text.secondary", fontSize: "0.6875rem" }}>{t.weight}</TableCell>
              <TableCell sx={{ fontWeight: 500, color: "text.secondary", fontSize: "0.6875rem" }}>{t.accum}</TableCell>
              <TableCell sx={{ fontWeight: 500, color: "text.secondary", fontSize: "0.6875rem" }}>{t.massTone}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formula.components.map((comp, idx) => {
              let running = 0;
              for (let i = 0; i <= idx; i++) running += weights[i] ?? 0;

              return (
                <TableRow key={comp.toner_code}>
                  <TableCell sx={{ py: 1, fontSize: "0.6875rem", fontFamily: "monospace", color: "text.disabled" }}>
                    {comp.toner_code}
                  </TableCell>
                  <TableCell sx={{ py: 1, fontSize: "0.8125rem" }}>{comp.toner_name}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <TextField
                      type="number"
                      value={weights[idx] ?? ""}
                      onChange={(e) => handleWeightChange(idx, e.target.value)}
                      size="small"
                      slotProps={{ htmlInput: { min: 0, step: 0.1 } }}
                      sx={{ width: "100%", "& input": { fontSize: "0.8125rem", py: 0.5 } }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1, fontVariantNumeric: "tabular-nums", fontWeight: 500, fontSize: "0.8125rem" }}>
                    {running.toFixed(1)}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box
                      sx={{ height: 28, width: "100%", borderRadius: 0.5, border: 1, borderColor: "grey.200" }}
                      style={{ backgroundColor: massToneColor(comp) }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow sx={{ "& td": { fontWeight: 700, fontSize: "0.8125rem", bgcolor: "grey.50" } }}>
              <TableCell colSpan={5}>
                <Box component="span">{t.totalWeightLabel}</Box>
                <Box component="span" sx={{ fontVariantNumeric: "tabular-nums" }}>
                  &nbsp;&nbsp;&nbsp;{totalWeight.toFixed(1)} g
                </Box>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}
