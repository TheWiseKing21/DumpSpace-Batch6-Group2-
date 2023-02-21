import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar, SnackbarContent } from "@mui/material";

function CustomSnackbar(props) {
    const { open, message, variant, onClose } = props;

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
        >
            <SnackbarContent
                message={message}
                style={{ backgroundColor: variant === 'success' ? '#064670' : '#fff' }}
            />
        </Snackbar>
    );
}

CustomSnackbar.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['success', 'error']).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CustomSnackbar;



