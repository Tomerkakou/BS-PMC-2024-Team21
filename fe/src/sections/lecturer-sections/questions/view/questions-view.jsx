
import Card from '@mui/material/Card';
import { Button} from "@mui/material";
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import { useAuth } from 'auth';
import Scrollbar from 'components/scrollbar';
import TableRowsLoader from 'components/table';
import { useEffect, useState } from 'react';
import TableHead from 'components/table/table-head';
import QuestionsTableRow from '../questions-table-row';
import QuestionsTableToolbar from '../questions-table-toolbar';
import TableEmptyRows from 'components/table/table-empty-rows';
import TableNoData from 'components/table/table-no-data';
import { applyFilter, emptyRows, getComparator } from 'components/table/utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Iconify from "components/iconify";



// ----------------------------------------------------------------------

export default function QuestionsView() {
  const [page, setPage] = useState(0);
  const {currentUser}=useAuth();

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [questions,setQuestions] = useState([]);

  const [loading,setLoading] = useState(true);
  const navigate=useNavigate();
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
        const response=await axios.get("/lecturer/questions")
        console.log(response.data);
        setQuestions(response.data);
        // setOtherLecturers(response.data.other)
        setLoading(false)
      }
      catch(e){
        console.log(e)
      }
    })()
  },[currentUser])
 
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = questions.map((n) => n.id);
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
    inputData: questions,
    comparator: getComparator(order, orderBy),
    filterName,
  });


  const handleDeleteQuestions = (questions, resetSelected) => {
    setQuestions((prev) =>
      prev.filter((question) => !questions.find((id) => id === question.id))
    );
    if (resetSelected) {
      setSelected([]);
    }
  };
  

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Questions</Typography>
        <Button
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={() => navigate("/new-question")}
      >
        New Question
      </Button>
      </Stack>

      <Card>
        <QuestionsTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          selected={selected}
          handleDeleteQuestions={handleDeleteQuestions}
        />
        

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead
                order={order}
                orderBy={orderBy}
                rowCount={questions.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'subject', label: 'Subject' },
                  { id: 'qtype', label: 'Type' },
                  { id: 'level', label: 'Level' },
                  {id:''}
                ]}
              />
              <TableBody>
                {!loading && dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <QuestionsTableRow
                      key={row.id}
                      id={row.id}
                      name={row.name}
                      subject={row.subject}
                      type={row.type}
                      level={row.level}
                      selected={(selected.indexOf(row.id) !== -1)}
                      handleClick={(event) => handleClick(event, row.id)}
                      handleDeleteQuestions={handleDeleteQuestions}
                    />
                  ))}
                {loading && <TableRowsLoader rowsNum={rowsPerPage} cellNum={6} />}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, questions.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={questions.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
