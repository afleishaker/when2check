const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
const puppeteer = require('puppeteer');
const cors = require('cors')({origin: true});
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(functions.config().sendgrid.key);
admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true })


const createEvent = async (uid, title, startDate, endDate, startTime, endTime, notifyUntil, expectedPeople) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.when2meet.com/');
    await page.evaluate((title, startDate, endDate, startTime, endTime) => {

        // Function to trigger mouse events
        function triggerMouseEvent (node, eventType) {
            var clickEvent = document.createEvent ('MouseEvents');
            clickEvent.initEvent (eventType, true, true);
            node.dispatchEvent (clickEvent);
        }

        startDate = moment(startDate);
        endDate = moment(endDate);

        // Selects date options for event
        do{
            var dateElem = document.querySelector("input[value='"+ startDate.format("YYYY-MM-DD") +"']").previousElementSibling;
            triggerMouseEvent(dateElem, "mousedown")
            triggerMouseEvent(dateElem, "mouseup")
            startDate.add(1, "day");
        }  while(!startDate.isAfter(endDate));

        // Selects time options for event
        document.querySelector("[name='NoEarlierThan']").value = startTime;
        document.querySelector("[name='NoLaterThan']").value = endTime;
        document.querySelector("[name='TimeZone']").value = "America/New_York";

        // Sets title for event
        document.getElementById("NewEventName").value = title;

        // Creates event
        document.querySelector("input[value='Create Event']").click();
    }, title, startDate, endDate, startTime, endTime);
    // PHP event for creating new event
    await page.waitForNavigation();
    // Redirect to the actual new event
    await page.waitForNavigation();
    await browser.close();
    console.log(page.url());
    await admin.firestore().collection('links').add({
        availablePeople: "0",
        currentPeople: "0",
        expectedPeople: expectedPeople,
        lastCheckedTime: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        link: page.url(),
        notifyUntil: notifyUntil,
        subscribers: [uid],
        title: title
    });
    return page.url();
};

exports.createEvent = functions.runWith({
        timeoutSeconds: 300,
        memory: '1GB'
    }).https.onRequest((request, response) => {
    cors(request, response, async () => {
        const { uid, title, startDate, endDate, startTime, endTime, notifyUntil, expectedPeople } = request.body.data;

        const data = await createEvent(uid, title, startDate, endDate, startTime, endTime, notifyUntil, expectedPeople);
        response.send(data);
    });
});

exports.createUser = functions.auth.user().onCreate((user) => {
    return admin.firestore().collection('users').doc(user.uid).set({email: user.email});
});

const getAvailability = async (url) => {
    async function notifySubscribers(subscribers, url, availability) {
        for (const uid of subscribers) {
            const user = await admin.firestore().collection('users').doc(uid).get();
            console.log(uid);
            if (user.exists) {
                const msg = {
                    to: user.data().email,
                    from: 'when2check@gmail.com',
                    subject: 'Availability Update',
                    text: 'Updated Availability for ' + url + ': ' + availability[0] + "/" + availability[1],
                    html: '<strong>Updated Availability for ' + url + ':</strong> ' + availability[0] + "/" + availability[1],
                }
                sgMail
                    .send(msg)
                    .then(() => {
                        console.log('Email sent')
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }
        }
    }

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);
    let availability = await page.evaluate(() => {
        return document.getElementById("MaxAvailable").innerText.split("/");
    });
    console.log(availability);
    admin.firestore().collection('links').where('link', '==', url).get().then(querySnapshot => {
        querySnapshot.forEach(document => {
            if (document.data().availablePeople !== availability[0] || document.data().currentPeople !== availability[1]) {
                admin.firestore().collection('links').doc(document.id).update({availablePeople: availability[0], currentPeople: availability[1]});
                notifySubscribers(document.data().subscribers, url, availability);
            }
        })
    });
    return availability;
};

exports.availability = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const data = await getAvailability(request.body.url);
        response.send(data);
    });
});