import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

// Component for editing an item in a dialog
function EditItemDialog({ open, onClose, onSave, selectedItem }) {
  // State variable for the edited item
  const [editedItem, setEditedItem] = useState(selectedItem || {});

  // Effect hook to update the edited item when the selected item changes
  useEffect(() => {
    setEditedItem(selectedItem || {});
  }, [selectedItem]);

  // Function to handle dialog close
  // on close (Cancel) we set the item to empty {}
  const handleClose = () => {
    setEditedItem({});
    onClose();
  };

  // Function to handle save action
  const handleSave = () => {
    onSave(editedItem);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          value={editedItem.name || ''}
          onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
          fullWidth
        />
        <TextField
          margin="dense"
          label="UOM"
          value={editedItem.uom || ''}
          onChange={(e) => setEditedItem({ ...editedItem, uom: e.target.value })}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Price"
          type="number"
          value={editedItem.price || ''}
          onChange={(e) => setEditedItem({ ...editedItem, price: e.target.value })}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditItemDialog;