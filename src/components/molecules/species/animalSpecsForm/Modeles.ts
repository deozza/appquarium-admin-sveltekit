import BaseButtonModel from '../../../atoms/button/BaseButtonModel';
import BaseNumberInputModel from '../../../atoms/input/number/BaseNumberInputModel';
import BaseLabelModel from '../../../atoms/input/BaseLabelModel';

const maleSizeLabel: BaseLabelModel = new BaseLabelModel('Taille du male (cm)', 'maleSize');
const maleSizeInput: BaseNumberInputModel = new BaseNumberInputModel('maleSize');
maleSizeInput.required = true;
maleSizeInput.min = 0;
maleSizeInput.step = 0.1;

const femaleSizeLabel: BaseLabelModel = new BaseLabelModel(
	'Taille de la femelle (cm)',
	'femaleSize'
);
const femaleSizeInput: BaseNumberInputModel = new BaseNumberInputModel('femaleSize');
femaleSizeInput.required = true;
femaleSizeInput.min = 0;
femaleSizeInput.step = 0.1;

const longevityLabel: BaseLabelModel = new BaseLabelModel('Longévité (années)', 'longevity');
const longevityInput: BaseNumberInputModel = new BaseNumberInputModel('longevity');
longevityInput.required = true;
longevityInput.min = 0;
longevityInput.step = 1;

let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter');

export const formElements: object = {
	maleSizeLabel: maleSizeLabel,
	maleSizeInput: maleSizeInput,
	femaleSizeLabel: femaleSizeLabel,
	femaleSizeInput: femaleSizeInput,
	longevityLabel: longevityLabel,
	longevityInput: longevityInput,
	submitButton: submitButton
};
