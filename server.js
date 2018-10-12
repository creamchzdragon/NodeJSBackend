const express = require('express');
const path = require("path");
var fs = require('fs');
var dbModels=require('./components/DataBaseModels');

var bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/GetAnnouncement/:id', (req, res) => {
    var a=new dbModels.AnnouncementV();
    a.getJSONById(req.params.id,(announcment)=>{
      res.json(announcment);
    });
});
app.get('/GetAnnouncements', (req, res) => {
  var a=new dbModels.AnnouncementV();
  a.getJSONList({},["postedDate"],(result)=>{
    res.json(result)
  });
});
app.get('/GetCommittees', (req, res) => {
  var c=new dbModels.CommitteeV();
  c.getJSONList({},['name'],(l)=>{
      res.json(l);
  });
});
app.get('/GetCommittee/:id',(req,res)=>{
    var c=new dbModels.Committee();
    c.getJSONById(req.params.id,function(json){
      res.json(json);
    });
});
app.get('/Hello/:name', (req, res) => {
    console.log("Hello "+req.params.name);
  res.send("Hello "+req.params.name);
});

app.get('/GetCommitteeMembers/:committeeName', (req, res) => {
        var m=new dbModels.MemberV();
        m.getJSONList({committeeName:req.params.committeeName},["lastname"],(l)=>{
          res.json(l);
        });
  
});
//atler database section
/*
fetch('https://mywebsite.com/endpoint/', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue',
  })
})
*/
app.post('/isAdmin', function(req, res) {
  var token = req.body.token;
  res.json({isAdmin:true});
});
app.post('/AddEditAnouncement', function(req, res) {
  
  var authorToken = req.body.authorToken;
  var author=req.body.author;
  var id=req.body.id!=undefined?req.body.id:null;
  var title=req.body.title;
  var text=req.body.text;
  var postedDate=new Date().toLocaleString();
  var imageUrl=req.body.imageUrl;
  var externalLink=req.body.externalLink;
  var committeeId=req.body.committeeId;
  var m=new dbModels.Member().getJSONList({googleUid:author},[],function(member){
      if(member[0].isAdmin&&member[0].loginToken===authorToken){

      
      var a=new dbModels.Announcement();
      a.values={
        announcementId:id!=null?id:null,
        title:title,
        text:text,
        postedDate:postedDate,
        imageUrl:imageUrl,
        externalLink:externalLink,
        committeeId:committeeId,
        authorId:member[0].memberId};
      a.assignFieldsFromJSON({
        announcementId:id!=null?id:null,
        title:title,
        text:text,
        postedDate:postedDate,
        imageUrl:imageUrl,
        externalLink:externalLink,
        committeeId:committeeId,
        authorId:member[0].memberId});

        a.saveToDb(function(result){
          res.json({code:200});
        });
      }
      else{
        res.json({err:"you do not have persmition to complete this function"});
      }
  });
  
});
app.get("/GetCommitteesByMember/:memberId",function(req,res){
    var m=new dbModels.Member();
    m.getQuery("SELECT * FROM member_committee WHERE memberId = "+req.params.memberId,function(committees){
        res.json(committees);
    });
  
});
app.get("/GetFullMember/:id/:adminUid/:adminToken",function(req,res){
  var m=new dbModels.Member().getJSONList({googleUid:req.body.uid},[],function(member){
    if(member[0].isAdmin&&member[0].loginToken===req.body.loginToken){
        var member=new dbModels.Member();
        member.getJSONById(req.params.id,function(json){
          res.json(json);
        });
    }
  });
});
app.get("/GetFullMembers/:adminUid/:adminToken",function(req,res){
  
  var m=new dbModels.Member().getJSONList({googleUid:req.params.adminUid},[],function(member){
    console.log("GetFullMembers: "+member[0].isAdmin+" "+member[0].loginToken+" "+req.params.adminToken);
    if(member[0].isAdmin&&member[0].loginToken===req.params.adminToken){
    var members=new dbModels.Member();
    members.getJSONList({},["lastname"],function(json)
    {
      res.json(json);
    });
  }
});
});
app.post('/AddEditCommittee',function(req,res){
 
  var m=new dbModels.Member().getJSONList({googleUid:req.body.author},[],function(member){
    
    if(member[0]!=undefined&&member[0].isAdmin&&member[0].loginToken===req.body.authorToken){
    var c=new dbModels.Committee();
    var body=req.body;
    c.values={
      committeeId:body.committeeId,
      name:body.name,
      description:body.description,
      committeeHeadId:body.committeeHeadId,
      learningChairId:body.learningChairId
    }
    c.saveToDb(function(result){

      res.json({code:200});
    });
  }
}
  );
});

app.post('/AddEditMember', function(req, res) {
  var m=new dbModels.Member().getJSONList({googleUid:req.body.author},[],function(member){
    
    if(member[0]!=undefined&&member[0].isAdmin&&member[0].loginToken===req.body.authorToken){
    var b=req.body;
    
    var a=new dbModels.Member();
    a.values={
      memberId:b.memberId!=null?b.memberId:null,
      firstname:b.firstname,
      lastname:b.lastname,
      email:b.email,
      phoneNumber:b.phoneNumber,
      slackUsername:b.slackUsername,
      githubUsername:b.githubUsername,
      googleUid:b.googleUid,
      pictureUrl:b.pictureUrl,
      bannerId:b.bannerId,
      isAdmin:b.isAdmin
};
    a.assignFieldsFromJSON({
      memberId:b.memberId!=null?b.memberId:null,
      firstname:b.firstname,
      lastname:b.lastname,
      email:b.email,
      phoneNumber:b.phoneNumber,
      slackUsername:b.slackUsername,
      githubUsername:b.githubUsername,
      googleUid:b.googleUid,
      pictureUrl:b.pictureUrl,
      bannerId:b.bannerId,
      isAdmin:b.isAdmin
    });

      a.saveToDb(function(result){

        res.json({code:200});
      });
      var sql="DELETE FROM member_committee WHERE memberId = "+b.memberId+";";
      a.getQuery(sql);
      for(var c in b.memberCommittees){
        sql="INSERT INTO member_committee (memberId,committeeId) VALUES ("+b.memberId+","+b.memberCommittees[c]+");"
        a.getQuery(sql);
      }
      
    }
    else{
      res.json({err:"you do not have persmition to complete this function"});
    }
})});

app.post('/SignIn',function(req,res){
  console.log(req.body);
  var body=req.body;
  var member=new dbModels.Member();
  member.getJSONList({googleUid:body.googleUid},[],function(result){
    if(result!=undefined&&result!=null&&result[0]!=null){
      var dbMember=new dbModels.Member();
      dbMember.values={
        memberId:result[0].memberId,
        loginToken:body.loginToken};
      dbMember.saveToDb();
      res.json({isAdmin:result[0].isAdmin});
    }
    else{
      var newMember=new dbModels.Member();
      newMember.values={
        firstname:body.firstname,
        lastname:body.lastname,
        email:body.email,
        googleUid:body.googleUid,
        pictureUrl:body.pictureUrl,
        isAdmin:false,
        loginToken:body.loginToken,

      }
      newMember.saveToDb();
      res.json({isAdmin:false});
    }
  });
});
const port = 5002;

app.listen(port, () => `Server running on port ${port}`);