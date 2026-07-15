import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { HEADER_BG, headerCellSx } from "./admin-table-styles";

interface AdminTableHeaderProps {
  columns: Array<{ label: string; width: number }>;
}

export function AdminTableHeader({ columns }: AdminTableHeaderProps) {
  return (
    <TableHead>
      <TableRow sx={{ bgcolor: HEADER_BG }}>
        {columns.map((col, index) => (
          <TableCell
            key={index}
            sx={{
              ...headerCellSx,
              width: col.width,
            }}
          >
            {col.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
