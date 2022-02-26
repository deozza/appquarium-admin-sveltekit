import BaseButtonModel from '../../../atoms/button/BaseButtonModel';
import BaseLabelModel from '../../../atoms/input/BaseLabelModel';
import BaseTextInputModel from '../../../atoms/input/text/BaseTextInputModel';

const originLabel: BaseLabelModel = new BaseLabelModel('Origine', 'origin');
const originInput: BaseTextInputModel = new BaseTextInputModel('origin');
originInput.datalist = 'originInput-list';
originInput.required = true;

let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter');

export const formElements: object = {
	originLabel: originLabel,
	originInput: originInput,
	submitButton: submitButton
};
