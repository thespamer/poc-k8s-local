
CREATE DATABASE voting_svc_database;
CREATE USER voting_svc WITH PASSWORD 'bitcapital';
GRANT ALL PRIVILEGES ON DATABASE voting_svc TO voting_svc;
ALTER USER voting_svc WITH SUPERUSER;

CREATE DATABASE kong;
CREATE USER kong WITH PASSWORD 'kong';
GRANT ALL PRIVILEGES ON DATABASE kong TO kong;

CREATE DATABASE konga;
CREATE USER konga WITH PASSWORD 'konga';
GRANT ALL PRIVILEGES ON DATABASE konga TO konga;
