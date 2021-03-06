/**
 * createURL() takes the vin and places it within the template.
 * @param string vin
 * Returns string url
 */
exports.createURL = vin => {
  return `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`;
};

/**
 * * filterData() takes the data and removes null and empty values.
 * @param array of Objects
 * Returns promise
 */
exports.filterData = data => {
  return new Promise((resolve, reject) => {
    try {
      resolve(data.data.Results.filter(ele => ele.Value !== null).filter(ele => ele.Value !== ''));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * * checkVin() takes the vinData and checks the error code.
 * @param array of Objects
 * Returns promise.
 *
 * Possible Codes :
 * 0 - VIN decoded clean.Check Digit(9 th position) is correct
 * 1 - VIN decoded clean.Check Digit(9 th position) does not calculate properly.
 * 5 - VIN has errors in few positions.
 * 11 - Incorrect Model Year, decoded data may not be accurate!
 */
exports.checkVin = vinData => {
  return new Promise((resolve, reject) => {
    // Filter the data for the error code info.
    const errorCode = vinData.filter(ele => ele.Variable === 'Error Code')[0].Value;
    // Split the error code string so we can get the code number.
    const code = errorCode.split(' ')[0];
    // Check the code number.
    if (code === '0' || code === '1') {
      resolve(vinData);
    } else {
      reject(errorCode);
    }
  });
};

/**
 * * storageAvailable() check if the browser has local storage available.
 * @param string ("localStorage" OR "sessionStorage")
 * Returns boolean
 */
exports.storageAvailable = type => {
  try {
    const storage = window[type];
    const test_sample = 'storage_test';
    storage.setItem(test_sample, test_sample);
    storage.removeItem(test_sample);
    return true;
  } catch (error) {
    return (
      error instanceof DOMException &&
      // everything except Firefox
      (error.code === 22 ||
        // Firefox
        error.code === 1014 ||
        // Test name field
        // everything except Firefox
        error.name === 'QuotaExceededError' ||
        // Firefox
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // Acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0
    );
  }
};

/**
 * * capitalize() makes only the first letter capitalized.
 * @param string
 * Returns string
 */
exports.capitalize = str => {
  if (str === null) return str;
  const firstLetter = str.charAt(0).toUpperCase();
  const restOfWord = str.slice(1).toLowerCase();
  return firstLetter + restOfWord;
};

/**
 * * determineAge() returns the age based on the model year.
 * @param string year
 * Returns string
 */
exports.determineAge = year => {
  const today = new Date().getFullYear();
  let age = today - year;
  // Just in case the vehicle is the next year model. ie(a 2020 model in 2019)
  if (age < 0) {
    age = 0;
  }

  let text = '';

  switch (age) {
    case 0:
      text = 'Less than a year old';
      break;
    case 1:
      text = '1 year old';
      break;
    default:
      text = `${age} years old`;
  }

  return text;
};

/**
 * * getSerialNumber() return the serial number from the vin.
 * @param string vin (must be 17 characters)
 * Returns string or undefined
 */
exports.getSerialNumber = vin => {
  if (vin.length === 17) {
    return vin.slice(11);
  }
  return undefined;
};

/**
 * * formatLocation() returns a string with spaces replaced by plus chars
 * The function is used for google geocoding api
 * @param string location
 * Returns formatted string
 */
exports.formatLocation = location => {
  const arrOfStrings = location.split(' ');
  const reducer = (accumulator, nextValue) => accumulator + '+' + nextValue;
  return arrOfStrings.reduce(reducer);
};