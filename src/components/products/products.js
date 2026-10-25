import { useEffect, useState } from "react";
import "./products.css";

const schools = [
    { name: "Ben Franklin Elementary", loadItems: () => import("../../itemData/benfranklin") },
    { name: "Country Dale Elementary", loadItems: () => import("../../itemData/countrydale") },
    { name: "Pleasant View Elementary", loadItems: () => import("../../itemData/pleasantview") },
    { name: "Robinwood Elementary", loadItems: () => import("../../itemData/robinwood") },
    { name: "Southwood Glen Elementary", loadItems: () => import("../../itemData/southwoodglen") },
];

function Products() {
    const [school, setSchool] = useState("");
    const [schoolItems, setSchoolItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [itemsError, setItemsError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [notice, setNotice] = useState("");
    const [studentDetails, setStudentDetails] = useState({
        name: "",
        studentId: "",
        teacher: "",
        school: "",
    });

    useEffect(() => {
        if (!school) {
            setSchoolItems([]);
            setItemsLoading(false);
            return undefined;
        }

        const selectedSchool = schools.find((schoolOption) => schoolOption.name === school);
        if (!selectedSchool) {
            setSchoolItems([]);
            setItemsLoading(false);
            return undefined;
        }

        let isCurrentSchool = true;
        setItemsLoading(true);
        setItemsError("");

        selectedSchool.loadItems()
            .then((module) => {
                if (isCurrentSchool) {
                    setSchoolItems(module.default);
                }
            })
            .catch((error) => {
                if (isCurrentSchool) {
                    console.error(`Unable to load items for ${school}.`, error);
                    setSchoolItems([]);
                    setItemsError(`We couldn't load the lost and found items for ${school}. Please try selecting the school again.`);
                }
            })
            .finally(() => {
                if (isCurrentSchool) {
                    setItemsLoading(false);
                }
            });

        return () => {
            isCurrentSchool = false;
        };
    }, [school]);

    useEffect(() => {
        if (!selectedItem) {
            return undefined;
        }

        function closeOnEscape(event) {
            if (event.key === "Escape") {
                setSelectedItem(null);
            }
        }

        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [selectedItem]);

    function handleSchoolChange(event) {
        setSchool(event.target.value);
        setSearch("");
        setSelectedItem(null);
        setNotice("");
    }

    function openRedeemForm(item) {
        setSelectedItem(item);
        setStudentDetails({
            name: "",
            studentId: "",
            teacher: "",
            school,
        });
    }

    function handleDetailsChange(event) {
        const { name, value } = event.target;
        setStudentDetails((details) => ({ ...details, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        setNotice(`Thanks! Your request for ${selectedItem.name} has been submitted.`);
        setSelectedItem(null);
    }

    const visibleItems = schoolItems.filter((item) =>
        `${item.name} ${item.detail} ${item.category}`.toLowerCase().includes(search.toLowerCase().trim())
    );

    return (
        <main className="products">
            <section className="school-picker" aria-labelledby="school-picker-title">
                <span className="products-eyebrow">Franklin School District</span>
                <h1 id="school-picker-title">Please select your school</h1>
                <p>Choose your school to see its current lost and found items.</p>
                <label className="school-select-label" htmlFor="school-select">Your school</label>
                <select id="school-select" value={school} onChange={handleSchoolChange}>
                    <option value="">Select a school</option>
                    {schools.map((schoolOption) => (
                        <option key={schoolOption.name} value={schoolOption.name}>{schoolOption.name}</option>
                    ))}
                </select>
            </section>

            {school && (
                <section className="dashboard" aria-label={`${school} lost and found`}>
                    <aside className="dashboard-sidebar">
                        <section className="sidebar-panel contact-panel">
                            <span className="panel-icon" aria-hidden="true">✉</span>
                            <h2>Contact Us</h2>
                            <p>Have a question about an item? Get in touch with the school office.</p>
                            <a href="mailto:lostandfound@franklin.k12.wi.us">Email the school office</a>
                        </section>
                        <section className="sidebar-panel school-info">
                            <span className="panel-label">School info</span>
                            <h2>{school}</h2>
                            <p>8222 South 51st Street<br />Franklin, WI 53132</p>
                            <div className="school-hours">
                                <strong>Lost &amp; found hours</strong>
                                <span>Monday–Friday, 7:00 AM–3:00 PM</span>
                            </div>
                        </section>
                    </aside>

                    <div className="dashboard-main">
                        <div className="dashboard-heading">
                            <div>
                                <span className="products-eyebrow">Find what’s missing</span>
                                <h2>Recently found items</h2>
                                <p>Browse the items below and submit a request to claim one.</p>
                            </div>
                            <span className="item-count">{itemsLoading ? "Loading…" : `${visibleItems.length} items`}</span>
                        </div>

                        <div className="instructions">
                            <span className="instructions-mark" aria-hidden="true">i</span>
                            <p><strong>How it works</strong> — See something that belongs to your child? Select <b>Redeem</b> and send us the student details. The school office will follow up.</p>
                        </div>

                        <label className="search-box" htmlFor="item-search">
                            <span aria-hidden="true">⌕</span>
                            <input
                                id="item-search"
                                type="search"
                                aria-label="Search lost and found items"
                                placeholder="Please provide summary"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                            {search && (
                                <button type="button" className="clear-search" onClick={() => setSearch("")} aria-label="Clear search">
                                    ×
                                </button>
                            )}
                        </label>

                        {notice && <p className="success-notice" role="status">{notice}</p>}

                        {itemsLoading ? (
                            <p className="empty-results" role="status">Loading this school’s lost and found items…</p>
                        ) : itemsError ? (
                            <p className="empty-results" role="alert">{itemsError}</p>
                        ) : visibleItems.length > 0 ? (
                            <div className="item-grid">
                                {visibleItems.map((item) => (
                                    <article className="item-card" key={item.id}>
                                        <div className="item-image-wrap">
                                            <img src={item.image} alt={item.alt} loading="lazy" />
                                            <span className="item-category">{item.category}</span>
                                        </div>
                                        <div className="item-card-content">
                                            <h3>{item.name}</h3>
                                            <p>{item.detail}</p>
                                            <button type="button" className="redeem-button" onClick={() => openRedeemForm(item)}>
                                                Redeem <span aria-hidden="true">→</span>
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-results">
                                <span aria-hidden="true">⌕</span>
                                <h3>No matching items</h3>
                                <p>Try a different search or clear your summary.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {selectedItem && (
                <div className="modal-backdrop" onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                        setSelectedItem(null);
                    }
                }}>
                    <section className="redeem-modal" role="dialog" aria-modal="true" aria-labelledby="redeem-title">
                        <button type="button" className="modal-close" onClick={() => setSelectedItem(null)} aria-label="Close redeem form">×</button>
                        <div className="modal-preview">
                            <img src={selectedItem.image} alt={selectedItem.alt} />
                        </div>
                        <div className="modal-content">
                            <span className="products-eyebrow">Item redemption</span>
                            <h2 id="redeem-title">Claim this item</h2>
                            <p className="modal-item-name">{selectedItem.name}</p>
                            <p className="modal-intro">Enter the student’s details and the school office will help reunite them with this item.</p>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="child-name">Child Name</label>
                                <input id="child-name" name="name" type="text" autoComplete="name" value={studentDetails.name} onChange={handleDetailsChange} required />
                                <label htmlFor="child-student-id">Child Student ID</label>
                                <input id="child-student-id" name="studentId" type="text" value={studentDetails.studentId} onChange={handleDetailsChange} required />
                                <label htmlFor="child-teacher">Child Teacher</label>
                                <input id="child-teacher" name="teacher" type="text" value={studentDetails.teacher} onChange={handleDetailsChange} required />
                                <label htmlFor="child-school">School</label>
                                <input id="child-school" name="school" type="text" value={studentDetails.school} onChange={handleDetailsChange} required />
                                <div className="modal-actions">
                                    <button type="button" className="cancel-button" onClick={() => setSelectedItem(null)}>Close</button>
                                    <button type="submit" className="submit-button">Submit request</button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}

export default Products;
