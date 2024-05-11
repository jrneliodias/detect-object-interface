import psycopg2
import os
# Configurações do banco de dados
DB_NAME = os.environ.get("DB_NAME")
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT")


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
