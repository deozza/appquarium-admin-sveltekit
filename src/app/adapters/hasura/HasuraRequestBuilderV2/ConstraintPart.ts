export default class ConstraintPart {
	constraintName: string;
	constraints: Array<object> | string;

	constructor(constraintName: string) {
		this.constraintName = constraintName;
		this.constraints = [];
	}

	addConstraint(constraints: Array<object> | string): ConstraintPart {
		this.constraints = constraints;

		return this;
	}

	buildConstraintsAsGQLString(whereObject: object): string {
		let constraintAsGQLString: string = '';

		constraintAsGQLString += whereObject['constraintName'] + ': ';

		if (Array.isArray(whereObject['constraints'])) {
			whereObject['constraints'].forEach((subWhere: object, index: number) => {
				if (index < 1) {
					constraintAsGQLString += '{ ';
				} else {
					constraintAsGQLString += ', ';
				}

				constraintAsGQLString += this.buildConstraintsAsGQLString(subWhere);
				if (index === whereObject['constraints'].length - 1) {
					constraintAsGQLString += ' }';
				}
			});
		} else {
			constraintAsGQLString += whereObject['constraints'];
		}

		return constraintAsGQLString;
	}
}
