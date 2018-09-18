const express = require('express');
const path = require("path");
var fs = require('fs');
var announcments={
  announcments:
  [
    {
      key:1,
      title:"Test Announcment 1",
      announcmentText:"this is a test announcment",
      picture:"https://espnfivethirtyeight.files.wordpress.com/2014/04/bob-ross.jpg",
      committee:"General",
      timeStamp:Date.now()
    },
    {
      key:2,
      title:"Test Announcment 2",
      announcmentText:"this is a test announcment",
      picture:"https://espnfivethirtyeight.files.wordpress.com/2014/04/bob-ross.jpg",
      committee:"General",
      timeStamp:Date.now()-1000
    },
    {
      key:3,
      title:"Test Announcment 3",
      announcmentText:"this is a test announcment",
      picture:"https://espnfivethirtyeight.files.wordpress.com/2014/04/bob-ross.jpg",
      committee:"General",
      timeStamp:Date.now()-10000
    },
    {
      key:4,
      title:"Test Announcment 4",
      announcmentText:"this is a test announcment",
      picture:"https://espnfivethirtyeight.files.wordpress.com/2014/04/bob-ross.jpg",
      committee:"General",
      timeStamp:Date.now()-100000
    },

  ]
}
var committees={
    committees:[
      {
        name:"Animation and Game Design ",
        description:"ya know game design",
        contactEmail:"jtwalder@gmail.com",
        picture:"https://espnfivethirtyeight.files.wordpress.com/2014/04/bob-ross.jpg"
      },
      {
        name:"AI ",
        description:"ya know AI design",
        contactEmail:"jtwalder@gmail.com",
        picture:"https://espnfivethirtyeight.files.wordpress.com/2014/04/bob-ross.jpg"
      },
      {
        name:"App design ",
        description:"ya know App design",
        contactEmail:"jtwalder@gmail.com",
        picture:"https://espnfivethirtyeight.files.wordpress.com/2014/04/bob-ross.jpg"
      },


    ]
}



const app = express();

app.get('/GetAnnouncment/:id', (req, res) => {
    var found=false;
    for(announcment in announcments.announcments){
      console.log(announcments.announcments[announcment].key+"==="+req.params.id);
      
      if(announcments.announcments[announcment].key==req.params.id){
        res.json(announcments.announcments[announcment]);
        found=true;
        break;
      }
    }
    if(!found){
      res.json({message:"announcement not found, fucking panic!!"});
    }

});
app.get('/GetAnnouncments', (req, res) => {

    res.json(announcments.announcments);

});
app.get('/GetCommittees', (req, res) => {

    res.json(committees.committees);
  });
  app.get('/Hello/:name', (req, res) => {
    
        res.send("Hello "+req.params.name);
      });
const port = 5000;

app.listen(port, () => `Server running on port ${port}`);