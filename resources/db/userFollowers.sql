DROP TABLE IF EXISTS `userFollowers`;

CREATE TABLE `userFollowers` (
  `id` int(12)        				unsigned NOT NULL AUTO_INCREMENT,
  `followed_by`								int(12) unsigned NOT NULL,
  `followed_to`								int(12) unsigned NOT NULL,
  `created_at` 								timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` 								timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  FOREIGN KEY (`followed_by`) REFERENCES `users` (`id`),
  FOREIGN KEY (`followed_to`) REFERENCES `users` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;