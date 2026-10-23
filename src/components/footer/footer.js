// import React from 'react';
import "./footer.css";

const Footer = () => {
    return (    
        <footer className="store-footer">
            <div className="footer-inner">
                <div className="footer-content">
                    <section className="footer-column">
                        <h2>Get in touch</h2>
                        <a href="/contact">
                            mail: school???
                        </a>
                        <p className="footer-credit">
                            Powered by the members of the FHS STEM Club:
                            <br />
                            Aaryan S, Aayush S, Adhvik R
                        </p>
                    </section>

                    <section className="footer-column">
                        <h2>Visit us</h2>
                        <address>
                            Franklin High School
                            <br />
                            8222 South 51st Street
                            <br />
                            Franklin, WI 53132
                        </address>
                    </section>
                    <section className="footer-column">
                        <h2>School Hours</h2>
                        <p>Monday - Friday: 7:00 AM - 7:15 PM</p>
                        <p>Monday - Wednesday: 2:35 PM - 3:00 PM</p>
                        <p>Friday: 2:35 PM - 3:00 PM</p>
                    </section>
                </div>
                <div className="footer-bottom">
                    <span>Lost and Found</span>
                    <span>&copy; 2026 Lost and Found. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;