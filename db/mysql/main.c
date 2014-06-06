#include <mysql/mysql.h>
#include <stdio.h>
#include <stdlib.h>

#define UPDATE "UPDATE user_song SET times_30d = (SELECT COUNT(*) FROM listened_song WHERE listened_song.usid = user_song.id AND DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= FROM_UNIXTIME(begin_time)), times_15d = (SELECT COUNT(*) FROM listened_song WHERE listened_song.usid = user_song.id AND DATE_SUB(CURDATE(), INTERVAL 15 DAY) <= FROM_UNIXTIME(begin_time)), times_10d = (SELECT COUNT(*) FROM listened_song WHERE listened_song.usid = user_song.id AND DATE_SUB(CURDATE(), INTERVAL 10 DAY) <= FROM_UNIXTIME(begin_time)), times_5d = (SELECT COUNT(*) FROM listened_song WHERE listened_song.usid = user_song.id AND DATE_SUB(CURDATE(), INTERVAL 5 DAY) <= FROM_UNIXTIME(begin_time))"

int main(){
	MYSQL *conn;

	char server[] = "localhost";
	char username[] = "root";
	char password[] = "111111";
	char database[] = "listen_his_songs";

	conn = mysql_init(NULL);
	if(!mysql_real_connect(conn, server, username, password, database, 0, NULL, 0)){
		fprintf(stderr, "%s\n", mysql_error(conn));
		exit(-1);
	}

	if(mysql_query(conn, UPDATE)){
		fprintf(stderr, "%s\n", mysql_error(conn));
		exit(-1);
	}

	mysql_close(conn);
	return -1;
}
