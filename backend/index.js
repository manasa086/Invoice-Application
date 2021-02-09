const express = require('express');
const path = require('path');
const cors=require('cors');
const bcrypt=require('bcryptjs');

var mongodb=require("mongodb");
var MongoClient=mongodb.MongoClient;
var url=process.env.url;
const app = express();
const PORT = process.env.PORT || 5000; 
var dbname="invoicedata";
const nodemailer=require("nodemailer");
const jwt = require("jsonwebtoken");
const client_URL=process.env.client_URL;

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const gmail_user=process.env.gmail_user;
const clientID=process.env.clientID;
const clientSecret=process.env.clientSecret;
const refreshToken=process.env.refreshToken;
const oauth2Client = new OAuth2(
    clientID,
    clientSecret,
    "https://developers.google.com/oauthplayground" // Redirect URL
  );
  
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });
  const accessToken = oauth2Client.getAccessToken()
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: "OAuth2",
      user: gmail_user,
      clientId: clientID,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      accessToken: accessToken
    }
  });


  

var authenticate = function(req, res, next) {
    if (req.body.token) {
        jwt.verify(req.body.token, process.env.JWT_SECRET, function(err, decoded) {
            if (decoded) {
                next();
            } else {
                res.json({
                    message: "Not Authenticated"
                })
            }
        });
        //next();
    } else {
        res.json({
            message: "Token is not valid"
        });
    }
};


app.post("/getdata",authenticate,(req,res)=>{
    MongoClient.connect(url, function(err, client) {
        if(err) {
             console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        }
        var db=client.db(dbname);
        console.log(req.body.email);
        var cursor=db.collection("invoice").findOne({email:req.body.email});
        
        cursor.then(function(data)
        {
            console.log(data);
            client.close();
            res.json({message:data});

        })

     });
})
app.post("/getdataByEmail",authenticate,(req,res)=>{
    MongoClient.connect(url, function(err, client) {
        if(err) {
             console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        }
        var db=client.db(dbname);
        console.log(req.body.email);
        var cursor=db.collection("invoice").findOne({email:req.body.email});
        
        cursor.then(function(data)
        {
            console.log(data);
            client.close();
            res.json({message:data});

        })

     });
})

app.post("/login",(req,res)=>{

    MongoClient.connect(url,function(err,client)
    {
        if(err)
            console.log("Error occured while connecting to mongoDB Atlas....\n",err);
        var db=client.db(dbname);
        if(req.body.email!="admin")
        {
        var cursor=db.collection("invoice").findOne({email:req.body.email});
        cursor.then(async function(user)
        {
            if(user)
            {
                try
                {
                    let token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);
                    let result = await bcrypt.compare(req.body.password, user.password);
                    if(result)
                    {
                        client.close();
                        res.json({
                            message:"Success",
                            token
                        })
                    }
                    else
                    {
                        client.close();
                        res.json({
                            message:"Username or Password is incorrect"
                        })
                    }
                }
                catch(error)
                {
                    console.log(error);
                }

            }
            else
            {
                client.close();
                res.json({
                    message:"User not found"
                })
            }

        })
        }
        else
        {
            var cursor=db.collection("invoice").findOne({name:req.body.email});
        cursor.then(async function(user)
        {
            if(user)
            {
                try
                {
                    let token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);
                    let result = await bcrypt.compare(req.body.password, user.password);
                    if(result)
                    {
                        client.close();
                        res.json({
                            message:"Success",
                            token
                        })
                    }
                    else
                    {
                        client.close();
                        res.json({
                            message:"Username or Password is incorrect"
                        })
                    }
                }
                catch(error)
                {
                    console.log(error);
                }

            }
            else
            {
                client.close();
                res.json({
                    message:"User not found"
                })
            }

        })
        }

    })


})
app.get("/",(req,res)=>{
    MongoClient.connect(url,function(err,client)
    {
        if(err)
            console.log("Error occureed while connecting to MongoDB Atlas...\n",err);
        var db=client.db(dbname);
        client.close();
        res.json({message:"Connected"});
    })
})
app.post("/forgotpass",(req,res)=>{
    MongoClient.connect(url, function(err, client) {
        if(err) {
             console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        }
        var db = client.db(dbname);
        var cursor=db.collection("invoice").find({email:req.body.email}).toArray();
        console.log(req.body.email);
        cursor.then(async function(user)
        {
            
            if(user)
            {
                try{
                let token = jwt.sign({ email: req.body.email }, process.env.EMAIL_SECRET);
                let mail_to_send=req.body.email;
                console.log(mail_to_send);
                console.log(req.body.email);
                let url = `https://react-invoice-application.herokuapp.com/confirmation/${token}`;
                let email = await db.collection("forgotpassword").insertOne({email: req.body.email, url: url });
                let info = await transporter.sendMail({
                    from: gmail_user,
                    to:mail_to_send,
                    subject: "Invoice Application---Forgot Password",
                    text: "Click the below link to reset the password",
                    html: `<a href=${url}>Please Click on the URL to Register</a>`
                });
                client.close();
                res.json({message:"Email Sent to your email account. Please Verify"})
                }
                catch(error)
                {
                    if(client)
                        client.close();
                    res.json({
                        message:error
                    })    
                }
            }
            else
            {
                client.close();
                res.json({message:"User not found"})
            }
        })
})
})
app.put("/changepassword",(req,res)=>{
    MongoClient.connect(url,async function(err,client)
    {
        if(err)
        {
            console.log('Error occurred while coonecting to MongoDB Atlas ....\n',err)
        }
        var db=client.db(dbname);
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);
        req.body.password=hash;
        db.collection("invoice").findOneAndUpdate({email:req.body.email},{$set:{"password":req.body.password}},
        function(err,data)
        {
            if(err)
                console.log(err);
            client.close();
            res.json({message:"Password changed successfully"})
        });
        // res.json({message:"data updated"})
    });
   
    

})

let confirm_pass=false;
app.get("/confirmation/:token",(req,res)=>{

    MongoClient.connect(url,function(err,client){
        if(err)
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        var db=client.db(dbname);
        let url_speci = `https://react-invoice-application.herokuapp.com/confirmation/${req.params.token}`;
        console.log(url_speci);
        let email_ver = jwt.verify(req.params.token, process.env.EMAIL_SECRET,function (err,decoded)
        {
            if(decoded)
            {
                console.log(decoded);
             var cursor=db.collection("forgotpassword").findOne({email:decoded.email,url:url_speci})
            cursor.then(async function(user)
            {
                console.log(user);
                if(user)
                {
                    let removeData = await db.collection("forgotpassword").deleteOne({ email: decoded.email,url: url_speci });
                    client.close();
                    res.redirect(client_URL);
                }
                else
                {
                    client.close();
                    res.json({message:"Specified URL is wrong"})
                }
            })
           }
           else
           {
            res.json({
                message: "Token is not valid"
                })
           }
        })
        
    });
});
app.post("/",(req,res)=>{
    MongoClient.connect(url, function(err, client) {
        if(err) {
             console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        }
        var db = client.db(dbname);
        
        var cursor=db.collection("invoice").find({email:req.body.email}).toArray();
        cursor.then(async function(data)
        {
           // console.log(data.length);
           if(data.length==0)
           {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt);
            req.body.password=hash;
            req.body.role=4;
            db.collection("invoice").insertOne(req.body,function(err,data)
            {
                if(err)
                    console.log("Not inserted in to database");
                client.close();
                res.json({message:"data inserted"});
            });
            }
            else
            {
                res.json({message:"Email Already Exists.Provide new email Address"});
            }
        })    
     });
    
})

app.put("/changerights",authenticate,(req,res)=>{
    MongoClient.connect(url,async function(err,client)
    {
        if(err)
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        var db=client.db(dbname);
        try{
        let updateData=await db.collection("invoice").findOneAndUpdate({name:req.body.name,lastname:req.body.lastname,email:req.body.email},{$set:{role:req.body.role}});
        client.close();
        res.json({
            message:"Role Changed SuccessFully 😃"     
        })
        }
        catch(error){
            client.close();
            res.json({
                message:"Error while changing the role 😞. Kindly, try again"   
            })
        }

    })
});

app.post("/invoiceCount",authenticate,(req,res)=>{
    MongoClient.connect(url,function(err,client)
    {
        if(err)
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err)
        var db=client.db(dbname);
        var cursor=db.collection("invoiceData").find({email:req.body.email}).toArray();
        cursor.then(function(user)
        {
            if(user.length>0)
            {
                client.close();
                res.json({message:user.length.toString()})
            }
            else
            {
                client.close();
                res.json({message:"0"})
            }
        })
    })
})
app.post("/invoiceInsert",authenticate,(req,res)=>{
//    
    MongoClient.connect(url,async function(err,client)
    {
        if(err)
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err)
        var db=client.db(dbname);
        var invoicedata=await db.collection("invoiceData").find().toArray();
        req.body.index=invoicedata.length+1;
        var cursor=db.collection("invoiceData").insertOne(req.body);
        var mailist=[];
        console.log(req.body)
        mailist.push(req.body.clientemail);
        cursor.then(async function(data,err)
        {
            // if(err)
            // {
            //     client.close(); 
            //     console.log(err);
            //     res.json({message:"Data is not inserted"})
            // }
            // else
            // {
                console.log(mailist);
                var manager=await db.collection("invoice").findOne({role:2});
                if(manager)
                {
                    maillist.push(manager.email);
                }
                var admin=await db.collection("invoice").findOne({role:1});
                if(admin)
                {
                    mailist.push(admin.email);
                }
                mailist.forEach(async function(mail,index){
                let info = await transporter.sendMail({
                    from: gmail_user,
                    to:mail,
                    subject: "Invoice Application --- Invoice Created",
                    text: "Invoice created",
                    html: `<h3>Invoice Created...</h3>`
                });
                })
                client.close();
                res.json({message:"invoice created"});
            //}
        })
    })
})
app.post("/getInvoiceData",authenticate,(req,res)=>{
    MongoClient.connect(url,function(err,client)
    {
        if(err)
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        var db=client.db(dbname);
        var cursor=db.collection("invoiceData").find({email:req.body.email}).toArray();
        cursor.then(function(data)
        {
            if(data.length>0)
            {
                client.close();
                res.json({message:data});
            }
            else
            {
                client.close();
                res.json({message:"No invoices created for the given employee"});
            }
        })

    })
})
app.get("/getAllInvoiceData",(req,res)=>{
    MongoClient.connect(url,function(err,client)
    {
        if(err)
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err)
        var db=client.db(dbname);
        var cursor=db.collection("invoiceData").find().toArray();
        cursor.then(function(data)
        {
            if(data.length>0)
            {
                client.close();
                res.json({message:data})

            }
            else
            {
                client.close();
                res.json({message:"No Employee Created Invoices"});
            }
        })
    })
})
app.get("/getInvoiceById/:id",(req,res)=>{
    MongoClient.connect(url,function(err,client)
    {
        if(err)
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err)
        var db=client.db(dbname);
        console.log(Number(req.params.id));
        req.params.id=Number(req.params.id);
        var cursor=db.collection("invoiceData").findOne({index:req.params.id})
        cursor.then(function(data)
        {
            console.log(data);
            if(data)
            {
                client.close();
                res.json({message:data})
            }
            else
            {
                client.close();
                res.json({message:"Error in fetching the data"});
            }

        })
    })
})
app.get("/getUserEmails",(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        if(err)
        {
            console.log("Error while connecting to MongoDB Atlas",err);
        }
        try{
            let db=client.db(dbname);
            let getEmails=await db.collection("invoice").find({name:{$not:{$eq:"admin"}}}).toArray();
            console.log(getEmails);
            client.close();
            res.json({
                message:getEmails
            })
        }
        catch(error){
            client.close();
            res.json({
                message:"Error while fetching the data"
            })
        }

    })
});
app.post("/totalInvoicesCount",authenticate,(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        if(err)
        {
            console.log("Error while connecting to MongoDB Atlas",err);
        }
        let db=client.db(dbname);
        try{
        let getData=await db.collection("invoiceData").find({}).toArray();
        client.close();
        res.json({
            message:getData.length
        })
        }
        catch(error){
            client.close();
            res.json({
                message:"Error while fetching the count 😞"  
            })
        }

    })
})
app.listen(PORT, console.log(`Server is starting at ${PORT}`));