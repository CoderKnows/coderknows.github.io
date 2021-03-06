---
layout: post
title:  "Советы по Windows"
author: vdovenko_eugene
date:   2019-07-09 20:43:00 +0000
tags:   [tips, Windows, настройка, советы]
categories: [DevOps]
---

### Аавтозаполнение в командной строке Windows

#### Временная активировация автозаполнения

Для активации автозаполнения в CMD для текущего пользователя для текущего сеанса команд, откройте 
окно «Выполнить» (__Win__ + __R__), введите следующую команду:

```
cmd /f
```

Ключ 
- `/f` включает или отключает символы завершения имени файла и каталога.


Для отключения автоматического завершения введите следующее:
```
cmd /f:off
```

- __Ctrl__ + __D__ - завершение имени папки 
- __Ctrl__ + __F__ - завершение имени файла

#### Постоянная активация автозаполнения

Запустите `regedit`, чтобы открыть редактор реестра, и перейдите к следующему разделу реестра:

```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Command Processor
```

Отредактировать значения:
- __CompletionChar__ установить значение REG_DWORD равным 9
- __PathCompletionChar__ установить значение REG_DWORD равным 9

Установленные значения означают управляющие символы:
- 4 для __Ctrl__ + __D__
- 6 для __Ctrl__ + __F__
- 9 для __TAB__


__Полезные ссылки__:
- [How to turn on Auto Complete in Windows Command Prompt](https://www.thewindowsclub.com/autocomplete-in-windows-command-prompt)(en)
