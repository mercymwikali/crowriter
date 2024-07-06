import { Card, Divider, Input, Select, Button, Tabs, Segmented, Slider, Table, Modal } from 'antd';
import { AppstoreOutlined, BarsOutlined, FileDoneOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { BsFilterSquare } from 'react-icons/bs';
import { Categories } from '../constants/Categories'; // Adjust the import path as needed

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const CompletedJobs = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [budgetRange, setBudgetRange] = useState([0, 1000]);
    const [jobs, setJobs] = useState([]); // Replace with your jobs data source
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [viewMode, setViewMode] = useState('List');

    const handleCreateInvoice = (job) => {
        // Logic for navigating to theDelete Submission page, passing job details if needed
        console.log(`Creating invoice for job: ${job.orderId}`);
        // Example: Navigate toDelete Submission page
        // history.push(`/create-invoice/${job.orderId}`);
    };

    useEffect(() => {
        const mockJobs = [
            {
                orderId: '123',
                budget: 500,
                topic: 'Web Development',
                instructions: 'Develop a responsive web application using React and Node.js...',
                category: 'Development',
                status: 'Completed',
            },
            {
                orderId: '126',
                budget: 600,
                topic: 'Content Writing',
                instructions: 'Write SEO-friendly content for our new website...',
                category: 'Writing',
                status: 'Completed',
            },
        ];

        setJobs(mockJobs);
    }, []);

    useEffect(() => {
        let filtered = jobs;

        if (searchText) {
            filtered = filtered.filter(
                (job) =>
                    job.orderId.toLowerCase().includes(searchText) ||
                    job.topic.toLowerCase().includes(searchText)
            );
        }

        if (selectedCategory.length > 0) {
            filtered = filtered.filter((job) =>
                selectedCategory.includes(job.category)
            );
        }

        filtered = filtered.filter(
            (job) => job.budget >= budgetRange[0] && job.budget <= budgetRange[1]
        );

        setFilteredJobs(filtered);
    }, [searchText, selectedCategory, budgetRange, jobs]);

    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const handleBudgetChange = (value) => {
        setBudgetRange(value);
    };

    const clearFilters = () => {
        setSearchText('');
        setSelectedCategory([]);
        setBudgetRange([0, 1000]);
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
        },
        {
            title: 'Budget',
            dataIndex: 'budget',
            key: 'budget',
            render: (text) => `$${text}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, job) => (
                <div>
                    <Button 
                        type="primary" 
                        icon={<FileDoneOutlined />} 
                        onClick={() => handleCreateInvoice(job)}
                        danger
                    >
                       Delete Submission
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h4>Completed Jobs</h4>
            <div className="d-block d-md-flex">
                <div className="w-25" style={{ marginTop: '20px', border: '1px solid #f3f3f3', padding: '10px', borderRadius: '5px', height: 'fit-content' }}>
                    <div className="d-flex align-items-center justify-content-between w-100 ">
                        <div className="gap-2">
                            <span className='h6 text-secondary'>Filter By:</span>
                            <BsFilterSquare className='text-secondary my-1' />
                        </div>
                        <div>
                            <span className='text-secondary text-decoration-underline text-end cursor-pointer' onClick={clearFilters}>Clear Filters</span>
                        </div>
                    </div>
                    <Divider />
                    <div className='my-3'>
                        <h6>Category</h6>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Select a Category"
                            onChange={handleCategoryChange}
                            value={selectedCategory}
                        >
                            {Categories.map((category) => (
                                <Option key={category.value} value={category.value}>
                                    {category.label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <Divider />
                    <div className='my-3'>
                        <h6>Budget</h6>
                        <Slider
                            range
                            defaultValue={[0, 1000]}
                            max={1000}
                            onChange={handleBudgetChange}
                            value={budgetRange}
                        />
                    </div>
                    <Divider />
                </div>

                <div className="flex-grow-1 p-3">
                    <h6>Search Completed Jobs</h6>
                    <Search
                        placeholder="Search by Order ID or Topic"
                        onSearch={handleSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ marginBottom: 20 }}
                    />
                    <Segmented
                        options={[
                            {
                                value: 'List',
                                icon: <BarsOutlined />,
                            },
                            {
                                value: 'Grid',
                                icon: <AppstoreOutlined />,
                            },
                        ]}
                        onChange={(value) => setViewMode(value)}
                        style={{ marginBottom: 20 }}
                    />
                    {viewMode === 'Grid' ? (
                        <div className="row">
                            {filteredJobs.filter(job => job.status === 'Completed').map((job) => (
                                <div key={job.orderId} className="col-md-6">
                                    <Card
                                        title={`${job.orderId} - $${job.budget}`}
                                        extra={<Button type="link">Details</Button>}
                                        style={{ marginBottom: 20 }}
                                    >
                                        <p><strong>Topic:</strong> {job.topic}</p>
                                        <p><strong>Instructions:</strong> {job.instructions.slice(0, 100)}...</p>
                                        <div className="d-flex justify-content-between mt-3">
                                            <Button 
                                                type="primary" 
                                                icon={<FileDoneOutlined />} 
                                                onClick={() => handleCreateInvoice(job)}
                                                danger
                                            >
                                               Delete Submission
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Table
                            dataSource={filteredJobs.filter(job => job.status === 'Completed')}
                            columns={columns}
                            rowKey="orderId"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default CompletedJobs;
