import React,{Fragment, useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import {useHistory} from "react-router-dom";
import routes from '../routes';
import { Col, Row, Button, Form, FormGroup, Label, input,Input } from 'reactstrap';
import "../App.css"



const InvoiceData = () => {
    const [resultdata,setResultData]=useState("");
    const [resultdata1,setResultData1]=useState("");
    const history=useHistory();
    const [price,setPrice]=useState(0);
    const [tax,setTax]=useState(0);
    const { register, handleSubmit,errors } = useForm();

    const onSubmit=(data)=>{
        let months=["January","February","March","April","May","June","July","August","September","October","November","December"];
        let total=Number(data.price1)+Number(data.tax)
        data.total=total.toString();  
        data.token=localStorage.getItem("token");
        data.email=localStorage.getItem("email");
        let date_obj= new Date();
        let date=date_obj.getDate();
        let month=date_obj.getMonth();
        let month_num=month;
        month=months[month];
        let nextday=0;
        let nextmonth=0;
        let year=date_obj.getFullYear();
        let nextyear=0;
       if(month=="January" || month=="March" || month=="May" || month=="July" || month=="August" || month=="October")
        {
            if(date==30)
            {
                nextday=1;
                nextmonth=months[month_num+1];
                nextyear=year;
            }
            else if(date==31)
            {
              nextday=2;
              nextmonth=months[month_num+1];
              nextyear=year;
            }
            else
            {
              nextday=date+2;
              nextmonth=months[month_num];
              nextyear=year;
            }
        }
        else if(month=="February")
        {
            let leapYear=false;
            if(year%4==0)
            {
                if(year%100==0)
                {
                  if(year%400==0)
                  {
                    leapYear=true;
                  }
                  else
                  {
                    leapYear=false;
                  }
                }
                else
                {
                  leapYear=true;
                }
            }
            else
            {
              leapYear=false;
            }
            if(leapYear)
            {
              if(date==29)
              {
                nextday=2
                nextmonth=months[month_num+1];
                nextyear=year;
              }
              else if(date==28)
              {
                nextday=1;
                nextmonth=months[month_num+1];
                nextyear=year;
              }
              else
              {
                nextday=date+2;
                nextmonth=months[month_num];
                nextyear=year;
              }
            }
            else
            {
               if(date==28)
               {
                  nextday=2;
                  nextmonth=months[month_num+1];
                  nextyear=year;
               }
               else
               {
                 nextday=date+2;
                 nextmonth=months[month_num];
                 nextyear=year;
               }
            }
        }
        else if(month=="December")
        {
            if(date==30)
            {
              nextday=1;
              nextmonth=months[1];
              nextyear=year+1;
            }
            else if(date==31)
            {
              nextday=2;
              nextmonth=months[1];
              nextyear=year+1;
            }
            else
            {
              nextday=date+2;
              nextmonth=months[month_num];
              nextyear=year+1;
            }
        }
        else
        {
           if(date==30)
           {
             nextday=1;
             nextmonth=months[month_num+1];
             nextyear=year;
           }
           else if(date==31)
           {
             nextday=2;
             nextmonth=months[month_num+1];
             nextyear=year;
           }
           else
           {
             nextday=date+2;
             nextmonth=months[month_num];
             nextyear=year;
           }
        }
        let date1=date+" "+month+" "+year;
        let duedate=nextday+" "+nextmonth+" "+nextyear;
        data.date=date1;
        data.duedate=duedate;
        data.term="Two Day";
        fetch("https://react-invoice-application.herokuapp.com/invoiceInsert",{
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
          if(data.message==="invoice created")
          {
            setResultData("Total Price:"+ total);
          }
          else
          {
            setResultData("Invoice is not created. Please try again");
          }
        })
    }
    const changeDisplay=()=>{
      history.push(routes.invoice);
    }
    const changeBasedOnPrice=(event)=>{
        if(event.target.value)
        {
        let pricePerQuantity=Number(event.target.value)*Number(document.getElementById("quantity").value);
        setPrice(pricePerQuantity);
        }
        else
       {
           setPrice(0);
       }
    }
    const changePrice=(event)=>{
       if(event.target.value)
       {
        let pricePerQuantity=Number(event.target.value)*Number(document.getElementById("price").value);
        setPrice(pricePerQuantity);
        let tax=pricePerQuantity*0.07;
        setTax(tax);
       }
       else
       {
           setPrice(0);
       }
        

    }
    return (
        <div class="aroundDiv1">
      <div className="top1"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="invoiceHeading">Generate Invoice Form</h4>
          <p></p>
        <Row form>
        <Col md={1}></Col>
      <Col md={10}>
        <FormGroup>
          <Label for="clientname">Client Name</Label>
          <input className="form-control" type="text" name="clientname" id="clientname" ref={register({ required: true })} placeholder="Client Name" />
          {errors.clientname && "Client Name is required"}
        </FormGroup>
      </Col>
      </Row>
      <Row form>
        <Col md={1}></Col>
      <Col md={10}>
        <FormGroup>
          <Label for="clientemail">Client Email</Label>
          <input className="form-control" type="email" name="clientemail" id="clientemail" ref={register({ required: true })} placeholder="Client Email" />
          {errors.clientemail && "Client Email is required"}
        </FormGroup>
      </Col>
      </Row>
      <Row form>
        <Col md={1}></Col>
      <Col md={10}>
        <FormGroup>
          <Label for="product">Product Name</Label>
          <input className="form-control" type="text" name="product" id="product" ref={register({ required: true })} placeholder="Product Name" />
          {errors.product && "Product Name is required"}
        </FormGroup>
      </Col>
      </Row>
      <Row form>
        <Col md={1}></Col>
      <Col md={10}>
        <FormGroup>
          <Label for="price of product">Price of Single Quantity</Label>
          <input className="form-control" type="text" name="price" onChange={changeBasedOnPrice} id="price" ref={register({ required: true })} placeholder="Price of Single Quantity" />
          {errors.price && "Price of Single Quantity is required"}
        </FormGroup>
      </Col>
      </Row>
      <Row form>
      <Col md={1}></Col>
      <Col md={10}>
        <FormGroup>
          <Label for="quantity">Quantity</Label>
          <input className="form-control" type="text" onChange={changePrice} name="quantity" id="quantity" ref={register({ required: true })} placeholder="Quantity" />
          {errors.quantity && "Quantity is required"}
        </FormGroup>
      </Col>
      </Row>
      <Row form>
        <Col md={1}></Col>
        <Col md={10}>
        <FormGroup>
          <Label for="price1">Price</Label>
          <input  className="form-control" type="text"  value={price} name="price1" id="price1" ref={register({ required: true })} placeholder="Price" />
          {errors.price1 && "Price Per Quantity is required"}
        </FormGroup>
    </Col>
    </Row>
        <Row form>
        <Col md={1}></Col>
        <Col md={10}>
    <FormGroup>
      <Label for="tax">Tax</Label>
      <input className="form-control" type="text" name="tax" id="tax" value={tax}  ref={register({ required: true })} placeholder="Tax"/>
      {errors.tax && "tax is required"}
    </FormGroup>
    </Col>
      </Row>    
    <div className="center">
    <button type="submit" className="btn btn-secondary">Submit</button>
    {resultdata!=""?<Fragment><b className="b5">{resultdata}</b><a href="#" className="b4" onClick={changeDisplay}>Click this link to go back</a></Fragment>:null}
    {resultdata1!=""?<b className="b3">{resultdata1}</b>:null}
    </div>
    
    </form>
    
  </div>
        
    );
}

export default InvoiceData;
