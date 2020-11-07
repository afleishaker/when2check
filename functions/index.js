const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const puppeteer = require('puppeteer');

const createEvent = async (title, dates, start, end) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.when2meet.com/');
    await page.evaluate((title, dates, start, end) => {

        // Function to trigger mouse events
        function triggerMouseEvent (node, eventType) {
            var clickEvent = document.createEvent ('MouseEvents');
            clickEvent.initEvent (eventType, true, true);
            node.dispatchEvent (clickEvent);
        }

        // Selects date options for event
        dates.forEach((element) => {
            var dateElem = document.querySelector("input[value='"+ element +"']").previousElementSibling;
            console.log(dateElem);
            triggerMouseEvent(dateElem, "mousedown")
            triggerMouseEvent(dateElem, "mouseup")
        });

        // Selects time options for event
        document.querySelector("[name='NoEarlierThan']").value = start;
        document.querySelector("[name='NoLaterThan']").value = end;

        // Sets title for event
        document.getElementById("NewEventName").value = title;

        // Creates event
        document.querySelector("input[value='Create Event']").click();
    }, title, dates, start, end);
    // PHP event for creating new event
    await page.waitForNavigation();
    // Redirect to the actual new event
    await page.waitForNavigation();
    await browser.close();
    console.log(page.url());
    return page.url();
};

exports.create = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const data = await createEvent(request.query.title, JSON.parse(request.query.dates), request.query.start, request.query.end);
        response.send(data);
    });
});