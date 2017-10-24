DROP TABLE IF EXISTS `contacts`;

CREATE TABLE `contacts` (
  `id` int(12)        				unsigned NOT NULL AUTO_INCREMENT,
  `logged_user_id`						int(12) unsigned NOT NULL,
  `contact_id`								int(12) unsigned NOT NULL,
  `created_at` 								timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` 								timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  FOREIGN KEY (`logged_user_id`) REFERENCES `users` (`id`),

) ENGINE=InnoDB DEFAULT CHARSET=utf8;