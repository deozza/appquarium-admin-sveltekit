import firebase from "firebase";

export default class Image {
  url: string = ''
  alt: string = ''
  origin: string = ''

  setFromFirebase(file: firebase.storage.Reference) {
    this.url = ''
    this.alt = ''
    this.origin = ''

    file.getMetadata().then(metadata => {
      if(metadata.customMetadata === undefined || metadata.customMetadata === null){
        return
      }

      if(metadata.customMetadata.alt !== undefined && metadata.customMetadata.alt !== null){
        this.alt = metadata.customMetadata.alt
      }

      if(metadata.customMetadata.origin !== undefined && metadata.customMetadata.origin !== null){
        this.origin = metadata.customMetadata.origin
      }
    })

    file.getDownloadURL().then(url => this.url =  url)
  }
}
