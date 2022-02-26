import BaseButtonModel from '../../../atoms/button/BaseButtonModel';
import BaseNumberInputModel from '../../../atoms/input/number/BaseNumberInputModel';
import BaseLabelModel from '../../../atoms/input/BaseLabelModel';
import BaseSelectInputModel from '../../../atoms/input/select/BaseSelectInputModel';

const minVolumeLabel: BaseLabelModel = new BaseLabelModel('Volume minimal (L)', 'minVolume');
const minVolumeInput: BaseNumberInputModel = new BaseNumberInputModel('minVolume');
minVolumeInput.min = 1;
minVolumeInput.required = true;

const maxVolumeLabel: BaseLabelModel = new BaseLabelModel('Volume maximal (L)', 'maxVolume');
const maxVolumeInput: BaseNumberInputModel = new BaseNumberInputModel('maxVolume');

const minLengthLabel: BaseLabelModel = new BaseLabelModel('Longueur minimale (cm)', 'minLength');
const minLengthInput: BaseNumberInputModel = new BaseNumberInputModel('minLength');

const maxHeightLabel: BaseLabelModel = new BaseLabelModel('Hauteur maximale (cm)', 'maxHeight');
const maxHeightInput: BaseNumberInputModel = new BaseNumberInputModel('maxHeight');

const soilKindLabel: BaseLabelModel = new BaseLabelModel('Type de sol', 'soilKind');
const soilKindInput: BaseSelectInputModel = new BaseSelectInputModel('soilKind');

const decorLabel: BaseLabelModel = new BaseLabelModel('Décor', 'decor');

let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter');

export const formElements: object = {
	minVolumeLabel: minVolumeLabel,
	minVolumeInput: minVolumeInput,
	maxVolumeLabel: maxVolumeLabel,
	maxVolumeInput: maxVolumeInput,
	minLengthLabel: minLengthLabel,
	minLengthInput: minLengthInput,
	maxHeightLabel: maxHeightLabel,
	maxHeightInput: maxHeightInput,
	soilKindLabel: soilKindLabel,
	soilKindInput: soilKindInput,
	decorLabel: decorLabel,
	submitButton: submitButton
};
