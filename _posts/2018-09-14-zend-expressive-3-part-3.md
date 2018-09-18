---
layout: post
title:  "Работа с базами даннных в Zend Expressive 3"
author: vdovenko_eugene
date:   2018-09-14 09:10:00 +0000
tags:   zend-expressive zend-db database php frameworks
categories: zend expressive
---

На моей памяти, чаще всего для работы с базами данных в PHP-проектах используют Doctrine ORM.
В версии 2 данная ORM использует паттерн _Data Mapper_.
 
Пока что обойдемся стандартным компонентом _Zend\Db_ .
Этот модуль использует паттерн _Table Gateway_. 
Для небольших объемов данных этот модуль вполне себе сгодится.

__NB!__

Про паттерны проектирования (_Design Pattern_) будет отдельный рассказ.

И так, устанавливаем модуль _Zend\Db_:
```
composer require zendframework/zend-db
```

Далее, предлагаю создать отдельный модуль, в котором сгруппируем код для работы с БД.

Делается это так: в консоле заходим в каталог проекта и выполняем команду для создания нового модуля:
```
module:create [-c|--composer COMPOSER] [-p|--modules-path MODULES-PATH] [--] <module>
```
```
$ composer expressive module:create Database

> expressive --ansi 'module:create' 'Database'
Using project autoloader based on current working directory
Created module Database in /var/www/domain.tld/src/Database
Generating autoload files
Registered autoloading rules and added configuration entry for module Database
```

На выходе получаем некоторую структуру каталогов и файлов нового модуля.
Также, этот модуль прописывается в файлах _composer.json_ и _config.php_.

Теперь нужно вписать настройки доступа к БД. 
Настройки пропишем в файле ConfigProvider.php:

```
public function __invoke() : array
{
    return [
        'dependencies' => $this->getDependencies(),
        'templates'    => $this->getTemplates(),

        'db' => [
            'driver'   => 'Pdo_Pgsql',
            'database' => 'derbysoft',
            'username' => 'homestead',
            'password' => 'secret',
            'hostname' => 'localhost',
            'port'     => 5432,
        ],
    ];
}
```

Этот код добавляет секцию 'db' в конфигурацию приложения. Далее, рассказываем приложению, как же мы будем работать с БД.

```
public function getDependencies() : array
{
    return [
        'invokables' => [
        ],
        'factories'  => [
            // эта фабрика нужна, чтобы из конфига достать настройки БД, а потом создать адаптер на основе этих настроек
            \Zend\Db\Adapter\Adapter::class => \Zend\Db\Adapter\AdapterServiceFactory::class,

            // фабрика, которая подготавливает объект для работы с таблицей customer
            Table\CustomerTable::class => function($container) {
                // создаем соединение с БД
                $dbAdapter = $container->get(AdapterInterface::class);
                // говорим, какого типа результат ожидаем
                $resultSetPrototype = new ResultSet();
                $resultSetPrototype->setArrayObjectPrototype(new Model\Customer());
                // говорим, что для данной таблицы будем использовать созданное выше соединение с БД и ожидаем в конце такой-то результат
                return new Table\CustomerTable('customer', $dbAdapter, null, $resultSetPrototype);
            },
        ],
    ];
}
```

Первое, что нужно - это некий класс Adapter, который указывает какая БД на каком сервере будет использоваться.
В конструктор Adapter-а можно передать настройки самостоятельно, или можно использовать фабрику (_Factory_), которая будет брать настройки из конфигурации (которые добавили выше) для создания объекта Adapter.

Именно эту фабрику мы и объявляем, т.е. при запросе из DI-контейнера класса \Zend\Db\Adapter\Adapter будут исполняться методы класса \Zend\Db\Adapter\AdapterServiceFactory, которые и подготовят нужный нам объект.   

Второе - создаем объект для операций с таблицей. Тут фабрика представляет собой анонимную функцию, в которой 
- используется объявленный раннее Adapter (читай, подключение к БД), 
- указывается, что каждую строку таблицы описывает какой-то класс

Т.е. описанное выше указывает, что при запросе из контейнера класса `\Database\Table\CustomerTable` будет 
- создаваться подключение к БД с настройками из секции 'db' конфигурации приложения
- указываться, что при запросе будет возвращаться список объектов `\Database\Model\Customer`

Теперь, нужно создать эти 2 класса:
- класс для создания объекта, в котором будут хранится данные для каждой строки таблицы
- класс, в котором будут описаны операции с таблицей

Создаем 2 файла в только что созданном модуле:
- \Database\src\Model\Customer.php
  
  Результатом запроса может быть объект или массив (это описано в классе ResultSet).
  Если целью является использовать данные как объект - то в качестве возвращаемого значения должен быть эксемпляр класса _ArrayObject_.
```
<?php

namespace Database\Model;

class Customer extends \ArrayObject
{
    public $id;
    public $username;
    public $password;

    public function exchangeArray(array $data)
    {
        $this->id       = !empty($data['id']) ? $data['id'] : null;
        $this->username = !empty($data['username']) ? $data['username'] : null;
        $this->password = !empty($data['password']) ? $data['password'] : null;
    }
}
```
- \Database\src\Table\CustomerTable.php

  2 класса - _TableGateway_ и _AbstractTableGateway_ объявляют некоторое количество полей и методов для работы с таблицей.
  
  Типа, __SELECT__ | __INSERT__ | __DELETE__ | ...
   
  Для использования этого функционала в своих классах, которые работают с таблицами, делается наследование от _TableGateway_.
  
  Отличие классов _TableGateway_ и _AbstractTableGateway_ в том, что в классе _TableGateway_ написан конструктор. 
```
<?php

namespace Database\Table;

use Zend\Db\TableGateway\TableGateway;
use Zend\Db\Adapter\AdapterInterface;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\ResultSet\ResultSetInterface;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\TableIdentifier;

class CustomerTable extends TableGateway
{
    /**
     * Constructor.
     *
     * @param $table
     * @param AdapterInterface $adapter
     * @param null $features
     * @param ResultSetInterface|null $resultSetPrototype
     * @param Sql|null $sql
     */
    public function __construct(
        $table,
        AdapterInterface $adapter,
        $features = null,
        ResultSetInterface $resultSetPrototype = null,
        Sql $sql = null
    ) {
        parent::__construct($table, $adapter, $features, $resultSetPrototype, $sql);
    }

    public function fetchAll() {
        return $this->select();
    }
}
```
