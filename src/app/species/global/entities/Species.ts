import SpeciesNaming from "./SpeciesNaming";
import WaterConstraints from "./WaterConstraints";
import AnimalSpecs from "./AnimalSpecs";
import InvalidSpeciesObjectError from "../../../../errors/app/species/global/entities/InvalidSpeciesObjectError";
import UnexpectedSpeciesPublicationStateError
  from "../../../../errors/app/species/global/entities/UnexpectedSpeciesPublicationStateError";
import Image from "../../../file/entities/Image";

export default class Species {
  uuid: string
  created_at: Date
  updated_at: Date
  user: string
  species_naming: SpeciesNaming
  water_constraint: WaterConstraints
  animal_specs: AnimalSpecs
  origin: string
  publication_state: string
  category: string
  images: Array<Image>

  constructor(species: Array<string>) {
    this.uuid = species.hasOwnProperty('uuid') ? species['uuid'] : ''
    this.created_at = species.hasOwnProperty('created_at') ? new Date(species['created_at']) : new Date()
    this.updated_at = species.hasOwnProperty('updated_at') ? new Date(species['updated_at']) : new Date()
    this.user = species.hasOwnProperty('user') ? species['user'] : ''
    this.species_naming = species.hasOwnProperty('species_naming') && species['species_naming'] !== null ? new SpeciesNaming(species['species_naming']) : new SpeciesNaming([])
    this.water_constraint = species.hasOwnProperty('water_constraint') && species['water_constraint'] !== null ? new WaterConstraints(species['water_constraint']) : new WaterConstraints([])
    this.animal_specs = species.hasOwnProperty('animal_specs') && species['animal_specs'] !== null ? new AnimalSpecs(species['animal_specs']) : new AnimalSpecs([])
    this.origin = species.hasOwnProperty('origin') ? species['origin'] : ''
    this.publication_state = species.hasOwnProperty('publication_state') ? species['publication_state'] : ''
    this.category = species.hasOwnProperty('category') ? species['category'] : ''
    this.images = []
  }

  toJSON() {
    return {...this} // here I make a POJO's copy of the class instance
  }

  public computeLinkToSpecies(): string {
    if (this.category === '' || this.uuid === '') {
      throw new InvalidSpeciesObjectError()
    }

    return '/species/' + this.category + '/' + this.uuid
  }

  public computeName(): string {
    if (this.species_naming.species_genre.name === '' || this.species_naming.name === '') {
      return 'NA'
    }

    return this.species_naming.species_genre?.name + " " + this.species_naming.name
  }

  public getPublicationStateStyle(): string {

    if (this.publication_state === '') {
      throw new InvalidSpeciesObjectError()
    }

    const publicationStateStyle: object = {
      'DRAFT': 'secondary',
      'PRE_PUBLISHED': 'info',
      'MODERATED': 'warning',
      'PUBLISHED': 'success',
      'ARCHIVED': 'secondary',
    }

    if (!publicationStateStyle.hasOwnProperty(this.publication_state)) {
      throw new UnexpectedSpeciesPublicationStateError(this.publication_state)
    }

    return publicationStateStyle[this.publication_state]
  }

  public getPublicationStateContent(): string {

    if (this.publication_state === '') {
      throw new InvalidSpeciesObjectError()
    }

    const publicationStateContent: object = {
      'DRAFT': 'brouillon',
      'PRE_PUBLISHED': 'pré-publié',
      'MODERATED': 'modéré',
      'PUBLISHED': 'publié',
      'ARCHIVED': 'archivé',
    }

    if (!publicationStateContent.hasOwnProperty(this.publication_state)) {
      throw new UnexpectedSpeciesPublicationStateError(this.publication_state)
    }

    return publicationStateContent[this.publication_state]
  }
}
