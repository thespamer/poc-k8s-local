
#!/bin/bash

# Configuração inicial do Kong

### Criando serviço emoji-service
curl -s -X POST http://${KONG_ADMIN_HOST}:${KONG_ADMIN_PORT}/services \
    -d name=emoji-service \
    -d url=http://emoji-service

### Criando serviço emoji-web
curl -s -X POST http://${KONG_ADMIN_HOST}:${KONG_ADMIN_PORT}/services \
    -d name=emoji-web \
    -d url=http://emoji-web

### Criando serviço voting-service
curl -s -X POST http://${KONG_ADMIN_HOST}:${KONG_ADMIN_PORT}/services \
    -d name=voting-service \
    -d url=http://voting-service

### Criando rota padrao para o serviço emoji-service
curl -s -X POST http://${KONG_ADMIN_HOST}:${KONG_ADMIN_PORT}/services/emoji-service/routes -d "paths[]=/emoji-service"

### Criando rota padrao para o serviço emoji-web
curl -s -X POST http://${KONG_ADMIN_HOST}:${KONG_ADMIN_PORT}/services/emoji-web/routes -d "paths[]=/emoji-web"

### Criando rota padrao para o serviço voting-service
curl -s -X POST http://${KONG_ADMIN_HOST}:${KONG_ADMIN_PORT}/services/voting-service/routes -d "paths[]=/voting-service"