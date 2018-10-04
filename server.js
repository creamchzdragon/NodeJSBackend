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
app.get('/Hello/:name', (req, res) => {
    
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
  //TODO affirm person has editing rights
  var id=req.body.id!=undefined?req.body.id:null;
  var title=req.body.title;
  var text=req.body.text;
  var postedDate=new Date().toLocaleString();
  var imageUrl=req.body.imageUrl;
  var externalLink=req.body.externalLink;
  var committeeId=req.body.committeeId;
  var m=new dbModels.Member().getJSONList({/*googleUid:author*/},[],function(member){
      if(member[0].canPostAnnouncements){

      
      var a=new dbModels.Announcement();
      a.values={
        announcementId:id!=null?id:null,
        title:title,
        text:text,
        postedDate:postedDate,
        imageUrl:imageUrl,
        externalLink:externalLink,
        committeeId:committeeId,
        authorId:member[0].memberid};
      a.assignFieldsFromJSON({
        announcementId:id!=null?id:null,
        title:title,
        text:text,
        postedDate:postedDate,
        imageUrl:imageUrl,
        externalLink:externalLink,
        committeeId:committeeId,
        authorId:member[0].memberid});

        a.saveToDb(function(result){
          res.json({code:200});
        });
      }
      else{
        res.json({err:"you do not have persmition to complete this function"});
      }
  });
  
});
app.post('/EditMember', function(req, res) {
  var user_id = req.body.id;
  var token = req.body.token;
  var geo = req.body.geo;

  res.send(user_id + ' ' + token + ' ' + geo);
});
const port = 5002;

app.listen(port, () => `Server running on port ${port}`);