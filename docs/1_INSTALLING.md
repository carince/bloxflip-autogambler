# Prerequisites
- [NodeJS](https://nodejs.org/en/download/ "NodeJS v16.17.0^")
- [git](https://git-scm.com/downloads "git")

# Installation
- Open your terminal and clone the repository
```bash
git clone https://github.com/carince/bloxflip-autogambler.git
```

- Open your Browser of choice, Go to [Bloxflip](http://bloxflip.com "Bloxflip") and then run the following code inside of the Dev Tools console. (it should copy onto your clipboard):
```js
copy(localStorage.getItem(`_DO_NOT_SHARE_BLOXFLIP_TOKEN`))
```

- Rename `config.example.json5` to `config.json5`

- Edit `config.json5` with your desired configuration, documentation on what each entry does: [Config Documentation](./2_CONFIG.md)

- Install required dependencies:
```bash
npm i
```

- Run the bot! 🚀
```bash
npm start
```

### 🆕 Updating
You must be in the root folder to be able to pull new commits
```bash
git pull
```