import BaseButtonModel from "../../../atoms/button/BaseButtonModel";

const prePublishButton: BaseButtonModel = new BaseButtonModel('Pré-publier')
prePublishButton.setStyleOrThrowError('info')
prePublishButton.setTypeOrThrowError('button')
prePublishButton.event = 'PRE_PUBLISHED'

const publishButton: BaseButtonModel = new BaseButtonModel('Publier')
publishButton.setStyleOrThrowError('success')
publishButton.setTypeOrThrowError('button')
publishButton.event = 'PUBLISHED'

const moderateButton: BaseButtonModel = new BaseButtonModel('Modérer')
moderateButton.setStyleOrThrowError('warning')
moderateButton.setTypeOrThrowError('button')
moderateButton.event = 'MODERATED'

const archiveButton: BaseButtonModel = new BaseButtonModel('Archiver')
archiveButton.setStyleOrThrowError('secondary')
archiveButton.setTypeOrThrowError('button')
archiveButton.event = 'ARCHIVED'

const deleteButton: BaseButtonModel = new BaseButtonModel('Supprimer')
deleteButton.setStyleOrThrowError('danger')
deleteButton.setTypeOrThrowError('button')
deleteButton.event = 'DELETE'

export const possibleNextStates: object = {
    DRAFT: [prePublishButton, archiveButton],
    PRE_PUBLISHED: [publishButton, moderateButton],
    PUBLISHED: [moderateButton],
    MODERATED: [publishButton, archiveButton],
    ARCHIVED: [moderateButton, deleteButton],
}