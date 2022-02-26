import BaseHeaderModel from '../../../../atoms/typography/header/BaseHeaderModel';
import BaseButtonModel from '../../../../atoms/button/BaseButtonModel';

export const header: BaseHeaderModel = new BaseHeaderModel('Dashboard plantes')
	.setDisplaySizeOrTrowError('xxxl')
	.setSizeOrTrowError('h1');

export const addPlantButton: BaseButtonModel = new BaseButtonModel('Ajouter une plante')
	.setTypeOrThrowError('button')
	.setStyleOrThrowError('success');
