import psycopg2
from psycopg2 import sql

# Configurações do banco de dados
DB_NAME = 'ai-detection'
DB_USER = 'postgres'
DB_PASSWORD = 'postgres2024'
DB_HOST = 'localhost'
DB_PORT = '5432'


# Conecta ao banco de dados
conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)

# Cria um cursor para executar comandos SQL
cur = conn.cursor()

# Função para executar uma migração SQL


def run_migration(sql_file):
    with open(sql_file, 'r') as f:
        migration_sql = f.read()

    cur.execute(migration_sql)
    conn.commit()
    print(f'Migration {sql_file} executed successfully')


# Executa suas migrações
run_migration('postgres/migrations/01-init.sql')

# Fecha a conexão com o banco de dados
cur.close()
conn.close()
