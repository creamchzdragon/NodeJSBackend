
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
    getModel(){
        throw DOMException("abstract");
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
    assignFieldsFromJSON(vals){
        throw DOMException("abstract, please implement in your subclass");
    }
    /**
     * 
     * @param {number} id Id of the object you want to get
     * @param {Function} func callback function when object is retrievd, function is passed the current object after fields have been set
     */
    getSingleByID(id,func){
        var self=this;
        this.getQuery("SELECT * FROM "+this.tableName+" WHERE "+this.idField+" = "+id+" ;",
        
        function (result) {
            var obj=self.createDbModel(result);

                if(func !=undefined)
                    func(obj);
          });
    }
    createDbModel(result){
        var values={};
        for(var field in result[0]){
            values[field]=result[0][field];
        }
        var me = this.getModel();
        me.assignFieldsFromJSON(values);
        return me;
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
        var self=this;
        this.getQuery(sql,(result)=>{
            var objs=[];
            for(var i in result){
                var vals={};
                for(var field in result[i]){
                    vals[field]=result[i][field];
                }
                var obj=self.createDbModel(vals);
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
    getJSONList(conditions,orderby,func){
        var cond=[];
        for(var c in conditions){
            if(typeof conditions[c]=="string")
                cond.push(c+"=\""+conditions[c]+"\"");
            else
                cond.push(c+"="+conditions[c]);
        }
        var where="";
        if(cond.length!=0){
            where=" WHERE "+cond.join(",");
        }
        this.getQuery("SELECT * FROM "+this.tableName+where+" ORDER BY "+orderby.join(",")+" ;",
        function (result) {
            console.log("Result: "+result);
                if(func !=undefined)
                    func(result);
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
    assignFieldsFromJSON(vals){
        this.memberid=vals.memberid;
        this.firstname=vals.firstname;
        this.lastname=vals.lastname;
        this.email=vals.email;
        this.phoneNumber=vals.phoneNumber;
        this.slackUsername=vals.slackUsername;
        this.githubUsername=vals.githubUsername;
        this.googleUid=vals.googleUid;
        this.pictureUrl=vals.pictureUrl;
        this.bannerId=vals.bannerId;
        this.canPostAnnouncements=vals.canPostAnnouncements;
        
    }
    getModel(){
        return new Member();
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
    assignFieldsFromJSON(vals){
        this.committeeId=vals.committeeId;
        this.name=vals.name;
        this.description=vals.description;
        this.committeeHeadId=vals.committeeHeadId;
        this.learningChairId=vals.learningChairId;
        
    }
    getModel(){
        return new Committee();
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
    assignFieldsFromJSON(vals){
        this.meetingId=vals.meetingId;
        this.startTime=vals.startTime;
        this.meetingType=vals.meetingType;
        
        
    }
    getModel(){
        return new Meeting();
    }
}
class Announcement extends DbModel{
    constructor(){
        super();
        this.tableName="announcements";
        this.idField="announcementId";
        this.fields=["title","text","postedDate","imageUrl","externalLink","committeeId","authorId"];
        this.createJSONFromFields();
    }
    assignFieldsFromJSON(vals){
        this.announcementsId=vals.announcementsId;
        this.title=vals.title;
        this.text=vals.text;
        this.postedDate=vals.postedDate;
        this.imageUrl=vals.imageUrl;
        this.externalLink=vals.externalLink;
        this.committeeId=vals.committeeId;
        this.authorId=vals.authorId;
    }
    getModel(){
        return new Announcement();
    }

}
class AnnouncementV extends DbModel{
    constructor(){
        super();
        this.tableName="announcement_v";
        this.idField="announcementId";
        this.fields=["title","text","postedDate","imageUrl","externalLink","committeeId","authorId","name","firstname"];
        this.createJSONFromFields();
    }
    assignFieldsFromJSON(vals){
        this.announcementsId=vals.announcementsId;
        this.title=vals.title;
        this.text=vals.text;
        this.postedDate=vals.postedDate;
        this.imageUrl=vals.imageUrl;
        this.externalLink=vals.externalLink;
        this.committeeId=vals.committeeId;
        this.authorId=vals.authorId;
        this.name=vals.name;
        this.firstname=vals.firstname;
    }
    getModel(){
        return new Announcement();
    }

}
class CommitteeV extends DbModel{
    constructor(){
        super();
        this.tableName="committee_v";
        this.idField="committeeId";
        this.fields=["name","description","headFirstName","headLastName",
        "headEmail","learningChairFirstName","learningChairId","learningChairLastName"];
        this.createJSONFromFields();
    }
    assignFieldsFromJSON(vals){
        this.committeeId=vals.committeeId;
        this.name=vals.name;
        this.description=vals.description;
        this.headFirstName=vals.headFirstName;
        this.headLastName=vals.headLastName;
        this.headEmail=vals.headEmail;
        this.learningChairFirstName=vals.learningChairFirstName;
        this.learningChairLastName=vals.learningChairLastName;
        
    }
    getModel(){
        return new Committee();
    }
}
class MemberV extends DbModel{
    constructor(vals){
        super();
        this.tableName="member_v";
        this.idField="memberid";
        this.fields=["firstname","lastname","pictureUrl","committeeName"];
        super.createJSONFromFields(vals);
        
    }
    assignFieldsFromJSON(vals){
        this.memberid=vals.memberid;
        this.firstname=vals.firstname;
        this.lastname=vals.lastname;
        this.pictureUrl=vals.pictureUrl;
        this.committeeName=vals.committeeName;
        
        
    }
    getModel(){
        return new Member();
    }
}
module.exports={Member:Member,Committee:Committee,Announcement:Announcement,Meeting:Meeting,CommitteeV:CommitteeV,AnnouncementV:AnnouncementV
,MemberV:MemberV};
/*var me=new Member({firstname:"jamie",lastname:"walder",email:"walderj5@students.rowan.edu",phoneNumber:"856-500-0106",canPostAnnouncements:true});
me.saveToDb();*/
/*var me=new Member().getSingleByID(18,function(member){
    console.log(member);
}
);*/
/*var me=new Member().getList({firstname:"jamie"},["firstname"],(res)=>{
    for(var i in res){
        console.log(res[i].values);
        res[i].values.firstname="tyler";
        new Member(res[i].values).saveToDb();
    }
});*/
/*new Member().getJSONById(18,(res)=>{
    console.log(res);
});*/

/*new Member().getJSONList({firstname:"tyler"},["firstname"],function(res){
    console.log(res);
});*/