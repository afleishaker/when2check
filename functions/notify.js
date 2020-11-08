const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const puppeteer = require('puppeteer');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
    availability = await page.evaluate(() => {
        return document.getElementById("MaxAvailable").innerText.split("/");
    });
    console.log(availability);
    admin.firestore().collection('links').where('link', '==', url).get().then(querySnasphot => {
        querySnasphot.forEach(document => {
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