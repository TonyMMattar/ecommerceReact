import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import EditItemDialog from './EditItemDialog';
import { useNavigate } from "react-router-dom";

// Component for displaying the home page with product list
function Home() {
  // State variables for rows, edit dialog open state, selected row, total rows count, and pagination model
  const [rows, setRows] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 5,
    page: 0,
  });

  // Effect hook to check authentication and fetch data on pagination change
  useEffect(() => { 
        if(!token){
          // Redirect to login page if token is not available
            navigate('/login')
        }
    fetchData();
  }, [paginationModel]);

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
        const skip = (paginationModel.page) * paginationModel.pageSize;
        const response = await fetch(`https://localhost:44331/api/product/list?skip=${skip}&take=${paginationModel.pageSize}`, {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
          });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }else{
        const data = await response.json();
        setTotalRows(data.rowsCount);
        setRows(data.products);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to open edit dialog
  const handleEditOpen = (row) => {
    setSelectedRow(row);
    setEditOpen(true);
  };

  // Function to close edit dialog
  const handleEditClose = () => {
    setSelectedRow(null);
    setEditOpen(false);
  };

  // Function to save/create new/edited item
  // If the item doesn't have an Id we must call the POST Method in order to create a new product, else we update the selected one
  const handleEditSave = async (editedItem) => {
    try {
      const response = await fetch(`https://localhost:44331/api/product`, {
        method: editedItem.id == undefined ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedItem),
      });
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      
      fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Function to handle creating a new product
  const handleCreateNewProduct = () => {
    setSelectedRow({});
    setEditOpen(true);
  };

  // Function to handle user logout
  // We must remove the token on logout so the user can't go back
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login')
  }

  // Columns configuration for DataGrid
  const columns = [ 
    /* { field: 'id', headerName: 'ID', width: 100 }, */
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'uom', headerName: 'UOM', width: 150 },
    { field: 'price', headerName: 'Price', width: 150 },
    {
        field: 'edit',
        headerName: 'Edit',
        width: 100,
        renderCell: (params) => (
        <Button variant="outlined" onClick={() => handleEditOpen(params.row)}>Edit</Button>
        ),
    }, ];

  return (
    <div style={{ height: 500, width: '90%', marginLeft: '5%'}}>
      <Button onClick={handleCreateNewProduct}>Create New Product</Button>
      <Button onClick={handleLogout} style={{float: 'right'}}>Logout</Button>
      <br></br>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={totalRows}
        paginationMode="server"
        /* checkboxSelection */
        /* disableSelectionOnClick */
      />
      <EditItemDialog
        open={editOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
        selectedItem={selectedRow}
      />
    </div>
  );
}

export default Home;