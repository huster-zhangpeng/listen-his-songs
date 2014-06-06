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
-- Definition of table `friends`
--

DROP TABLE IF EXISTS `friends`;
CREATE TABLE `friends` (
  `user_uid` int(10) NOT NULL,
  `uid` int(10) NOT NULL,
  `name` varchar(25) NOT NULL,
  `registertime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_uid`,`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `friends`
--

/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;


--
-- Definition of table `genre`
--

DROP TABLE IF EXISTS `genre`;
CREATE TABLE `genre` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `number` int(3) NOT NULL,
  `kinds` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `genre`
--

/*!40000 ALTER TABLE `genre` DISABLE KEYS */;
/*!40000 ALTER TABLE `genre` ENABLE KEYS */;


--
-- Definition of table `listend_songs`
--

DROP TABLE IF EXISTS `listend_songs`;
CREATE TABLE `listend_songs` (
  `user_id` int(10) NOT NULL,
  `friends_id` int(10) NOT NULL,
  `begin_time` datetime NOT NULL,
  `interrput` tinyint(1) NOT NULL,
  `time` time NOT NULL,
  PRIMARY KEY (`user_id`,`friends_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `listend_songs`
--

/*!40000 ALTER TABLE `listend_songs` DISABLE KEYS */;
/*!40000 ALTER TABLE `listend_songs` ENABLE KEYS */;


--
-- Definition of table `songs`
--

DROP TABLE IF EXISTS `songs`;
CREATE TABLE `songs` (
  `mid` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `src` varchar(100) NOT NULL,
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `songs`
--

/*!40000 ALTER TABLE `songs` DISABLE KEYS */;
/*!40000 ALTER TABLE `songs` ENABLE KEYS */;


--
-- Definition of table `songs_genre`
--

DROP TABLE IF EXISTS `songs_genre`;
CREATE TABLE `songs_genre` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `genre` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `songs_genre`
--

/*!40000 ALTER TABLE `songs_genre` DISABLE KEYS */;
/*!40000 ALTER TABLE `songs_genre` ENABLE KEYS */;


--
-- Definition of table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `password` varchar(20) NOT NULL,
  `registertime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`uid`,`name`,`password`,`registertime`) VALUES 
 (1,'zp','111111','2012-04-10 00:55:04'),
 (2,'hk','111111','2012-04-10 00:55:50');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;


--
-- Definition of table `users_songs`
--

DROP TABLE IF EXISTS `users_songs`;
CREATE TABLE `users_songs` (
  `user_name` varchar(25) NOT NULL,
  `user_uid` int(10) NOT NULL,
  `songs_name` varchar(40) NOT NULL,
  `songs_id` int(10) NOT NULL,
  `five_days_rate` float NOT NULL,
  `ten_days_rate` float NOT NULL,
  `fifteen_days_rate` float NOT NULL,
  `one_month_rate` float NOT NULL,
  PRIMARY KEY (`user_uid`,`songs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users_songs`
--

/*!40000 ALTER TABLE `users_songs` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_songs` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
