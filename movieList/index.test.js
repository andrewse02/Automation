const { Builder, Capabilities, By } = require("selenium-webdriver");

require("chromedriver");

const driver = new Builder().withCapabilities(Capabilities.chrome()).build();

let movieElement;
let movieText;
let deleteButton;
let message;

beforeAll(async () => {
    await driver.get("http://127.0.0.1:5500/movieList/");
    
    const movieInput = await driver.findElement(By.xpath("//input"));
    await movieInput.sendKeys("Movie\n");
    
    movieElement = await driver.findElement(By.xpath("//ul/li"));
    movieText = await driver.findElement(By.xpath("//ul/li/span"));
    deleteButton = await driver.findElement(By.xpath("//ul/li/button"));
    message = await driver.findElement(By.xpath("//aside"));
});

afterAll(async () => {
    await driver.quit();
});

describe("cross off movie", () => {
    test("should cross off movie", async () => {
        await movieText.click();
        expect(await movieText.getAttribute("class")).toBe("checked");
        await movieText.click();
    });

    test("watched movie notification should display", async () => {
        await movieText.click();
        expect(await message.getText()).toBe("Movie watched!");
    });
    
    test("add movie back notification should display", async () => {
        await movieText.click();
        expect(await message.getText()).toBe("Movie added back!");
    });
});

describe("delete movie", () => {
    test("should delete movie", async () => {
        const prevLength = await (await driver.findElements(By.xpath("//ul/*"))).length;
        await deleteButton.click();
        expect(await driver.findElements(By.xpath("//ul/*"))).toHaveLength(prevLength - 1);
    });

    test("delete movie notification should display", async () => {
        expect(await message.getText()).toBe("Movie deleted!");
    });
});
