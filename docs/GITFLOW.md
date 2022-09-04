# Fluxo de versionamento

![](../docs/images/gitflow.png?raw=true "Title")
## Branches principais

O repositório central possui dois branches principais com vida infinita.
- **master**
- **develop**

O branch **master** é o branch principal, a HEAD do projeto, nele há somente versões que estão em produção.
O branch **develop** possui todo código já entregue e as últimas de desenvolvimento para a próxima versão. Quando o código do branch **develop** é considerado estável e pronto para ser implantado, todas as alterações devem ser mescladas de volta para o branch **master** e criada uma tag.

## Branches de suporte

Junto aos branches **master** e **develop** utilizamos outros branches de suporte, para correção de erros, criação de melhorias e preparação para implantação. Diferente dos branches principais, esses tem uma vida limitada, uma vez que eles são removidos eventualmente.

Os diferentes tipos de branches são:

- Branches de melhorias (feature)
- Branches de lançamento (release)
- Branches de correções (hotfix)

Cada tipo de branch tem um propósito específico e segue regras de quais branches devem ser originados e mesclados.

## Branches de melhorias

Deve ser criado a partir de:

- develop

Deve ser mesclado de volta para:

- develop

Convensão de nome:

- Qualquer nome exceto master, develop, release/*, ou hotfix/*

Branches de melhorias são usados para desenvolver novas funcionalidades para o próximo lançamento. Em excência, um branch de melhoria existe apenas enquanto está em desenvolvimento, devendo ser mesclado ao branch develop, assumindo que entrará no próximo lançamento, ou descartado caso não seja útil ou seja um experimento.

## Criando um branch de melhoria

Ao iniciar o desenvolvimento de uma funcionalidade, crie um branch a partir do branch **develop**

```console
git checkout -b feature/xpto develop
```

## Finalizando um branch de melhoria

Uma vez concluído o desenvolvimento no branch, ele deve ser incorporado de volta no branch develop através de um pull request.

Envie seu branch para o servidor:

```console
git push origin feature/xpto
```

Navegue até a interface e clique em **New pull request**, selecione como base seu branch e o branch **develop**.

Uma vez aceito o pull request pelo administrador do projeto, a melhoria entrará na próxima versão.

## Branches de lançamento

Deve ser criado a partir de:
- develop

Deve ser mesclado de volta para:
- develop e master

Convensão de nome:
- release/MAJOR.MINOR.PATCH

Branches de lançamento são usados para preparação do lançamento da próxima versão de produção. Nele são permitidas pequenas correções e atualização de versão nos arquivos, por exemplo, defines.mk. Fazendo isso no branch de lançamento, o branch develop fica livre para receber novas melhorias para a próxima versão.

Na criação do branch de lançamento é decidido qual versão o projeto terá, até este momento o branch develop reflete as alterações da próxima versão, independende de qual for. Esta decisão é feita na criação do branch de lançamento e segue as convensões de versionamento do projeto.

## Criando um branch de lançamento

Branches de lançamentto são criados a partir do branch **develop**. Digamos que o projeto está na versão 1.5.3 e há uma implantação em breve. O estado do branch **develop** está pronto para a próxima implantação e decidimos que vai se tornar 1.2.0 (ao invés de 1.1.5 ou 2.0.0). Então criamos um branch com o nome da versão que escolhemos.

```console
git checkout -b release/1.2.0 develop
```

Depois de criar o branch, a primeira coisa a fazer é aumentar a versão nos arquivos equivalentes e comitar. Podendo ser um composer.json, defines.mk, um version.py, etc. Esta alteração é chamada de bump.

```console
$ ./bump-version.sh 1.2.0
Files modified successfully, version bumped to 1.2.0
$ git commit -a -m “Bumped version number to 1.2.0”
[release/1.2.0 74d9424] Bumped version number to 1.2.0
1 files changed, 1 insertions(+), 1 deletions(-)
```

Neste exemplo o script bump-version.sh faz estas alterações, mas podem ser feitas manualmente.

Este branch deve existir por enquanto, até que esteja pronto para ser implantado definitivamente em produção. Pequenas correções são permitidas nele (ao invés do branch develop). Adicionar funcionalidades novas nele são proibidas, apenas correções pontuais desta versão de lançamento.

## Finalizando um branch de lançamento

Quando o branch de lançamento estiver pronto para ser implantado em produção, algumas ações precisam ser tomadas. Primeiro o brach de lançamento é mesclado com o branch **master** (uma vez que cada commit no master é uma nova versão, por definição):


```console
$ git checkout master
Switched to branch ‘master’
$ git merge — no-ff release/1.2.0
Merge made by recursive.
(Summary of changes)
```

Em seguida este commit deve ser tageado para referência futura para esta versão:

```console
$ git tag -a 1.2.0
```

Finalmente, as mudanças feitas no branch de lançamento precisam mescladas de volta no branch develop, para que as versões futuras também possuam as correções feitas neste branch:

```console
$ git checkout develop
Switched to branch ‘develop’
$ git merge — no-ff release/1.2.0
Merge made by recursive.
(Summary of changes)
```

Neste momento podem ocorrer alguns conflitos, já que as correções podem mudar a versão dos arquivos, se acontecer, corrija e comite.
Feitos os merges podemos excluir o branch de lançamento, já que não precisamos mais dele:

```console
$ git branch -d release/1.2.0
Deleted branch release/1.2.0 (was ff452fe).
```
## Branches de correções

Deve ser criado a partir de:
 - master

Deve ser mesclado de volta para:
- develop e master

Convensão de nome:
 - hotfix/*

Branches de correções são muito parecidos com branches de lançamentos em sua concepção, pois tem o mesmo objetivo de prepara uma versão para produção, embora não planejada. Eles surgem da necessidade de agir imediatamente em uma versão de produção já implantada. Quando um bug crítico ocorre em produção um branch de correção precisa ser criado a partir da tag correspondente.
A ideia é que o time que está trabalhando na próxima versão no branch develop possa continuar enquanto alguém prepara uma correção.

## Criando um branch de correção

Branches de correção são criados a partir do branch master. Por exemplo, digamos que a versão corrente é a 1.2.0 e está causando problemas devido a um erro grave em produção. Porém as mudanças no branch develop não estão estáveis ainda. Precisamos criar um branch de correção e começar a corrigir o problema.

```console
$ git checkout -b hotfix/-1.2.1 master
Switched to a new branch “hotfix/1.2.1”
$ ./bump-version.sh 1.2.1
Files modified successfully, version bumped to 1.2.1.
$ git commit -a -m “Bumped version number to 1.2.1”
[hotfix-1.2.1 41e61bb] Bumped version number to 1.2.1
1 files changed, 1 insertions(+), 1 deletions(-)
```

Não esqueça de aumentar a versão após criar o branch.
Em seguida corrigir o bug e comitar em um ou mais commits.

```console
$ git commit -m “Fixed severe production problem”
[hotfix-1.2.1 abbe5d6] Fixed severe production problem
5 files changed, 32 insertions(+), 17 deletions(-)
```

### Finalizando um branch de correção

Quando finalizados as correções, o branch deve ser mesclado devolta com o branch master, mas também deve ser mesclado com o branch develop, para que as correções sejam incluídas na próxima versão também. O processo é similar ao do branch de lançamento.

Primeiro atualize o master e crie uma tag.

```console
$ git checkout master
Switched to branch ‘master’
$ git merge — no-ff hotfix/1.2.1
Merge made by recursive.
(Summary of changes)
$ git tag -a 1.2.1
```

Em seguida inclua a correção no branch develop.


```console
$ git checkout develop
Switched to branch ‘develop’
$ git merge — no-ff hotfix/1.2.1
Merge made by recursive.
(Summary of changes)
```

A única excessão a esse processo é quando existe um branch de lançamento, neste caso as alterações devem ser mescladas nele, ao invés de no branch develop. As alterações mescladas no branch de lançamento refletirão no banch develop também, quando forem finalizadas. Se o branch develop precisar da correção imediatamente e não puder esperar a finalização do branch de lançamento você pode mesclar com ele também.

Finalmente, removemos o branch já mesclado:

```console
$ git branch -d hotfix/1.2.1
Deleted branch hotfix/1.2.1 (was abbe5d6).
```
