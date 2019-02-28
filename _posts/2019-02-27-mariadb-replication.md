---
layout: post
title:  "Настройка репликации MariaBD"
author: vdovenko_eugene
date:  2019-02-27 16:27:00 +0000
tags:   [Linux, MariaDB, DevOps, database, replication]
categories: [DevOps]
---

Начиная с версии 10.0.2 у MariaDB есть новый режим репликации. Чем он отличается от старого?

Старый подход: все действия с базой данных записываются в некие файлы (binlog, двоичный лог). Существование этих вайлов
позволяет восстановить базу в случае сбоя и узнать, как изменлась база.

Теперь можно создать ещё одну базу данных (slave) и указать оригинальной базе (master), с какого момента 
нужно передать данные из binlog-а в новую базу. Т.е. процесс такой:
1. master изменяется
2. данные об изменении записываются в binlog
3. из slave в master передаются данные, какой файл binlog-а и какое смещение от начала в этом файле было 
   передано последним в slave 
4. данные из binlog-а передаются в slave

А теперь новая задача: база, в которую вносятся изменения - не одна. Настроить репликацию между несколькими 
разными базами было проблематично при таком подходе. Поэтому сделали новый вариант репликации: вместо указания 
файла binlog-а и смещения указывают составной мега-идентификатор сервера и точку последней синхронизации с 
этого сервера (GTID).

Это объяснение на пальцах и на сколько я понял сам.

__Теперь, как настраивать__.

На сервере с master-базой:
1. Открываем конфигурационный файл my.cnf. Обычно он находится в каталоге `\etc\mysql\`.
   ```
   sudo vi \etc\mysql\my.cnf
   ```
2. Включаем ведение файлов bin-log.
   ```
   log_bin          = /var/log/mysql/mariadb-bin
   log_bin_index    = /var/log/mysql/mariadb-bin.index
   max_binlog_size  = 100M
   expire_logs_days = 10
   ```
3. Устанавливаем идентификатор сервера. 
   ```
   server-id = 1
   ```
4. Перезапускаем сервер:
   ```
   sudo service mysql restart
   ``` 

На сервере со slave-базой:
1. Конфигурационный файл уже оказался немного другой:
   ```
   sudo vi \etc\mysql\mariadb.conf.d\50-server.cnf
   ```
2. Включаем ведение файлов bin-log.
   ```
   log_bin          = /var/log/mysql/mysql-bin.log
   log_bin_index    = /var/log/mysql/mysql-bin.index
   max_binlog_size  = 100M
   expire_logs_days = 10
   ```
3. Устанавливаем идентификатор сервера. 
   ```
   server-id = 2
   ```
4. Задаем базу, которую будем реплицировать:
   ```
   replicate_do_db = dbName
   ```
   Для репликации нескольких баз нужно повторить этот параметр для каждой базы.
5. Перезапускаем сервер:
   ```
   sudo service mysql restart
   ```

__Полезные ссылки__:
1. [Репликация MySQL без простоя](https://askit.su/replikatsiya-mysql-bez-prostoya/)
2. [Как настроить MySQL Master-Slave репликацию?](https://ruhighload.com/%D0%9A%D0%B0%D0%BA+%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D1%8C+mysql+master-slave+%D1%80%D0%B5%D0%BF%D0%BB%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D1%8E%3f)
3. [Master-Slave репликация MySQL (MariaDB)](https://zipofar.ru/doku.php?id=master-slave_replication_mysql_mariadb)
4. [Global Transaction ID](https://mariadb.com/kb/en/library/gtid/)
5. [SHOW BINLOG EVENTS](https://mariadb.com/kb/en/library/show-binlog-events/)
6. [CHANGE MASTER TO](https://mariadb.com/kb/en/library/change-master-to/)
7. [Replication Filters](https://mariadb.com/kb/en/library/replication-filters/)
8. [Настройка репликации MySQL](http://www.hilik.org.ua/%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0-%D1%80%D0%B5%D0%BF%D0%BB%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D0%B8-mysql/)
