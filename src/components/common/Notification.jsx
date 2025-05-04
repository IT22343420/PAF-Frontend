import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const Notification = ({ message, type = 'success', onClose }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            if (onClose) onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!show) return null;

    return (
        <Alert 
            variant={type} 
            onClose={() => {
                setShow(false);
                if (onClose) onClose();
            }} 
            dismissible
            className="position-fixed top-0 end-0 m-3"
            style={{ zIndex: 1000 }}
        >
            {message}
        </Alert>
    );
};

export default Notification; 