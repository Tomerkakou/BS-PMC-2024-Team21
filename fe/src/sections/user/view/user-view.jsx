import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useAuth } from 'auth';
import axios from 'axios';
import Iconify from 'components/iconify';
import Label from 'components/label';
import Scrollbar from 'components/scrollbar';
import { useEffect, useState } from 'react';
import TableEmptyRows from '../table-empty-rows';
import TableNoData from '../table-no-data';
import UserTableHead from '../user-table-head';
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../utils';






// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);
  const {currentUser}=useAuth();

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [users,setUsers] = useState([]);
  
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
        const response=await axios.get("/admin/getusers")
        setUsers(response.data)
        console.log(response.data)
      }
      catch(e){
        console.log(e)
      }
    })()
  },[])
 
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const nonActiveUser = async (event,id_list) =>{

    const response= await axios.post("/admin/nonactive",id_list)
    const nonActiveUsers = response.data.users;
    for(const user of users){
      if (nonActiveUsers.includes(user.id))
      {
        user.status=false;
      }
    }
    setUsers([...users])
    setSelected([]);
  }
  const activedUser = async (event,id_list) =>{

    const response= await axios.post("/admin/activeuser",id_list)
    const activedUsers = response.data.users;
    for(const user of users){
      if (activedUsers.includes(user.id))
      {
        user.status=true;
      }
    }
    setUsers([...users])

    setSelected([]);
  }




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
    console.log(newSelected)
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
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });






  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New User
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          nonActiveUser={(event)=>nonActiveUser(event,selected)}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'role', label: 'Role' },
                  { id: 'verifiedEmail', label: 'Verified', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
              <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
          <TableCell padding="checkbox">
         
          </TableCell>
          <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={currentUser.firstName} src={currentUser.avatar} />
            <Typography variant="subtitle2" noWrap>
              {`${currentUser.firstName} ${currentUser.lastName}`}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{currentUser.email}</TableCell>

        <TableCell>{currentUser.role}</TableCell>

        <TableCell align="center">{'Yes'}</TableCell>

        <TableCell>
          <Label color={ 'success'}>{ 'Active'}</Label>
        </TableCell>

        <TableCell align="right">

        </TableCell>
      </TableRow>

                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      name={row.name}
                      role={row.role}
                      status={row.status}
                      email={row.email}
                      avatarUrl={row.avatar}
                      isVerified={row.verifiedEmail}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      nonActiveUser={(event) => nonActiveUser(event, [row.id])}
                      activeUser={(event) => activedUser(event, [row.id])}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
