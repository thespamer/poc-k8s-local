#!/bin/bash
#
# Description: Script for managment metallb
# Maintainer: BitCapital <tech@bitcapital.com.br>

# Global Variables
LOG_FILE="metallb_init.log"
NAMESPACE="metallb-system"


# Use log info <function> <msg>
log_info(){

	TEXT_COLOR_INIT="\e[0;32m"
    TEXT_COLOR_FINAL="\e[0m"
	DT=$(date "+%Y/%m/%d %H:%M:%S")
	STR_CONSOLE="${TEXT_COLOR_INIT} [${DT}] - [INFO] - [${1}]: ${2} ${TEXT_COLOR_FINAL}"
    STR_FILE="[${DT}] - [INFO] - [${1}]: ${2}"
    echo -e ${STR_CONSOLE}
    echo ${STR_FILE} >> ${LOG_FILE}
}

# Use log warning <function> <msg>
log_warning(){

	TEXT_COLOR_INIT="\e[1;33m"
    TEXT_COLOR_FINAL="\e[0m"
	DT=$(date "+%Y/%m/%d %H:%M:%S")
	STR_CONSOLE="${TEXT_COLOR_INIT} [${DT}] - [INFO] - [${1}]: ${2} ${TEXT_COLOR_FINAL}"
    STR_FILE="[${DT}] - [INFO] - [${1}]: ${2}"
    echo -e ${STR_CONSOLE}
    echo ${STR_FILE} >> ${LOG_FILE}
}

# Use log error <function> <msg>
log_error(){

	TEXT_COLOR_INIT="\e[1;31m"
    TEXT_COLOR_FINAL="\e[0m"
	DT=$(date "+%Y/%m/%d %H:%M:%S")
	STR_CONSOLE="${TEXT_COLOR_INIT} [${DT}] - [INFO] - [${1}]: ${2} ${TEXT_COLOR_FINAL}"
    STR_FILE="[${DT}] - [INFO] - [${1}]: ${2}"
    echo -e ${STR_CONSOLE}
    echo ${STR_FILE} >> ${LOG_FILE}
}

info_header(){
    echo ""
    echo  "Script: init.sh"
    echo  "Maintainer: BitCapital <tech@bitcapital.com.br>"
    echo  "Description: Script for managment metallb"
}

help_info() {

    info_header
    
    echo ""
    echo " Use option to script: " 
    echo ""
    echo " --install                 - Install metallb"
    echo " --delete                  - Delete helm metallb"
    echo " --help | -h               - Show this info."
    echo ""
}


# Install chart
install() {

    kubectl apply -f 1_namespace.yaml

    log_info "install" "Configuration for use Kind"

    config_kind
    
    kubectl apply -f 2_metallb.yaml

    kubectl create secret generic -n metallb-system memberlist --from-literal=secretkey="$(openssl rand -base64 128)"
}

# Delete chart
delete() {
    kubectl delete -f .
}

# Configuration kind
config_kind() {

    GET_IP_SUBCLASS=$(docker inspect --format '{{(index .IPAM.Config 0).Gateway}}' $(docker network ls --filter name=kind --format {{.ID}}) | cut -d '.' -f1,2)

    cat <<EOF | kubectl create -f -
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
      - ${GET_IP_SUBCLASS}.255.200-${GET_IP_SUBCLASS}.255.250
EOF

}

main() {

    local OPTION=${1}

    case ${OPTION} in
        --install)
            install
        ;;
        --delete)
            delete
        ;;
        --help | -h)
            help_info
        ;;
        *) log_error "main" "Invalid option: ${OPTION}" 
            help_info
        ;;
    esac

}

main $@