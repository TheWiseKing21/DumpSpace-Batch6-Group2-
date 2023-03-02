import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar, SnackbarContent } from "@mui/material";

function CustomSnackbar(props) {
    const { open, message, variant, onClose } = props;

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
        >
            <SnackbarContent
                message={message}
                style={{
                    background: variant === 'success'
                        ? 'radial-gradient(circle, rgba(119,52,81,1) 0%, rgba(62,100,144,1) 60%)'
                        : '#fff'
                }}
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



