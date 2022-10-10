const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});



app.post("/loginpage", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let sql = "SELECT id,txtFirstName FROM crm.tblusers where txtEmail='"+username+"' and txtPassword='"+password+"';";
  
    con.query( sql
      ,
      function (err, result) {
        if (err) throw err;
        console.log(result);
        if(result == ''){
          res.send("username and password is incorrect");
        }
        else{
        res.send("success!!");
        }
      }
    );
  });




con.connect(function (err) {
  if (err) throw err;
  console.log("connected!");
});


app.post("/signuppage", (req, res) => {
  let email = req.body.email;
  let firstname = req.body.firstname;
  let password = req.body.password;
  let phone = req.body.phone;
  let sqlinsert = "insert into crm.dbdata(txtfirstname, txtemail, txtpassword, txtphone) values('"+firstname+"', '"+email+"', '"+password+"', '"+phone+"');";
  let sqlemaillist = "select txtemail from crm.dbdata where txtemail='"+email+"';";
  
  if(email == ""){
    res.send("email is mandatory");
    return res
  }
  else if(firstname == ""){
    res.send("firstname is mandatory");
    return res
  }
  else if(phone == ""){
    res.send("phone number is mandatory");
    return res
  }
  else if(password == ""){
    res.send("password is mandatory");
    return res
  }
  else{
    con.query( sqlemaillist
      ,
      function (err, result) {
        if (err) throw err;
        console.log(result);
        if(result != ""){
            res.send("email already exist");
        }
        else{
          con.query(sqlinsert, function (err, result) {  
            if (err) throw err;  
            console.log("1 record inserted"); 
            res.send("1 record inserted");
            }); 
        }
        
      }
    );
    }
  });


app.post('/verifyOTP', (req, res)=>{
  let otp = req.body.enteredotp
  let email = req.body.email;
  let sqlverify = "select id from crm.tblusers where txtOTP = '"+otp+"' and txtEmail = '"+email+"';"
  con.query(sqlverify, function(err, result){
    if(err) throw err;
    console.log(result)
    if(result == ""){
      res.send("wrong otp")
    }
    else{
      res.send("your verified")
    }
  })

})







app.post('/updateuserapi', (req,res)=>{
  let id = req.body.id
  let sqlget = "select * from crm.tblusers where id = "+id+";"
  let firstname
  let email
  let password
  let phoneno
  let firstname1 = req.body.firstname
  let email1 = req.body.email
  let password1 = req.body.password
  let phoneno1 = req.body.phone
  con.query(sqlget, function(err, result){
    if(err) throw err;
    console.log(result);
    firstname = result.txtFirstName
    email = result.txtEmail  
    password = result.txtPassword
    phoneno = result.txtPhonenumber
    res.send(result)
    if(firstname1 == ""){
      res.send("firstname is mandatory")
    }
    else if(email1 == ""){
      res.send("email is mandatory")
    }
    else if(password1 == ""){
      res.send("password is mandatory")
    }
    else if(phoneno1 == ""){
      res.send("phone number is mandatory")
    }
    else{
      firstname = firstname1
      email = email1
      password = password1
      phoneno = phoneno1
      let sqlupdate = "update crm.tblusers set txtFirstName = '"+firstname+"', txtEmail = '"+email+"', txtPassword = '"+password+"', txtPhonenumber = '"+phoneno+"' where id = "+id+";"
      con.query(sqlupdate, function(err, result){
        if(err) throw err;
        console.log(result)
        res.send("your data is updated")
      })
    }
  })
})



app.post('/campaignwiseprospectcount', (req,res)=>{
  let sql = "SELECT B.refCampaignId, A.txtCampaignName, D.txtConversionType, count(txtCampaignName) as count FROM tblcampaign A  JOIN tblleadcampaignmap B ON A.id = B.refCampaignId  JOIN  tblactivity C ON B.id = C.refMapid    JOIN  tblconversiontype D ON C.refConversionStatus = D.id  where D.txtConversionType = 'Prospect '  group by A.txtCampaignName;"
  con.query(sql, function(err, result){
    if(err) throw err
    console.log(result)
    res.send(result)
  })
})










app.post("/insertsingleprofile", (req, res) => {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let dob = req.body.dob;
  let address = req.body.address;
  let password = req.body.password;
  let repassword = req.body.repassword;
  let sql = "select txtEmail from tblusers where txtEmail =  '" + email + "';"
  let sql1 = "insert into tblusers(txtFirstName,txtLastName,txtEmail,txtdob,txtAddress,txtPassword) values ('" + firstname + "','" + lastname + "','" + email + "','" + dob + "','" + address + "','" + password + "');"
  if (firstname == "") {
    res.send("Firstname is empty")
    return
  }
  if (lastname == "") {
    res.send("Lastname is empty")
    return
  }
  if (email == "") {
    res.send("Email is empty")
    return
  }
  if (dob == "") {
    res.send("Date of birth is empty")
    return
  }
  if (address == "") {
    res.send("Address is empty")
    return
  }
  if (password == "") {
    res.send("Password is empty")
    return
  }
  if (repassword == "") {
    res.send("Repassword is empty")
    return
  }
  if (password != repassword) {
    res.send("Password's do not match")
    return
  }
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result = " + JSON.stringify(result))
    if (result != "") {
      res.send("Profile already exists!")
      return
    }
    else {
      con.query(sql1, function (err, result) {
        if (err) throw err;
        res.send("Profile Inserted!")
        console.log("New user profile details inserted")
        return
      });
    }
  });
});




app.post("/getsingleprofile", (req, res) => {
  let id = req.body.id;
  let sql = "select txtFirstName,txtLastName,txtEmail,txtdob,txtAddress from tblusers where id = '" + id + "';"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Profile information displayed")
    if (result != "") {
      res.send("Profile Information " + JSON.stringify(result))
      return
    }
    else {
      res.send("Profile does not exist")
      return
    }
  });
});


app.post("/GetSingleCampaign", (req, res) => {
  let txtCampaignName = req.body.txtCampaignName;
  let sqlSinglecampaign =
    "SELECT txtCampaignName CampaignName,dtStartdate Startdate,dtEnddate Enddate , count(txtCampaignName) NoOfOwners FROM tblcampaign join tblusers where txtCampaignName = '"+txtCampaignName+"' group by txtCampaignName;";
  con.query(sqlSinglecampaign, function (err, result) {
    if (err) throw err;
    console.log("Selected Campaign Details");
    if (result != "") {
      res.send("Campaign details for selected Campaign" + JSON.stringify(result))
      return
    } else {
      res.send("Campaign Does Not Exist")
      return
    }
  });
  
});




app.post("/InsertSingleCampaign", (req, res) => {
  let CampaignName = req.body.CampaignName;
  let ParentCampaignName = req.body.ParentCampaignName;
  let Status = req.body.Status;
  let Startdate = req.body.Startdate;
  let Enddate = req.body.Enddate;
  let Responses = req.body.Responses;
  let CampaignOwner = req.body.CampaignOwner;
  let sqlinsert =
    "insert into tblcampaign (txtCampaignName,ParentCampaignName,Status,dtStartdate,dtEnddate,Responses,refCampaignOwner) VALUES('" +
    CampaignName +
    "','" +
    ParentCampaignName +
    "','" +
    Status +
    "','" +
    Startdate +
    "','" +
    Enddate +
    "','" +
    Responses +
    "','" +
    CampaignOwner +
    "');";
  if (CampaignName == "") {
    res.send("CampaignName is mandatory");
    return res;
  }
  if (ParentCampaignName == "") {
    res.send("ParentCampaignName is mandatory");
    return res;
  }
  if (Startdate == "") {
    res.send("Startdate is mandatory");
    return res;
  }
  if (Enddate == "") {
    res.send("Enddate is mandatory");
    return res;
  }
  if (CampaignOwner == "") {
    res.send("CampaignOwner name is mandatory");
    return res;
  }

  con.query(sqlinsert, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.send("1 record inserted");
  });
});

























app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/addition", (req, res) => {
  let a = req.body.a;
  let b = req.body.b;
  let result = a + b;
  res.send("result = " + result);
});

app.post("/subraction", (req, res) => {
  let a1 = req.body.a1;
  let b1 = req.body.b1;
  let result = a1 - b1;
  res.send("result = " + result);
});
