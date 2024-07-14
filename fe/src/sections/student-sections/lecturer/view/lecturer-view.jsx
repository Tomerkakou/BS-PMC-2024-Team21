
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import { useAuth } from 'auth';
import axios from 'axios';
import Scrollbar from 'components/scrollbar';
import TableRowsLoader from 'components/table';
import { useEffect, useState } from 'react';
import LecturerTableHead from '../lecturer-table-head';
import LecturerTableRow from '../lecturer-table-row';
import LecturerTableToolbar from '../lecturer-table-toolbar';
import NewLecturer from '../new-lecturer';
import TableEmptyRows from '../table-empty-rows';
import TableNoData from '../table-no-data';
import { applyFilter, emptyRows, getComparator } from '../utils';



// ----------------------------------------------------------------------

export default function LecturerView() {
  const [page, setPage] = useState(0);
  const {currentUser}=useAuth();

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [signedLecturer,setSingedLecturers] = useState([]);
  const [otherLecturer,setOtherLecturers] = useState([]);
  const [loading,setLoading] = useState(true);
  
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  useEffect(()=>{
    (async ()=>{
      try{
        const response=await axios.get("/student/getlecturer")
        setSingedLecturers(response.data.signed)
        setOtherLecturers(response.data.other)
        setLoading(false)
      }
      catch(e){
        console.log(e)
      }
    })()
  },[currentUser])
 
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = signedLecturer.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: signedLecturer,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleNewLecturer = (lecturers) => {
    setSingedLecturers([...lecturers, ...signedLecturer]);
    setOtherLecturers(prev=>prev.filter((lecturer)=>!lecturers.find((l)=>l.id===lecturer.id)))
  }

  const handleDeleteLecturers = (lecturers,resetSelected)=>{
    const addToOther=signedLecturer.filter((lecturer)=>lecturers.find((id)=>id===lecturer.id)).map((lecturer)=>({id:lecturer.id,name:lecturer.name}))
    setSingedLecturers(prev=>prev.filter((lecturer)=>!lecturers.find((id)=>id===lecturer.id)))
    setOtherLecturers(prev=>[...prev,...addToOther])
    if(resetSelected){
      setSelected([])
    }
  }

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Lecturers</Typography>
        <NewLecturer lecturers={otherLecturer} handleNewLecturer={handleNewLecturer}/>
      </Stack>

      <Card>
        <LecturerTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          selected={selected}
          handleDeleteLecturers={handleDeleteLecturers}
        />
        

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <LecturerTableHead
                order={order}
                orderBy={orderBy}
                rowCount={signedLecturer.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {!loading && dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <LecturerTableRow
                      key={row.id}
                      id={row.id}
                      name={row.name}
                      email={row.email}
                      avatarUrl={row.avatar}
                      selected={(selected.indexOf(row.id) !== -1)}
                      handleClick={(event) => handleClick(event, row.id)}
                      handleDeleteLecturers={handleDeleteLecturers}
                    />
                  ))}
                {loading && <TableRowsLoader rowsNum={rowsPerPage} cellNum={4} />}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, signedLecturer.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={signedLecturer.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
