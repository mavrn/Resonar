import { getStorage, ref as storageRef, getBytes } from 'firebase/storage';

export const loadImage = async (fileName) => {
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
