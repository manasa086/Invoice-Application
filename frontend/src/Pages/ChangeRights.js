import React,{Fragment, useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import {useHistory} from "react-router-dom";
import routes from '../routes';
import { Table } from 'reactstrap';
import Header from '../Components/Header';
const ChangeRights = () => {
    const roleData=["Manager","Employee"];
    const [employeeData,setEmployeeData]=useState([]);
    const [Resultdata,setResultData]=useState("");
    const [Resultdata1,setResultData1]=useState("");
    const [selectValue,setSelectValue]=useState({});
    const history=useHistory();
    const { register, handleSubmit,errors } = useForm();
    useEffect(()=>{
      fetch("https://react-invoice-application.herokuapp.com/getUserEmails")
      .then((res)=>res.json())
      .then((data)=>{
      
        data.message.map((each,index)=>{
          if(each.role==1)
          {
            each.right="Admin"
          }
          else if(each.role==2){
            each.right="Manager"
          }
          else if(each.role==3)
          {
            each.right="Employee with Access Rights"
          }
          else{
            each.right="Employee with out Access Right"
          }
          
        })
     
        setEmployeeData(data.message)
      })
      

    },[])
    const onSubmit=(data)=>{
        data.token=localStorage.getItem("token");
        let email=data.email
        if(selectValue[data.email]=="--default--")
        {
          alert("Please select value to change the right of an user");
        }
        else{
          data.role=selectValue[data.email]
          fetch("https://react-invoice-application.herokuapp.com/changerights",{
              method:"PUT",
              body:JSON.stringify(data),
              headers:{
                  "Content-Type":"application/json"
            }
          })
          .then((res)=>res.json())
          .then((data)=>{setResultData(data.message)
            setEmployeeData(employeeData.map((each,index)=>{
              if(email==each.email)
               {
                if(each.role==1)
                {
                  each.right="Admin"
                }
                else if(each.role==2){
                  each.right="Manager"
                }
                else if(each.role==3)
                {
                  each.right="Employee with Access Rights"
                }
                else{
                  each.right="Employee with out Access Right"
                }
               }
               return each
            }))
          
          
          })
      }
    }
    const changeSelection=(e)=>{
      
      setSelectValue({
        ...selectValue,
        [e.target.name]:e.target.value
      });
    }
    const changeDisplay=()=>{
        history.push(routes.home)

    }
    if(employeeData.length>0)
    {
    return (
      <>
       <Header></Header>
      <h2 className="heading">Change Access Rights of Employees</h2>
      <div ClassName="container Post">
      <div className="col mt-5">
      <Table responsive>
          <thead>
  <tr>
<th>#</th>
<th>Employee Name</th>
<th>Employee Email</th>
<th>Employee Current Role</th>
<th>Select a role to change</th>
<th>Change Role</th>
    
</tr>
</thead>
          <tbody>
      {employeeData.map((data,index)=>{
          
          return (<Fragment>
              <td>{index+1}</td>
              <td>{data.name} &nbsp; {data.lastname}</td>
          <td>{data.email}</td>
          <td>{data.right}</td>
          <td><select  className="form-control" onChange={changeSelection} name={data.email} id="role" >
            <option key="1" value="--default--">--Select--</option>
            <option key="2" value="2">Manager</option>
            <option key="3" value="3">Employee with Access Rights</option>
            <option key="4" value="4">Employee wit out Access Rights</option>
    </select></td>
          <td><button className="btn btn-secondary" onClick={()=>onSubmit(data)}>Change Role</button></td>
          <tr></tr>
              </Fragment>
          )
      
      })}
      </tbody>
      </Table>
        
      {Resultdata!=""?<Fragment><b className="b4">{Resultdata}</b><br></br><a href="#"  className="anchor" onClick={changeDisplay}>Click this link to login as Employee</a></Fragment>:null}
      {Resultdata1!=""?<b className="b1">{Resultdata1}</b>:null}
   </div>
    </div>
    </>
      );
    }
    else{
      return (<h1 className="blink">Customer Relation Management</h1>)
    }
}

export default ChangeRights;
