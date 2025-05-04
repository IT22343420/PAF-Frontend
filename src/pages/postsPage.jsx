import React, { useState } from 'react';
import Posts from '../components/posts/posts';
import Header from '../components/header/Header';
import Notification from '../components/common/Notification';

const PostsPage = () => {
  const [notification, setNotification] = useState(null);
  return (
    <div className="main-container" style={{backgroundColor: "aliceblue"}}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Posts onSetNotification={setNotification}/>
    </div>
  );
};

export default PostsPage;