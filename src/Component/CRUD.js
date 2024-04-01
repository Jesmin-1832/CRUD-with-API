import { useEffect, useState } from "react";
import Axios from "axios";
import Container from 'react-bootstrap/Container';
import { Nav, NavDropdown, Pagination, Table } from "react-bootstrap";
import { RiDeleteBinFill } from "react-icons/ri";
import { PiNotePencilBold } from "react-icons/pi";

function CRUD() {

    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        Axios.get("http://localhost:3000/user")
            .then((res) => {
                setData(res.data);
                setFilteredData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getinputvalue = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setUser({ ...user, [name]: value });
        console.log(user);
    };

    const getsubmitdata = (e) => {
        e.preventDefault();
        console.log(user);

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

        if (!user.username) {
            alert("Username Is Required. ");
        } else if (user.username.length < 3) {
            alert('Username Must Be At Least 3 Characters Long');
        } else if (!user.email) {
            alert("Email Is Required. ");
        } else if (!emailPattern.test(user.email)) {
            alert("Enter Valid Email.");
        } else if (!user.phone) {
            alert("Phone No. Is Required.");
        } else if (user.phone.length > 10 || user.phone.length < 10) {
            alert("Phone Number Should Contain 10 Digits");
        } else if (!user.image) {
            alert("Image Is Required.");
        } else if (!urlPattern.test(user.image)) {
            alert("Enter a Valid Image URL.");
        } else {
            if (user.id) {
                Axios.put(`http://localhost:3000/user/${user.id}`, user)
                    .then(() => {
                        setUser({});
                        getData();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                Axios.post("http://localhost:3000/user", user)
                    .then(() => {
                        setUser({});
                        getData();
                        alert("Data Submit");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    };

    const getdeletedata = (id) => {
        Axios.delete(`http://localhost:3000/user/${id}`)
            .then(() => {
                getData();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getupdatedata = (id) => {
        const updateuser = filteredData.find((u) => u.id === id);
        setUser(updateuser);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const filtered = data.filter((u) =>
            u.username.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleSort = (sortBy) => {
        setSortBy(sortBy);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        const sortedData = [...filteredData];
        sortedData.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            } else {
                return a[sortBy] < b[sortBy] ? 1 : -1;
            }
        });
        setFilteredData(sortedData);
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredData.length / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePostsPerPageChange = (value) => {
        setPostsPerPage(value);
        setCurrentPage(1); // Reset to the first page when changing posts per page
    };

    return (
        <Container>
            <div>
                <h2 className="m-3">CRUD WITH API</h2>
                <form method="post" onSubmit={(e) => getsubmitdata(e)}>
                    <Table border={2} striped bordered hover style={{ width: "50%", margin: "0 auto" }}>
                        <tbody>
                            <tr>
                                <td className="text-end">Enter User Name :</td>
                                <td className="text-start"><input type="text" name="username" id="username" value={user.username ? user.username : ""} onChange={(e) => getinputvalue(e)} /></td>
                            </tr>
                            <tr>
                                <td className="text-end">Enter User Email :</td>
                                <td className="text-start"><input type="text" name="email" id="email" value={user.email ? user.email : ""} onChange={(e) => getinputvalue(e)} /></td>
                            </tr>
                            <tr>
                                <td className="text-end">Enter User Phone :</td>
                                <td className="text-start"><input type="text" name="phone" id="phone" value={user.phone ? user.phone : ""} onChange={(e) => getinputvalue(e)} /></td>
                            </tr>
                            <tr>
                                <td className="text-end">Image URL :</td>
                                <td className="text-start"><input type="text" name="image" id="image" value={user.image ? user.image : ""} onChange={(e) => getinputvalue(e)} /></td>
                            </tr>
                            <tr>
                                <td className="text-end"></td>
                                <td className="text-start"><input type="submit" name="submit" className="btn btn-primary" /></td>
                            </tr>
                        </tbody>
                    </Table>
                </form>

                <br />
                <div className="d-flex justify-content-between">
                    <div>
                        <input type="text" placeholder="Search By Name.." className="px-2 p-1 ms-2  d-flex" name="Search" onChange={handleSearch} />
                    </div>
                    <div>
                        <select className="form-select" onChange={(e) => handlePostsPerPageChange(parseInt(e.target.value))}>
                            <option value="5">Show 5 Records</option>
                            <option value="10">Show 10 Records</option>
                            <option value="15">Show 15 Records</option>
                        </select>
                    </div>
                    <div>
                        <Nav className="mx-auto m-0 border border-2 bg-light">
                            <NavDropdown title="⇵ Sorting User">
                                <NavDropdown.Item onClick={() => handleSort("username")}>Sort By Name</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleSort("email")}>Sort By Email</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </div>
                </div>
                <br />
                <Table border={2} striped bordered hover style={{ margin: "0 auto" }}>
                    <tbody>
                        <tr>
                            <th style={{ background: "#212528", color: "white" }}>No.</th>
                            <th style={{ background: "#212528", color: "white" }}>Image</th>
                            <th style={{ background: "#212528", color: "white" }}>Name</th>
                            <th style={{ background: "#212528", color: "white" }}>Email</th>
                            <th style={{ background: "#212528", color: "white" }}>Phone</th>
                            <th style={{ background: "#212528", color: "white" }}>Action</th>
                        </tr>
                        {currentPosts.map((v, i) => {
                            return (
                                <tr style={{ verticalAlign: "middle" }} key={v.id}>
                                    <td>{indexOfFirstPost + i + 1}.</td>
                                    <td><img src={v.image} alt="image" width="60px" height="60px" className="object-fit-cover border border-secondary border-1" /></td>
                                    <td>{v.username}</td>
                                    <td>{v.email}</td>
                                    <td>{v.phone}</td>
                                    <td>
                                        <button onClick={() => getupdatedata(v.id)} className="btn text-success p-2 fs-5"><PiNotePencilBold /></button>
                                        <button onClick={() => getdeletedata(v.id)} className="btn text-danger p-2 fs-5"><RiDeleteBinFill /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <Pagination className="justify-content-center mt-3">
                    {pageNumbers.map(number => (
                        <Pagination.Item key={number} onClick={() => paginate(number)} active={number === currentPage}>
                            {number}
                        </Pagination.Item>
                    ))}
                </Pagination>
                <br />
            </div>
        </Container>
    )
}

export default CRUD;
