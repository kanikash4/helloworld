DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id`                                          int(12) unsigned NOT NULL AUTO_INCREMENT,
  `email`                                       varchar(255) NOT NULL,
  `firstname`                                   varchar(255) DEFAULT NULL,
  `lastname`                                    varchar(255) DEFAULT NULL,
  `status`                                      tinyint(1) unsigned NOT NULL DEFAULT '1',
  `phone`                                       varchar(255) DEFAULT NULL,
  `created_at`                                  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at`                                  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `password`                                    varchar(90) DEFAULT NULL,
  `username`                                    varchar(30) DEFAULT NULL,
  `token`                                       varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8;