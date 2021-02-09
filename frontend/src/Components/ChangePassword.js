import React,{Fragment,useEffect,useState} from "react";
import { useForm } from 'react-hook-form';
import { useHistory } from "react-router-dom";
import { Col, Row, Button, Form, FormGroup, Label, input,Input } from 'reactstrap';
import routes from "../routes"




const ChangePassword=()=>{
    const history=useHistory();
    const { register, handleSubmit,errors } = useForm();
    const [values,setValues]=useState({pass1:"",pass2:""});
    const [resultdata,setResultData]=useState("");

    

    const handleChange=(event)=>{

        setValues({
            ...values,
            [event.target.name]: event.target.value
        })

    }
    const onSubmit=(data)=>{

        if(data.pass1!=data.pass2)
        {
            setValues({pass1:"",pass2:""});
            alert("Both passwords do not match");
        }
        else if(data.pass1=="" || data.pass2=="")
        {
            setValues({pass1:"",pass2:""});
            alert("Both passwords do not match");
        }
        else
        {
            let data1={email:localStorage.getItem("email").toString(),
            password:data.pass1}
            
                fetch("https://react-invoice-application.herokuapp.com/changepassword",{
                    method:"PUT",
                    body:JSON.stringify(data1),
                    headers:{
                        "Content-Type":"application/json"
                      }
                })
                .then((res)=>res.json())
                .then((data)=>{
                    if(data.message==="Password changed successfully")
                    {
                        setResultData("Password changed successfully");
                    }
                    else
                    {
                        setResultData(data.message)
                    }
                })
        }

    }
    const loginPage=()=>{

        history.push(routes.home)

    }
return ( 
    <div class="aroundDiv">
      <div className="top"></div>
    <form onSubmit={handleSubmit(onSubmit)} >
        
      <Row form>
      <Col md={1}></Col>
      <Col md={10}>
        <FormGroup>
          <Label for="password">Password</Label>
          <input className="form-control" type="password" value={values.pass1}  onChange={handleChange} ref={register} name="pass1" id="pass1" placeholder="Password" />
        </FormGroup>
      </Col>
      </Row>
      <Row form>
        <Col md={1}></Col>
      <Col md={10}>
        <FormGroup>
          <Label for="password">Confirm-Password</Label>
          <input className="form-control" type="password" value={values.pass2} onChange={handleChange} ref={register} name="pass2" id="pass2" placeholder="Confirm-Password" />
        
        </FormGroup>
      </Col>
      </Row>
      <div className="center">
    <button type="submit" className="btn btn-secondary">Change Password</button>
    </div>
    <p></p>
    {resultdata!=""?<Fragment><b className="b3">{resultdata}</b><br></br></Fragment>:null}
    {resultdata=="Password changed successfully"?<a href="#" className="b4" onClick={loginPage}>Click this link to login</a>:null}
  </form>
  </div>
    )



}
export default ChangePassword;


// window.onbeforeunload=function(e)
// {
//     window.onunload=function()
//     {
//         localStorage.removeItem("email");
//         localStorage.removeItem("token")
//     }
//     return undefined;
// }
// window.onload=function()
// {
//     let email_addr=localStorage.getItem("email");
//     localStorage.setItem("email",email_addr)
//     let token1=localStorage.getItem("token");
//     localStorage.setItem("token",token1)
// }