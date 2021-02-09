import React from 'react';
import { useHistory } from 'react-router-dom';
import routes from "../routes";
import "../App.css";
import logo from "../Pages/log.png";

const Header = (props) => {

  const history=useHistory();

  const logout=()=>{
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    history.push(routes.home);


  }

  return (
    <div className="table2">
        <img src={logo} className="pull-left img-responsive float-left" width="60px" height="60px"></img>
        <span className="pull-left img-responsive header float-left">Invoice Application</span>
        <button className="btn3 btn-secondary" onClick={logout}>Log out</button>&nbsp;
        <p></p>
      <hr color="black"></hr>  
    </div>
  );
}

export default Header;
