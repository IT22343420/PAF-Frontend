import React, { useEffect, useState } from 'react';
import { Typography, Button, Table, Input, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

const RegisteredUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // Placeholder: Fetching dummy data for multiple users
    // TODO: Replace with actual API call to fetch latest registered users from backend
    const fetchUsers = async () => {
      try {
        // Replace with your actual API endpoint to fetch latest registered users
        // const response = await fetch('/api/latest-registered-users');
        // const data = await response.json();
        // setUsers(data);
        // setFilteredUsers(data);

        // Dummy data for demonstration
        const dummyUsers = [
          { key: '1', name: 'John Doe', email: 'john.doe@example.com' },
          { key: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
          { key: '3', name: 'Peter Jones', email: 'peter.jones@example.com' },
          { key: '4', name: 'Mary Brown', email: 'mary.brown@example.com' },
          { key: '5', name: 'Diluki', email: 'diluki@gmail.com' }, // Added your user to dummy data
        ];
        setUsers(dummyUsers);
        setFilteredUsers(dummyUsers); // Initialize filtered list

      } catch (error) {
        console.error('Error fetching users (using dummy data):', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const results = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleDownloadReport = () => {
    // Frontend placeholder for download based on filtered data.
    // TODO: Implement report generation on backend based on the filtered user list
    console.log('Download report button clicked for filtered users:', filteredUsers);
    if (filteredUsers.length > 0) {
        // Basic example: create a simple text file for download of filtered users
        const reportContent = ['Registered Users Report', ''];
        filteredUsers.forEach(user => {
            reportContent.push(`Name: ${user.name}, Email: ${user.email}`);
        });
        const blob = new Blob([reportContent.join('\n')], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'registered_users_report.txt'; // Download as a text file
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        message.success('Downloading report...');
    } else {
        message.info('No user data to download.');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Title level={2}>Active Learners</Title>
      </div>
      <Space style={{ marginBottom: '16px', width: '100%', justifyContent: 'flex-end' }}>
        <Search
          placeholder="Search by name or email (filters dummy data)"
          allowClear
          enterButton={<SearchOutlined />}
          style={{ width: 300 }}
          onSearch={(value) => setSearchTerm(value)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Space>
      <Table dataSource={filteredUsers} columns={columns} pagination={{ pageSize: 10 }} />

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Button 
          type="primary"
          onClick={handleDownloadReport}
        >
          Download Report (Text File)
        </Button>
      </div>
    </div>
  );
};

export default RegisteredUsersPage; 