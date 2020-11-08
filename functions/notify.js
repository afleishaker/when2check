const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const puppeteer = require('puppeteer');

const getAvailability = async (url) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);
    availability = await page.evaluate(() => {
        return document.getElementById("MaxAvailable").innerText.split("/");
    });
    console.log(availability);
    admin.firestore().collection('links').where('link', '==', url).get().then(querySnasphot => {
        querySnasphot.forEach(document => {
            if (document.data().availablePeople < availability[0]) {
                admin.firestore().collection('links').doc(document.id).update({availablePeople: availability[0]});
            }
            if (document.data().currentPeople < availability[1]) {
                admin.firestore().collection('links').doc(document.id).update({currentPeople: availability[1]});
            }
        })
    });
    return availability;
};

exports.availability = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const data = await getAvailability(request.query.url);
        response.send(data);
    });
});