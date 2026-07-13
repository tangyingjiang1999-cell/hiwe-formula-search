"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/LanguageContext";
import type { FormulaTableRow } from "@/types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

export interface SearchResultsProps {
  rows: FormulaTableRow[];
  isLoading: boolean;
  hasSearched: boolean;
  onOpenFormula: (row: FormulaTableRow) => void;
}

function colorSwatchStyle(hex: string): React.CSSProperties {
  return {
    backgroundColor: hex,
    backgroundImage:
      "linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.12) 16%, rgba(0,0,0,0) 32%, rgba(255,255,255,0.28) 42%, rgba(255,255,255,0.50) 50%, rgba(255,255,255,0.28) 58%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.12) 84%, rgba(0,0,0,0.32) 100%)",
  };
}

function SkeletonRows() {
  return (
    <TableBody>
      {[0, 1, 2, 3, 4].map((i) => (
        <TableRow key={i}>
          <TableCell><Skeleton variant="rounded" width={40} height={20} /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" width="60%" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" width={40} /></TableCell>
          <TableCell><Skeleton variant="text" width={60} /></TableCell>
          <TableCell><Skeleton variant="circular" width={28} height={28} /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default function SearchResults({
  rows,
  isLoading,
  hasSearched,
  onOpenFormula,
}: SearchResultsProps) {
  const { t } = useLang();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(0);
  }, [rows]);

  if (isLoading) {
    return (
      <Box>
        <Typography variant="caption" sx={{ color: "text.secondary", ml: 1 }}>
          <Skeleton variant="text" width={180} />
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
          <Table size="small">
            <SkeletonRows />
          </Table>
        </TableContainer>
      </Box>
    );
  }

  if (!hasSearched) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {t.searchHint}
        </Typography>
      </Box>
    );
  }

  if (rows.length === 0) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <SearchOffIcon sx={{ fontSize: 56, color: "grey.300", mb: 2 }} />
        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
          {t.noResults}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5 }}>
          {t.noResultsHint}
        </Typography>
      </Box>
    );
  }

  const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Typography variant="caption" sx={{ color: "text.secondary", ml: 1 }}>
        {t.foundFormulas(rows.length)}
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 500, color: "text.disabled", fontSize: "0.6875rem" }}></TableCell>
              <TableCell sx={{ fontWeight: 500, color: "text.disabled", fontSize: "0.6875rem" }}>{t.manufacturerLabel}</TableCell>
              <TableCell sx={{ fontWeight: 500, color: "text.disabled", fontSize: "0.6875rem" }}>{t.carModelLabel}</TableCell>
              <TableCell sx={{ fontWeight: 500, color: "text.disabled", fontSize: "0.6875rem" }}>{t.codeLabel}</TableCell>
              <TableCell sx={{ fontWeight: 500, color: "text.disabled", fontSize: "0.6875rem" }}>{t.colorName}</TableCell>
              <TableCell sx={{ fontWeight: 500, color: "text.disabled", fontSize: "0.6875rem" }}>{t.yearsLabel}</TableCell>
              <TableCell sx={{ fontWeight: 500, color: "text.disabled", fontSize: "0.6875rem" }}>{t.versionLabel}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 500, color: "text.disabled", fontSize: "0.6875rem" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((row) => (
              <TableRow key={row.formula.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell sx={{ py: 1.5 }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: 32,
                      height: 16,
                      borderRadius: 0.5,
                      border: 1,
                      borderColor: "grey.200",
                    }}
                    style={colorSwatchStyle(row.color.hex_preview)}
                  />
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" noWrap>{row.makeName}</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" noWrap sx={{ color: "text.primary" }}>
                    {row.color.car_model || "—"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="caption" sx={{ fontFamily: "monospace", color: "grey.400" }}>
                    {row.color.color_code}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" noWrap>{row.color.color_name}</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {row.variant?.year_range ?? "-"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2">{row.formula.version}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ py: 1.5 }}>
                  <IconButton
                    onClick={() => onOpenFormula(row)}
                    size="small"
                    sx={{ color: "text.secondary", "&:hover": { bgcolor: "rgba(13,148,136,0.08)", color: "primary.main" } }}
                  >
                    <ZoomInIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
          labelRowsPerPage={t.pageSizeLabel}
        />
      </TableContainer>
    </Box>
  );
}
