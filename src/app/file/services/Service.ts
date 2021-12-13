import ServiceInterface from "./ServiceInterface";

import UseCaseError from "../../utils/useCasesResult/types/UseCaseError";

import Image from "../entities/Image";

import AdapterInterface from "../adapters/AdapterInterface";
import FirebaseAdapter from "../adapters/FirebaseAdapter";

export default class Service implements ServiceInterface{

  private readonly module: any

  constructor(module: any) {
    this.module = module
  }

  getComputedFileName(fileName: string): string {
    return fileName.replaceAll(' ', '_')
      .replaceAll("'", '_')
      .toLowerCase();
  }

  getMetadata(fileName: string, fileSource: string): object {
    return {
      customMetadata: {
        alt: fileName,
        source: fileSource
      }
    }
  }

  async uploadFile(path: string, file: File, metadata: object): Promise<Image | Array<UseCaseError>> {
    const adapter: AdapterInterface = new FirebaseAdapter(this.module)

    return await adapter.uploadFile(path, file, metadata)
  }

  async editFileMetadata(image: Image): Promise<boolean | Array<UseCaseError>> {
    const adapter: AdapterInterface = new FirebaseAdapter(this.module)

    return await adapter.editFileMetadata(image)
  }

  async deleteFile(image: Image): Promise<boolean | Array<UseCaseError>> {
    const adapter: AdapterInterface = new FirebaseAdapter(this.module)

    return await adapter.deleteFile(image)
  }
}
