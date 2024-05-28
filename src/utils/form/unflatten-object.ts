// import { ConsoleLog } from "../debug/console-log";

export const unflattenObject = (flatObject: Record<string, any>): Record<string, any> => {
  const result = {};

  for (const key in flatObject) {
    const keys = key.split('.');
    let currentLevel = result;

    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i];
      const isLastKey = i === keys.length - 1;

      if (isLastKey) {
        currentLevel[currentKey] = flatObject[key];
      } else {
        currentLevel[currentKey] = currentLevel[currentKey] || {};
        currentLevel = currentLevel[currentKey];
      }
    }
  }

  return result;
};

// // Example usage with the flattened structure received from the backend
// const flattenedDataFromBackend = {
//   'fizSender.surnameSender': '',
//   'fizSender.nameSender': '',
//   'fizSender.patronymicSender': '',
//   'fizSender.phoneSender.formattedValue': '',
//   'fizSender.phoneSender.value': '',
//   'fizSender.phoneSender.floatValue': undefined,
//   'fizSender.telegamSender': false,
//   'fizSender.whatsAppSender': false,
//   'fizSender.pointFrom': '',
//   'fizSender.pickupAddress': '',
//   'companySender.companySender': '',
//   'companySender.phoneSender.formattedValue': '',
//   'companySender.phoneSender.value': '',
//   'companySender.phoneSender.floatValue': undefined,
//   'companySender.emailSender': '',
//   'companySender.pointFrom': '',
//   'companySender.pickupAddress': '',
//   'companySender.innSender.formattedValue': '',
//   'companySender.innSender.value': '',
//   'companySender.innSender.floatValue': undefined,
//   'price.formattedValue': '',
//   'price.value': '',
//   'price.floatValue': undefined,
//   'optional': '',
//   'acceptedTerms': false,
// };
//
// const originalNestedStructure = unflattenObject(flattenedDataFromBackend);
//
// ConsoleLog(originalNestedStructure);
