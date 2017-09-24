DROP TABLE IF EXISTS `gallery`;

CREATE TABLE `gallery` (
  `id` 											      int(12) unsigned NOT NULL AUTO_INCREMENT,
  `userId`										    int(12) unsigned NOT NULL,
  `photoPath`									    varchar(255) NOT NULL,
  `email`                       	varchar(255) NOT NULL,
  `created_at` 								    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` 								    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` 									      tinyint(1) unsigned NOT NULL DEFAULT '1',

  PRIMARY KEY (`id`),
  UNIQUE KEY `uniqueItems` (`email`,`hash`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;