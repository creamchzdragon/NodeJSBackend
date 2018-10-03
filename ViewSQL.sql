ALTER VIEW announcement_v AS (

  SELECT a.announcementId,a.title,a.text,a.postedDate,a.imageUrl,a.externalLink,c.committeeId,m.memberid,c.name,m.firstname FROM
    announcements a
  LEFT JOIN 
    committee c
  ON
    a.committeeId = c.committeeId
  LEFT JOIN
    member m
  ON 
    m.memberid=a.authorId
);
CREATE VIEW committee_v AS(
    SELECT c.committeeId, c.name, c.description, m.firstname AS headFirstName,
    m.lastname AS headLastName,m.email AS headEmail,m2.firstname AS learningChairFirstName,
    m2.lastname AS learningChairLastName
    FROM committee c
    LEFT JOIN member m ON m.memberid=c.committeeHeadId
    LEFT JOIN member m2 ON m2.memberid=c.learningChairId 
);
CREATE VIEW member_v AS(
    SELECT m.memberid,m.firstname,m.lastname,m.pictureUrl,c.name AS committeeName
    FROM member m
    LEFT JOIN member_committee mc ON mc.memberid=m.memberid
    LEFT JOIN committee c ON c.committeeId = mc.committeeId
);