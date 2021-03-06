# when2check 🕑

when2check is a platform built by Adam Fleishaker and Mitchell Dodell as part of Codestellation 2020.

## Inspiration
The inspiration for this project was due to us relying on [when2meet](https://www.when2meet.com/) for group meetings in the asynchronous landscape that is COVID-19. when2meet is a pretty bare website, and you have to constantly check if people have filled it out. when2check allows you to see when people have filled out your when2meets, and be notified every hour by email or text.

## What it does

when2check allows you to create events through the interface, specifying several fields:

* the title of the event
* the date range of the event
* the potential times of the event
* when the user would like to receive notifications until
* how many users they expect to fill out the notification

## How I built it
We built the website using React, Firebase (Firestore, Cloud Functions, Hosting, Authentication), Puppeteer, and the SendGrid/Twilio API. 

It scrapes when2meet using a headless instance of puppeteer, which allows us to create events through the event and then get their availability.

## Challenges I ran into
Developing code to scrape from when2meet, which doesn't necessarily provide identifiers for a lot of its components, so we had to calculate certain fields.

## Accomplishments that I'm proud of
Extending when2meet's functionality in both email and text notification, as well as an extended interface in the duration of the hackathon!

## What I learned
We learned how to utilize Firebase's various components, Puppeteer, the SendGrid API, and refreshed our knowledge on React and Twilio.

## What's next for when2check
Future iterations could include Slack and other integrations, multiple subscribers, and more targeted notifications, or a complete re-write of when2meet.
