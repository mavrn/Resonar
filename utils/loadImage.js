import { getStorage, ref as storageRef, getBytes } from 'firebase/storage';

//returns true if a string looks like an URL. is sufficient for this purpose (distincting between file names and urls)
function isURL(str) {
  return str.split('.').length >= 3;
}

/**
 * Fetches image from Firebase storage
 * @param {string} fileName Filename in images/ storage directory
 * @returns Image raw data as a string if found, URL if the picture string is one
 */
export const loadImage = async (fileName) => {
  if (isURL(fileName)) {
    return fileName;
  }
  const storage = getStorage();
  const store = storageRef(storage, `images/${fileName}`);
  const imageFormat = fileName.split('.')[1];

  const arrayBuffer = await getBytes(store);

  const uint8Array = new Uint8Array(arrayBuffer);
  const binary = uint8Array.reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ''
  );
  const base64Image = btoa(binary);
  return `data:image/${imageFormat};base64,${base64Image}`;
};
