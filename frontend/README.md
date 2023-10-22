### Set up develop enviroment in Ubuntu 20.04
1. Install NVM
    Node Version Manager (NVM), as the name implies, is a tool for managing Node versions on your device.
    1. Run the nvm installer
        ```bash
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
        ```
    2. Update your profile configuration
        ```bash
        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        ```
    3. Reload the shell configuration
        ```bash
        source ~/.bashrc
        ```
        ```bash
        nvm -v
        ```
2. Install node 18
    ```bash
    nvm install 18
    ```
    ```bash
    nvm use 18
    ```
### Install library
    ```bash
    npm install
    ```

### Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

### Run the production server:
    ```bash
    npm run build
    
    npm start
    ```
