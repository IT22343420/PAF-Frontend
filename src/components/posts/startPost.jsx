import React from 'react';
import { Button } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const StartPost = () => {
    const navigate = useNavigate();

    const handleAddPost = () => navigate('/addPost');

    return (
        <div className="w-50 mx-auto">
            <Button 
                variant="outline-primary" 
                className="d-flex align-items-center gap-2 mb-4 w-100"
                onClick={handleAddPost}
                style={{ 
                    padding: '12px 16px',
                    borderRadius: '30px',
                    border: '1px solid #0a66c2',
                    color: '#000000',
                    backgroundColor: 'white',
                    fontWeight: '600'
                }}
            >
                <PencilSquare size={20} />
                <span>Start a post</span>
            </Button>
        </div>
    );
};

export default StartPost; 