import './setupFirebase';
import { ref as storageRef } from 'firebase/storage';
import { test, expect } from 'vitest';
import { useFirebaseStorage, useStorageFileUrl } from 'vuefire';

const storage = useFirebaseStorage();


const fetchRemoteJson = async () => {
  console.debug('Starting fetch...');
  const requestOptions = {
    method: 'GET',
    headers: new Headers({}),
  };
  console.debug('Getting URL...');
  const url = await new Promise((resolve, reject) => {
    const storageUrl = useStorageFileUrl(storageRef(storage, 'index.json'));
    storageUrl
      .refresh()
      .then(() => {
        resolve(storageUrl.url.value);
      })
      .catch(reject);
  });
  if (url) {
    const request = new Request(url, requestOptions);
    console.debug('Requesting JSON...');
    const response = await fetch(request);
    console.debug('Parsing JSON...');
    const json = await response.json();
    return json;
  }
};

test('fetchRemoteJson fetches and returns data correctly', async () => {
    // Call the fetchRemoteJson function
    const data = await fetchRemoteJson();
  
    // Expect data to be defined and to be an object (JSON)
    expect(data).toBeDefined();
    expect(typeof data).toBe('object');
  });