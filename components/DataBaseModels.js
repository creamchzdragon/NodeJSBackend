
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
        this.values={};
    
    }
    createJSONFromFields(vals){
        var values={};
        if(vals!=null&&this.idField!=null&&vals[this.idField]!=undefined){
            values[this.idField]=vals[this.idField];
       }
        for (var field in this.fields){
            if(vals!=null&&vals[this.fields[field]]!=undefined)
                values[this.fields[field]]=vals[this.fields[field]];
            else
            values[this.fields[field]]=null;
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
        function (result) {
            console.log("Result: " + result[0].firstname);
            var obj=new DbModel();
            for(var field in result[0]){
                obj.values[field]=result[0][field];
            }
                if(func !=undefined)
                    func(obj);
          });
    }

    getList(conditions,orderby,func){
        var fieldConditions=[];
        for(var c in conditions){
            if(typeof conditions[c] =="string")
                fieldConditions.push(c+"="+"\""+conditions[c]+"\"");
            else
                fieldConditions.push(c+"="+conditions[c]);
        }
        var where=fieldConditions.length==0?"":" WHERE "+fieldConditions.join(" AND ");
        var sql="SELECT * FROM "+this.tableName+where+" ORDER BY "+orderby.join(" , ")+";";
        this.getQuery(sql,(result)=>{
            var objs=[];
            for(var i in result){
                var obj=new DbModel();
                for(var field in result[i]){
                    obj.values[field]=result[i][field];
                }
                objs.push(obj);
            }
            if(func != undefined)
                func(objs);
        });

    }
    /**
     * 
     * @param {dictionary} fields a dictionary of fields and their desired values in the list
     * @param {Array} orderby list of how the returned result is to be ordered 
     * @param {Ascending or Descending} orderMethod wether the list should be ascending or descending
     * @param {Function} func the callback function, it is passed a list of @this
     */
    getListByFields(fields,orderby,orderMethod,func){
        throw DOMException("not finsihed");
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
        function (result) {
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
            function (result) {
                    console.log("Result: " + result);
                    var field=result[0];
                    func(field);
            });
        }
        else{
            throw DOMException("Field Doesn't Exist: "+fieldName);
        }
    }
    /**
     * retrieves a row and return corresponding JSON
     * @param {int} id the id of the object you want to retrieve 
     * @param {function} func callback function after the row has been retrieved
     */
    getJSONById(id,func){
        this.getQuery("SELECT * FROM "+this.tableName+" WHERE "+this.idField+" = "+id+" ;",
        function (result) {
            console.log("Result: "+result);
                if(func !=undefined)
                    func(result[0]);
          });
    }
    /**
     * 
     * @param {SQL string} sql sql you want to run
     * @param {function} func callback function when call is complete,function is passed result
     */
    getQuery(sql,func){
        console.log(sql);
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
        var tableString=[];
        var tableValues=[];
        for(var v in this.values){
            tableString.push(v);
            if(this.values[v]!=undefined){
                if(typeof this.values[v]=="string")
                    tableValues.push("\""+this.values[v]+"\"");
                else
                tableValues.push(this.values[v]);
            }
            else
                tableValues.push("NULL");
        }
        if(this.values[this.idField]!=undefined){
            var updatestr=[];
            for(var v in this.values){
                if(this.values[v]!=undefined){
                    if(typeof this.values[v]=="string")
                        updatestr.push(v+"=\""+this.values[v]+"\"");
                    else
                    updatestr.push(v+"="+this.values[v]);
                }
            }
           var sql= "UPDATE "+this.tableName+" SET "+updatestr.join(",")+" WHERE "+this.idField+" = "+this.values[this.idField]+" ;";
        }
        else{
            var sql="INSERT INTO "+this.tableName+" ( "+tableString.join(",")+" ) VALUES ("+tableValues.join(",")+") ;";
        }
        this.getQuery(sql,
        function (result) {
                console.log("Result: " + result);
                if(func!=undefined)
                    func();
          });
    }
}

class Member extends DbModel{
    constructor(vals){
        super();
        this.tableName="member";
        this.idField="memberid";
        this.fields=["firstname","lastname","email","phoneNumber","slackUsername","githubUsername","googleUid",
            "pictureUrl","bannerId","canPostAnnouncements"];
            super.createJSONFromFields(vals);
        
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
//var me=new Member({firstname:"jamie",lastname:"walder",email:"walderj5@students.rowan.edu",phoneNumber:"856-500-0106",canPostAnnouncements:true});
//me.saveToDb();
/*var me=new Member().getSingleByID(18,function(member){
    console.log(member.values.firstname);
}
);*/
/*var me=new Member().getList({firstname:"jamie"},["firstname"],(res)=>{
    for(var i in res){
        console.log(res[i].values);
        res[i].values.firstname="tyler";
        new Member(res[i].values).saveToDb();
    }
});*/
new Member().getJSONById(18,(res)=>{
    console.log(res);
});