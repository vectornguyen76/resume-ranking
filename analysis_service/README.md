# Analysis service

## Development Environment

1. **Create Environment and Install Packages**

   ```shell
   conda create -n analysis_service python=3.10
   ```

   ```shell
   conda activate analysis_service
   ```

   ```shell
   pip install -r requirements.txt
   ```

2. **Run the Application**

   ```shell
   uvicorn app:app --port 7000
   ```
