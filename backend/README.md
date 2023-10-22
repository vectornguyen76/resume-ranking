# Flask API REST Template
Rest API template developed in Python with the Flask framework. The template covers user management, jwt tokens for authentication, and assign permissions for each user with Flask Principal. In the local environment, it uses docker to create an environment made up of several services such as api (flask), database (postgresql), reverse-proxy (nginx).
## Index
- [Technology](#technology)
- [Requirements](#requirements)
- [Environments](#environments)
    - [Develop](#develop)
    - [Testing](#testing)
    - [Local](#local)
    - [Production](#production)
- [Flask Commands](#flask-commands)
   - [Flask-cli](#flask-cli)
- [Database commands](#bbdd-commands)
   - [Flask-migrate](#flask-migrate)
- [Swagger](#swagger)
- [Reference](#reference)
- [Contribution](#contribution)

## Technology
- **Operating System:** Ubuntu 20.04
- **Web Framework:** Flask
- **ORM:** Flask-sqlalchemy
- **Swagger:** Swagger-UI
- **Authentication:** Flask Json Web Token
- **Permission:** Flask Principal
- **Serialization, Deserialization and Validation:** Marshmallow
- **Migration Database:** Flask-migrate
- **Environment manager:** Anaconda/Miniconda
- **Containerization:** Docker, docker-compose
- **Database:** PostgreSQL 
- **Python WSGI HTTP Server:** Gunicorn
- **Proxy:** Nginx
- **Tests:** Unittest
- **Deployment platform:** AWS
- **CI/CD:** Github Actions

## Requirements
- [Python 3.9](https://www.python.org/downloads/)
- [Anaconda/Miniconda](instructions/anaconda-miniconda.md)
- [Docker](instructions/docker-dockercompose.md)
- [Docker-Compose v2.10.2](instructions/docker-dockercompose.md)
- [Github](https://github.com)

## Environments
### Develop
Development environment that uses PostgreSQL in local and uses the server flask in debug mode.
1. Create environment and install packages:
    ```shell
    conda create -n backend python=3.9
    ```
    ```shell
    conda activate backend
    ```
    ```shell
    pip install -r requirements.txt
    ```
2. Create PosgresSQL on Ubuntu 20.04 
    Install PosgresSQL
    ```shell
    sudo apt-get install postgresql-12
    ```

    Go in PosgresSQL
    ```shell
    sudo -u postgres psql
    ```

    Create user and password
    ```shell
    CREATE USER db_user WITH PASSWORD 'db_password';
    ```
    
    Create Database dev
    ```shell
    CREATE DATABASE db_dev;
    ```

    Add permission User to Database
    ```shell
    GRANT ALL PRIVILEGES ON DATABASE db_dev TO db_user;
    ```

2. Create or update **.env** file and enter the environment variables of the environment. Example:
   ```shell
    # APP configuration
    APP_NAME="Flask API Rest Template"
    APP_ENV="develop"

    # Flask Configuration
    FLASK_APP= "app:app"
    FLASK_DEBUG="true"
    APP_SETTINGS_MODULE="config.DevelopConfig"
    FLASK_RUN_HOST="0.0.0.0"
    FLASK_RUN_PORT="5000"

    # Database service configuration
    DATABASE_URL="postgresql://db_user:db_password@localhost/db_dev"
   ```

3. Run:
    Create Database
    ```shell
    flask create-db
    ```

    Create User Admin
    ```shell
    flask create-user-admin
    ```

    Run a development server
    ```shell
    flask run
    ```

### Testing
Testing environment that uses PostgreSQL as database (db_test) and performs unit tests, integration tests and API tests.
1. Create environment and install packages:
    ```shell
    conda create -n backend python=3.9
    ```
    ```shell
    conda activate backend
    ```
    ```shell
    pip install -r requirements.txt
    ```
2. Create PosgresSQL on Ubuntu 20.04 
    Install PosgresSQL
    ```shell
    sudo apt-get install postgresql-12
    ```

    Go in PosgresSQL
    ```shell
    sudo -u postgres psql
    ```

    Create user and password
    ```shell
    CREATE USER db_user WITH PASSWORD 'db_password';
    ```
    
    Create Database test
    ```shell
    CREATE DATABASE db_test;
    ```

    Add permission User to Database
    ```shell
    GRANT ALL PRIVILEGES ON DATABASE db_test TO db_user;
    ```
2. Create or update **.env** file and enter the environment variables of the environment. Example:
   ```shell
    # APP configuration
    APP_NAME="Flask API Rest Template"
    APP_ENV="testing"

    # Flask Configuration
    FLASK_APP= "app:app"
    FLASK_DEBUG="true"
    APP_SETTINGS_MODULE="config.TestingConfig"
    FLASK_RUN_HOST="0.0.0.0"
    FLASK_RUN_PORT="3000"

    # Database service configuration
    DATABASE_TEST_URL="postgresql://db_user:db_password@localhost/db_test"
   ```

3. Init database:
    Create Database
    ```shell
    flask create-db
    ```

    Create User Admin
    ```shell
    flask create-user-admin
    ```

4. Run all the tests:
    ```shell
    pipenv run tests
    ```

5. Run unit tests:
    ```shell
    pipenv run tests_unit
    ```

6. Run integration tests:
    ```shell
    pipenv run tests_integration
    ```

7. Run API tests:
    ```shell
    pipenv run tests_api
    ```

8. Run coverage:
    ```shell
    pipenv run coverage
    ```

9. Run coverage report:
    ```shell
    pipenv run coverage_report
    ```

### Local
Containerized services separately with PostgreSQL databases (db), API (api) and Nginx reverse proxy (nginx) with Docker and docker-compose.

1. Create **.env.api.local**, **.env.db.local** files and enter environment variables for
    each service. In the local environment there are 3 services (api, db, nginx). For example:
    1. **.env.api.local**:
        ```shell
        # APP configuration
        APP_NAME=[Name APP] # For example Flask API Rest Template
        APP_ENV=local
        
        # Flask configuration
        API_ENTRYPOINT=app:app
        APP_SETTINGS_MODULE=config.LocalConfig
        APP_TEST_SETTINGS_MODULE=config.TestingConfig
        
        # API service configuration
        API_HOST=<api_host> # For example 0.0.0.0
        API_PORT=<port_api> # For example 5000
        
        # Database service configuration
        DATABASE=postgres
        DB_HOST=<name_container_bbdd> # For example db_service (name service in docker-compose)
        DB_PORT=<port_container_bbdd> # For example 5432 (port service in docker-compose)
        POSTGRES_DB=<name_database> # For example db_dev 
        POSTGRES_USER=<name_user> # For example db_user 
        PGPASSWORD=<password_user> # For example db_password 

        DATABASE_TEST_URL=<url database test> # For example postgresql+psycopg2://db_user:db_password@db_service:5432/db_test
        DATABASE_URL=<url database> # For example postgresql+psycopg2://db_user:db_password@db_service:5432/db_dev
        ```
    2. **.env.db.local**:
       ```shell
       POSTGRES_USER=<name_user> # For example db_user
      
       POSTGRES_PASSWORD=<password> # For example db_password

       POSTGRES_DB=<name_DB> # For example db_dev
       ```

2. Run:
    1. Build and run services:
       ```shell
       docker-compose up --build
       ```
    2. Stop services:
       ```shell
       docker-compose stop
       ```
    3. Delete services:
       ```shell
       docker compose down
       ```
    4. Remove services (removing volumes):
       ```shell
       docker-compose down -v
       ```
    4. Remove services (removing volumes and images):
       ```shell
       docker-compose down -v --rmi all
       ```
    5. View services:
       ```shell
       docker-compose ps
       ```
**NOTE:** The Rest API defaults to host *localhost* and port *8080*.

### Production
Apply CI/CD with Github Actions to automatically deployed to AWS platform use EC2, RDS PostgresSQL.

1. Create file **.env.pro** and enter the environment variables needed for production. For example:
    1. **.env.pro**:
       ```shell
       # APP configuration
       APP_NAME=Flask API Rest Template
       APP_ENV=production
      
       # Flask configuration
       API_ENTRYPOINT=app:app
       APP_SETTINGS_MODULE=config.ProductionConfig
      
       # API service configuration
       API_HOST=<api_host> # For example 0.0.0.0
      
       # Database service configuration
       DATABASE_URL=<url_database> # For example sqlite:///production.db
      
       # Deploy platform
       PLATFORM_DEPLOY=AWS
       ```
2. Create *Secrets* on Github:
    1. **AWS_ACCESS_KEY_ID**: access token
    2. **AWS_SECRET_ACCESS_KEY**: secret access
    3. **AWS_DEFAULT_REGION**: region

## Flask Commands
### Flask-cli
- Create all tables in the database:
    ```
    flask create_db
    ```

- Delete all tables in the database:
    ```sh
    flask drop_db
    ```

- Create admin user for the Rest API:
    ```sh
    flask create-user-admin
    ```
    
- Database reset:
    ```sh
    flask reset-db
    ```
    
- Run tests without coverage:
    ```sh
    flask reset-db
    ```
    
- Run tests with coverage without report in html:
    ```sh
    flask cov
    ```
    
- Run tests with coverage with report in html:
    ```sh
    flask cov-html
    ```
     
## Database commands
### Flask-migrate
- Create a migration repository:
    ```sh
    flask db init
    ```

- Generate a migration version:
    ```sh
    flask db migrate -m "Init"
    ```
    
- Apply migration to the Database:
    ```sh
    flask db upgrade
    ```

## Swagger
```
http://localhost:port/swagger-ui
```
## Reference
- [Udemy - REST APIs with Flask and Python in 2023](https://www.udemy.com/course/rest-api-flask-and-python/)
- [Github - Flask API REST Template](https://github.com/igp7/flask-rest-api-template)

## Contribution
Feel free to make any suggestions or improvements to the project.