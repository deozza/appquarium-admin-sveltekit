import BaseButtonModel from '../../../atoms/button/BaseButtonModel';
import BaseNumberInputModel from '../../../atoms/input/number/BaseNumberInputModel';
import BaseLabelModel from '../../../atoms/input/BaseLabelModel';

const phMinLabel: BaseLabelModel = new BaseLabelModel('pH minimum', 'phMin');
const phMinInput: BaseNumberInputModel = new BaseNumberInputModel('phMin');
phMinInput.required = true;
phMinInput.min = 0;
phMinInput.max = 14;
phMinInput.step = 0.1;
phMinInput.errorMessage = 'Cette valeur doit etre inférieure au pH maximum';

const phMaxLabel: BaseLabelModel = new BaseLabelModel('pH maximum', 'phMax');
const phMaxInput: BaseNumberInputModel = new BaseNumberInputModel('phMax');
phMaxInput.required = true;
phMaxInput.min = 0;
phMaxInput.max = 14;
phMaxInput.step = 0.1;
phMaxInput.errorMessage = 'Cette valeur doit etre supérieure au pH minimum';

const ghMinLabel: BaseLabelModel = new BaseLabelModel('GH minimum', 'ghMin');
const ghMinInput: BaseNumberInputModel = new BaseNumberInputModel('ghMin');
ghMinInput.required = true;
ghMinInput.min = 0;
ghMinInput.max = 50;
ghMinInput.step = 1;
ghMinInput.errorMessage = 'Cette valeur doit etre inférieure au GH maximum';

const ghMaxLabel: BaseLabelModel = new BaseLabelModel('GH maximum', 'ghMax');
const ghMaxInput: BaseNumberInputModel = new BaseNumberInputModel('ghMax');
ghMaxInput.required = true;
ghMaxInput.min = 0;
ghMaxInput.max = 50;
ghMaxInput.step = 1;
ghMaxInput.errorMessage = 'Cette valeur doit etre supérieure au GH minimum';

const tempMinLabel: BaseLabelModel = new BaseLabelModel('Température minimum', 'tempMin');
const tempMinInput: BaseNumberInputModel = new BaseNumberInputModel('tempMin');
tempMinInput.required = true;
tempMinInput.min = 10;
tempMinInput.max = 35;
tempMinInput.step = 1;
tempMinInput.errorMessage = 'Cette valeur doit etre inférieure à la température maximum';

const tempMaxLabel: BaseLabelModel = new BaseLabelModel('Température maximum', 'tempMax');
const tempMaxInput: BaseNumberInputModel = new BaseNumberInputModel('tempMax');
tempMaxInput.required = true;
tempMaxInput.min = 10;
tempMaxInput.max = 35;
tempMaxInput.step = 1;
tempMaxInput.errorMessage = 'Cette valeur doit etre supérieure à la température minimum';

let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter');

export const formElements: object = {
	phMinLabel: phMinLabel,
	phMinInput: phMinInput,
	phMaxLabel: phMaxLabel,
	phMaxInput: phMaxInput,
	ghMinLabel: ghMinLabel,
	ghMinInput: ghMinInput,
	ghMaxLabel: ghMaxLabel,
	ghMaxInput: ghMaxInput,
	tempMinLabel: tempMinLabel,
	tempMinInput: tempMinInput,
	tempMaxLabel: tempMaxLabel,
	tempMaxInput: tempMaxInput,
	submitButton: submitButton
};
