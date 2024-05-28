// import { ConsoleLog } from "../debug/console-log";

export const flattenObject = (obj: Record<string, any>, parentKey = '') => {
  let result = {};

  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      result = { ...result, ...flattenObject(obj[key], newKey) };
    } else {
      result[newKey] = obj[key];
    }
  }

  return result;
};

// const structuralInitialValues = {
//   fizSender: {
//     surnameSender: '',
//     nameSender: '',
//     patronymicSender: '',
//     phoneSender: { formattedValue: '', value: '', floatValue: undefined },
//     telegamSender: false,
//     whatsAppSender: false,
//     pointFrom: '',
//     pickupAddress: '',
//   },
//   companySender: {
//     companySender: '',
//     phoneSender: { formattedValue: '', value: '', floatValue: undefined },
//     emailSender: '',
//     pointFrom: '',
//     pickupAddress: '',
//     innSender: { formattedValue: '', value: '', floatValue: undefined },
//   },
//   price: { formattedValue: '', value: '', floatValue: undefined },
//   optional: '',
//   acceptedTerms: false,
// };
//
// const result = flattenObject(structuralInitialValues);
//
// ConsoleLog(result);
