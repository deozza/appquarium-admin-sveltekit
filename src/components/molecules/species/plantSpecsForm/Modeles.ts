import BaseButtonModel from "../../../atoms/button/BaseButtonModel";
import BaseNumberInputModel from "../../../atoms/input/number/BaseNumberInputModel";
import BaseLabelModel from "../../../atoms/input/BaseLabelModel";
import BaseSelectInputModel from '../../../atoms/input/select/BaseSelectInputModel';

const sizeLabel: BaseLabelModel = new BaseLabelModel("Taille maximale (cm)", 'size')
const sizeInput: BaseNumberInputModel = new BaseNumberInputModel('size')
sizeInput.required = true
sizeInput.min = 0

const zoneLabel: BaseLabelModel = new BaseLabelModel("Zone de plantation", 'zone')
const zoneInput: BaseSelectInputModel = new BaseSelectInputModel('zone')
zoneInput.required = true

const growthSpeedLabel: BaseLabelModel = new BaseLabelModel("Croissance", 'growthSpeed')
const growthSpeedInput: BaseSelectInputModel = new BaseSelectInputModel('growthSpeed')
growthSpeedInput.required = true

const needInFertilizerLabel: BaseLabelModel = new BaseLabelModel("Besoin d'un fertilizant ?", 'needInFertilizer')

const needInCarboneLabel: BaseLabelModel = new BaseLabelModel("Besoin de CO2 ?", 'needInCarbone')

let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter')

export const formElements: object = {
    sizeLabel: sizeLabel,
    sizeInput: sizeInput,
    zoneLabel: zoneLabel,
    zoneInput: zoneInput,
    growthSpeedLabel: growthSpeedLabel,
    growthSpeedInput: growthSpeedInput,
    needInFertilizerLabel: needInFertilizerLabel,
    needInCarboneLabel: needInCarboneLabel,
    submitButton: submitButton
}