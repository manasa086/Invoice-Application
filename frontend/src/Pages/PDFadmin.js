import React,{useState,useEffect, Fragment,useRef} from 'react';
import {useParams,useHistory} from "react-router-dom";
import routes from "../routes";
import "../App.css";
import logo from "./log.png";
import { Table } from 'reactstrap';
import Pdf from "react-to-pdf";
import Header from '../Components/Header';

const PDFadmin = () => {
    const [invoice,setInvoice]=useState("");
    const [fromData,setFromData]=useState("");
    const { id }=useParams();
    const ref=useRef();
    const history=useHistory();
    
    useEffect(() => {
        console.log("Hello");
        fetch("https://react-invoice-application.herokuapp.com/getInvoiceById/"+id)
        .then((res)=>res.json())
        .then((data)=>{
            
            if(data.message=="Error in fetching the data")
            {
                setInvoice("Error in fetching the data");
            }
            else
            {
                
                setInvoice(data.message);
                
            }
        });
        if(invoice!="Error in fetching the data" && invoice!="")
        {
            console.log(invoice.email);
        let sendData={
            email:invoice.email
            
        }
        fetch("https://react-invoice-application.herokuapp.com/getdataByEmail/",{
            method:"POST",
            body:JSON.stringify(sendData),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            setFromData(data.message);
        })
        }
        
    }, []);
    const logout=()=>{
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        history.push(routes.home);
    
    
      }
    
    if(invoice)
    {
        if(invoice==="Error in fetching the data")
        {
         return (
            <div>
                <h2>Error in fetching the data</h2>
            </div>
            );
        }
        else
        {
            return (
                <Fragment>
                    <div className="header-table">
        <img src={logo} className="pull-left img-responsive  float-left" width="60px" height="60px"></img>
        <span className="pull-left img-responsive header float-left">Invoice Application</span>
        <button className="btn3 btn-secondary" onClick={logout}>Log out</button>&nbsp;
        <p></p>
      <hr color="black"></hr>  
    </div>
                
                <div ref={ref} className="left">
               
                <div className="container heading-pdf" >
                    <div className="row">
                    <div className="col">
                        <p></p>
                        <span>From</span><br></br>
                        <b>Retail Shop</b>
                        <p>{fromData.email}</p>
                    </div>
                    <div className="col">
                        <p></p>
                        <span>For</span><br></br>
                        <b>{invoice.clientname}</b>
                        <p>{invoice.clientemail}</p>
                    </div>
                    <div className="col">
                    <img src={logo} class="pull-right img-responsive header-image image1 float-right" width="100px" height="100px"></img>
                    <b className="pull-right1 float-right">Think big</b>
                    </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col">
                        <hr></hr>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col top2">
                            <table>
                                <tr><td>Number:</td><td></td><td></td><td>INV{invoice.index}</td></tr>
                                <tr><td>Date:</td><td></td><td></td><td>{invoice.date}</td></tr>
                                <tr><td>Terms:</td><td></td><td></td><td>{invoice.term}</td></tr>
                                <tr><td>Due:</td><td></td><td></td><td>{invoice.duedate}</td></tr>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col"><p></p></div>
                    </div>
                    <div className="row">
                        <div className="col tab2">
                        <Table responsive>
      <thead>
        <tr className="head">
         
          <th>Product Name</th>
          <th></th>
          <th></th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr className="tr1">
          
          <td>{invoice.product}</td>
          <td></td>
          <td></td>
          <td>{invoice.price}</td>
            <td>{invoice.quantity}</td>
          <td>{invoice.price1}</td>
        </tr>
       
        <tr className="tr1">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>Tax(7%)</td>
            <td>{invoice.tax}</td>
        </tr>
        <tr className="tr1">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>Total</td>
            <td>{invoice.total}</td>
        </tr>
        <tr className="tr1">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td><b>Balance Due</b></td>
            <td><b>{invoice.total}</b></td>
        </tr>
        <tr className="tr1"><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      </tbody>
    </Table>
                        </div>
                    </div>
                </div>
                <div className="center">
                <Pdf targetRef={ref} filename="invoice.pdf">
                    {({toPdf})=><button className="btn btn6 btn-secondary" onClick={toPdf}>Capture as PDF</button>}
                </Pdf>
                </div>
                </div>
                

                </Fragment>
            )
        }
    }
    else
    {
        return null;
    }
}

export default PDFadmin;
