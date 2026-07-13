"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Guide, GuideCategory } from "@/types";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { generateGuideId, generateGuideCategoryId } from "@/lib/id-generator";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface GuideRow extends Guide { categoryName: string; }

export default function GuidesPanel() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<GuideCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editing, setEditing] = useState<Guide | null>(null);
  const [form, setForm] = useState({ id: "", categoryId: "", title: "", titleZh: "", content: "", contentZh: "" });
  const [error, setError] = useState("");
  const [catForm, setCatForm] = useState({ id: "", name: "", nameZh: "" });
  const guideIdEdited = useRef(false);
  const catIdEdited = useRef(false);

  useEffect(() => { if (!editing && !guideIdEdited.current && form.title) setForm((prev) => ({ ...prev, id: generateGuideId(form.title) })); }, [form.title, editing]);
  useEffect(() => { if (!catIdEdited.current && catForm.name) setCatForm((prev) => ({ ...prev, id: generateGuideCategoryId(catForm.name) })); }, [catForm.name]);

  const fetchGuides = useCallback(async () => { const r = await fetch("/api/admin/guides"); if (r.ok) setGuides(await r.json()); setLoading(false); }, []);
  const fetchCategories = useCallback(async () => { const r = await fetch("/api/admin/guide-categories"); if (r.ok) setCategories(await r.json()); }, []);
  useEffect(() => { fetchGuides(); fetchCategories(); }, [fetchGuides, fetchCategories]);

  function openCreate() { setEditing(null); setForm({ id: "", categoryId: categories[0]?.id || "", title: "", titleZh: "", content: "", contentZh: "" }); setError(""); guideIdEdited.current = false; setShowModal(true); }
  function openEdit(g: Guide) { setEditing(g); setForm({ id: g.id, categoryId: g.categoryId, title: g.title, titleZh: g.titleZh, content: g.content, contentZh: g.contentZh }); setError(""); setShowModal(true); }
  async function handleSave() {
    setError(""); if (!form.id || !form.categoryId || !form.title || !form.titleZh) { setError("必填字段不能为空"); return; }
    const m = editing ? "PUT" : "POST";
    const r = await fetch("/api/admin/guides", { method: m, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, sortOrder: 0 }) });
    if (r.ok) { setShowModal(false); fetchGuides(); } else { const d = await r.json(); setError(d.error || "保存失败"); }
  }
  async function handleDelete(g: Guide) { if (!confirm(`确定删除指南「${g.titleZh}」吗？`)) return; await fetch("/api/admin/guides", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: g.id }) }); fetchGuides(); }
  async function handleSaveCategory() {
    if (!catForm.id || !catForm.name || !catForm.nameZh) return;
    await fetch("/api/admin/guide-categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...catForm, sortOrder: 0 }) });
    setCatForm({ id: "", name: "", nameZh: "" }); catIdEdited.current = false; fetchCategories();
  }
  async function handleDeleteCategory(cat: GuideCategory) { if (!confirm(`确定删除「${cat.nameZh}」吗？`)) return; await fetch("/api/admin/guide-categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: cat.id }) }); fetchCategories(); fetchGuides(); }

  const catMap = new Map(categories.map((c) => [c.id, c.nameZh]));
  const filtered: GuideRow[] = (filterCat ? guides.filter((g) => g.categoryId === filterCat) : guides).map((g) => ({ ...g, categoryName: catMap.get(g.categoryId) ?? g.categoryId }));

  const columns: GridColDef<GuideRow>[] = [
    { field: "id", headerName: "ID", flex: 2, minWidth: 140 },
    { field: "titleZh", headerName: "中文标题", flex: 2, minWidth: 140 },
    { field: "title", headerName: "英文标题", flex: 2, minWidth: 140 },
    { field: "categoryName", headerName: "分类", flex: 1.2, minWidth: 100 },
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
      <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: "center" }}>
        <TextField select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} size="small" sx={{ minWidth: 160 }}>
          <MenuItem value="">全部分类</MenuItem>
          {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.nameZh}</MenuItem>)}
        </TextField>
        <Button onClick={() => setShowCatModal(true)} variant="outlined" size="small">管理分类</Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={openCreate} variant="contained" size="small">+ 新增指南</Button>
      </Stack>

      <DataGrid rows={filtered} columns={columns} getRowId={(r) => r.id} loading={loading}
        density="compact" autoHeight disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        sx={{ border: 1, borderColor: "grey.200", borderRadius: 1.5, "& .MuiDataGrid-columnHeader": { bgcolor: "grey.50", fontWeight: 600 }, "& .MuiDataGrid-row:hover": { bgcolor: "rgba(13,148,136,0.04)" } }}
      />

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? "编辑指南" : "新增指南"}</DialogTitle>
        <DialogContent><Stack spacing={2} sx={{ pt: 0.5 }}>
          <TextField label="ID" value={form.id} onChange={(e) => { guideIdEdited.current = true; setForm({ ...form, id: e.target.value }); }} disabled={!!editing} size="small" fullWidth />
          <TextField select label="分类" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} size="small" fullWidth>
            <MenuItem value="">请选择</MenuItem>
            {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.nameZh}</MenuItem>)}
          </TextField>
          <Stack direction="row" spacing={2}>
            <TextField label="英文标题" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} size="small" fullWidth />
            <TextField label="中文标题" value={form.titleZh} onChange={(e) => setForm({ ...form, titleZh: e.target.value })} size="small" fullWidth />
          </Stack>
          <TextField label="英文正文" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} size="small" multiline rows={5} fullWidth />
          <TextField label="中文正文" value={form.contentZh} onChange={(e) => setForm({ ...form, contentZh: e.target.value })} size="small" multiline rows={5} fullWidth />
          {error && <Box sx={{ color: "error.main", fontSize: "0.8125rem" }}>{error}</Box>}
        </Stack></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}><Button onClick={() => setShowModal(false)} variant="outlined">取消</Button><Button onClick={handleSave} variant="contained">保存</Button></DialogActions>
      </Dialog>

      <Dialog open={showCatModal} onClose={() => setShowCatModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>管理分类</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 200, overflow: "auto", mb: 2 }}>
            {categories.map((cat) => (
              <Stack key={cat.id} direction="row" sx={{ justifyContent: "space-between", alignItems: "center", p: 1, border: 1, borderColor: "grey.200", borderRadius: 1 }}>
                <Box sx={{ fontSize: "0.8125rem" }}><Box component="span" sx={{ fontWeight: 500 }}>{cat.nameZh}</Box> <Box component="span" sx={{ color: "text.disabled" }}>({cat.name})</Box></Box>
                <Button onClick={() => handleDeleteCategory(cat)} size="small" color="error">删除</Button>
              </Stack>
            ))}
          </Box>
          <Stack direction="row" spacing={1}>
            <TextField value={catForm.id} onChange={(e) => { catIdEdited.current = true; setCatForm({ ...catForm, id: e.target.value }); }} placeholder="auto" size="small" sx={{ width: 80 }} />
            <TextField value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="英文名" size="small" fullWidth />
            <TextField value={catForm.nameZh} onChange={(e) => setCatForm({ ...catForm, nameZh: e.target.value })} placeholder="中文名" size="small" fullWidth />
          </Stack>
          <Button onClick={handleSaveCategory} variant="contained" size="small" fullWidth sx={{ mt: 1.5 }}>添加分类</Button>
        </DialogContent>
        <DialogActions><Button onClick={() => setShowCatModal(false)} variant="outlined">关闭</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
