"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CarMake } from "@/types";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { generateBrandId } from "@/lib/id-generator";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const REGIONS = ["JPN", "EUR", "USA", "CHN", "KOR"] as const;

export default function BrandsPanel() {
  const [brands, setBrands] = useState<CarMake[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CarMake | null>(null);
  const [form, setForm] = useState({ id: "", name: "", region: "JPN" as CarMake["region"] });
  const [error, setError] = useState("");
  const idManuallyEdited = useRef(false);

  useEffect(() => {
    if (!editing && !idManuallyEdited.current && form.name) {
      setForm((prev) => ({ ...prev, id: generateBrandId(form.name) }));
    }
  }, [form.name, editing]);

  const fetchBrands = useCallback(async () => {
    const res = await fetch("/api/admin/brands");
    if (res.ok) setBrands(await res.json());
    setLoading(false);
  }, []);
  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  function openCreate() {
    setEditing(null); setForm({ id: "", name: "", region: "JPN" }); setError(""); idManuallyEdited.current = false; setShowModal(true);
  }
  function openEdit(brand: CarMake) {
    setEditing(brand); setForm({ id: brand.id, name: brand.name, region: brand.region }); setError(""); setShowModal(true);
  }
  async function handleSave() {
    setError("");
    if (!form.id || !form.name) { setError("ID 和名称不能为空"); return; }
    const m = editing ? "PUT" : "POST";
    const res = await fetch("/api/admin/brands", { method: m, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setShowModal(false); fetchBrands(); }
    else { const d = await res.json(); setError(d.error || "保存失败"); }
  }
  async function handleDelete(brand: CarMake) {
    if (!confirm(`确定删除品牌「${brand.name}」吗？`)) return;
    await fetch("/api/admin/brands", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: brand.id }) });
    fetchBrands();
  }

  const columns: GridColDef<CarMake>[] = [
    { field: "id", headerName: "ID", flex: 2, minWidth: 120 },
    { field: "name", headerName: "名称", flex: 2, minWidth: 120 },
    { field: "region", headerName: "产地", flex: 1, minWidth: 80 },
    {
      field: "actions", headerName: "操作", flex: 1, minWidth: 140, sortable: false, filterable: false,
      renderCell: (p) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton onClick={() => openEdit(p.row)} size="small" color="primary" sx={{ "&:hover": { bgcolor: "primary.light", color: "#fff" } }}><EditIcon fontSize="small" /></IconButton>
          <IconButton onClick={() => handleDelete(p.row)} size="small" color="error" sx={{ "&:hover": { bgcolor: "error.light", color: "#fff" } }}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
        <Button onClick={openCreate} variant="contained" size="small">+ 新增品牌</Button>
      </Box>
      <DataGrid
        rows={brands}
        columns={columns}
        getRowId={(r) => r.id}
        loading={loading}
        density="compact"
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        sx={{
          border: 1, borderColor: "grey.200", borderRadius: 1.5,
          "& .MuiDataGrid-columnHeader": { bgcolor: "grey.50", fontWeight: 600 },
          "& .MuiDataGrid-row:hover": { bgcolor: "rgba(13,148,136,0.04)" },
          "& .MuiDataGrid-cell:focus": { outline: "none" },
        }}
      />

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editing ? "编辑品牌" : "新增品牌"}</DialogTitle>
        <DialogContent><Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
          <TextField label="ID（自动生成）" value={form.id} onChange={(e) => { idManuallyEdited.current = true; setForm({ ...form, id: e.target.value }); }} disabled={!!editing} size="small" fullWidth />
          <TextField label="名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} size="small" fullWidth />
          <TextField select label="产地" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value as CarMake["region"] })} size="small" fullWidth>
            {REGIONS.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>
          {error && <Box sx={{ color: "error.main", fontSize: "0.8125rem" }}>{error}</Box>}
        </Box></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowModal(false)} variant="outlined">取消</Button>
          <Button onClick={handleSave} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
