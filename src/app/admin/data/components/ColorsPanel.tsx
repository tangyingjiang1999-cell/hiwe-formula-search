"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CarMake, Color, ColorVariant } from "@/types";
import { colorSwatchStyle } from "@/lib/utils";
import { generateColorId } from "@/lib/id-generator";
import { FONT, HEADER_BG, HEADER_FONT_SIZE, CELL_FONT_SIZE, COLUMN_BG, ROW_BG, HOVER_BG, HOVER_TRANSITION, tableContainerSx, tableSx, cellSx, headerCellSx, getRowSx, actionButtonSx, deleteButtonSx } from "@/components/admin-table-styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const COLOR_TYPES = ["solid", "metallic", "pearl", "matte", "candy", "special"] as const;

const COLUMN_WIDTHS = {
  preview: 60,
  colorCode: 120,
  colorName: 150,
  carModel: 120,
  brand: 120,
  colorType: 80,
  variantCount: 70,
  yearCount: 70,
  actions: 100,
};

interface ColorRow extends Color {
  brandName: string;
  variantCount: number;
  yearCount: number;
}

export default function ColorsPanel() {
  const [colors, setColors] = useState<Color[]>([]);
  const [brands, setBrands] = useState<CarMake[]>([]);
  const [allVariants, setAllVariants] = useState<ColorVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Color | null>(null);
  const [form, setForm] = useState({ id: "", make_id: "", color_code: "", color_name: "", color_type: "solid" as Color["color_type"], hex_preview: "#FFFFFF", car_model: "" });
  const [variantIds, setVariantIds] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const idManuallyEdited = useRef(false);

  useEffect(() => {
    if (!editing && !idManuallyEdited.current && form.make_id && form.color_code) {
      setForm((prev) => ({ ...prev, id: generateColorId(form.make_id, form.color_code) }));
    }
  }, [form.make_id, form.color_code, editing]);

  const fetchColors = useCallback(async () => {
    const res = await fetch("/api/admin/colors");
    if (res.ok) setColors(await res.json());
    setLoading(false);
  }, []);
  useEffect(() => { fetchColors(); fetch("/api/admin/brands").then((r) => r.ok ? r.json() : []).then(setBrands); fetch("/api/admin/variants").then((r) => r.ok ? r.json() : []).then(setAllVariants); }, [fetchColors]);

  useEffect(() => {
    setPage(0);
  }, [colors]);

  function openCreate() {
    setEditing(null); setForm({ id: "", make_id: "", color_code: "", color_name: "", color_type: "solid", hex_preview: "#FFFFFF", car_model: "" });
    setVariantIds([]); setYears([]); setError(""); idManuallyEdited.current = false; setShowModal(true);
  }
  function openEdit(c: Color) {
    setEditing(c); setForm({ id: c.id, make_id: c.make_id, color_code: c.color_code, color_name: c.color_name, color_type: c.color_type, hex_preview: c.hex_preview, car_model: c.car_model ?? "" });
    setVariantIds(c.variants.map((v) => v.id)); setYears(c.years || []); setError(""); setShowModal(true);
  }
  async function handleSave() {
    setError("");
    if (!form.id || !form.make_id || !form.color_code || !form.color_name) { setError("所有字段不能为空"); return; }
    const m = editing ? "PUT" : "POST";
    const res = await fetch("/api/admin/colors", { method: m, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, variantIds, years }) });
    if (res.ok) { setShowModal(false); fetchColors(); }
    else { const d = await res.json(); setError(d.error || "保存失败"); }
  }
  async function handleDelete(c: Color) {
    if (!confirm(`确定删除颜色「${c.color_name}」吗？`)) return;
    await fetch("/api/admin/colors", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: c.id }) });
    fetchColors();
  }
  function toggleVariant(id: string) { setVariantIds((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]); }

  const brandMap = new Map(brands.map((b) => [b.id, b.name]));
  const rows: ColorRow[] = colors.map((c) => ({ ...c, brandName: brandMap.get(c.make_id) ?? c.make_id, variantCount: c.variants.length, yearCount: c.years?.length || 0 }));

  const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
        <Button onClick={openCreate} variant="contained" size="small">+ 新增颜色</Button>
      </Box>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 1, border: "1px solid", borderColor: "grey.200" }}
      >
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#1a1a1a" }}>
              <TableCell sx={{ width: COLUMN_WIDTHS.preview, fontWeight: 700, color: "#FFFFFF", fontFamily: FONT, fontSize: HEADER_FONT_SIZE, borderBottom: "2px solid #333", py: 1.5, textAlign: "center" }}>预览</TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.colorCode, fontWeight: 700, color: "#FFFFFF", fontFamily: FONT, fontSize: HEADER_FONT_SIZE, borderBottom: "2px solid #333", py: 1.5, textAlign: "center" }}>颜色代码</TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.colorName, fontWeight: 700, color: "#FFFFFF", fontFamily: FONT, fontSize: HEADER_FONT_SIZE, borderBottom: "2px solid #333", py: 1.5, textAlign: "center" }}>颜色名称</TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.carModel, fontWeight: 700, color: "#FFFFFF", fontFamily: FONT, fontSize: HEADER_FONT_SIZE, borderBottom: "2px solid #333", py: 1.5, textAlign: "center" }}>车型</TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.brand, fontWeight: 700, color: "#FFFFFF", fontFamily: FONT, fontSize: HEADER_FONT_SIZE, borderBottom: "2px solid #333", py: 1.5, textAlign: "center" }}>品牌</TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.colorType, fontWeight: 700, color: "#FFFFFF", fontFamily: FONT, fontSize: HEADER_FONT_SIZE, borderBottom: "2px solid #333", py: 1.5, textAlign: "center" }}>类型</TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.variantCount, fontWeight: 700, color: "#FFFFFF", fontFamily: FONT, fontSize: HEADER_FONT_SIZE, borderBottom: "2px solid #333", py: 1.5, textAlign: "center" }}>变体</TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.yearCount, fontWeight: 700, color: "#FFFFFF", fontFamily: FONT, fontSize: HEADER_FONT_SIZE, borderBottom: "2px solid #333", py: 1.5, textAlign: "center" }}>年份</TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.actions, borderBottom: "2px solid #333", py: 1.5 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  borderBottom: "1px solid #e5e7eb",
                  "&:last-child td": { borderBottom: "none" },
                }}
              >
                <TableCell sx={{ py: 1.4, bgcolor: COLUMN_BG.odd, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Box
                    sx={{ width: 40, height: 24, borderRadius: 0.5, border: 1, borderColor: "grey.200" }}
                    style={colorSwatchStyle(row.hex_preview)}
                  />
                </TableCell>
                <TableCell sx={{ py: 1.4, bgcolor: COLUMN_BG.even, textAlign: "center" }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: CELL_FONT_SIZE, color: "#374151", fontWeight: 500 }}>
                    {row.color_code}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.4, bgcolor: COLUMN_BG.odd, textAlign: "center" }}>
                  <Typography variant="body2" noWrap sx={{ fontFamily: FONT, fontSize: CELL_FONT_SIZE, color: "#1a1a1a" }}>
                    {row.color_name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.4, bgcolor: COLUMN_BG.even, textAlign: "center" }}>
                  <Typography variant="body2" noWrap sx={{ fontFamily: FONT, fontSize: CELL_FONT_SIZE, color: "#374151" }}>
                    {row.car_model || "—"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.4, bgcolor: COLUMN_BG.odd, textAlign: "center" }}>
                  <Typography variant="body2" noWrap sx={{ fontFamily: FONT, fontSize: CELL_FONT_SIZE, fontWeight: 500, color: "#1a1a1a" }}>
                    {row.brandName}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.4, bgcolor: COLUMN_BG.even, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontFamily: FONT, fontSize: CELL_FONT_SIZE, color: "#374151" }}>
                    {row.color_type}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.4, bgcolor: COLUMN_BG.odd, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontFamily: FONT, fontSize: CELL_FONT_SIZE, color: "#374151" }}>
                    {row.variantCount}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.4, bgcolor: COLUMN_BG.even, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontFamily: FONT, fontSize: CELL_FONT_SIZE, color: "#9ca3af" }}>
                    {row.yearCount}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ py: 1.4, bgcolor: COLUMN_BG.odd }}>
                  <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                    <IconButton onClick={() => openEdit(row)} size="small" sx={{ color: "#9ca3af", "&:hover": { bgcolor: "rgba(13,148,136,0.08)", color: "primary.main" } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row)} size="small" sx={{ color: "#9ca3af", "&:hover": { bgcolor: "rgba(239,68,68,0.08)", color: "error.main" } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
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
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="每页行数"
        />
      </TableContainer>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "编辑颜色" : "新增颜色"}</DialogTitle>
        <DialogContent><Stack spacing={2} sx={{ pt: 0.5 }}>
          <TextField label="ID" value={form.id} onChange={(e) => { idManuallyEdited.current = true; setForm({ ...form, id: e.target.value }); }} disabled={!!editing} size="small" fullWidth />
          <TextField select label="品牌" value={form.make_id} onChange={(e) => setForm({ ...form, make_id: e.target.value })} size="small" fullWidth>
            <MenuItem value="">请选择品牌</MenuItem>
            {brands.map((b) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
          </TextField>
          <Stack direction="row" spacing={2}>
            <TextField label="颜色代码" value={form.color_code} onChange={(e) => setForm({ ...form, color_code: e.target.value })} size="small" fullWidth />
            <TextField label="颜色名称" value={form.color_name} onChange={(e) => setForm({ ...form, color_name: e.target.value })} size="small" fullWidth />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField select label="类型" value={form.color_type} onChange={(e) => setForm({ ...form, color_type: e.target.value as Color["color_type"] })} size="small" fullWidth>
              {COLOR_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField label="预览色" type="color" value={form.hex_preview} onChange={(e) => setForm({ ...form, hex_preview: e.target.value })} size="small" sx={{ "& input": { height: 32, p: 0.5 } }} fullWidth />
          </Stack>
          <TextField label="车型" value={form.car_model} onChange={(e) => setForm({ ...form, car_model: e.target.value })} placeholder="例如 Camry / Corolla" size="small" fullWidth />
          <Box>
            <Box sx={{ fontSize: "0.8125rem", fontWeight: 500, mb: 1 }}>适用年份</Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
              {years.map((year) => (
                <Chip
                  key={year}
                  label={year}
                  onDelete={() => setYears(years.filter((y) => y !== year))}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
              {years.length === 0 && <Box sx={{ fontSize: "0.8125rem", color: "text.disabled" }}>暂无年份</Box>}
            </Box>
            <Stack direction="row" spacing={1}>
              <TextField
                label="添加年份"
                type="number"
                size="small"
                sx={{ width: 120 }}
                slotProps={{ htmlInput: { min: 1900, max: 2100 } }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    const val = parseInt(target.value, 10);
                    if (val >= 1900 && val <= 2100 && !years.includes(val)) {
                      setYears([...years, val].sort());
                      target.value = "";
                    }
                  }
                }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                  if (input) {
                    const val = parseInt(input.value, 10);
                    if (val >= 1900 && val <= 2100 && !years.includes(val)) {
                      setYears([...years, val].sort());
                      input.value = "";
                    }
                  }
                }}
              >
                添加
              </Button>
            </Stack>
            <Box sx={{ fontSize: "0.75rem", color: "text.disabled", mt: 0.5 }}>
              按 Enter 或点击「添加」按钮添加年份
            </Box>
          </Box>
          <Box>
            <Box sx={{ fontSize: "0.8125rem", fontWeight: 500, mb: 1 }}>关联变体</Box>
            <Box sx={{ maxHeight: 160, overflow: "auto", border: 1, borderColor: "grey.300", borderRadius: 1, p: 1 }}>
              {allVariants.length === 0 && <Box sx={{ fontSize: "0.8125rem", color: "text.disabled" }}>暂无变体</Box>}
              {allVariants.map((v) => (
                <FormControlLabel key={v.id} control={<Checkbox checked={variantIds.includes(v.id)} onChange={() => toggleVariant(v.id)} size="small" />}
                  label={`${v.name} (${v.year_range})`} />
              ))}
            </Box>
          </Box>
          {error && <Box sx={{ color: "error.main", fontSize: "0.8125rem" }}>{error}</Box>}
        </Stack></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowModal(false)} variant="outlined">取消</Button>
          <Button onClick={handleSave} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
