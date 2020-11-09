const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
const puppeteer = require('puppeteer');
const cors = require('cors')({origin: true});
const sgMail = require('@sendgrid/mail');
const client = require('twilio')(functions.config().twilio.sid, functions.config().twilio.token);

sgMail.setApiKey(functions.config().sendgrid.key);
admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true })


const createEvent = async (uid, title, startDate, endDate, startTime, endTime, notifyUntil, expectedPeople) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.when2meet.com/');
    page.on('console', consoleObj => console.log(consoleObj.text()));
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
        document.querySelector("[name='NoEarlierThan']").value = Number(startTime);
        console.log(document.querySelector("[name='NoEarlierThan']").value)
        document.querySelector("[name='NoLaterThan']").value = Number(endTime);
        console.log(document.querySelector("[name='NoLaterThan']").value);
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
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
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

    function generateNotification(url, availability, times, isEmail) {
        let notification = 'Updated Availability for ' + url + ': ' + availability[0] + "/" + availability[1];
        let divider = isEmail ? "<br>" : "\n";
        if (times.length !== 0) {
            notification += divider + "Times: " + times.toString();
        }
        return notification;
    }


    async function notifySubscribers(subscribers, url, availability, times) {
        for (const uid of subscribers) {
            const user = await admin.firestore().collection('users').doc(uid).get();
            console.log(uid);
            if (user.exists) {
                const msg = {
                    to: user.data().email,
                    from: 'when2check@gmail.com',
                    subject: 'Availability Update',
                    text: generateNotification(url, availability, times, true),
                    html: generateNotification(url, availability, times, true),
                }
                sgMail
                    .send(msg)
                    .then(() => {
                        console.log('Email sent')
                    })
                    .catch((error) => {
                        console.error(error)
                    })
                if (user.data().phoneNumber) {
                    client.messages
                        .create({
                            body: generateNotification(url, availability, times, false),
                            from: '+19146537960',
                            to: user.data().phoneNumber
                        })
                        .then(message => console.log(message.sid))
                        .catch((error) => {
                            console.error(error)
                        });
                }
            }
        }
    }

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);
    page.on('console', consoleObj => console.log(consoleObj.text()));

    console.log("URL", url);
    // eslint-disable-next-line promise/always-return
    await admin.firestore().collection('links').where('link', '==', url).get().then(async querySnapshot => {

        for(const link of querySnapshot.docs) {

            // eslint-disable-next-line no-await-in-loop
            let results = await page.evaluate((link) => {
                const available = document.getElementById("MaxAvailable");

                if (available) {
                    const table = document.getElementById("GroupKey").children[0];
                    const header = table.getElementsByTagName("td");
                    const maxAvailableColor = header[header.length-1].bgColor;

                    let timeCells = Array.from(document.querySelectorAll("[id^='GroupTime']"))
                        .filter(obj => {
                            let background = obj.style.background;
                            let arr = [];
                            background.replace(/[\d+\.]+/g, function(v) {
                                arr.push(parseFloat(v));
                            });
                            let hex = "#" + arr.slice(0, 3).map((elem) => {
                                let hex = elem.toString(16);
                                return hex.length === 1 ? "0" + hex : hex
                            });
                            return hex.split(",").join("") === maxAvailableColor
                        });

                    const dates = [];
                    const startDate = moment(link.startDate);
                    const endDate = moment(link.endDate);

                    // Selects date options for event
                    do{
                        dates.push(startDate.clone());
                        startDate.add(1, "day");
                    }  while(!startDate.isAfter(endDate));


                    function getTimes(time, dates){
                        console.log("Start time is", link.startTime);
                        console.log("Time Row is", time.dataset.row)
                        let number = Number(link.startTime)+(0.25*Number(time.dataset.row))
                        console.log("Number is ", number);
                        console.log("Formatted moment number is", `${Math.floor(number)}.${(number%1)*60}`);
                        let newTime = moment(`${Math.floor(number)}.${(number%1)*60}`, "LT").format("h:mm a")
                        console.log("New time is", newTime);
                        return `${dates[time.dataset.col].format("YYYY-MM-DD")} ${newTime}`
                    }

                    timeCells = timeCells.map(time => getTimes(time, dates))
                    return [available.innerText.split("/"), timeCells];
                }
                else {
                    return [["0", "0"], []];
                }
            }, link.data());
            const availability = results[0];
            const times = results[1];

            console.log("times:", times);
            console.log(url + ": " + availability[0], availability[1]);

            console.log("Link data here:", link.data());
            if(link.data().availablePeople !== availability[0] || link.data().currentPeople !== availability[1]) {
                await admin.firestore().collection('links').doc(link.id).update({
                    availablePeople: availability[0],
                    currentPeople: availability[1],
                    lastCheckedTime: admin.firestore.FieldValue.serverTimestamp()
                });
                await notifySubscribers(link.data().subscribers, url, availability, times);
            } else {
                await admin.firestore().collection('links').doc(link.id).update({lastCheckedTime: admin.firestore.FieldValue.serverTimestamp()});
            }
        }
    });
};

exports.availability = functions.runWith({
    timeoutSeconds: 540,
    memory: '2GB'
}).pubsub.schedule('5 11 * * *').onRun(async (context) => {
    const querySnapshot = await admin.firestore().collection('links').get();
    for (document of querySnapshot.docs) {
        if (document.data().link) {
            await getAvailability(document.data().link);
        }
    }
});