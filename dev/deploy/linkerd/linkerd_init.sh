#!/bin/bash
#
# Description: Script for managment linkerd 
# Maintainer: BitCapital <tech@bitcapital.com.br>

# Global Variables
LOG_FILE="linkerd_init.log"
REPOSITORY_NAME="linkerd"
REPOSITORY_URI="https://helm.linkerd.io/stable"
YAML_LINKERD="linkerd.yaml"
YAML_LINKERD_VIZ="linkerd-viz.yaml"


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
    echo  "Description: Script for managment linkerd"
}

help_info() {

    info_header
    
    echo ""
    echo " Use option to script: " 
    echo ""
    echo " --install                 - Install helm linkerd"
    echo " --upgrade                 - Upgrade helm linkerd"
    echo " --delete                  - Delete helm linkerd"
    echo " --help | -h               - Show this info."
    echo ""
}

# Update chart
add_update() {

    helm repo add ${REPOSITORY_NAME} ${REPOSITORY_URI}
    helm repo update
}

# Install otimized control-plane
install_control_plane() {

    helm install linkerd linkerd/linkerd2 -f ${YAML_LINKERD}
    linkerd check
}

install_viz() {

    # Install otimized viz
    helm install linkerd-viz linkerd/linkerd-viz -f ${YAML_LINKERD_VIZ}
    linkerd viz check
}

upgrade() {

    helm upgrade linkerd linkerd/linkerd2 -f ${YAML_LINKERD} -n default
    helm upgrade linkerd-viz linkerd/linkerd-viz -f ${YAML_LINKERD_VIZ} -n default

}

delete_control_plane() {
    helm delete linkerd
}

delete_viz() {
    helm delete linkerd-viz
}

main() {

    local OPTION=${1}

    case ${OPTION} in
        --install)
            add_update
            install_control_plane
            install_viz
        ;;
        --upgrade)
            upgrade
        ;;
        --delete)
            delete_control_plane
            delete_viz
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