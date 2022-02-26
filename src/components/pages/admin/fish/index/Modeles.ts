import BaseHeaderModel from '../../../../atoms/typography/header/BaseHeaderModel';
import BaseButtonModel from '../../../../atoms/button/BaseButtonModel';

export const header: BaseHeaderModel = new BaseHeaderModel('Dashboard poissons')
	.setDisplaySizeOrTrowError('xxxl')
	.setSizeOrTrowError('h1');

export const addFishButton: BaseButtonModel = new BaseButtonModel('Ajouter un poisson')
	.setTypeOrThrowError('button')
	.setStyleOrThrowError('primary');
