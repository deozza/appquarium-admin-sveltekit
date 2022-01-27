import BaseHeaderModel from '../../../atoms/typography/header/BaseHeaderModel';
import BasePillModel from '../../../atoms/pill/BasePillModel';

export const header: BaseHeaderModel = new BaseHeaderModel('Chargement ...')
	.setDisplaySizeOrTrowError('xxxl')
	.setSizeOrTrowError('h1')

export const statusPill: BasePillModel = new BasePillModel('')

export const generalFormHeader: BaseHeaderModel = new BaseHeaderModel('Infos générales')
	.setDisplaySizeOrTrowError('xxl')
	.setSizeOrTrowError('h2')

export const namingFormHeader: BaseHeaderModel = new BaseHeaderModel('Nom')
	.setDisplaySizeOrTrowError('xxl')
	.setSizeOrTrowError('h2')

export const waterConstraintsFormHeader: BaseHeaderModel = new BaseHeaderModel("Contraintes d'eau")
	.setDisplaySizeOrTrowError('xxl')
	.setSizeOrTrowError('h2')

export const specsFormHeader: BaseHeaderModel = new BaseHeaderModel("Caractéristiques")
	.setDisplaySizeOrTrowError('xxl')
	.setSizeOrTrowError('h2')

export const imageFormHeader: BaseHeaderModel = new BaseHeaderModel("Images")
	.setDisplaySizeOrTrowError('xxl')
	.setSizeOrTrowError('h2')