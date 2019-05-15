---
layout: post
title:  "Управление пакетами: Composer"
author: vdovenko_eugene
date:   2018-09-13 14:30:00 +0000
tags:   [php]
categories: [PHP]
---

Q: При выполнении некоторых команд вылетает ошибка:
```
PHP Fatal error:  Allowed memory size of 1610612736 bytes exhausted (tried to allocate 4096 bytes) in phar:...
```

A:
```
php -d memory_limit=-1 composer.phar update
```