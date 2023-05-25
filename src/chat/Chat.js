import './Chat.css';
import { useEffect, useState } from 'react';
import UserIcon from '../assets/images/user.png';
import dateFormat from 'dateformat';
import SockJsClient from 'react-stomp';

const SOCKET_URL = `${process.env.REACT_APP_API_URL}/ws`;

export default function Chat(props) {

  const [members, setMembers] = useState([]);
  const [member, setMember] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  let onConnected = () => {
    console.log("Connected!!")
  }

  let onMessageReceived = (msg) => {
    getMessageBody(member);
  }

  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      window.location.href = "/login";
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => res.json())
      .then(response => {
        if (response.statusCode === 200) {
          setMembers(response.data);
        }
      })
      .catch(err => err);
  }, []);

  const openMessageBody = () => {
    document.getElementById("message-body").style.display = "block";
  }

  const closeMessageBody = () => {
    document.getElementById("message-body").style.display = "none";
  }

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
    window.location.href = "/login";
  }

  const sendMessage = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/message/add`, {
      method: 'POST',
      body: JSON.stringify({ message: message, receiver: member }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(response => response.json())
      .then(data => {
        if (data.statusCode === 200) {
          setMessage("");
          getMessageBody(member);
        }
        else {
          console.log(data)
        }
      })
      .catch(err => err);
  }

  const getMessageBody = (username) => {
    setMember(username);
    document.getElementById("message-body").style.display = "block";
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/messages/get?username=${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => res.json())
      .then(response => {
        if (response.statusCode === 200) {
          setMessages(response.data);
        }
      })
      .catch(err => err);
  }

  return (
    <div style={{ background: 'blue', height: '100vh' }}>
      <div style={{ bottom: 15, right: 10, position: 'absolute' }}>
        <a style={{ background: 'red', color: 'white', padding: '10px 100px 10px 100px', cursor: 'pointer' }} onClick={() => openMessageBody()}>ChatBot</a>
      </div>

      <div id="message-body" style={{ bottom: 5, right: 10, position: 'absolute', height: '97%', width: '800px', background: 'lightgray', border: '1px solid gray' }}>

        <div className='main-body'>
          <div className='member-body'>
            <div className='heading'>
              All Members
              <i className='fa fa-power-off' style={{ paddingLeft: "94px", cursor: "pointer" }} onClick={() => logout()}></i>
            </div>
            <ul>
              {members.map((item, index) => (
                <li><a className={`${member && member === item.username ? 'active' : ''}`} style={{ display: 'flex', cursor: 'pointer' }} onClick={() => getMessageBody(item.username)}><img
                  src={UserIcon}
                  alt={item.name} className='member-avatar' /> &nbsp;
                  <span style={{ marginTop: '10px', marginLeft: '10px' }}>{item.username}</span></a></li>
              ))}
            </ul>
          </div>
          {
            member ?
              <SockJsClient
                url={SOCKET_URL}
                topics={[`/user/${member}/topic/message`]}
                onConnect={onConnected}
                onDisconnect={console.log("Disconnected!")}
                onMessage={msg => onMessageReceived(msg)}
                debug={false}
              />
              :
              null
          }
          <div className='message-body'>
            <div className='header'>
              <div style={{ display: 'flex', width: '96%' }}><img
                src={UserIcon}
                alt={member}
                height="24px"
                width="24px" />
                <span style={{ marginTop: '2px', marginLeft: '10px' }}>{member}</span>
              </div>
              <div style={{ float: 'right' }}>
                <a style={{ color: 'black', cursor: 'pointer', fontSize: '20px' }} onClick={() => closeMessageBody()}>---</a>
              </div>
            </div>

            <div className="msg-body">
              {messages?.length ? messages.map((item, index) => (
                <div>
                  {item.sender !== member ?
                    <div className="container-msg" style={{ marginLeft: 100 }}>
                      <span className="time-right">{item.message}</span>
                      <br></br>
                      <span className="time-right" style={{ fontSize: '11px', fontWeight: 'bold' }}>{dateFormat(item.createdAt, "mmmm dd, yyyy")}</span>
                    </div>
                    :
                    item.sender === member ?
                      <div className="container-msg darker">
                        <img
                          src={UserIcon}
                          alt={member} />
                        <span className='time-left' style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.sender}</span>
                        <br></br>
                        <span className="time-left">{item.message}</span>
                        <br></br>
                        <span className="time-left" style={{ fontSize: '11px', fontWeight: 'bold' }}>{dateFormat(item.createdAt, "mmmm dd, yyyy")}</span>
                      </div>
                      :
                      null
                  }
                </div>
              ))
                :
                <div style={{ textAlign: "center" }}>No Messages Available</div>
              }
            </div>
            <div style={{ paddingLeft: "30px", display: "flex" }}>
              <input placeholder='Enter message...' className='form-control' value={message}
                onChange={(e) => setMessage(e.target.value)} style={{ width: "95%", height: "47px" }} />
              <button style={{ width: "40px", background: "blue", color: "white" }} disabled={!member || !message} onClick={() => sendMessage()}><i className='fa fa-paper-plane'></i></button>
            </div>
          </div>
        </div>
      </div>

    </div >
  );
}