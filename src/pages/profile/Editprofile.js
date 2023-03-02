import React from 'react'

import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Editprofile(props) {
    const [open, setOpen] = React.useState(false);
  
    const handleClickToOpen = () => {
      setOpen(true);
    };
    
    const handleToClose = () => {
      setOpen(false);
    };
    
    return (
      <div stlye={{}}>
        
        <Button variant="outlined" color="primary" 
                onClick={handleClickToOpen}
                sx={{ marginBottom: "5px", color: "#57636F", border: "none", fontStyle: "italic", '&:hover': { border: "none", backgroundColor: "#57636f", color: "#fff", fontStyle: "normal" } }}>
          Edit Profile
        </Button>
        <Dialog open={open} onClose={handleToClose}>
          <DialogTitle>{"Edit Profile"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.children}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleToClose} 
                    color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}
