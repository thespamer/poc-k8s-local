#!/bin/bash
#
# Description: Script for managment helm chart
# Maintainer: BitCapital <tech@bitcapital.com.br>

# Global Variables
LOG_FILE="voyager_init.log"
DEPLOY_NAME="voyager-operator"
REPOSITORY_NAME="appscode"
REPOSITORY_URI="https://charts.appscode.com/stable/"
CHART="voyager"
VERSION_CHART="v12.0.0"
NAMESPACE="voyager"
YAML_VALUES="voyager.yaml"

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
    echo  "Description: Script for managment ${CHART}"
}

help_info() {

    info_header
    
    echo ""
    echo " Use option to script: " 
    echo ""
    echo " --install                 - Install helm ${CHART}"
    echo " --delete                  - Delete helm ${CHART}"
    echo " --help | -h               - Show this info."
    echo ""
}

# Update chart
add_update() {

    helm repo add ${REPOSITORY_NAME} ${REPOSITORY_URI}
    helm repo update
}

# Install chart
install() {

    helm install ${DEPLOY_NAME} ${REPOSITORY_NAME}/${CHART} --version=${VERSION_CHART} --namespace ${NAMESPACE} --create-namespace -f ${YAML_VALUES}
    
    sleep 30s

    kubectl apply -f ingress.yaml
}

# Delete chart
delete() {
    
    helm delete ${DEPLOY_NAME} -n ${NAMESPACE}

    kubectl delete -f ingress.yaml
}   


main() {

    local OPTION=${1}

    case ${OPTION} in
        --install)
            add_update
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