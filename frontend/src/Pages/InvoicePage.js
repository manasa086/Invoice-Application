import React,{Fragment, useEffect,useState} from 'react';
import InvoiceContent from "../Components/InvoiceContent.js";
import TableContent from "../Components/TableContent.js";
import routes from "../routes"; 
import {useParams,useHistory} from "react-router-dom";
import Header from '../Components/Header.js';
import Invoices from '../Components/Invoices';

const InvoicePage = () => {
    const [role,setRole]=useState("");


    const history=useHistory();
    useEffect(()=>{
        console.log(localStorage.getItem("email"));
        let data={email:localStorage.getItem("email"),
        token:localStorage.getItem("token")};
        fetch("https://react-invoice-application.herokuapp.com/getdata",{
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                "Content-Type":"application/json"
            }

        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data.message.role);
            setRole(data.message.role.toString())
            console.log(role)
        });
        
    },[]);

    if(role!="")
    {
    if(role==="1")
    {
    return (
        <div>
            <h1>{localStorage.getItem("email")}</h1>
        </div>
    );
    }
    else if(role==="2")
    {
        const generatePDF=(id)=>{
            history.push(routes.pdfadmin.replace(":id",id));
          }
        return (<Fragment>
            <Header></Header>
            <InvoiceContent/>  
            <Invoices generatePDF={generatePDF}/></Fragment>);
    }
    else if(role==="3")
    {
        const generatePDF=(id)=>{
            history.push(routes.pdf.replace(":id",id));
        }

       return( 
           <Fragment>
               <Header></Header>
       <InvoiceContent/>  
       <TableContent generatePDF={generatePDF}/>
       </Fragment> 
       );
    }
    else if(role==="4")
    {
        const generatePDF=(id)=>{
            history.push(routes.pdfadmin.replace(":id",id));
          }
        return (<Fragment>
            <Header></Header>
          
        <Invoices generatePDF={generatePDF}/></Fragment>);
    }
    else
    {
        return null;
    }
    }
    else
    {
        return null;
    }

}

export default InvoicePage;
