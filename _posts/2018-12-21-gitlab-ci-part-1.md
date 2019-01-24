---
layout: post
title:  "GitLab CI/CD: конкретные обработчики заданий"
author: vdovenko_eugene
date:   2018-12-21 17:05:00 +0000
tags:   [DevOps, automation, git, GitLab, Continuous Integration, Continuous Delivery]
categories: [DevOps]
---

__Задача__: обеспечить доставку кода на сервер при пуше в определенную ветку. При пуше в stage-ветку на сервере GitLab - 
выгрузить код на stage-сервер. При пуше в master-ветку на сервере GitLab - выкатываем код на production-сервер.

В GitLab для решения этой задачи есть runner-ы - небольшие программы, которые могут по некоторому сценарю запускать 
заданные в этом сценарии команды.

Есть 3 вида runner-ов: конкретные (specific), общие (shared) и групповые (group). Здесь мы поговорим о 
specific runners.

Specific runner можно установить на своем сервере (manually) или использовать инфрастуктуру GitLab (automatically). 
Во втором случае создается кластер Kubernetes в Google Cloud Platform.

В первом случае все достаточно тривиально. Устанавливаем репозиторий, из которого устанавливаются runner-ы:

```
# For Debian/Ubuntu/Mint
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash

# For RHEL/CentOS/Fedora
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | sudo bash
```

Устанавливаем runner:

```
# For Debian/Ubuntu/Mint
sudo apt-get install gitlab-runner

# For RHEL/CentOS/Fedora
sudo yum install gitlab-runner
```

Регистрируем runner:
```
sudo gitlab-runner register
```

Потребуется ввести 
  - адрес GitLab, 
  - токен,
  - какое-нибудь описание, 
  - теги, на которые будет реагировать runner (можно несколько, через запятую)
  - что будет использовать runner для выполнения сценария (shell, ssh, docker и т.п.)
  
Некоторые данные (адрес, токен) написаны на странице настроек CI/CD проекта.

По умолчанию, runner запускается как сервис под пользователем root и выполняет сценарий под пользователем gitlab-runner.
Команда запуска выглядит примерно так:
```
/usr/lib/gitlab-runner/gitlab-runner run --working-directory /home/gitlab-runner --config /etc/gitlab-runner/config.toml --service gitlab-runner --syslog --user gitlab-runner
```

Если нужен другой пользователь - нужно остановить сервис и удалить его командами  
```
sudo gitlab-runner stop
sudo gitlab-runner uninstall
```

А дальше - снова добавляем сервис с новой строкой запуска:
```
sudo gitlab-runner install --working-directory /home/<smbUser> --config /etc/gitlab-runner/config.toml --service gitlab-runner --syslog --user <smbUser>
sudo gitlab-runner start
```

Теперь, про сценарий. Обычно он лежит в корне проекта в файле .gitlab-ci.yml. В общем виде формает сценария такой:
```
job1:
  script: 
  - "execute-script-for-job1"
  - "execute-script-for-job1"

job2:
  script: 
  - "execute-script-for-job2"
```

Название задачи может быть произвольным (и должно быть уникальным!), исключая некоторые зарезервированные слова:
- image
- services
- stages
- types
- before_script
- after_script
- variables
- cache

В этом же файле можно определить стадии сборки. Можно также ограничить выполнение задач некоторыми параметрами 
(например, выполнять/не выполнять только для конкретной ветки, только по конкретному тегу и т.п.).

__Ссылки по теме__:
1. [Официальная документация](https://docs.gitlab.com/ee/ci/) (en)
2. [GitLab Runner repository](https://gitlab.com/gitlab-org/gitlab-runner)
