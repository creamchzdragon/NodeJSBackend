const express = require('express');
const path = require("path");
var fs = require('fs');
var dbModels=require('./components/DataBaseModels');


const app = express();

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
const port = 5001;

app.listen(port, () => `Server running on port ${port}`);