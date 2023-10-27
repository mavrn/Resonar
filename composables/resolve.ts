import { getDoc, DocumentReference } from 'firebase/firestore';

export const resolve = async (reference: DocumentReference) => {
  getDoc(reference).then((answer) => {
    return answer;
  });
};
