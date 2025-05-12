import React from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import NotificationItem from './NotificationItem';
import PropTypes from 'prop-types';

const NotificationPanel = ({ 
    show, 
    handleClose, 
    notifications, 
    onClearNotification, 
    onClearAllNotifications 
}) => {
    return (
        <Offcanvas show={show} onHide={handleClose} placement="end" backdrop={true} scroll={false}>
            <Offcanvas.Header closeButton className="bg-primary text-white">
                <Offcanvas.Title as="h5">Notifications</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0"> {/* Remove body padding to make items flush */}
                {notifications.length > 0 && (
                    <div className="text-end p-2 border-bottom">
                        <Button 
                            variant="link" 
                            size="sm" 
                            onClick={() => {
                                onClearAllNotifications();
                                // Optionally close panel after clearing all
                                // handleClose(); 
                            }}
                            className="p-0 text-primary fw-semibold"
                        >
                            Clear All
                        </Button>
                    </div>
                )}
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => {
                        const isLastItem = index === notifications.length - 1;
                        // Use bg-primary-subtle for item background
                        const itemClasses = `border-0 shadow-none w-100 rounded-0 mb-0 bg-primary-subtle ${isLastItem ? '' : 'border-bottom'}`;
                        return (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onClose={onClearNotification} // Pass the single clear handler
                                className={itemClasses}
                            />
                        );
                    })
                ) : (
                    <div className="text-center p-4 text-muted">
                        No new notifications.
                    </div>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

NotificationPanel.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    })).isRequired,
    onClearNotification: PropTypes.func.isRequired,
    onClearAllNotifications: PropTypes.func.isRequired,
};

export default NotificationPanel;
