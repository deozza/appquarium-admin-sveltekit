import BaseButtonModel from "../../../../atoms/button/BaseButtonModel";
import BaseHeaderModel from "../../../../atoms/typography/header/BaseHeaderModel";
import BaseTextInputModel from "../../../../atoms/input/text/BaseTextInputModel";
import BaseLabelModel from "../../../../atoms/input/BaseLabelModel";

export const header: BaseHeaderModel = new BaseHeaderModel("Ajouter une espèce de poisson")

const speciesNameLabel: BaseLabelModel = new BaseLabelModel("Nom de l'espèce", 'speciesName')
const speciesNameInput: BaseTextInputModel = new BaseTextInputModel('speciesName')
speciesNameInput.required = true

const speciesGenreLabel: BaseLabelModel = new BaseLabelModel("Genre", 'speciesGenre')
const speciesGenreInput: BaseTextInputModel = new BaseTextInputModel('speciesGenre')
speciesGenreInput.datalist = 'speciesGenre-list'
speciesGenreInput.required = true

const speciesFamilyLabel: BaseLabelModel = new BaseLabelModel("Famille", 'speciesFamily')
const speciesFamilyInput: BaseTextInputModel = new BaseTextInputModel('speciesFamily')
speciesFamilyInput.datalist = 'speciesFamily-list'
speciesFamilyInput.required = true

const speciesCommonNamesLabel: BaseLabelModel = new BaseLabelModel("Noms communs", 'speciesCommonNames')
const speciesCommonNamesInput: BaseTextInputModel = new BaseTextInputModel('speciesCommonNames')

const speciesOldNamesLabel: BaseLabelModel = new BaseLabelModel("Anciens noms", 'speciesOldNames')
const speciesOldNamesInput: BaseTextInputModel = new BaseTextInputModel('speciesOldNames')

let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter')

export const formElements: object = {
    speciesNameLabel: speciesNameLabel,
    speciesNameInput: speciesNameInput,
    speciesGenreLabel: speciesGenreLabel,
    speciesGenreInput: speciesGenreInput,
    speciesFamilyLabel: speciesFamilyLabel,
    speciesFamilyInput: speciesFamilyInput,
    speciesCommonNamesLabel: speciesCommonNamesLabel,
    speciesCommonNamesInput: speciesCommonNamesInput,
    speciesOldNamesLabel: speciesOldNamesLabel,
    speciesOldNamesInput: speciesOldNamesInput,
    submitButton: submitButton
}