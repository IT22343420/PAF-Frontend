import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmBox = ({ show, title, message, onConfirm, onCancel }) => {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    No
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmBox; 