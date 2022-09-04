{{- /*
postgresql check template.
*/ -}}
{{- define "postgresqlCheck.pod" }}
  - name: postgresql-check
    image: "{{ .Values.imageScript.repository }}:{{ .Values.imageScript.tag }}"
    command: ["/bin/bash"]
    args:
      - "-c"
      - |
        while true
        do
          POSTGRES_IS_ALIVE=$(nc -z -w3 {{ .Values.postgresql.fullnameOverride }} {{ .Values.postgresql.service.port }})
          if [[ ${?} == 0 ]]; then
            echo "postgresql is OK!"
            break;
          fi
          echo "Wait postgresql up..."
          sleep 5
        done
{{ end -}}

{{- /*
Kong check template.
*/ -}}
{{- define "kongCheck.pod" }}
  - name: kong-check
    image: "{{ .Values.imageScript.repository }}:{{ .Values.imageScript.tag }}"
    command: ["/bin/bash"]
    args:
      - "-c"
      - |
        while true
        do
          KONG_IS_ALIVE=$(nc -z -w3 {{ .Values.kong.fullnameOverride }} {{ .Values.kong.service.adminHttpPort }})
          if [[ ${?} == 0 ]]; then
            echo "Kong is OK!"
            break;
          fi
          echo "Wait Kong up..."
          sleep 5
        done
{{ end -}}

