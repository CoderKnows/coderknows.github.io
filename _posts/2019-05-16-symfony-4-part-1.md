---
layout: post
title:  "Новый проект на Symfony 4"
author: vdovenko_eugene
date:   2019-05-16 17:30:00 +0000
tags:   [Symfony, php, frameworks, новый проект]
categories: [PHP]
---

__Symfony PHP Framework__.

Для нового проекта можно использовать специальную заготовку, доступную через Composer:
- для разработки микросервисов, консольных приложений или API
  ```
  composer create-project symfony/skeleton ./
  ```
- для разработки веб-сайтов
  ```
  composer create-project symfony/website-skeleton ./
  ```

или, если не используется глобально установленный Composer:
```
php composer.phar create-project symfony/skeleton ./
```

Установка делается в __пустой__ каталог, иначе Composer будет ругаться.

__Полезные ссылки__:
 1. [Официальная документация](https://symfony.com/doc/) (en)
