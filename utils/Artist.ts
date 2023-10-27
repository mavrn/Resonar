import { DocumentReference, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { Release } from './Release';

export class Artist {
  avatar: string;
  name: string;
  // releasesUnresolved: DocumentReference[];
  // releases: Release[];

  constructor(doc: DocumentData) {
    const docData = doc.data();
    this.avatar = docData.avatar;
    this.name = docData.name;
    // this.releasesUnresolved = docData.releases;
    // this.releases = [];
  }

  // async resolve() {
  //   this.releasesUnresolved.forEach((releaseReference: DocumentReference) =>
  //     getDoc(releaseReference).then((releaseSnapshot) => {
  //       this.releases.push(new Release(releaseSnapshot));
  //     })
  //   );
  // }
}
