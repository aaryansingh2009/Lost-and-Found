import './header.css';

function Header() {
    return (
        <header className="find-header">
            <div className="lost-found-logo">
                <a href="/" aria-label="Saber Roar Store home">
                    <img className="lost-found-logo" src="/images/lostnfound-logo.png" alt="Saber Logo" />
                </a>
            </div>
            <nav aria-label="Main navigation">
                <ul className="store-nav">
                    <li className="nav-item">
                        <a href="/">Home</a>
                    </li>
                    <li className="nav-item">
                        <a href="/products">Products</a>
                    </li>
                    {/* Create a new item for a post button */}
                    {/* <li className="nav-item" nav-item-create>
                        <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                    </li> */}
                    <li className="nav-item">
                        <a href="/contact">Contact Us</a>
                    </li>
                    <li className="nav-item nav-item-log-in">
                        <a href="/login">Log in</a>
                    </li>
                    <li className="nav-item nav-item-sign-up">
                        <a href="/signup">Sign Up</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;