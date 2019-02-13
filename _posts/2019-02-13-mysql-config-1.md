---
layout: post
title:  "Настройка MySQL/MariaBD"
author: vdovenko_eugene
date:  2019-02-13 00:00:00 +0000
tags:   [Linux, MySQL, MariaDB, DevOps, database]
categories: [DevOps]
---

Решаю проблемы с MySQL / MariaDB по мере их возникновения. Не всегда результативно, но всё же...


В журнале СУБД попадается вот такая запись:

```
Jan 1 00:00:00 ubuntu mysqld[1757]: 190213  0:00:00 [Warning] 'user' entry 'root@localhost' has both a password and an authentication plugin specified. The password will be ignored.
```

Что это означает? Для авторизации пользователя `root@localhost` используется плагин, готорый авторизует этого 
пользователя без запроса пароля. Посмотрим плагины, подключенные к этому пользователю:

```
 > SELECT user, host, plugin FROM mysql.user;
 +--------+-----------+-------------+
 | user   | host      | plugin      |
 +--------+-----------+-------------+
 | root   | localhost | unix_socket |
 | user   | localhost |             |
 +--------+-----------+-------------+
 2 rows in set (0.00 sec)
``` 

Видим, что у пользователя `root` есть используемый плагин `unix_socket`. Этот плагин позволяет авторизоваться в СУБД
без ввода пароля, если в системе у пользователя повышенные привелегии (например, под `sudo`).

В последних версиях MySQL/MariaDB под пользователем `root` по другому и не авторизуешься, только с повышенными 
привелегиями.

Данный способ (с использованием плагина `unix_socket` без ввода пароля) необходим для выполнения некоторых сценариев 
запуска и мониторинга службы MySQL/MariaDB.   

Теоретически, этот способ авторизации можно отключить:

```
UPDATE mysql.user SET plugin = '' WHERE plugin = 'unix_socket';
FLUSH PRIVILEGES;
```

Но в некоторых случаях могут возникнуть проблемы при перезагрузке служб СУБД.

Как решение, предлагают создавать несколько пользователей и для `root` использовать авторизацию по `unix_socket`, 
а для второго - через TCP с использованием логина и пароля.

```
CREATE USER admin@localhost IDENTIFIED BY 'your_password'; 
GRANT ALL ON *.* TO admin@localhost WITH GRANT OPTION;
```

или

```
GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' IDENTIFIED BY 'your_password' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED VIA unix_socket WITH GRANT OPTION;
```

В последнем случае нужно понимать, что в MySQL `localhost` и `127.0.0.1` - это не одно и то же.



__Полезные ссылки__:
1. [Stack Overflow #43439111](https://stackoverflow.com/questions/43439111/mariadb-warning-rootlocalhost-has-both-the-password-will-be-ignored)