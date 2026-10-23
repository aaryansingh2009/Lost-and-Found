import "./header.css";

function Header() {
    return (
        <header className="find-header">
            <div className="lost-found-logo">
                {/* <NavLink to="/" aria-label="Lost and Found Home">
                    <img className="saber-logo" src="/" alt="Lost and Found Logo"/>
                </NavLink> */}
            </div>
            <nav aria-label="Main navigation">
            <ul className="store-nav">
                <li>Home</li>
                <li>Products</li>
                <li>Sign Up</li>
                <li>Log In</li>
            </ul>
            </nav>
        </header>
    );
}   

export default Header;