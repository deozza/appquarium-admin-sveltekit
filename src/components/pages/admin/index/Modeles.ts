import BaseHeaderModel from "../../../atoms/typography/header/BaseHeaderModel";
import BaseButtonModel from "../../../atoms/button/BaseButtonModel";

export const header: BaseHeaderModel = new BaseHeaderModel('Dashboard espèces')
    .setDisplaySizeOrTrowError('xxxl')
    .setSizeOrTrowError('h1')

const addFishButton: BaseButtonModel = new BaseButtonModel('Ajouter un poisson')
    .setTypeOrThrowError('button')
    .setStyleOrThrowError('primary')

const addPlantButton: BaseButtonModel = new BaseButtonModel('Ajouter une plante')
    .setTypeOrThrowError('button')
    .setStyleOrThrowError('success')

const addInvertebrateButton: BaseButtonModel = new BaseButtonModel('Ajouter un invertébré')
    .setTypeOrThrowError('button')
    .setStyleOrThrowError('warning')


export const buttonsAdd: Array<object> =[
    {
        modele: addFishButton,
        link : "/admin/species/fishes/add"
    },
    {
        modele: addPlantButton,
        link: "/admin/species/plants/add"
    },
    {
        modele: addInvertebrateButton,
        link: "/admin/species/invertebrates/add"
    }
]

