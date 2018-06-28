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
        autoIncrement: false, // automatically increment the value
    },
    MeetPath: Sequelize.STRING,
    Federation: Sequelize.STRING,
    Date: Sequelize.DATEONLY,
    MeetCountry: Sequelize.STRING,
    MeetState: Sequelize.STRING,
    MeetTown: Sequelize.TEXT,
    MeetName: Sequelize.TEXT
},
    {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
    });

//define competitors module
var competitors = sequelize.define("Competitors", {
    MeetID: Sequelize.INTEGER,
    Name: Sequelize.STRING,
    Sex: Sequelize.CHAR,
    Equipment: Sequelize.STRING,
    Age: Sequelize.INTEGER,
    Division: Sequelize.STRING,
    BodyweightKg: Sequelize.FLOAT,
    WeightClassKg: Sequelize.STRING,
    Squat4Kg: Sequelize.FLOAT,
    BestSquatKg: Sequelize.FLOAT,
    Bench4Kg: Sequelize.FLOAT,
    BestBenchKg: Sequelize.FLOAT,
    Deadlift4Kg: Sequelize.FLOAT,
    BestDeadlift: Sequelize.FLOAT,
    TotalKg: Sequelize.FLOAT,
    Place: Sequelize.STRING,
    Wilks: Sequelize.FLOAT
}, {
        createdAt: false,
        updatedAt: false
    })

//set foreignkey
meets.hasMany(competitors, {
    foreignKey: "MeetID",
    constraints: false
});

var meetObjs = [];
var competitorObjs = [];

//  Extract meets data to meetObjs
//  confirm connection...
sequelize.authenticate().then(() => {
    console.log("Data base connection established")
}).then(() => {

    //  read contents of file...
    fs.readFile(path.join(__dirname, "/data/meets.csv"), "utf-8", (err, data) => {
        if (err) {
            console.log(err);
        } else {

            //  begin parsing data...
            Papa.parse(data, {
                delimiter: ',',
                newline: '\n',
                complete: function (results) {

                    //  push to meetObjs array
                    for (let i = 1; i < results.data.length - 1; i++) {   //NOTE: Last element extracted is NaN. Look more into this.

                        meetObjs.push({
                            MeetID: results.data[i][0],
                            MeetPath: results.data[i][1],
                            Federation: results.data[i][2],
                            Date: results.data[i][3],
                            MeetCountry: results.data[i][4],
                            MeetState: results.data[i][5],
                            MeetTown: results.data[i][6],
                            MeetName: results.data[i][7]
                        })
                    }




                    //  read contents of file...
                    fs.readFile(path.join(__dirname, "/data/openpowerlifting.csv"), "utf-8", (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {

                            //  begin parsing data...
                            Papa.parse(data, {
                                delimiter: ',',
                                newline: '\n',
                                complete: function (results) {

                                    //  push to meetObjs array
                                    for (let i = 1; i < results.data.length - 1; i++) {   //NOTE: Last element extracted is NaN. Look more into this.

                                        competitorObjs.push({
                                            MeetID: Number(results.data[i][0]),
                                            Name: results.data[i][1],
                                            Sex: results.data[i][2],
                                            Equipment: results.data[i][3],
                                            Age: Number(results.data[i][4]),
                                            Division: results.data[i][5],
                                            BodyweightKg: Number(results.data[i][6]),
                                            WeightClassKg: results.data[i][7],
                                            Squat4Kg: Number(results.data[i][8]),
                                            BestSquatKg: Number(results.data[i][9]),
                                            Bench4Kg: Number(results.data[i][10]),
                                            BestBenchKg: Number(results.data[i][11]),
                                            Deadlift4Kg: Number(results.data[i][12]),
                                            BestDeadlift: Number(results.data[i][13]),
                                            TotalKg: Number(results.data[i][14]),
                                            Place: results.data[i][15],
                                            Wilks: Number(results.data[i][16])
                                        })
                                    }

                                    sequelize.sync().then(() => {
                                        meets.bulkCreate(meetObjs).then(() => {
                                            competitors.bulkCreate(competitorObjs).then(() => {
                                                console.log("Competitors created!");
                                            }).catch("Competitors creation failed!")
                                        }).then(() => {
                                            console.log("Meets created!");
                                        }).catch(() => {
                                            console.log("Meets creation failed!");
                                        })
                                    })
                                }
                            });
                        }
                    });
                }
            });
        }
    });


}).catch(() => {
    console.log("Something went wrong trying to connect to the DB");
});