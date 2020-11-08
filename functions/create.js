// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const moment = require('moment');
// const cors = require('cors')({ origin: true });
// const puppeteer = require('puppeteer');
//
// const createEvent = async (uid, title, startDate, endDate, startTime, endTime, notifyUntil, expectedPeople) => {
//     const browser = await puppeteer.launch({headless: true});
//     const page = await browser.newPage();
//     await page.goto('https://www.when2meet.com/');
//     await page.evaluate((title, startDate, endDate, startTime, endTime) => {
//
//         // Function to trigger mouse events
//         function triggerMouseEvent (node, eventType) {
//             var clickEvent = document.createEvent ('MouseEvents');
//             clickEvent.initEvent (eventType, true, true);
//             node.dispatchEvent (clickEvent);
//         }
//
//         startDate = moment(startDate);
//         endDate = moment(endDate);
//
//         // Selects date options for event
//         do{
//             var dateElem = document.querySelector("input[value='"+ startDate.format('YYYY-MM-DD') +"']").previousElementSibling;
//             triggerMouseEvent(dateElem, "mousedown")
//             triggerMouseEvent(dateElem, "mouseup")
//             startDate.add(1, "day");
//         }  while(!startDate.isAfter(endDate));
//
//         // Selects time options for event
//         document.querySelector("[name='NoEarlierThan']").value = startTime;
//         document.querySelector("[name='NoLaterThan']").value = endTime;
//
//         // Sets title for event
//         document.getElementById("NewEventName").value = title;
//
//         // Creates event
//         document.querySelector("input[value='Create Event']").click();
//     }, title, startDate, endDate, startTime, endTime);
//     // PHP event for creating new event
//     await page.waitForNavigation();
//     // Redirect to the actual new event
//     await page.waitForNavigation();
//     await browser.close();
//     console.log(page.url());
//     await admin.firestore().collection('links').add({
//         availablePeople: "0",
//         currentPeople: "0",
//         expectedPeople: expectedPeople,
//         lastCheckedTime: Date.now(),
//         link: page.url(),
//         notifyUntil: notifyUntil,
//         subscribers: [uid],
//         title: title
//     });
//     return page.url();
// };
//
// exports.createEvent = functions.https.onRequest((request, response) => {
//     cors(request, response, async () => {
//         const { uid, title, startDate, endDate, startTime, endTime, notifyUntil, expectedPeople } = request.body;
//         const data = await createEvent(uid, title, startDate, endDate, startTime, endTime, notifyUntil, expectedPeople);
//         response.send(data);
//     });
// });
//
// exports.createUser = functions.auth.user().onCreate((user) => {
//     return admin.firestore().collection('users').doc(user.uid).set({email: user.email});
// });