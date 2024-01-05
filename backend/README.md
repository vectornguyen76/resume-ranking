# Backend 

## Environments
### Develop
The development environment utilizes PostgreSQL locally and runs the Flask server in debug mode.

1. **Create environment and install packages:**
    ```shell
    conda create -n backend python=3.9
    ```
    ```shell
    conda activate backend
    ```
    ```shell
    pip install -r requirements.txt
    ```

2. **Setting up PostgreSQL on Ubuntu 20.04:**
    - Install PostgreSQL:
        ```shell
        sudo apt-get install postgresql-12
        ```
    
    - Access PostgreSQL:
        ```shell
        sudo -u postgres psql
        ```

    - Create a user and set a password:
        ```shell
        CREATE USER db_user WITH PASSWORD 'db_password';
        ```

    - Create the development database:
        ```shell
        CREATE DATABASE db_dev;
        ```

    - Grant all privileges to the user on the development database:
        ```shell
        GRANT ALL PRIVILEGES ON DATABASE db_dev TO db_user;
        ```

## Swagger
Access the Swagger documentation at:
```
http://localhost:port/swagger-ui
```