DROP TABLE IF EXISTS `userMesages`;

CREATE TABLE `userMessages` (
  `id`										int(12) unsigned NOT NULL AUTO_INCREMENT,
  `user_id`									int(12) unsigned NOT NULL,
  `message`                                 varchar(255) NOT NULL,
  `created_at` 								timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` 								timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),

  INDEX `idx_id` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;