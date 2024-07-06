import { Button, Card, Progress } from 'antd';
import React, { useRef } from 'react';
import { FaPen, FaRedo, FaEdit, FaSpellCheck, FaLanguage, FaPuzzlePiece, FaEllipsisH } from 'react-icons/fa';
import { services } from '../constants/Services';
import image from '../assets/image.png';
import logo from '../assets/logo.png';

import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const servicesRef = useRef(null);
    const clientsRef = useRef(null);
    const contactEmailRef = useRef(null);
    const contactMessageRef = useRef(null);

    const scrollToServices = () => {
        servicesRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToClients = () => {
        clientsRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleEmailSubmit = (event) => {
        event.preventDefault();
        const email = contactEmailRef.current.value;
        const message = contactMessageRef.current.value;
        // Send email functionality (mockup)
        alert(`Sending email to crowriter@info.com\nEmail: ${email}\nMessage: ${message}`);
        // Clear form fields after submission
        contactEmailRef.current.value = '';
        contactMessageRef.current.value = '';
    };

    const renderHeaderMenu = () => {
        const items = [
            { label: "Home", key: "home", onClick: () => window.scrollTo(0, 0) },
            // { label: "About", key: "about", onClick: () => navigate('/about') },
            { label: "Services", key: "services", onClick: scrollToServices },
            { label: "Clients", key: "clients", onClick: scrollToClients },
            { label: "Contact", key: "contact", onClick: () => contactEmailRef.current.scrollIntoView({ behavior: 'smooth' }) }
        ];

        return (
            <ul className="nav d-flex justify-content-center w-100">
                {items.map(item => (
                    <li className="nav-item" key={item.key}>
                        <a className="nav-link" href="#" onClick={item.onClick}>{item.label}</a>
                    </li>
                ))}
            </ul>
        );
    };

    const renderMainSection = () => {
        return (
            <div className="container d-flex align-items-center" style={{ height: 'calc(100vh - 60px)' }}>
                <div className="row w-100">
                    <div className="col-md-6 d-flex flex-column justify-content-center">
                        <h1 className="display-4 fw-bold">Welcome to Crowriter</h1>
                        <p className="lead">
                            Crowriter comprises a team of dedicated freelancers providing top-notch services to meet your needs.
                            Our services range from Analytical Writing to Technical Writing. Every project is crafted with care and precision to ensure the highest quality.
                        </p>
                        <Button type="primary" className="mt-3" onClick={() => navigate('/signup')}>Hire Us as Freelancers</Button>
                    </div>
                    <div className="col-md-6 d-flex justify-content-center">
                        <img src={image} alt="Freelancers at work" className="img-fluid" />
                    </div>
                </div>
            </div>
        );
    };

    const renderServiceCards = () => {
        const icons = {
            Writing: <FaPen size={40} />,
            Rewriting: <FaRedo size={40} />,
            Editing: <FaEdit size={40} />,
            Proofreading: <FaSpellCheck size={40} />,
            Translation: <FaLanguage size={40} />,
            'Problem-Solving': <FaPuzzlePiece size={40} />,
            Other: <FaEllipsisH size={40} />
        };

        return (
            <div className="container py-5 bg-grey" ref={servicesRef} id="services">
                <h2 className="text-center mb-4 text-capitalize">Our Services</h2>
                <div className="row">
                    {Object.keys(icons).map((key, index) => (
                        <div className="col-md-4 mb-4" key={index}>
                            <Card
                                className="text-center service-card"
                                hoverable
                                style={{ borderColor: '#ff4500', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                bodyStyle={{ padding: '20px' }}
                            >
                                <div className="mb-3">
                                    {icons[key]}
                                </div>
                                <h5>{key}</h5>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderHiringSteps = () => {
        return (
            <div className="container py-5 bg-light gap-3">
                <h2 className="text-center mb-4">Hiring Freelancers - Steps</h2>
                <Progress percent={33} status="active" showInfo={false} />
                <h4>Step 1: Talk to One of Our Industry Experts</h4>
                <p>An expert on our team will work with you to understand your goals, technical needs, and team dynamics.</p>
                <Progress percent={66} status="active" showInfo={false} />
                <h4>Step 2: Work With Hand-Selected Talent</h4>
                <p>Within days, we'll introduce you to the right talent for your project. Average time to match is under 24 hours.</p>
                <Progress percent={100} status="active" />
                <h4>Step 3: The Right Fit, Guaranteed</h4>
                <p>Work with your new team member on a trial basis (pay only if satisfied), ensuring you hire the right people for the job.</p>
            </div>
        );
    };

    const renderClientsSection = () => {
        const testimonials = [
            { quote: "I have been working with Crowriter for over 5 years. They have helped me find the right talent for my project. I highly recommend them!", rating: 5, name: "John Doe", country: "USA" },
            { quote: "Professional and timely delivery. Great service overall!", rating: 4, name: "Jane Smith", country: "Canada" },
            { quote: "Outstanding quality and attention to detail. Definitely recommend!", rating: 4, name: "Michael Johnson", country: "Australia" }
        ];

        return (
            <div className="container py-5 bg-dark text-white" ref={clientsRef} id="clients">
                <h2 className="text-center mb-4">Client Testimonials</h2>
                <div className="row" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    {testimonials.map((testimonial, index) => (
                        <div className="col-md-4 mb-4" key={index}>
                            <Card className="text-start p-4 text-wrap" style={{ width: '100%', height: '100%' }}>
                                <p style={{ fontStyle: 'italic', fontSize: '18px', wordWrap: 'break-word' }}>&#8220;{testimonial.quote}&#8221;</p>
                                <div className="mt-3">
                                    {renderStars(testimonial.rating)}
                                </div>
                                <p className="mt-3">- {testimonial.name}, {testimonial.country}</p>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(<span key={i} className="text-warning">&#9733;</span>);
            } else {
                stars.push(<span key={i} className="text-secondary">&#9733;</span>);
            }
        }
        return stars;
    };

    const renderFooterMenu = () => {
        const items = [
            { label: "Home", key: "home" },
            { label: "About", key: "about" },
            { label: "Services", key: "services" },
            { label: "Clients", key: "clients" },
            { label: "Contact", key: "contact" }
        ];

        return (
            <div className="d-flex justify-content-evenly py-3 gap-3">
                <div className="flex-grow-1 mx-3">
                    <h5>Links</h5>
                    <ul className="nav flex-column">
                        {items.map(item => (
                            <li className="nav-item" key={item.key}>
                                <a className="nav-link text-white" href={`#${item.key}`} onClick={item.onClick}>{item.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex-grow-1 mx-3">
                    <h5>Address</h5>
                    <p>123 Street Name</p>
                    <p>City, State, Zip</p>
                </div>
                <div className="flex-grow-1 mx-3">
                    <h5>Contact Us</h5>
                    <form onSubmit={handleEmailSubmit}>
                        <div className="form-group">
                            <label htmlFor="contactEmail">Email</label>
                            <input type="email" className="form-control" id="contactEmail" ref={contactEmailRef} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactMessage">Message</label>
                            <textarea className="form-control" id="contactMessage" rows="3" ref={contactMessageRef}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary my-2">Submit</button>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-light">
            <header className="bg-grey text-white ">
                <div className="container">
                    <nav className="navbar navbar-expand-lg navbar-dark d-flex justify-content-between align-items-center">
                        <a className="navbar-logo" href="#" style={{ fontWeight: 'bold', color: '#ff4500' }}>
                            <img src={logo} alt="Crowwriter" style={{ width: '140px', height: '87px' }} />
                        </a>
                        <div className="d-flex flex-grow-1">
                            {renderHeaderMenu()}
                        </div>
                        <div className="d-flex align-items-center justify-content-end gap-3">
                            <Button type="primary" className="mr-2" onClick={() => navigate('/signup')}>Apply as a Freelancer</Button>
                            <Button type="default" onClick={() => navigate('/login')}>Login</Button>
                        </div>
                    </nav>
                </div>
            </header>
            <main className="bg-secondary text-white" style={{ paddingTop: '0', marginTop: '0' }}>
                {renderMainSection()}
            </main>
            <section>
                {renderServiceCards()}
                {renderClientsSection()}
                {renderHiringSteps()}

            </section>
            <footer className="bg-dark text-white py-3">
                <div className="container">
                    {renderFooterMenu()}
                </div>
            </footer>
        </div>
    );
};

export default Home;
