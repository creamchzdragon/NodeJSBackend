class DbModel{
    constructor(){
        this.tableName=null;
        this.idField=null;
        this.fields=null;
    }
    getSingleByID(id){
        throw DOMException("not implmented yet");
    }
    getList(condition,orderby,ascending){
        throw DOMException("not implmented yet");
    }
    getSingleByField(field){
        throw DOMException("not implmented yet");
    }
    getFieldById(id,fieldName){
        throw DOMException("not implmented yet");
    }
    getJSON(){
        throw DOMException("not implmented yet");
    }
}

export class Member extends DbModel{
    constructor(){
        super();
        this.tableName="person";
        this.idField="memberId";
        this.fields=["firstName","lastName","email","phoneNumber","slackUsername","githubUsername","googleUid",
            "pictureUrl","bannerId","canPostAnnouncements"];
    }
}
export class Committee extends DbModel{
    constructor(){
        super();
        this.tableName="committee";
        this.idField="committeeId";
        this.fields=["name","description","committeeHeadId","learningChairId"];
    }
}
export class MemberCommittee extends DbModel{
    constructor(){
        super();
        this.tableName="member_committee";
        this.fields=["memberId","committeeId"];

    }
}
export class MemberMeeting extends DbModel{
    constructor(){
        super();
        this.tableName="member_meeting";
        this.fields=["memberId","meetingId"];

    }
}
export class Meeting extends DbModel{
    constructor(){
        super();
        this.tableName="meeting";
        this.idField="meetingId";
        this.fields=["startTime","meetingType"];
    }
}
export class Announcement extends DbModel{
    constructor(){
        super();
        this.tableName="announcement";
        this.idField="announcementsId";
        this.fields=["title","text","postedDate","imageUrl","externalLink","committeeId","authorId"];
    }
}