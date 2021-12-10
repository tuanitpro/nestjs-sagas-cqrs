CREATE USER 'demo-db'@'%' IDENTIFIED BY 'demo-db';

CREATE DATABASE IF NOT EXISTS `demo-db`;

GRANT ALL ON `demo-db`.* TO 'demo-db'@'%';


