
var key=require("./DatabaseKey.js");
var con=key.con;
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
class DbModel{
    constructor(){
        this.tableName=null;
        this.idField=null;
        this.fields=[];
        this.createJSONFromFields();
    
    }
    createJSONFromFields(){
        var values={};
        for (var field in this.fields){
            values[field]=null
        }
        this.values=values;
    }
    /**
     * 
     * @param {number} id Id of the object you want to get
     * @param {Function} func callback function when object is retrievd, function is passed the current object after fields have been set
     */
    getSingleByID(id,func){
        this.getQuery("SELECT * FROM "+this.tableName+" WHERE "+this.idField+" = "+id+" ;",
        function (err, result) {
            if (err) throw err;
                console.log("Result: " + result);
                func(this);
          });
    }
    getList(field,condition,orderby,orderMethod,func){
        throw DOMException("not implmented yet");
    }
    /**
     * 
     * @param {dictionary} fields a dictionary of fields and their desired values in the list
     * @param {Array} orderby list of how the returned result is to be ordered 
     * @param {Ascending or Descending} orderMethod wether the list should be ascending or descending
     * @param {Function} func the callback function, it is passed a list of @this
     */
    getListByFields(fields,orderby,orderMethod,func){
        for(var field in fields){
            if(!this.fields.includes(field)) 
            throw DOMException("Field Doesn't Exist: "+field);
        }
        var eqStr="";
        for(field in fields){
            eqStr+=field+" = "+fields[field]+" ,";
        }
        eqStr=eqStr.substring(0,eqStr.length-1);
        this.getQuery("SELECT * FROM "+this.tableName+" WHERE "+eq+" "+" ORDER BY "+orderby.join(",")+";",
        function (err, result) {
           if (err) throw err;
                console.log("Result: " + result);
                var objects=[];//TODO init me
                func(objects);
        });
        
        
    }
    /**
     * 
     * @param {number} id The Id of the obejct you want to get
     * @param {string} fieldName the specific field you want to retrieve
     * @param {function} func the call back function after the field has been retrieved, function is passed the field
     */
    getFieldById(id,fieldName,func){
        if(this.fields.includes(fieldName)){
            this.getQuery("SELECT "+fieldName+" FROM "+this.tableName+" WHERE "+this.idField+" = "+id+" ;",
            function (err, result) {
                if (err) throw err;
                    console.log("Result: " + result);
                    var field=null;//TODO init me
                    func(field);
            });
        }
        else{
            throw DOMException("Field Doesn't Exist: "+fieldName);
        }
    }
    getJSONById(id,func){
        throw DOMException("not implmented yet");
    }
    /**
     * 
     * @param {SQL string} sql sql you want to run
     * @param {function} func callback function when call is complete,function is passed result
     */
    getQuery(sql,func){
        con.query(sql, function(err,result){
            if(err) throw err;
            func(result);
        }
            
            /*function (err, result) {
            if (err) throw err;
                console.log("Result: " + result);
          }*/);
    }
    /**
     * 
     * @param {function} func callback function after the object as been saved
     */
    saveToDb(func){
        var tableString="";
        var tableValues="";
        for(var i=0;i<this.fields.length;i++){
            if(i==this.fields.length-1){
                tableString+=this.fields[i];
                tableValues+=this.values[this.fields[i]];
            }
            else{
                tableString+=this.fields[i]+", ";
                tableValues+=this.values[this.fields[i]]+", ";
            }

        }
        this.getQuery("INSERT INTO "+this.tableName+" ( "+tableString+" ) VALUES "+tableValues+" ;",
        function (err, result) {
            if (err) throw err;
                console.log("Result: " + result);
                func();
          });
    }
}

class Member extends DbModel{
    constructor(){
        super();
        this.tableName="person";
        this.idField="memberId";
        this.fields=["firstName","lastName","email","phoneNumber","slackUsername","githubUsername","googleUid",
            "pictureUrl","bannerId","canPostAnnouncements"];
            super.createJSONFromFields();
    }
}
class Committee extends DbModel{
    constructor(){
        super();
        this.tableName="committee";
        this.idField="committeeId";
        this.fields=["name","description","committeeHeadId","learningChairId"];
        createJSONFromFields();
    }
}
class Meeting extends DbModel{
    constructor(){
        super();
        this.tableName="meeting";
        this.idField="meetingId";
        this.fields=["startTime","meetingType"];
        createJSONFromFields();
    }
}
class Announcement extends DbModel{
    constructor(){
        super();
        this.tableName="announcement";
        this.idField="announcementsId";
        this.fields=["title","text","postedDate","imageUrl","externalLink","committeeId","authorId"];
        createJSONFromFields();
    }
}
var me=new Member();
me.values={firstName:"jamie",lastName:"walder"};
me.saveToDb();