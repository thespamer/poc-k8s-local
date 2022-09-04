# K8S-DEV

Este modulo tem como objetivo auxiliar as equipes em criar um cluster Kubernetes localmente para fins de desenvolvimento.

### Por que precisamos configurar um cluster de vários nós?

Os clusters Kubernetes de vários nós oferecem um ambiente semelhante ao de produção, com várias vantagens. Mesmo que o `Minikube` forneça uma excelente plataforma para começar, ele não oferece a oportunidade de trabalhar com clusters de vários nós que podem ajudar a resolver problemas ou bugs relacionados ao design e arquitetura do aplicativo. Por exemplo, o Ops pode reproduzir um problema em um ambiente de cluster de vários nós, os testadores podem implantar várias versões de um aplicativo para executar casos de teste e verificar mudanças. Esses benefícios permitem que as equipes resolvam problemas com mais rapidez, o que os torna mais ágeis.

## Kind

[kind](https://kind.sigs.k8s.io/) é uma ferramenta para executar clusters Kubernetes locais usando "nós" de contêiner do Docker.
kind foi projetado principalmente para testar o próprio Kubernetes, mas pode ser usado para desenvolvimento **local** ou **CI**.

## **Pré-requisitos**

> <font color="orange">Atenção</font>: Os testes deste projeto foram feitos em um ambiente Linux `ubuntu 20.04` como host de desenvolvimento, mas isso não impede de utilizá-lo em` Windows` ou `Windows com WSL`.

Para utilização do script em ambiente Linux, voce vai precisar executar:

- Linux

```bash
$ sudo apt-get install docker.io dialog curl -y
```

- MacOS

```bash
$ brew install curl
```

### **kind**

- Linux

```bash
$ curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.11.0/kind-linux-amd64
$ chmod +x ./kind
$ sudo mv ./kind /usr/local/bin/kind
```
- MacOS

```bash
$ brew install kind
```

### **kubectl**

- Linux
Instale o [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) cli em seu computador.

```bash
$ curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
$ chmod +x kubectl
$ sudo mv kubectl /usr/local/bin/
```
- MacOS

```bash
$ brew install kubectl
```

### **skaffold**

`Skaffold` é uma ferramenta de linha de comando que facilita o desenvolvimento contínuo para aplicativos nativos do Kubernetes. O Skaffold lida com o fluxo de trabalho para construir, enviar e implantar seu aplicativo e fornece blocos de construção para a criação de pipelines de **CI / CD**. Isso permite que você se concentre na iteração em seu aplicativo localmente, enquanto o Skaffold implanta continuamente em seu cluster Kubernetes local ou remoto.

- Linux
```bash
$ curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/v1.29.0/skaffold-linux-amd64
$ chmod +x skaffold 
$ sudo mv skaffold /usr/local/bin
```
- MacOS
```bash
$ brew install skaffold
```

### **Helm 3**

Helm é um gerenciador de pacotes de código aberto para Kubernetes. Ele fornece a capacidade de fornecer, compartilhar e usar software desenvolvido para Kubernetes.

- Linux

```bash
$ curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
```

- MacOS 

```bash
$ brew install helm
```

## Visão geral da configuração

A configuração do cluster Kubernetes, que consistirá em um nó mestre e dois nós de trabalho.

### Estrutura do projeto

Os arquivos e pastas mantidos no projeto são:

```
.
├── deploy
│   ├── kube-prometheus-stack
│   ├── metallb
│   └── voyager
├── init.conf
├── init.sh
├── README.md
```

### Otimizando seu ambiente

Aqui está uma breve descrição de cada parâmetro que pode ser alterado.

### init.conf

| Parametro                     | Descrição                                                                                                 | Valor Padrão                           |
|-------------------------------|-----------------------------------------------------------------------------------------------------------|------------------------------------    |
| `KIND_IMAGE`                  | Define qual image do kind sera utilizada (a imagem representa a versão do kubernetes)                     | `kindest/node:v1.18.15`                |


## Provisionando o ambiente

```bash
                                                                                                                                                                                                                          
Script: init.sh
Maintainer: Tech <tech@bitcapital.com.br>
Description: Script for install / update Kubernetes locally

 Use option to script: 

 --create-cluster                     - run k8s local using Kind
 --delete-cluster                     - delete k8s local using Kind
 --create-deploy                      - Install base deploys for the local cluster.
 --delete-deploy                      - Delete base deploys for the local cluster.
 --help | -h                          - Show this info.
```

## Criando o cluster local

Com os comandos **./init.sh --create-cluster** e .**/init.sh --delete-cluster** o desenvolvedor poderá criar / deletar o cluster localmente.

### Criando o cluster k8s localmente

```bash
$ ./init.sh --create-cluster

 [2021/07/29 12:36:03] - [INFO] - [up]: Run Kind create 
 [2021/07/29 12:36:03] - [INFO] - [create_registry]: create registry container unless it already exists 
 [2021/07/29 12:36:04] - [INFO] - [create_cluster]: create a cluster with the local registry enabled in containerd 
Creating cluster "kind" ...
 ✓ Ensuring node image (kindest/node:v1.18.15) 🖼
 ✓ Preparing nodes 📦 📦 📦  
 ✓ Writing configuration 📜 
 ✓ Starting control-plane 🕹️ 
 ✓ Installing CNI 🔌 
 ✓ Installing StorageClass 💾 
 ✓ Joining worker nodes 🚜 
Set kubectl context to "kind-kind"
You can now use your cluster with:

kubectl cluster-info --context kind-kind

Thanks for using kind! 😊
 [2021/07/29 12:37:00] - [INFO] - [config_cluster]: connect the registry to the cluster network 
 [2021/07/29 12:37:01] - [INFO] - [config_cluster]: Document the local registry 
configmap/local-registry-hosting created

```

> <font color="orange">Atenção</font>: A execução deste comando alem de criar o cluster kubernetes tambem irá criar um registro de container local vinclulado ao cluster no endereço: **localhost:5000**

Após o comando ser executado com sucesso, valide a criação do cluster com os comando abaixo:

Validando endpoints do cluster:

```bash
$ kubectl cluster-info --context kind-kind

Kubernetes control plane is running at https://127.0.0.1:44201
KubeDNS is running at https://127.0.0.1:44201/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.

```

**Para utilizar o contexto kind-kind em sua sessão de terminal;**

```bash
$ kubectl config  use-context kind-kind

```


Verificando os container docker do **kind** e **registry**.

```bash
$ docker ps -a

CONTAINER ID   IMAGE                   COMMAND                  CREATED         STATUS         PORTS                       NAMES
9bd6c12b9d51   kindest/node:v1.18.15   "/usr/local/bin/entr…"   3 minutes ago   Up 3 minutes                               kind-worker
657600388c9d   kindest/node:v1.18.15   "/usr/local/bin/entr…"   3 minutes ago   Up 3 minutes                               kind-worker2
f0fc4116d39d   kindest/node:v1.18.15   "/usr/local/bin/entr…"   3 minutes ago   Up 3 minutes   127.0.0.1:39107->6443/tcp   kind-control-plane
ae70b3f424cd   registry:2              "/entrypoint.sh /etc…"   3 days ago      Up 16 hours    127.0.0.1:5000->5000/tcp    kind-registry

```

Executando **kubectl** no cluster local.

```bash
$ kubectl get pod -A

NAMESPACE            NAME                                         READY   STATUS    RESTARTS   AGE
kube-system          coredns-66bff467f8-89mtt                     1/1     Running   0          4m57s
kube-system          coredns-66bff467f8-z7j8t                     1/1     Running   0          4m57s
kube-system          etcd-kind-control-plane                      1/1     Running   0          5m5s
kube-system          kindnet-44crb                                1/1     Running   2          4m39s
kube-system          kindnet-cs9fm                                1/1     Running   0          4m57s
kube-system          kindnet-dv4mz                                1/1     Running   2          4m39s
kube-system          kube-apiserver-kind-control-plane            1/1     Running   0          5m5s
kube-system          kube-controller-manager-kind-control-plane   1/1     Running   0          5m5s
kube-system          kube-proxy-7n9s7                             1/1     Running   0          4m39s
kube-system          kube-proxy-dbxd4                             1/1     Running   0          4m39s
kube-system          kube-proxy-jgv58                             1/1     Running   0          4m57s
kube-system          kube-scheduler-kind-control-plane            1/1     Running   0          5m4s
local-path-storage   local-path-provisioner-5b4b545c55-6phvv      1/1     Running   0          4m57s

```

### Removendo o cluster

```bash
$ ./init.sh --delete-cluster

[2021/07/29 12:43:57] - [INFO] - [halt]: Run Kind delete 
Deleting cluster "kind" ...
```

# Deploy

Este projeto contém alguns deploys de aplicações iniciais:

As funções **./init.sh --create-deploy** e **./init.sh --delete-deploy** gerenciam de forma simplificada a instalação e desinstalação dos componetes abaixo:

Aqui temos o menu em `dialog` que fornece uma forma simples de gerenciamento.

![/init.sh --create-deploy](../docs/images/init_deploy_install.png?raw=true "Title")

Na lista abaixo temos os deploys base que podemos escolher para instalar no cluster.

---
- ### [Metallb](https://metallb.universe.tf/)

O Kubernetes não oferece uma implementação de balanceadores de carga de rede (Serviços do tipo LoadBalancer) para clusters locais (Bare Metal). As implementações de Network LB com as quais o Kubernetes é fornecido são todos códigos de adesão que chamam várias plataformas IaaS (GCP, AWS, Azure ...). Se você não estiver executando em uma plataforma IaaS compatível (GCP, AWS, Azure ...), LoadBalancers permanecerá no estado “pendente” indefinidamente quando criado.

Operadores de cluster bare metal ficam com duas ferramentas menores para trazer o tráfego do usuário para seus clusters, os serviços “NodePort” e “externalIPs”. Ambas as opções têm desvantagens significativas para o uso de produção, o que torna os clusters bare metal cidadãos de segunda classe no ecossistema Kubernetes.

O MetalLB visa corrigir esse desequilíbrio oferecendo uma implementação de Network LB que se integra com o equipamento de rede padrão, de modo que os serviços externos em clusters bare metal também “funcionem” tanto quanto possível.

O script irá instalar o metallb adicionando um range de loadbalancer sendo <seuIP>.200 - <seuIP>.250

```bash
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - 192.168.1.200-192.168.1.250 <exemplo>

```

- ### [Voyager](https://voyagermesh.com/)

  **Voyager** é um controlador de entrada **L7** e **L4** seguro apoiado por **HAProxy** para Kubernetes desenvolvido por AppsCode . Isso pode ser usado com qualquer provedor de nuvem Kubernetes, incluindo aws, gce, gke, azure, acs. Isso também pode ser usado com clusters Kubernetes bare metal e para fins de desenvolvimento.

- ### [kube-prometheus-operator](https://github.com/prometheus-operator/prometheus-operator)

  O Operador do Prometheus fornece implantação nativa do Kubernetes e gerenciamento do Prometheus e componentes de monitoramento relacionados. O objetivo deste projeto é simplificar e automatizar a configuração de uma pilha de monitoramento baseada no Prometheus para clusters Kubernetes.

- ### consul

  Consul é uma solução de malha de serviço (service mesh) que fornece um plano de controle completo com descoberta de serviço, configuração e funcionalidade de segmentação. Cada um desses recursos pode ser usado individualmente conforme necessário ou em conjunto para construir uma malha de serviço completo. 


# Executando o skaffold

## Dependencias
Para instalar as dependencias da bitnami, basta executar o comando a seguir:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

Para executar localmente o stack que esta sendo desenvolvido. Você pode:

```bash
skaffold dev --port-forward --default-repo=localhost:5000
```

Quando **skaffold dev** for executado, o Skaffold fará primeiro uma construção completa e uma implementação de todos os artefatos especificados no **skaffold.yaml** que esta na rais do projeto. Após a construção e implantação bem-sucedidas, o Skaffold começará a observar todas as dependências do arquivo de origem para todos os artefatos especificados no projeto. Conforme as mudanças são feitas nesses arquivos de origem, Skaffold reconstruirá os artefatos associados e reimplantará as novas mudanças em seu cluster.

O **dev loop** será executado até que o usuário cancele o processo Skaffold com **Ctrl+C**. Ao receber esse sinal, o Skaffold limpará todos os artefatos implantados no cluster ativo.
