import BaseButtonModel from '../../../atoms/button/BaseButtonModel';
import BaseLabelModel from '../../../atoms/input/BaseLabelModel';
import BaseFileInputModel from '../../../atoms/input/file/BaseFileInputModel';
import BaseTextInputModel from '../../../atoms/input/text/BaseTextInputModel';

const newFileToUploadLabel: BaseLabelModel = new BaseLabelModel('Image', 'newFileToUpload');
const newFileToUploadInput: BaseFileInputModel = new BaseFileInputModel('newFileToUpload');
newFileToUploadInput.required = true;
newFileToUploadInput.accept = ['image/png', 'image/jpeg', 'image/jpg'];

const newFileTitleLabel: BaseLabelModel = new BaseLabelModel('Titre', 'newFileTitle');
const newFileTitleInput: BaseTextInputModel = new BaseTextInputModel('newFileTitle');
newFileTitleInput.required = true;

const newFileSourceLabel: BaseLabelModel = new BaseLabelModel('Source', 'newFileSource');
const newFileSourceInput: BaseTextInputModel = new BaseTextInputModel('newFileSource');
newFileSourceInput.required = true;

const updateFileTitleLabel: BaseLabelModel = new BaseLabelModel('Titre', 'updateFileTitleLabel');
const updateFileThumbnailLabel: BaseLabelModel = new BaseLabelModel(
	'Thumbnail',
	'updateFileThumbnailLabel'
);

let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter');

let updateButton: BaseButtonModel = new BaseButtonModel('Modifier');
updateButton.setTypeOrThrowError('button');
updateButton.setStyleOrThrowError('warning');

let deleteButton: BaseButtonModel = new BaseButtonModel('Supprimer');
deleteButton.setTypeOrThrowError('button');
deleteButton.setStyleOrThrowError('danger');

export const formElements: object = {
	newFileToUploadLabel: newFileToUploadLabel,
	newFileToUploadInput: newFileToUploadInput,
	newFileTitleLabel: newFileTitleLabel,
	newFileTitleInput: newFileTitleInput,
	newFileSourceLabel: newFileSourceLabel,
	newFileSourceInput: newFileSourceInput,
	updateFileTitleLabel: updateFileTitleLabel,
	updateFileThumbnailLabel: updateFileThumbnailLabel,
	submitButton: submitButton,
	updateButton: updateButton,
	deleteButton: deleteButton
};
