/*
NOTE - Not used anywhere but would call this from the middleware if needed
*/

const cookieConsentCheck = (req, res, next) => {
  const consent = req.cookies.cookie_consent;
  if (consent === 'true') {
    console.log('User has given consent');
    next();
  } else if (consent === 'false') {
    console.log('User has NOT given consent');
    res.clearCookie('analytics_cookie');
    next();
  } else {
    // As no analyics sent
    console.log('No analytics cookie set');

    next();
  }
};

module.exports = cookieConsentCheck;
