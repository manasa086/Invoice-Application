import React,{Fragment, useEffect, useState} from 'react';
// import csc from 'country-state-city';
import { useForm } from 'react-hook-form';
import {useHistory} from "react-router-dom";
import routes from '../routes';
import { Col, Row, Button, Form, FormGroup, Label, input,Input } from 'reactstrap';

const Home=()=>{
    const history=useHistory();
    const [islogin,setLogin]=useState(true);
    const [isAdmin,setAdmin]=useState(false);
  const [resultdata,setResultData]=useState("");
  const [resultdata1,setResultData1]=useState("");
  const { register, handleSubmit,errors } = useForm();

  const changeDisplay=()=>{
    setResultData1("");
    setResultData("");
    setLogin(!islogin);
  }
  const onSubmit=(data)=>{
    fetch("https://react-invoice-application.herokuapp.com/", {method: "POST",
    body: JSON.stringify(data),
    headers: {
        "Content-Type": "application/json"
    }})
    .then((res)=>res.json())
    .then((data1)=>{
      if(data1.message==="data inserted")
      {
          setResultData("Data Successfully Inserted");
          setResultData1("");
      }
      else if(data1.message=="Email Already Exists.Provide new email Address")
      {
        setResultData1("Email Already Exists.Provide new email Address");
        setResultData("");
      }

    })
  }
  const changetoAdmin=()=>{
   history.push(routes.admin)
  }
  const forgotPassword=()=>{
    let data={email:document.getElementById("email").value.toString()}
    console.log(data);
    if(document.getElementById("email").value==="")
    {
      alert("Please enter valid email address");
    }
    else
    {
    console.log(data);
      fetch("https://react-invoice-application.herokuapp.com/forgotpass/",{
      method:"POST",
      body:JSON.stringify(data),
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.message=="Email Sent to your email account. Please Verify")
        {
            setResultData("Email Sent to your email account. Please Verify")
            localStorage.setItem("email",document.getElementById("email").value.toString());
            setResultData1("");
        }
        else
        {
          setResultData("");
          setResultData1("User not found")
        }
    })
    }
  }
    const onSubmit1=(data)=>{
        let email=data.email;
   
        fetch("https://react-invoice-application.herokuapp.com/login/",{
          method:"POST",
          body:JSON.stringify(data),
          headers:{
            "Content-Type":"application/json"
          }
        })
        .then((res)=>res.json())
        .then((data)=>{
          if(data.message==="Success")
          {
            localStorage.setItem("token", data.token);
            localStorage.setItem("email",email);
            setResultData("");
            setResultData1("");
            //alert("Successful");

            history.push(routes.invoice);
          }
          else if(data.message==="Username or Password is incorrect")
          {
            setResultData("Username or Password is incorrect");
            setResultData1("");
          }
          else
          {
            setResultData("");
            setResultData1("User not found");
          }
    
        })
        

    }
    if(islogin)
  {

  return (
    <>
    <h1>Welcome to Invoice Application</h1>
    <div className="aroundDiv">
      
      <div className="top"></div>
      
    <form onSubmit={handleSubmit(onSubmit1)} class="form" >
      <Row form>
      <Col md={1}></Col>
      <Col md={5}>
        <FormGroup>
          <Label for="email">Email</Label>
          <input className="form-control" type="email" name="email" id="email" ref={register({ required: true })} placeholder="Email" />
          {errors.email && "Email is required"}
        </FormGroup>
      </Col>
      <Col md={5}>
        <FormGroup>
          <Label for="password">Password</Label>
          <input className="form-control" type="password" name="password" id="password" ref={register({ required: true })} placeholder="Password" />
          {errors.password && "Password is required"}
        </FormGroup>
      </Col>
      </Row>
      <div className="center">
    <button type="submit" className="btn btn-secondary">Submit</button>
    <p>
    </p>
    <a href="#" onClick={forgotPassword}>Forgot Password</a>
    </div>
    <p className="b">Do you have an account</p>
    <a className="b2" href="#" onClick={changeDisplay}>Sign Up?</a>
    <a className="link" href="#" onClick={changetoAdmin}>Login as Admin</a>
    
  </form>
  {resultdata!=""?<Fragment><b className="b2">{resultdata}</b><br></br></Fragment>:null}
    {resultdata1!=""?<b className="b1">{resultdata1}</b>:null}
  </div>
    </>
    
    
  );
  }
  else
  {
    return (
      <div class="aroundDiv1">
      <div className="top1"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="invoiceHeading">Employee Registration Form</h4>
          <p></p>
      <Row form>
        <Col md={1}></Col>
      <Col md={5}>
        <FormGroup>
          <Label for="name">Name</Label>
          <input className="form-control" type="text" name="name" id="name" ref={register({ required: true })} placeholder="Name" />
          {errors.name && "Name is required"}
        </FormGroup>
      </Col>
      <Col md={5}>
        <FormGroup>
          <Label for="lastname">LastName</Label>
          <input className="form-control" type="text" name="lastname" id="lastname" ref={register({ required: true })} placeholder="Last Name" />
          {errors.lastname && "Last Name is required"}
        </FormGroup>
      </Col>
      </Row>
      <Row form>
        <Col md={1}></Col>
        <Col md={10}>
        <FormGroup>
          <Label for="email">Email</Label>
          <input  className="form-control" type="email" name="email" id="email" ref={register({ required: true })} placeholder="Email" />
          {errors.email && "Email is required"}
        </FormGroup>
        </Col>
        </Row>
        <Row form>
        <Col md={1}></Col>
        <Col md={10}>
    <FormGroup>
      <Label for="password">Password</Label>
      <input className="form-control" type="password" name="password" id="password"  ref={register({ required: true })} placeholder="Password"/>
      {errors.password && "Password is required"}
      
    </FormGroup>
    </Col>
      </Row>    
    <div className="center">
    <button type="submit" className="btn btn-secondary">Submit</button>
    </div>
    <p></p>
    {resultdata!=""?<Fragment><b className="b2">{resultdata}</b><br></br><a href="#" onClick={changeDisplay}>Click this link to login</a></Fragment>:null}
    {resultdata1!=""?<b className="b1">{resultdata1}</b>:null}
  </form>
  </div>

    );
  }
 
    
}

export default Home;