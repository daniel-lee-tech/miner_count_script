# Miner Count Script
This is a simple script that counts the amount of unique mining addresses by scraping [www.blockchain.com](www.blockchain.com).

## Usage

You need to have nodejs installed on your machine.

then in the terminal

```bash
npm i
node index.js <coinTicker> <Number of blocks you want to analyze>
# example
node index.js btc 20000
```
Then check `results` folder a json folder holding your results
