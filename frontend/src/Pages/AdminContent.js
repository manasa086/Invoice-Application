import React,{Fragment, useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import {useHistory} from "react-router-dom";
import routes from '../routes';
import { Col, Row, Button, Form, FormGroup, Label, input,Input } from 'reactstrap';
import Invoices from '../Components/Invoices';
import Header from '../Components/Header';
import InvoiceContent from "../Components/InvoiceContent.js";


const AdminContent=()=>{

    const history=useHistory();
    const [countInvoices,setInvoices]=useState("");

    useEffect(()=>{
      let data={email:localStorage.getItem("email"),
      token:localStorage.getItem("token")};
      fetch("https://react-invoice-application.herokuapp.com/totalInvoicesCount",{
          method:"POST",
          body:JSON.stringify(data),
          headers:{
              "Content-Type":"application/json"
          }
      })
      .then((res)=>res.json())
      .then((data)=>setInvoices(data.message))
  },[])

    const changeRights=()=>{
      history.push(routes.changerights);
    }

    const generatePDF=(id)=>{
      history.push(routes.pdfadmin.replace(":id",id));
    }
    const createInvoice=()=>{
      history.push(routes.invoiceData)
  }
  if(countInvoices)
  {
    return (
      <Fragment>
        <Header></Header>
        <button className="btn btn-secondary button2" onClick={changeRights}>➕  Change Rights</button>
        <button className="btn btn-secondary button3" onClick={createInvoice}>➕ Create New Invoice</button> 
        <p></p>
        <i className="text-center"><b>Total Number of Invoices Created:{countInvoices}</b></i>
        <Invoices generatePDF={generatePDF}/>
      </Fragment>
    )
  }
  else{
    return (<h1 className="blink">Customer Relation Management</h1>)
  } 


}


export default AdminContent;