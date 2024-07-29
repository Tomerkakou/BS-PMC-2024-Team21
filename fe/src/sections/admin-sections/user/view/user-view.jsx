
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
import TableRowsLoader from 'components/table'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import TableHead from '../../../../components/table/table-head';
import TableEmptyRows from '../../../../components/table/table-empty-rows';
import TableNoData from '../../../../components/table/table-no-data';
import { applyFilter, emptyRows, getComparator } from '../../../../components/table/utils';




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
        const current={
          id:currentUser.id,
          email:currentUser.email,
          isVerified:true,
          status:true,
          name:`${currentUser.firstName} ${currentUser.lastName}`,
          avatar:currentUser.avatar,
          role:currentUser.role
        }
        setUsers([current,...response.data])
      }
      catch(e){
        console.log(e)
      }
    })()
  },[currentUser])
 
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const deActivateUsers = async (event,id_list) =>{
    try{
      const response=await axios.post("/admin/deactivate-user",id_list)
      const {message,users_id} = response.data;
      for(const user of users){
        if (users_id.includes(user.id))
        {
          user.status=false;
        }
      }
      setUsers([...users])
      toast.success(message)
      setSelected([]);
    }catch(error){
      if(error.response){
        toast.error(error.response.data)
      }
    }
  }
  const activateUsers = async (event,id_list) =>{
    try{
      const response=await axios.post("/admin/activate-user",id_list)
      const {message,users_id} = response.data;
      for(const user of users){
        if (users_id.includes(user.id))
        {
          user.status=true;
        }
      }
      setUsers([...users])
      toast.success(message)
      setSelected([]);
    }catch(error){
      if(error.response){
        toast.error(error.response.data)
      }
    }
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
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          deActivateUsers={(event)=>deActivateUsers(event,selected)}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead
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
                {users.length && dataFiltered
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
                      selected={(selected.indexOf(row.id) !== -1)}
                      handleClick={(event) => handleClick(event, row.id)}
                      deActivateUsers={(event) => deActivateUsers(event, [row.id])}
                      activateUsers={(event) => activateUsers(event, [row.id])}
                    />
                  ))}
                {!users.length && <TableRowsLoader rowsNum={rowsPerPage} cellNum={6} />}
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
