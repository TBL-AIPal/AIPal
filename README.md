# **Deployment Guide for AIPal Application**

This guide provides step-by-step instructions for deploying the AIPal application in containers. Follow the steps carefully to ensure a smooth setup process.

---

## **Before You Begin**
- Ensure you have administrative access to the system where the application will be deployed.
- Verify that your system meets the minimum requirements for Docker, MongoDB, and other dependencies.
- Backup any existing data or configurations before making changes.
- If deploying in a production environment, ensure all sensitive information (e.g., tokens, passwords) is stored securely.

---

## **Prerequisites**
1. **Install Docker**:
   - For Linux: Follow the [official Docker installation guide](https://docs.docker.com/engine/install/).
   - For Windows/Mac: Download and install Docker Desktop from the [official website](https://www.docker.com/products/docker-desktop/).
   - Verify installation:
     ```bash
     docker --version
     ```

2. **Install Git**:
   - For Ubuntu/Debian:
     ```bash
     sudo apt update && sudo apt install git
     ```
   - For macOS:
     ```bash
     brew install git
     ```
   - For Windows: Download and install Git from the [official website](https://git-scm.com/).

3. **Install MongoDB Shell (`mongosh`)**:
   - Follow the [MongoDB Shell installation guide](https://www.mongodb.com/docs/mongodb-shell/install/).
   - Verify installation:
     ```bash
     mongosh --version
     ```

4. **Install ngrok**:
   - Download ngrok from the [official website](https://ngrok.com/download).
   - Authenticate ngrok with your account:
     ```bash
     ngrok authtoken YOUR_NGROK_AUTH_TOKEN
     ```

---

## **1. Configure Environment Variables**

1. **Clone the Repository**:
   Clone the AIPal repository to get all necessary scripts and files:
   ```bash
   mkdir -p /home/sadm/AIPal && cd /home/sadm/AIPal
   git clone https://github.com/TBL-AIPal/AIPal.git .
   ```

2. **Copy the Generic `.env` File**:
   Use the provided generic `.env` file as a template:
   ```bash
   cp .env.example .env
   ```

3. **Edit the `.env` File**:
   Open the `.env` file in a text editor and replace placeholders with your specific configuration values:
   ```bash
   vim .env
   ```

4. **Verify the `.env` File**:
   Ensure all placeholders are replaced with actual values. Your `.env` file should now be fully configured for your environment.

---

## **2. Setup Containers**

1. **Navigate to the Scripts Directory**:
   Change into the `scripts` directory where the deployment scripts are located:
   ```bash
   cd /home/sadm/AIPal/scripts
   ```

2. **Make Scripts Executable**:
   Ensure the deployment scripts have executable permissions:
   ```bash
   chmod +x run-with-logging.sh pull-and-update-container.sh
   ```

3. **Run the Container Setup Script**:
   Execute the script to pull the latest container image and update the running container:
   ```bash
   bash /home/sadm/AIPal/scripts/run-with-logging.sh \
       --log-file /home/sadm/AIPal/logs/pull-and-update-container.log \
       --script /home/sadm/AIPal/scripts/pull-and-update-container.sh
   ```

   **What this script does**:
   - The `pull-and-update-container.sh` script performs the following actions:
     1. **Pulls the Latest Container Image**: It fetches the most recent version of the container image from the configured container registry (e.g., Docker Hub).
     2. **Stops and Removes Old Containers**: If there are existing containers running outdated versions, they are stopped and removed.
     3. **Starts the Updated Container**: The script starts a new container using the latest image, ensuring your deployment is up-to-date.
     4. **Logs Activity**: All actions performed by the script are logged in the specified log file (`/home/sadm/AIPal/logs/pull-and-update-container.log`) for troubleshooting or auditing purposes.

   By running this script, you ensure that your application is always using the latest version of the container, which includes any bug fixes, security patches, or new features.

4. **Verify Containers**:
   After running the script, verify that the containers are running as expected:
   ```bash
   docker ps
   ```
   This command lists all currently running containers. Look for the AIPal container in the output and confirm its status.

---

## **3. Setup Database**

1. **Install MongoDB**:
   - If using a local MongoDB instance, follow the [MongoDB installation guide](https://www.mongodb.com/docs/manual/administration/install-community/).
   - Alternatively, use a cloud-hosted service (e.g., MongoDB Atlas) and update the `MONGODB_HOST` variable in the `.env` file with the connection URI.

2. **Connect to MongoDB**:
   Use `mongosh` to connect to your database:
   ```bash
   mongosh mongodb://localhost:27017/ai-pal?directConnection=true
   ```

3. **Create Vector Search Index**:
   Run the following commands in the MongoDB shell to create a vector search index:
   ```javascript
   db.chunks.createSearchIndex(
     "default", 
     "vectorSearch", 
     {
       "fields": [
         {
           "type": "vector",
           "path": "embedding",
           "numDimensions": 1536,
           "similarity": "euclidean"
         },
         {
           "type": "filter",
           "path": "document"
         }
       ]
     }
   );
   ```

4. **Verify Indexes**:
   Confirm the indexes were created successfully:
   ```javascript
   db.chunks.getSearchIndexes("default");
   ```

---

## **4. Setup Reverse Proxy (Using ngrok)**

1. **Edit the ngrok Configuration File**:
   Locate your `ngrok.yml` file:
   ```bash
   ngrok config check
   ```

   Edit the `ngrok.yml` file:
   ```yaml
   version: "3"
   agent:
       authtoken: your_ngrok_auth_token_here
       log: /home/sadm/AIPal/logs/ngrok.log
   endpoints:
     - name: app
       url: your_endpoint_here
       upstream:
         url: http://localhost:3000
   ```
   Replace `your_ngrok_auth_token_here` and `your_endpoint_here` with your actual ngrok credentials.

2. **Start ngrok**:
   Launch the reverse proxy:
   ```bash
   ngrok service install --config C:\ngrok\ngrok.yml
   ngrok start
   ```

3. **Verify ngrok**:
   Access the provided ngrok URL in your browser to confirm the app is accessible.

---

## **5. Setup Cron Job**

1. **Open Crontab Editor**:
   To ensure your application stays up-to-date automatically, you can set up a cron job to periodically pull the latest container image and update the running container:
   ```bash
   crontab -e
   ```

2. **Add the Following Line**:
   Schedule the script to run hourly:
   ```cron
   0 * * * * /home/sadm/AIPal/scripts/run-with-logging.sh --log-file /home/sadm/AIPal/logs/pull-and-update-container.log --script /home/sadm/AIPal/scripts/pull-and-update-container.sh
   ```

3. **Verify the Cron Job**:
   List active cron jobs to confirm the entry:
   ```bash
   crontab -l
   ```

---

## **Post-Setup Verification**

1. **Check Services**:
   - Docker containers: `docker ps`
   - MongoDB: Connect using `mongosh` and verify the database.
   - ngrok: Access the provided URL and confirm the app loads.

2. **Test End-to-End Functionality**:
   Perform basic tests to ensure the application works as expected.

---

## **Troubleshooting**

- **Docker Issues**:
  - Check container logs:
    ```bash
    docker logs <container_id>
    ```
  - If containers fail to start, verify the `.env` file and ensure all required variables are set correctly.

- **Database Issues**:
  - Ensure MongoDB is running:
    ```bash
    systemctl status mongod
    ```
  - If using a remote database, verify the connection URI and network access rules.

- **ngrok Issues**:
  - Ensure the `ngrok.yml` file is valid and matches the correct syntax.
  - Check the ngrok dashboard for errors: [https://dashboard.ngrok.com](https://dashboard.ngrok.com).
  - If the app is inaccessible, verify the `upstream` URL matches the app's port.

- **Environment Variables**:
  - Double-check the `.env` file for typos or missing values.
  - Restart the application after making changes to the `.env` file.

- **Firewall/Ports**:
  - Ensure ports `3000`, `5000`, and `27017` are open and not blocked by a firewall.
