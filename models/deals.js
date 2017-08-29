module.exports = function(sequelize, DataTypes) {
	var Deals = sequelize.define("Deals", {
		// deal tittle string
		tittle: {
			type: DataTypes.STRING,
    	 	allowNull: false,
      		validate: {
      	 	len: [1-25]
     	 	}
		},
		body: {
			type: DataTypes.STRING,
			allowNull: false
		},
		category: {
			type: DataTypes.STRING,
    	 	allowNull: false,
      		validate: {
      	 	len: [1-25]
     	 	}
		},
		daysAvailable: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1-15]
			}
		},
		dealStart: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1-8]
			}	
		},
		dealEnd: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1-8]
			}	
		}
	});
	 Deals.associate = function(models) {
	 	// Associating Business with deals
   		 // When a Business is deleted, also delete any associated deals
	 	Deals.belongsTo(models.Business, {
	 		foreignKey: {
     	  	allowNull: false
     		}
	 	});
	 };

	 return Deals;
};