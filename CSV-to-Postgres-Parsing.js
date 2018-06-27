const Sequelize = require("sequelize");
const Papa = require("papaparse");
const path = require("path");
const fs = require("fs");

var sequelize = new Sequelize("d1vim7b4unbma2", "xoodphxejlrsfa", "af2cfa0b2b45b19734d5a278f0985483c9af3bd44e2578b88fab8e3063a70853", {
    host: "ec2-54-83-12-150.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl: true
    }
})

//  define a meets module
var meets = sequelize.define("Meets", {
        MeetID: {
            type: Sequelize.INTEGER,
            primaryKey: true, // use "project_id" as a primary key
            autoIncrement: false // automatically increment the value
        },
            MeetPath: Sequelize.STRING,
            Federation: Sequelize.STRING,
            Date: Sequelize.DATE,
            MeetCountry: Sequelize.STRING,
            MeetState: Sequelize.STRING,
            MeetTown: Sequelize.TEXT,
            MeetName: Sequelize.TEXT
        },
{
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

//  confirm connection...
sequelize.authenticate().then(() => {
    console.log("Data base connection established")
}).then(() => {
    //  read contents of file...
    fs.readFile(path.join(__dirname, "/data/meets.csv"), "utf-8", (err, data) => {
        if(err){
            console.log(err);
        } else{

            //  begin parsing data...
            Papa.parse(data, {
                delimiter: ',',
                newline: '\n',
                complete: function(results){                    
                    //Sync new data...
                    sequelize.sync().then(() => {
                        //  create and insert each element after the first element...

                        var meetObjs = [];                        
                        
                        for(let i = 1; i < results.data.length - 1; i++){   //NOTE: Last element extracted is NaN. Look more into this.

                            meetObjs.push({                            
                                MeetID: parseInt(results.data[i][0]),
                                MeetPath: results.data[i][1],
                                Federation: results.data[i][2],
                                Date: results.data[i][3],
                                MeetCountry: results.data[i][4],
                                MeetState: results.data[i][5],
                                MeetTown: results.data[i][6],
                                MeetName: results.data[i][7]
                            })
                        }

                        //push all formatted objects to DB...
                        meets.bulkCreate(meetObjs).then(() => {
                            console.log("Bulk creation Successful");
                        }).catch(err => {
                            console.log(`Error: ${err}`);
                        });
                        
                    });
                }
            });
        }
    });


}).catch(() => {
    console.log("Something went wrong trying to connect to the DB");
})
