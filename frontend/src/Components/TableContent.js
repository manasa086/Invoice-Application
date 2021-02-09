import React,{useState,useEffect, Fragment} from "react";
import { Table } from 'reactstrap';
import "../App.css";

const TableContent=(props)=>{
    let [getData,setData]=useState("");
    
    useEffect(()=>{
        let data={email:localStorage.getItem("email"),
    token:localStorage.getItem("token")
    }
        fetch("https://react-invoice-application.herokuapp.com/getInvoiceData",{
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                "Content-Type":"application/json",
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.message==="No invoices created for the given employee")
            {
                setData(null)
            }
            else
            {
                setData(data.message);
            }
        })
    },[]);

    

    
    if(getData)
    {
    return(
        <>
        <h4>List of Created Invoices by you</h4>
        <div className="table3">
                <Table responsive>
                    <thead>
            <tr>
          <th>#</th>
          <th>Client Name</th>
          <th>Client Email</th>
          <th>Product</th>
          <th>Price of Product</th>
          <th>Quantity</th>
          <th>Price Based on Quantity</th>
          <th>Tax</th>
          <th>Total Price</th>
          <th>Generate PDF</th>      
        </tr>
      </thead>
                    <tbody>
                {getData.map((data,index)=>{
                    const generatePDF=()=>{
                        props.generatePDF(data.index);
                    }
                    return (<Fragment>
                        <td>{index+1}</td>
                        <td>{data.clientname}</td>
                    <td>{data.clientemail}</td>
                    <td>{data.product}</td>
                    <td>{data.price}</td>
                    <td>{data.quantity}</td>
                    <td>{data.price1}</td>
                    <td>{data.tax}</td>
                    <td>{data.total}</td>
                    <td><button className="btn btn-secondary" onClick={generatePDF}>Generate PDF</button></td>
                    <tr></tr>
                        </Fragment>
                    )
                
                })}
                </tbody>
                </Table>
                </div> 
        </>
            
               
             
     
  
        
    )
    }
    else
    {
        return null;
    }


}

export default TableContent;