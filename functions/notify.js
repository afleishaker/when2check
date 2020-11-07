const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const puppeteer = require('puppeteer');

const getAvailability = async (url, user) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);
    availability = await page.evaluate(() => {
        return document.getElementById("MaxAvailable").innerText.split("/");
    });
    console.log(availability);
    return availability;
};

exports.availability = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const data = await getAvailability(request.query.url, request.query.user);
        response.send(data);
    });
});