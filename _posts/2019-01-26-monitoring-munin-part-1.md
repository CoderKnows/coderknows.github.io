---
layout: post
title:  "Системы мониторинга: Munin"
author: vdovenko_eugene
date:   2019-01-26 09:30:00 +0000
tags:   [DevOps, Monitoring, Munin]
categories: [DevOps]
---

Одно из условий бесперебойной работы сервисов - бесперебойная работа операционной системы и её компонентов.

__Munin__ - это система мониторинга тенденций, она собирает изменения в показателях работы системы с их последующей 
аналитикой.

Установка в систему:
```
sudo apt-get update
sudo apt-get install munin
sudo apt-get install munin-node
```

Настройка Munin происходит через 2 файла: `/etc/munin/munin.conf` и `/etc/munin/munin-node.conf`. Для начала, просто 
настроим в этих файлах имя системы:

в файле `/etc/munin/munin.conf` ищем строку:

```
[localhost.localdomain]
```

и меняем например, на такое:

```
[srv.domain.com]
```

В файле `/etc/munin/munin-node.conf` нужно найти строку

```
#host_name localhost.localdomain
```

Именно её потребуется отредактировать — например, так:

```
host_name srv.domain.com
```

Основное преимущество Munin - это наличие большого количества готовых плагинов, которые позволяют мониторить разныые 
параметры системы и приложения. Посмотреть их список, доступный в системе можно в каталоге

```
ls -l /usr/share/munin/plugins/
``` 

Для того, чтобы установить плагин нужно создать на него символическую ссылку в каталоге `/etc/munin/plugins/`. 
Например, для DNS-сервера Bind: 

```
cd /etc/munin/plugins/
ln -s /usr/share/munin/plugins/bind9
```

Управление сервисом: тут все стандартно
```
# запуск
service munin-node start
# перезапуск
service munin-node restart
# остановка
service munin-node stop
```

__Полезные ссылки__:
1. [Официальный сайт Munin](http://munin-monitoring.org)
