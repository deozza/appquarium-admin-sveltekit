import BaseHeaderModel from "../../../../atoms/typography/header/BaseHeaderModel";
import BaseButtonModel from "../../../../atoms/button/BaseButtonModel";

export const header: BaseHeaderModel = new BaseHeaderModel('Dashboard invertébrés')
    .setDisplaySizeOrTrowError('xxxl')
    .setSizeOrTrowError('h1')

export const addInvertebrateButton: BaseButtonModel = new BaseButtonModel('Ajouter un invertébré')
    .setTypeOrThrowError('button')
    .setStyleOrThrowError('warning')