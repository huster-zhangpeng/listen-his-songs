-- phpMyAdmin SQL Dump
-- version 2.11.6
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2012 年 04 月 07 日 14:43
-- 服务器版本: 5.0.51
-- PHP 版本: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `listening_friends`
--

-- --------------------------------------------------------

--
-- 表的结构 `friends`
--
-- 创建时间: 2012 年 04 月 07 日 22:00
--

DROP TABLE IF EXISTS `friends`;
CREATE TABLE IF NOT EXISTS `friends` (
  `user_uid` int(10) NOT NULL,
  `uid` int(10) NOT NULL,
  `name` varchar(25) NOT NULL,
  `registertime` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`user_uid`,`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 导出表中的数据 `friends`
--


-- --------------------------------------------------------

--
-- 表的结构 `genre`
--
-- 创建时间: 2012 年 04 月 07 日 22:01
--

DROP TABLE IF EXISTS `genre`;
CREATE TABLE IF NOT EXISTS `genre` (
  `id` int(10) NOT NULL auto_increment,
  `number` int(3) NOT NULL,
  `kinds` varchar(20) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- 导出表中的数据 `genre`
--


-- --------------------------------------------------------

--
-- 表的结构 `listend_songs`
--
-- 创建时间: 2012 年 04 月 07 日 22:03
--

DROP TABLE IF EXISTS `listend_songs`;
CREATE TABLE IF NOT EXISTS `listend_songs` (
  `user_id` int(10) NOT NULL,
  `friends_id` int(10) NOT NULL,
  `begin_time` datetime NOT NULL,
  `interrput` tinyint(1) NOT NULL,
  `time` time NOT NULL,
  PRIMARY KEY  (`user_id`,`friends_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 导出表中的数据 `listend_songs`
--


-- --------------------------------------------------------

--
-- 表的结构 `songs`
--
-- 创建时间: 2012 年 04 月 07 日 22:04
--

DROP TABLE IF EXISTS `songs`;
CREATE TABLE IF NOT EXISTS `songs` (
  `mid` int(10) NOT NULL auto_increment,
  `name` varchar(40) NOT NULL,
  `src` varchar(100) NOT NULL,
  PRIMARY KEY  (`mid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- 导出表中的数据 `songs`
--


-- --------------------------------------------------------

--
-- 表的结构 `songs_genre`
--
-- 创建时间: 2012 年 04 月 07 日 22:06
--

DROP TABLE IF EXISTS `songs_genre`;
CREATE TABLE IF NOT EXISTS `songs_genre` (
  `id` int(10) NOT NULL auto_increment,
  `genre` varchar(20) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- 导出表中的数据 `songs_genre`
--


-- --------------------------------------------------------

--
-- 表的结构 `user`
--
-- 创建时间: 2012 年 04 月 07 日 21:58
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `uid` int(10) NOT NULL auto_increment,
  `name` varchar(25) NOT NULL,
  `password` varchar(20) NOT NULL,
  `registertime` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- 导出表中的数据 `user`
--


-- --------------------------------------------------------

--
-- 表的结构 `users_songs`
--
-- 创建时间: 2012 年 04 月 07 日 22:09
--

DROP TABLE IF EXISTS `users_songs`;
CREATE TABLE IF NOT EXISTS `users_songs` (
  `user_name` varchar(25) NOT NULL,
  `user_uid` int(10) NOT NULL,
  `songs_name` varchar(40) NOT NULL,
  `songs_id` int(10) NOT NULL,
  `five_days_rate` float NOT NULL,
  `ten_days_rate` float NOT NULL,
  `fifteen_days_rate` float NOT NULL,
  `one_month_rate` float NOT NULL,
  PRIMARY KEY  (`user_uid`,`songs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 导出表中的数据 `users_songs`
--

