import { Skeleton, TableCell, TableRow } from "@mui/material";

const TableRowsLoader = ({ rowsNum,cellNum }:{rowsNum:number,cellNum:number}) => {
    return [...Array(rowsNum)].map((row, index) => (
      <TableRow key={index}>
        <TableCell component="th" scope="row">
          <Skeleton animation="wave" variant="text" />
        </TableCell>
        {Array.from({ length: cellNum - 1 }).map((_,index)=>(
            <TableCell key={'cell'+index}>
            <Skeleton animation="wave" variant="text" />
            </TableCell>
        ))}
      </TableRow>
    ));
  };

export default TableRowsLoader