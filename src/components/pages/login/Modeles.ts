import BaseButtonModel from '../../atoms/button/BaseButtonModel';
import BaseTextInputModel from '../../atoms/input/text/BaseTextInputModel';
import BaseLabelModel from '../../atoms/input/BaseLabelModel';
import BaseHeaderModel from '../../atoms/typography/header/BaseHeaderModel';
import BaseParagraphModel from '../../atoms/typography/paragraph/BaseParagraphModel';

export const header: BaseHeaderModel = new BaseHeaderModel('Connexion').setDisplaySizeOrTrowError(
	'xxxl'
);

export const errorParagraph: BaseParagraphModel = new BaseParagraphModel('').setColorOrTrowError(
	'danger'
);

export const pageStates: object = {
	normal: '',
	loginFailed: "L'email ou le mot de passe est invalide.",
	cookieFailed: 'Une erreur est survenue, veuillez réessayer plus tard'
};

const emailLabel: BaseLabelModel = new BaseLabelModel('Email', 'email');
let email: BaseTextInputModel = new BaseTextInputModel('email');
email.type = 'email';
email.required = true;
email.minlength = 6;
email.errorMessage = "L'email est invalide";

const passwordLabel: BaseLabelModel = new BaseLabelModel('Mot de passe', 'password');
let password: BaseTextInputModel = new BaseTextInputModel('password');
password.type = 'password';
password.required = true;
password.minlength = 6;
password.errorMessage = 'Le mot de passe est invalide';

let loginButton: BaseButtonModel = new BaseButtonModel('Se connecter').setStyleOrThrowError(
	'success'
);

export const formElements: object = {
	emailLabel: emailLabel,
	emailInput: email,
	passwordLabel: passwordLabel,
	passwordInput: password,
	loginButton: loginButton
};
