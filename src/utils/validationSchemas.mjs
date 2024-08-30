export const createUserValidationSchema = {
	username: {
		isLength: {
			options: {
				min: 5,
				max: 32,
			},
			errorMessage:
				"Username must be at least 5 characters with a max of 32 characters",
		},
		notEmpty: {
			errorMessage: "Username cannot be empty",
		},
		isString: {
			errorMessage: "Username must be a string!",
		},
	},
	//this one is optional if you have any or added inputs...
	// displayName: {
	// 	notEmpty: true,
	// },
	password: {
		notEmpty: true,
	},
};
