Deploying
Firebase
Firebase hosting provides many benefits for Progressive Web Apps, including fast response times thanks to CDNs, HTTPS enabled by default, and support for HTTP2 push.

First, if not already available, create the project in Firebase.

Next, in a Terminal, install the Firebase CLI:

npm install -g firebase-tools

note
If it's the first time you use firebase-tools, login to your Google account with firebase login command.

With the Firebase CLI installed, run firebase init within your Ionic project. The CLI prompts:

"Which Firebase CLI features do you want to set up for this folder?" Choose "Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys".

Create a new Firebase project or select an existing one.

"Select a default Firebase project for this directory:" Choose the project you created on the Firebase website.

"What do you want to use as your public directory?" Enter "build".

note
Answering this next question will ensure that routing, hard reload, and deep linking work in the app:

Configure as a single-page app (rewrite all urls to /index.html)?" Enter "Yes".

"File build/index.html already exists. Overwrite?" Enter "No".

Set up automatic builds and deploys with Github? Enter "Yes".

For which GitHub repository would you like to set up a Github Workflow? Enter your project name.

Set up the workflow to run a build script before every deploy? Enter "Yes".

What script should be run before every deploy? Enter npm ci && npm run build.

Set up automatic deployment to your sites live channel when a PR is merged? Enter "Yes".

What is the name of the get hooked branch associated with your sites live channel? Enter your project's main branch name.

A firebase.json config file is generated, configuring the app for deployment.


Next, build an optimized version of the app by running:

ionic build --prod

Last, deploy the app by running:

firebase deploy

After this completes, the app will be live.