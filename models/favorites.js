module.exports = function(sequelize, DataTypes) {
	var Favorites = sequelize.define("Favorites", {
		// favorites
		imageLink: {
			type: DataTypes.STRING,
			allowNul:false
		},
		name:  {
			type: DataTypes.STRING,
    	 	allowNull: false,
		},
		rating: {
			type: DataTypes.STRING,
			allowNull: false
		},
		price: {
			type: DataTypes.STRING,
			allowNull: false
		},
		street: {
			type: DataTypes.STRING,
			allowNull: false
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false
		},
		state: {
			type: DataTypes.STRING,
			allowNull: false
		},
		phoneNumber: {
			type: DataTypes.STRING,
			allowNull: false
		}	
	});
	 Favorites.associate = function(models) {
	 	// Associating Business with deals
   		 // When a Business is deleted, also delete any associated deals
	 	Favorites.belongsTo(models.Users, {
	 		foreignKey: {
     	  	allowNull: false
     		}
	 	});
	 };

	 return Favorites;
};