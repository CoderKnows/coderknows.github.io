---
layout: post
title:  "Использование Laravel Homestead и Vagrant"
author: vdovenko_eugene
date:   2019-01-24 13:40:00 +0000
tags:   [DevOps, Vagrant, Homestead]
categories: [DevOps]
---

Для локальной разработки я использую вирутальные машины. В основном - это 
[Laravel Homestead](https://app.vagrantup.com/laravel/boxes/homestead). В официальной документации достаточно подробно 
описано, как эту виртуальную машину развернуть и использовать. 

Но, тут возникла задача: с каждой версией обновляется ПО в этой виртуальной машине. Для legacy-проектов нужен старый
софт (вроде, старых версий PHP, старых версий систем и т.п.).

Скачать себе определенную версию виртуальной машины:

```
vagrant box add --box-version "6.4.0" laravel/homestead
```

Настройка Homestead делается через файл `homestead.yml`, который находится в каталоге с виртуалкой. Запустить 
два раза одну виртуальню машину с идеинтичными настройками нельзя (vagrant контролирует названия своих box-ов).
В файле настроек есть несколько параметров, которые нужно будет поменять.

```

---
ip: "192.168.10.11"

version: 6.4.0
name: homestead-6

```

- меняем ip-адрес (по умолчанию, 192.168.10.10) 
- прописываем версию виртуальной машины, которую хотим использовать (по умолчанию, последняя версия в системе)
- прописываем название виртуальной машины (по умолчанию, homestead-<текущая_версия_виртуальной_машины>)

В итоге, в системе будет две версии виртуальной машины:

```
> vagrant box list
laravel/homestead (virtualbox, 6.4.0)
laravel/homestead (virtualbox, 7.0.0)
```

```
> vagrant global-status
id       name        provider   state    directory
-----------------------------------------------------------------------------
c2d0814  homestead-7 virtualbox poweroff C:/Projects/Homestead
91f9c87  homestead-6 virtualbox poweroff C:/Projects/vm
```

И не забыть, в настройках сайта файла `homestead.yml` написать версию php:

```
sites:
# Project
    - map: project.test
      to: /var/www/project/www
      php: "5.6"
```
