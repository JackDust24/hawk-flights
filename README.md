## OVERVIEW

A flight search application using Next.js and Node. 

This is not a production app and is using mock data.

## TECH STACK

This is builr with Next.js for the frontend, with server actions used for intereacting with the Node.js backend.

Not using a real payment gateway, just a fake payment intent.

Frontend -
Next.js - Reason I chose this compared to React is there is better scalability with Next.js in my opinion and easier to implement different rendering needs when needed and server actions are very useable.
Fetching data - Used a mixture of Axios and fetch and though I did not use React Query in this project, I would do normally.
Styles - I am a huge fan of tailwindCSS as I believe using tailwind is more efficient when dealing with any styling conflicts or issues that may pop up.

Backend - 
Node.js/Express - I used Node.js for two reasons, one it was in the job description and though I could just rely on Next.js for a backend server, it isn't that scalable if the project were to get bigger. I like using Next.js server actions and haven't used them in conjunction with Node.js/Express before, so was eager to try it out.

Other -
Authentication - Just set my own one up here in Node.js, though I usually tend to go with Oauth in NextAuth and using Google and Github providers, was eager to just let this be handled by Node.js for this project.


## SET UP

IMPORTANT - In the repo there is a DB with a table for users with demo users set up, these users will be downlaoded 
with the repo. IF for any reason the users are not there, then when the server starts up the two users will be inserted by default.

STEP ONE - 
Please clone or download the repo.

STEP TWO -
Open two terminals and run the server first.

```
cd server
npm run dev

```

To run the client
```
cd client
npm run dev

```

Prees Enter at the route, then search the flight you want.

## TO SEARCH FOR A BOOK A FLIGHT
PRE-ASSUMPTIONS:
For demo purposes - Return flights only.
Three inbound and three outbound flights will return for selection.
If the origin and the destination are the SAME, for example, London -> London - this will return a non response.
For demo purposes - Not case sensitive, so LONDON -> london, are classed as two separate destinations.
For demo purposes - Using mock data only so whatever you enter for origin and destination, there will be results.
This is just basic flight details, no arrival time etc.

Search for Flights - 
Either press Enter in the home screen OR select Seacrh Flights in the navigation bar.

Choose Flights - 
Must choose an Inbound and Outbound flight to get to the booking form, click the BOOK FLIGHTS button.

## BOOK AND PAY FOR FLIGHT
PRE-ASSUMPTIONS:
For demo purposes - Not the full payment gateway flow, usually I would use Stripe or Omise and do the
full Stripe flow for example. Here we just mock create payment intent and then move onto booking.
For demo purposes - Just using USD for payments.
Don't need to sign in for this - in real application, will set this up.
Just basic details, no passport info or seat info etc.
Any data can be added as long as matches the validation.
just basic confirmation once a success.

Confirm booking -
Confirm booking or press cancel and select other flights

Fill in booking details -
Fill in basic details, any number for card number and security code as long as 16 and 3 numbers respectively.

Successful payment -
If success, should go to confirmation page showing booking number.

## AUTHENTICATION AND AUTHORISATION FLOW
PRE-ASSUMPTIONS:
Profile Screen is protected via the backend if you are signed in.
Admin Dashboard is protected for Admin users only.
When you register through the frontend, you are automatically assigned the Member role.
Just basic authentication flow, no forget password, reset password, email verification set up.

ROLES:
Two types - member and admin

Default users to test with:

```
Member - 
username: member@example.com
password: member1234

Admin -
username: admin@example.com
password: admin1234
```

Register user -
1. Click Register on the far top right
2. Add a unique username
3. Add a unique email
4. Add a password 

Login -
1. Click Login on the far top right
2. Add your email
3. Add your password 

You will be automatically asigned he member role.


Expected Result - Proflie Screen -
Not signed In - Profile screen displays you CANNOT view what's on the page
Signed in as a member - Profile screen displays you can access content
Signed in as an Admin - Profile screen displays you can access content

Expected Result - Admin Dashboard Screen -
Not signed In - Admin Dashboard screen displays you CANNOT view what's on the page
Signed in as a member - Admin Dashboard screen displays you CANNOT view what's on the page
Signed in as an Admin - Admin Dashboard screen displays you can access content

