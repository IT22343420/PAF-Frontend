import React, { useState, useEffect, useRef } from 'react';
import { Toast, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';

const NotificationItem = ({ notification, onClose: permanentOnClose, className }) => {
    const { id, title, description, createdAt } = notification;
    const [isExpanded, setIsExpanded] = useState(true);
    const [showUndo, setShowUndo] = useState(false);
    const undoTimerRef = useRef(null);

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        if (seconds < 5) return "just now";
        return Math.floor(seconds) + " seconds ago";
    };

    const handleToggleExpand = (e) => {
        if (e.target.closest('.btn-close')) {
            return;
        }
        setIsExpanded(!isExpanded);
    };

    const handleTemporaryDismiss = () => {
        setIsExpanded(false);
        setShowUndo(true);
        if (undoTimerRef.current) {
            clearTimeout(undoTimerRef.current);
        }
        undoTimerRef.current = setTimeout(() => {
            permanentOnClose(id);
        }, 5000);
    };

    const handleUndoDismiss = () => {
        setShowUndo(false);
        setIsExpanded(true);
        if (undoTimerRef.current) {
            clearTimeout(undoTimerRef.current);
            undoTimerRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (undoTimerRef.current) {
                clearTimeout(undoTimerRef.current);
            }
        };
    }, []);

    if (showUndo) {
        return (
            <div 
                className={`p-2 ${className || ''} d-flex justify-content-between align-items-center bg-primary-subtle text-muted small`}
                style={{ minHeight: '58px' }}
            >
                <span className="text-primary-emphasis">'{title}' removed.</span>
                <Button variant="primary" size="sm" onClick={handleUndoDismiss} className="fw-bold">
                    Undo
                </Button>
            </div>
        );
    }

    return (
        <Toast 
            onClose={handleTemporaryDismiss} 
            className={`notification-toast ${className || ''}`} 
        >
            <Toast.Header 
                closeButton={true} 
                onClick={handleToggleExpand} 
                style={{ cursor: 'pointer' }} 
                className="d-flex justify-content-between align-items-center"
            >
                <strong className="me-auto text-primary-emphasis">{title}</strong>
                <div className="d-flex align-items-center">
                    <small className="text-muted me-2">{timeAgo(createdAt)}</small>
                    {isExpanded ? <ChevronUp size={16} className="text-secondary"/> : <ChevronDown size={16} className="text-secondary"/>}
                </div>
            </Toast.Header>
            {isExpanded && <Toast.Body className="text-primary-emphasis">{description}</Toast.Body>}
        </Toast>
    );
};

NotificationItem.propTypes = {
    notification: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string,
};

NotificationItem.defaultProps = {
    className: '',
};

export default NotificationItem;
