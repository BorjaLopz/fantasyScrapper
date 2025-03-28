delete from "UserTeam";
select *
from "Player"
where "positionName" != '';
update "Player"
set "positionName" = '', "positionNameIndex" = 0;