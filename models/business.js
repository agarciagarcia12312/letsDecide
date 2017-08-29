module.exports = function(sequelize, DataTypes) {
	var Business = sequelize.define("Business", {
		// Busines name string
		businessName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len:[2-40]
			}
		},
		contactName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len:[2-30]
			}
		},
		email: {
			type:DataTypes.STRING,
			allowNull:false,
			validate: {
				isEmail: true
			}
		},

		// password string
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len:[6-10]
			}
		},
		webLink: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len:[2-40]
			}
		},

		// general description string
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		streetAddress: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len:[2-20]
			}
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len:[2-20]
			}
		},
		state: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len:[2-20]
			}
		},

		zipCode: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len:[2-20]
			}
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len:[2-20]
			}
		},

		// link to photo string
		photoLink: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
	 Business.associate = function(models) {
	 	// Associating Business with deals
   		 // When a Business is deleted, also delete any associated deals
	 	Business.hasMany(models.Deals, {
	 		onDelete: "cascade"
	 	});
	 };

	 return Business;
};