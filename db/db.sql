-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.5.9


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema listen_his_songs
--

CREATE DATABASE IF NOT EXISTS listen_his_songs;
USE listen_his_songs;

--
-- Definition of table `fgroup`
--

DROP TABLE IF EXISTS `fgroup`;
CREATE TABLE `fgroup` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `openid` varchar(48) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;


--
-- Definition of table `friend`
--

DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend` (
  `gid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fopenid` varchar(48) NOT NULL,
  PRIMARY KEY (`gid`,`fopenid`),
  CONSTRAINT `FK_friend_group` FOREIGN KEY (`gid`) REFERENCES `fgroup` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

--
-- Definition of table `listened_song`
--

DROP TABLE IF EXISTS `listened_song`;
CREATE TABLE `listened_song` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `begin_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `interrput` tinyint(1) NOT NULL DEFAULT '0',
  `time` time DEFAULT NULL,
  `usid` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_listened_song_us` (`usid`),
  CONSTRAINT `FK_listened_song_us` FOREIGN KEY (`usid`) REFERENCES `user_song` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;

--
-- Definition of table `song`
--

DROP TABLE IF EXISTS `song`;
CREATE TABLE `song` (
  `sid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `src` varchar(256) NOT NULL,
  `genre_name` varchar(20) DEFAULT NULL,
  `singer` varchar(45) NOT NULL,
  `album` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`sid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

--
-- Definition of table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `password` varchar(20) NOT NULL,
  `registertime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Definition of table `user_song`
--

DROP TABLE IF EXISTS `user_song`;
CREATE TABLE `user_song` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `times_5d` int(10) unsigned zerofill NOT NULL DEFAULT '0000000001',
  `times_10d` int(10) unsigned zerofill NOT NULL DEFAULT '0000000001',
  `times_15d` int(10) unsigned zerofill NOT NULL DEFAULT '0000000001',
  `times_30d` int(10) unsigned zerofill NOT NULL DEFAULT '0000000001',
  `openid` varchar(48) NOT NULL,
  `sid` int(10) unsigned NOT NULL,
  `flag` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_user_song_song` (`sid`),
  CONSTRAINT `FK_user_song_song` FOREIGN KEY (`sid`) REFERENCES `song` (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Definition of table `users_genre`
--

DROP TABLE IF EXISTS `users_genre`;
CREATE TABLE `users_genre` (
  `user_id` int(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `num` int(4) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users_genre`
--

/*!40000 ALTER TABLE `users_genre` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_genre` ENABLE KEYS */;


--
-- Definition of procedure `test`
--

DROP PROCEDURE IF EXISTS `test`;

DELIMITER $$

/*!50003 SET @TEMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `test`(IN param INT)
BEGIN
	INSERT INTO listened_song(`usid`) VALUES(param);
	delete from listened_song 
		where usid = param 
		AND DATE_SUB(CURDATE(), INTERVAL 30 DAY) > FROM_UNIXTIME(begin_time);
	update user_song 
		set times_5d = (select count(id) from listened_song where usid = param AND DATE_SUB(CURDATE(), INTERVAL 5 DAY) <= DATE(begin_time)),
			times_10d = (select count(id) from listened_song where usid = param AND DATE_SUB(CURDATE(), INTERVAL 10 DAY) <= DATE(begin_time)),
			times_15d = (select count(id) from listened_song where usid = param AND DATE_SUB(CURDATE(), INTERVAL 15 DAY) <= DATE(begin_time)),
			times_30d = (select count(id) from listened_song where usid = param AND DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= DATE(begin_time)) 
		where id = param;
END $$
/*!50003 SET SESSION SQL_MODE=@TEMP_SQL_MODE */  $$

DELIMITER ;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
