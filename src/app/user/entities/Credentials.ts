import BaseInputModele from "../../../components/atoms/input/BaseInputModel";

export default class Credentials {
  email: BaseInputModele
  password: BaseInputModele


  constructor(email: BaseInputModele, password: BaseInputModele) {
    this.email = email;
    this.password = password;
  }
}
