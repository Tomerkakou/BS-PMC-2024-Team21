
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import Scrollbar from 'components/scrollbar';
import TableRowsLoader from 'components/table';
import TableEmptyRows from 'components/table/table-empty-rows';
import TableNoData from 'components/table/table-no-data';
import { applyFilter, emptyRows, getComparator } from 'components/table/utils';
import { useEffect, useState } from 'react';
import StudentsTableHead from './student-average-table-head.jsx';
import StudentsTableRow from './student-average-table-row.jsx';



// ----------------------------------------------------------------------

export default function StudentsTableView() {
  const [students, setStudents] = useState([]);
  const [loading,setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

   useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/lecturer/student-subject-averages");
        const data = response.data;
        console.log(data);
        setStudents(data);
        setLoading(false);

      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const dataSorted = applyFilter({
    inputData: students,
    comparator: getComparator(order, orderBy),
    filterName:'',
  });

  const notFound = !students.length;
  return (
      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <StudentsTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                rowCount={students.length}
                headLabel={[
                  { id: 'student_name', label: 'Name' },
                  { id: 'CSHARP', label: 'C#' },
                  { id: 'Java', label: 'Java' },
                  { id: 'JavaScript', label: 'JavaScript' },
                  { id: 'Python', label: 'Python' },
                  { id: 'SQL', label: 'SQL' },
                ]}
              />
              <TableBody>
                {!loading && dataSorted
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <StudentsTableRow
                      key={row.student_name}
                      name={row.student_name}
                      subjects={[row.CSHARP, row.Java, row.JavaScript, row.Python, row.SQL]}

                    />
                  ))}
                {loading && <TableRowsLoader rowsNum={rowsPerPage} cellNum={6} />}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, dataSorted.length)}
                />

                {notFound && <TableNoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
  );
}
