import React,{Fragment, useEffect,useState} from 'react';
import { useHistory } from 'react-router-dom';
import routes from '../routes';
const InvoiceContent = () => {

    const history=useHistory();
    const [countInvoices,setInvoices]=useState("");


    useEffect(()=>{
        let data={email:localStorage.getItem("email"),
        token:localStorage.getItem("token")};
        fetch("https://react-invoice-application.herokuapp.com/invoiceCount",{
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>setInvoices(data.message))




    },[])
    const createInvoice=()=>{
        history.push(routes.invoiceData)
    }
    if(countInvoices!="")
    return (
        <Fragment>
            <button className="btn btn-secondary button" onClick={createInvoice}>➕ Create New Invoice</button> 
            <p></p>
            <i className="text-center"><b>Total Number of Invoices Created:{countInvoices}</b></i>
        </Fragment>
    );
    else
    {
        return (<h1 className="blink">Customer Relation Management</h1>)
    }
}

export default InvoiceContent;
