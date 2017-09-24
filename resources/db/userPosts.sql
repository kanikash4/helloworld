DROP TABLE IF EXISTS `userPosts`;

CREATE TABLE `userPosts` (
  `id` 													int(12) unsigned NOT NULL AUTO_INCREMENT,
  `email` 											varchar(255) NOT NULL,
  `status` 											tinyint(1) unsigned NOT NULL DEFAULT '1',
  `comment` 										varchar(255) DEFAULT NULL,
  `deleted_at`								  datetime DEFAULT NULL,
  `created_at` 									timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` 									timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uniquePosts` (`email`,`status`,`created_at`)

) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8;