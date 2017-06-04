DROP TABLE IF EXISTS `userHash`;

CREATE TABLE `userHash` (
  `email`                       			varchar(255) NOT NULL,
  `hash` 									varchar(90) NOT NULL,
  `created_at` 								timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` 								timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` 									tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;