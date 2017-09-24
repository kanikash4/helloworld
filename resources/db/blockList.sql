DROP TABLE IF EXISTS `blockList`;

CREATE TABLE `blockList` (
  `id` int(12)        				unsigned NOT NULL AUTO_INCREMENT,
  `user_id`										int(12) unsigned NOT NULL,
  `participant_id`						int(12) unsigned NOT NULL,
  `created_at` 								timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` 								timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`participant_id`) REFERENCES `users` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;