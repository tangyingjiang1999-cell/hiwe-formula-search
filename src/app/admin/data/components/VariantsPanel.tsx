"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ColorVariant } from "@/types";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { generateVariantId } from "@/lib/id-generator";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function VariantsPanel() {
  const [variants, setVariants] = useState<ColorVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ColorVariant | null>(null);
  const [form, setForm] = useState({ id: "", name: "", year_range: "" });
  const [error, setError] = useState("");
  const idManuallyEdited = useRef(false);

  useEffect(() => { if (!editing && !idManuallyEdited.current && form.name) setForm((prev) => ({ ...prev, id: generateVariantId(form.name) })); }, [form.name, editing]);
  const fetchVariants = useCallback(async () => { const r = await fetch("/api/admin/variants"); if (r.ok) setVariants(await r.json()); setLoading(false); }, []);
  useEffect(() => { fetchVariants(); }, [fetchVariants]);

  function openCreate() { setEditing(null); setForm({ id: "", name: "", year_range: "" }); setError(""); idManuallyEdited.current = false; setShowModal(true); }
  function openEdit(v: ColorVariant) { setEditing(v); setForm({ id: v.id, name: v.name, year_range: v.year_range }); setError(""); setShowModal(true); }
  async function handleSave() {
    setError(""); if (!form.id || !form.name || !form.year_range) { setError("所有字段不能为空"); return; }
    const m = editing ? "PUT" : "POST";
    const r = await fetch("/api/admin/variants", { method: m, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (r.ok) { setShowModal(false); fetchVariants(); } else { const d = await r.json(); setError(d.error || "保存失败"); }
  }
  async function handleDelete(v: ColorVariant) { if (!confirm(`确定删除变体「${v.name}」吗？`)) return; await fetch("/api/admin/variants", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: v.id }) }); fetchVariants(); }

  const columns: GridColDef<ColorVariant>[] = [
    { field: "id", headerName: "ID", flex: 2, minWidth: 140 },
    { field: "name", headerName: "名称", flex: 2, minWidth: 120 },
    { field: "year_range", headerName: "年份范围", flex: 2, minWidth: 140 },
    { field: "actions", headerName: "操作", flex: 1, minWidth: 100, sortable: false, filterable: false,
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
        <Button onClick={openCreate} variant="contained" size="small">+ 新增变体</Button>
      </Box>
      <DataGrid rows={variants} columns={columns} getRowId={(r) => r.id} loading={loading}
        density="compact" autoHeight disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        sx={{ border: 1, borderColor: "grey.200", borderRadius: 1.5, "& .MuiDataGrid-columnHeader": { bgcolor: "grey.50", fontWeight: 600 }, "& .MuiDataGrid-row:hover": { bgcolor: "rgba(13,148,136,0.04)" } }}
      />
      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editing ? "编辑变体" : "新增变体"}</DialogTitle>
        <DialogContent><Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
          <TextField label="ID" value={form.id} onChange={(e) => { idManuallyEdited.current = true; setForm({ ...form, id: e.target.value }); }} disabled={!!editing} size="small" fullWidth />
          <TextField label="名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} size="small" fullWidth />
          <TextField label="年份范围" value={form.year_range} onChange={(e) => setForm({ ...form, year_range: e.target.value })} size="small" fullWidth />
          {error && <Box sx={{ color: "error.main", fontSize: "0.8125rem" }}>{error}</Box>}
        </Box></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}><Button onClick={() => setShowModal(false)} variant="outlined">取消</Button><Button onClick={handleSave} variant="contained">保存</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
