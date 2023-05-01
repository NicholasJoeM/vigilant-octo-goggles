const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });

  test("Clicking the Draw button displays the div with id='choices'", async () => {
    await driver.get("http://localhost:8000");
    const drawButton = await driver.findElement(By.id("draw-btn"));
    await drawButton.click();
    const choicesDiv = await driver.findElement(By.id("choices"));
    expect(choicesDiv.isDisplayed()).toBeTruthy();
  });

  test("Clicking an 'Add to Duo' button displays the div with id='player-duo'", async () => {
    await driver.get("http://localhost:8000");
    const addButton = await driver.findElement(By.id("add-button-1"));
    await addButton.click();
    const playerDuoDiv = await driver.findElement(By.id("player-duo"));
    expect(playerDuoDiv.isDisplayed()).toBeTruthy();
  });

  test("Removing a bot from Duo moves it back to 'choices'", async () => {
    await driver.get("http://localhost:8000");
    const addButton = await driver.findElement(By.id("add-button-1"));
    await addButton.click();
    const removeButton = await driver.findElement(By.id("remove-button-1"));
    await removeButton.click();
    const choicesDiv = await driver.findElement(By.id("choices"));
    expect(choicesDiv.isDisplayed()).toBeTruthy();
  });
});

