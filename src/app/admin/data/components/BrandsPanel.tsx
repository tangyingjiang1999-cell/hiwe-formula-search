"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CarMake } from "@/types";
import { generateBrandId } from "@/lib/id-generator";
import { FONT, HEADER_BG, CELL_FONT_SIZE, COLUMN_BG, ROW_BG, HOVER_BG, HOVER_TRANSITION, tableContainerSx, tableSx, cellSx, headerCellSx, getRowSx, actionButtonSx, deleteButtonSx } from "@/components/admin-table-styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  useEffect(() => {
    setPage(0);
  }, [brands]);

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

  const pageRows = brands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
        <Button onClick={openCreate} variant="contained" size="small">+ 新增品牌</Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={tableContainerSx}>
        <Table sx={tableSx}>
          <TableHead>
            <TableRow sx={{ bgcolor: HEADER_BG }}>
              <TableCell sx={{ ...headerCellSx, width: 120 }}>ID</TableCell>
              <TableCell sx={{ ...headerCellSx, width: 200 }}>名称</TableCell>
              <TableCell sx={{ ...headerCellSx, width: 150 }}>产地</TableCell>
              <TableCell sx={{ ...headerCellSx, width: 100 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((brand, rowIndex) => (
              <TableRow key={brand.id} sx={getRowSx(rowIndex)}>
                <TableCell sx={{ ...cellSx, bgcolor: COLUMN_BG.odd }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: CELL_FONT_SIZE, color: "#374151", fontWeight: 500 }}>
                    {brand.id}
                  </Typography>
                </TableCell>
                <TableCell sx={{ ...cellSx, bgcolor: COLUMN_BG.even }}>
                  <Typography noWrap sx={{ fontFamily: FONT, fontSize: CELL_FONT_SIZE, color: "#1a1a1a" }}>
                    {brand.name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ ...cellSx, bgcolor: COLUMN_BG.odd }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: CELL_FONT_SIZE, color: "#374151" }}>
                    {brand.region}
                  </Typography>
                </TableCell>
                <TableCell sx={{ ...cellSx, bgcolor: COLUMN_BG.even, textAlign: "center" }}>
                  <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                    <IconButton onClick={() => openEdit(brand)} size="small" sx={actionButtonSx}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(brand)} size="small" sx={deleteButtonSx}>
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
          count={brands.length}
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
