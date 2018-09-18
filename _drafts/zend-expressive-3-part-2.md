---
layout: post
title:  "Zend Service Manager в качестве DI-контейнера Zend Expressive 3"
author: vdovenko_eugene
#date:   2018-09-13 16:40:00 +0000
tags:   zend-expressive zend-servicemanager DI php frameworks
categories: zend expressive
---

При установке Zend Expressive можно выбрать разные реализации управления зависимостями. 
У Zend есть и собственный контейнер - *Zend Service Manager*.

Для его настройки в конфигурации приложения есть отдельный раздел: 
```
'dependencies' => [
        'aliases' => [
            Fully\Qualified\ClassOrInterfaceName::class => Fully\Qualified\ClassName::class,
        ],
        'invokables' => [
            Fully\Qualified\InterfaceName::class => Fully\Qualified\ClassName::class,
        ],
        'factories'  => [
            Fully\Qualified\ClassName::class => Fully\Qualified\FactoryName::class,
        ],
```

Как видно из примера, есть несколько видов зависимостей, которые могут быть в контейнере:
- aliases
- invokable
- factories

### Aliases (Псевдонимы)

### Invokables (Вызываемые)

### Factories (Фабрики)