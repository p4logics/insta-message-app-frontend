import './Register.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'font-awesome/css/font-awesome.min.css';

export default function Register(props) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/user/register`, {
      method: 'POST',
      body: JSON.stringify({ username: username, password: password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => {
        if (data.statusCode === 200) {
          alert("Registered successfully!!");
          window.location.href = "/login";
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
            Register
          </div>
        </div>
        <div className="body-form">
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <input type="text" className="form-control" placeholder="Username" value={username}
                onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-group mb-3">
              <input type="password" className="form-control" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='text-center'><button type="submit" disabled={!username || !password} className="btn btn-secondary btn-block">SUBMIT</button></div>
          </form>
          <div className='text-center' style={{ paddingTop: "20px" }}>
            <a href="/login" style={{ color: "white" }}>You already registered? Click here</a>
          </div>
        </div>
      </div>
    </div>
  );
}