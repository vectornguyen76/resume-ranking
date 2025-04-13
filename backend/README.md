# Backend

## Environments

### Develop

The development environment utilizes PostgreSQL locally and runs the Flask server in debug mode.

1. **Create environment and install packages:**

   ```shell
   conda create -n backend python=3.10
   ```

   ```shell
   conda activate backend
   ```

   ```shell
   pip install -r requirements.txt
   ```

2. **Run the Application**

   ```shell
   flask run --port 5005
   ```

## Swagger

Access the Swagger documentation at:

```
http://localhost:port/swagger-ui
```
