const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true })

const cors = require('cors')({ origin: true });
const puppeteer = require('puppeteer');

const createEvent = async (uid, title, dates, start, end, notifyUntil) => {
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
    await admin.firestore().collection('links').add({
        availablePeople: 0,
        currentPeople: 0,
        expectedPeople: 0,
        lastCheckedTime: Date.now(),
        link: page.url(),
        notifyUntil: notifyUntil,
        subscribers: [uid],
        title: title
    });
    return page.url();
};

exports.createEvent = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const data = await createEvent(request.query.uid, request.query.title, JSON.parse(request.query.dates), request.query.start, request.query.end, request.query.notifyUntil);
        response.send(data);
    });
});

exports.createUser = functions.auth.user().onCreate((user) => {
    return admin.firestore().collection('users').add({email: user.email, userId: user.uid});
});