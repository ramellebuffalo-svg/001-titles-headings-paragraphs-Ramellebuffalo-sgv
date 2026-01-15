const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer((req, res) => {
    const filePath = __dirname + "/.." + req.url;
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "File not found" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  });

  const PORT = process.env.PORT || 3000;
  await new Promise((resolve) => server.listen(PORT, resolve));
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe("title", () => {
  it("should exist", async () => {
    const title = await page.$("head > title");
    expect(title).not.toBeNull();
  });
});

describe("heading 1", () => {
  it("should exist", async () => {
    const heading = await page.$("h1");
    expect(heading).not.toBeNull();
  });
});

describe("paragraph", () => {
  it("should exist", async () => {
    const paragraph = await page.$("p");
    expect(paragraph).not.toBeNull();
  });
});
