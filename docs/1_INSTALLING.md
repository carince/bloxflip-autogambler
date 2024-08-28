# Prerequisites
You need to have the following programs installed to be able to run bloxflip-autogambler.
- [Node.js v22+](https://nodejs.org/en/download/ "Download Node.js")
- [Git](https://git-scm.com/downloads "Download Git")

# Installation

1. **Clone the Repository**
   - Open your terminal and run the following command:
   ```bash
   git clone https://github.com/carince/bloxflip-autocrash.git
   ```

2. **Obtain Your Bloxflip Token**
   - Open your browser and go to [Bloxflip](http://bloxflip.com "Bloxflip").
   - Run the following code in the Dev Tools console to copy your token to the clipboard:
   ```js
   copy(localStorage.getItem('_DO_NOT_SHARE_BLOXFLIP_TOKEN'))
   ```

3. **Configure the Bot**
   - Rename `config.example.json5` to `config.json5`.
   - Edit `config.json5` with your desired configuration. Refer to the [Config Documentation](./2_CONFIG.md) for details on each entry.

4. **Install Dependencies**
   - In your terminal, run:
   ```bash
   npm i
   ```

5. **Run the Bot** 🚀
   - Start the bot by running:
   ```bash
   npm start
   ```

### 🆕 Updating

- To update to the latest version, make sure you are in the root folder and run:
   ```bash
   git pull
   npm i
   ```