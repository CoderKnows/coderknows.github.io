---
layout: post
title:  "Symfony Flex"
author: vdovenko_eugene
date:   2019-07-24 00:00:00 +0000
tags:   [Symfony, php]
categories: [PHP]
---

[Рецепты Flex](https://flex.symfony.com/)

Развернуть заготовку в текущем пустом каталоге можно командой:
```
composer create-project symfony/skeleton ./
```

- Установка __Web Debug Toolbar__ - панели, которая отображает огромное количество отладочной информации в 
нижней части вашей страницы во время разработки. Также добавляются функции `dump()` (как замена 
_var_dump()_) и `dd()` (_dump() and die()_).
  ```
  composer require --dev symfony/profiler-pack
  ```
  или через псевдоним:
  ```
  composer require --dev profiler
  ```
  - [Profiler](https://symfony.com/doc/current/profiler.html)
  - [The VarDumper Component](https://symfony.com/doc/current/components/var_dumper.html)
  - [Advanced Usage of the VarDumper Component](https://symfony.com/doc/current/components/var_dumper/advanced.html)

- Работа с базами данных (устанвливаются пакеты __Doctrine ORM__):
  ```
  composer require symfony/orm-pack
  ```
  или через псевдоним:
  ```
  composer require doctrine
  ```

- Добавление поддержки фикстур (__fixture__):
  ```
  composer require --dev doctrine/doctrine-fixtures-bundle
  ```
  или через псевдоним:
  ```
  composer require --dev orm-fixtures
  ```

- Чтобы добавить в приложение возможность настройки при помощи аннотаций (блоки комметариев перед описанием класса/метода)
  ```
  composer require annotations
  ```


- Этот рецепт для построения API (добавляет поддержку фреймворка [__api-platform__](https://api-platform.com/)).
  ```
  composer require api-platform/api-pack
  ```
  или через псевдоним:
  ```
  composer require api
  ```
  Чтобы добавить поддержку формата __GraphQL__ нужно подключить ещё один модуль:
  ```
  composer require webonyx/graphql-php
  ```
  - [API Platform Documentation](https://api-platform.com/docs)

- Настройка логирования (добавляется поддержка библиотеки __Monolog__):
  ```
  composer require logger
  ```

- Интернационализация и локализация:
  ```
  composer require symfony/translation
  ```
    или через псевдоним:
  ```
  composer require translation
  ```
