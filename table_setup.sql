CREATE TABLE test.member (memberid INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, firstname VARCHAR(45),lastname VARCHAR(45), email VARCHAR(45), phoneNumber VARCHAR(45),slackUsername VARCHAR(45),githubUsername VARCHAR(45),googleUid VARCHAR(45),pictureUrl VARCHAR(200),bannerId VARCHAR(45),canPostAnnouncements TINYINT(4));
CREATE TABLE test.committee (committeeId INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,name VARCHAR(45),committeeHeadId INT,learningChairId INT);
CREATE TABLE test.announcements (announcementId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,title VARCHAR(45), text VARCHAR(45),postedDate DATETIME, imageUrl VARCHAR(45),externalLink VARCHAR(45),committeeId VARCHAR(45),authorId INT);
CREATE TABLE test.member_committee (memberId INT NOT NULL, committeeId INT NOT NULL);
CREATE TABLE test.meeting (meetingId INT NOT NULL PRIMARY KEY, startTime DATETIME,meetingType VARCHAR(45));
CREATE TABLE test.member_meeting (memberId INT,meetingId INT);