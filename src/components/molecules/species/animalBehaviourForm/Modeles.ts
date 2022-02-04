import BaseButtonModel from "../../../atoms/button/BaseButtonModel";
import BaseNumberInputModel from "../../../atoms/input/number/BaseNumberInputModel";
import BaseLabelModel from "../../../atoms/input/BaseLabelModel";
import BaseSelectInputModel from '../../../atoms/input/select/BaseSelectInputModel';

const alimentationLabel: BaseLabelModel = new BaseLabelModel("Alimentation", 'alimentation')

const animalZoneLabel: BaseLabelModel = new BaseLabelModel("Dans la zone", 'zoneLabel')

const aquariumKindLabel: BaseLabelModel = new BaseLabelModel("Type d'aquarium", 'aquariumKind')
const aquariumKindInput: BaseSelectInputModel = new BaseSelectInputModel('aquariumKind')
aquariumKindInput.required = true

const intraspecificBehaviourLabel: BaseLabelModel = new BaseLabelModel("Comportement intraspécifique", 'intraspecificBehaviour')
const intraspecificBehaviourInput: BaseSelectInputModel = new BaseSelectInputModel('intraspecificBehaviour')
intraspecificBehaviourInput.required = true

const extraspecificBehaviourLabel: BaseLabelModel = new BaseLabelModel("Comportement extraspécifique", 'extraspecificBehaviour')
const extraspecificBehaviourInput: BaseSelectInputModel = new BaseSelectInputModel('extraspecificBehaviour')
extraspecificBehaviourInput.required = true

const femalePerMaleLabel: BaseLabelModel = new BaseLabelModel("Nombre de femelles par male", 'femalePerMale')
const femalePerMaleInput: BaseNumberInputModel = new BaseNumberInputModel('femalePerMale')

const minGroupLabel: BaseLabelModel = new BaseLabelModel("Groupe minimum", 'minGroup')
const minGroupInput: BaseNumberInputModel = new BaseNumberInputModel('minGroup')
minGroupInput.required = true
minGroupInput.min = 0

const maxGroupLabel: BaseLabelModel = new BaseLabelModel("Groupe maximum", 'maxGroup')
const maxGroupInput: BaseNumberInputModel = new BaseNumberInputModel('maxGroup')

const diurnalLabel: BaseLabelModel = new BaseLabelModel("Est actif", 'diurnal')

let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter')

export const formElements: object = {
    aquariumKindLabel: aquariumKindLabel,
    aquariumKindInput: aquariumKindInput,
    intraspecificBehaviourLabel: intraspecificBehaviourLabel,
    intraspecificBehaviourInput: intraspecificBehaviourInput,
    extraspecificBehaviourLabel: extraspecificBehaviourLabel,
    extraspecificBehaviourInput: extraspecificBehaviourInput,
    femalePerMaleLabel: femalePerMaleLabel,
    femalePerMaleInput: femalePerMaleInput,
    minGroupLabel: minGroupLabel,
    minGroupInput: minGroupInput,
    maxGroupLabel: maxGroupLabel,
    maxGroupInput: maxGroupInput,
    diurnalLabel: diurnalLabel,
    animalZoneLabel: animalZoneLabel,
    alimentationLabel: alimentationLabel,
    submitButton: submitButton
}