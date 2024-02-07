## Set Up Development Environment in Ubuntu 20.04

### 1. Install NVM - Node Version Manager to Manage Node Versions

- Run the NVM installer:

  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  ```

- Update your profile configuration:

  ```bash
  export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  ```

- Reload the shell configuration:

  ```bash
  source ~/.bashrc
  ```

- Verify the NVM installation:
  ```bash
  nvm -v
  ```

### 2. Install Node 18

```bash
nvm install 18
```

```bash
nvm use 18
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 5. Run the Production Server

```bash
npm run build
npm start
```
