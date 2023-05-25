import './Login.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'font-awesome/css/font-awesome.min.css';

export default function Login(props) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username: username, password: password }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                if (data.statusCode === 200) {
                    localStorage.setItem('user', JSON.stringify(data.data.user_details));
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('loggedIn', true);
                    window.location.href = "/chat";
                }
                else {
                    alert(data.message);
                }
            })
            .catch(err => err);
    }

    return (
        <div className="container">
            <div className="form-box">
                <div className="header-form">
                    <h4 className="text-primary text-center"><i className="fa fa-user-circle" style={{ fontSize: "110px" }}></i></h4>
                    <div className="image">
                    </div>
                    <div className='text-center' style={{ color: "white", fontSize: "30px" }}>
                        Login
                    </div>
                </div>
                <div className="body-form">
                    <form onSubmit={handleLoginSubmit}>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Username" value={username}
                                onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" className="form-control" placeholder="Password" value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='text-center'><button type="submit" disabled={!username || !password} className="btn btn-secondary btn-block">LOGIN</button></div>
                    </form>
                    <div className='text-center' style={{ paddingTop: "20px" }}>
                        <a href="/register" style={{ color: "white" }}>You are not registered? Click here</a>
                    </div>
                </div>
            </div>
        </div>
    );
}