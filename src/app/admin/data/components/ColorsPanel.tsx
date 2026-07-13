"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CarMake, Color, ColorVariant } from "@/types";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { generateColorId } from "@/lib/id-generator";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const COLOR_TYPES = ["solid", "metallic", "pearl", "matte", "candy", "special"] as const;

interface ColorRow extends Color {
  brandName: string;
  variantCount: number;
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
  const [error, setError] = useState("");
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

  function openCreate() {
    setEditing(null); setForm({ id: "", make_id: "", color_code: "", color_name: "", color_type: "solid", hex_preview: "#FFFFFF", car_model: "" });
    setVariantIds([]); setError(""); idManuallyEdited.current = false; setShowModal(true);
  }
  function openEdit(c: Color) {
    setEditing(c); setForm({ id: c.id, make_id: c.make_id, color_code: c.color_code, color_name: c.color_name, color_type: c.color_type, hex_preview: c.hex_preview, car_model: c.car_model ?? "" });
    setVariantIds(c.variants.map((v) => v.id)); setError(""); setShowModal(true);
  }
  async function handleSave() {
    setError("");
    if (!form.id || !form.make_id || !form.color_code || !form.color_name) { setError("所有字段不能为空"); return; }
    const m = editing ? "PUT" : "POST";
    const res = await fetch("/api/admin/colors", { method: m, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, variantIds }) });
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
  const rows: ColorRow[] = colors.map((c) => ({ ...c, brandName: brandMap.get(c.make_id) ?? c.make_id, variantCount: c.variants.length }));

  const columns: GridColDef<ColorRow>[] = [
    {
      field: "hex_preview", headerName: "预览", width: 60, sortable: false, filterable: false,
      renderCell: (p) => <Box sx={{ width: 32, height: 20, borderRadius: 0.5, border: 1, borderColor: "grey.200", bgcolor: p.value }} />,
    },
    { field: "color_code", headerName: "颜色代码", flex: 1.2, minWidth: 100 },
    { field: "color_name", headerName: "颜色名称", flex: 1.5, minWidth: 140 },
    { field: "car_model", headerName: "车型", flex: 1, minWidth: 100, valueGetter: (_, r) => r.car_model || "—" },
    { field: "brandName", headerName: "品牌", flex: 1.2, minWidth: 100 },
    { field: "color_type", headerName: "类型", flex: 0.8, minWidth: 80 },
    { field: "variantCount", headerName: "变体", width: 70, type: "number" },
    {
      field: "actions", headerName: "操作", width: 100, sortable: false, filterable: false,
      renderCell: (p) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton onClick={() => openEdit(p.row)} size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
          <IconButton onClick={() => handleDelete(p.row)} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
        <Button onClick={openCreate} variant="contained" size="small">+ 新增颜色</Button>
      </Box>
      <DataGrid
        rows={rows} columns={columns} getRowId={(r) => r.id} loading={loading}
        density="compact" autoHeight disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        sx={{
          border: 1, borderColor: "grey.200", borderRadius: 1.5,
          "& .MuiDataGrid-columnHeader": { bgcolor: "grey.50", fontWeight: 600 },
          "& .MuiDataGrid-row:hover": { bgcolor: "rgba(13,148,136,0.04)" },
          "& .MuiDataGrid-cell:focus": { outline: "none" },
        }}
      />

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
