const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

const args = process.argv.slice(2);

const coinTicker = args[0];
const blockAmount = Number(args[1]);

if (!["eth", "btc", "bch"].includes(coinTicker)) {
  console.log(coinTicker);
  console.error(
    "coin ticker is not supported, please enter either: eth  btc  or  bch"
  );
  process.exit();
}

if (typeof blockAmount != "number") {
  console.log(typeof blockAmount);
  console.error("please enter a number");
  process.exit();
}

const baseUrl = `https://www.blockchain.com/${coinTicker}/blocks?page=`;

// 50 blocks per page
// x pages
// blocks = x * 50
const numPages = Math.ceil(blockAmount / 50);

const miners = {
  // address: blockMinted
};

let blockCount = 0;

async function start() {
  console.log(
    `will analyze miners for ${coinTicker} in ${blockAmount} blocks, at this url ${baseUrl}`
  );
  for (let i = 1; i <= numPages; i++) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const url = baseUrl + i;
    const html = await rp(url);
    const $ = cheerio.load(html);

    const nodes = $(`a[href*="/${coinTicker}/address"]`, html);

    for (let j = 0; j < nodes.length; j++) {
      blockCount++;
      const minerAddress = nodes[j.toString()].attribs.href.split("/")[3];

      if (minerAddress in miners) {
        miners[minerAddress]++;
      } else {
        miners[minerAddress] = 1;
      }
    }
    console.log(
      miners,
      `blockCount: ${blockCount}`,
      `minerCount: ${Object.keys(miners).length}`
    );
  }
  fs.writeFile(
    `results/${coinTicker}results.json`,
    JSON.stringify(
      {
        dateAnalyzed: Date.now(),
        blockCount,
        minerCount: Object.keys(miners).length,
        miners,
      },
      null,
      2
    ),
    function (err) {
      if (err) return console.log(err);
      console.log("check results!");
    }
  );
}

start();
