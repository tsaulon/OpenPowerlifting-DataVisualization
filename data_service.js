const Papa = require("papaparse");
const path = require("path");
const fs = require("fs");
const Sequelize = require("sequelize");

var competitors = new Set();

var sequelize = new Sequelize("d1vim7b4unbma2", "xoodphxejlrsfa", "af2cfa0b2b45b19734d5a278f0985483c9af3bd44e2578b88fab8e3063a70853", {
    host: "ec2-54-83-12-150.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl: true
    }
})

//  define a meets module
var Meets = sequelize.define("Meets", {
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
var Competitors = sequelize.define("Competitors", {
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
Meets.hasMany(Competitors, {
    foreignKey: "MeetID",
    constraints: false
});

/*
    //  Create class that creates filters to be used when creatingn queries to DB.
    //  Currently grabs competitors depending on country.
*/

module.exports.getCompetitors = filters => {

    return new Promise((resolve, reject) => {

        sequelize.sync().then(() => {

            let tmpIDs = [];

            Meets.findAll({
                attributes: ["MeetID"],
                where: {
                    MeetCountry: country
                }
            }).then(data => {

                //  extract meet IDs
                data.forEach(x => {
                    tmpIDs.push(x.MeetID);
                })

                //  grab all competitors from all meet IDs extracted
                Competitors.findAll({
                    where: {
                        MeetID: tmpIDs
                    }
                }).then(data => {

                    competitors = new Set(data);

                    Promise.all(competitors).then(data => {
                        console.log(getSizeExtracted);
                        resolve(competitors);
                    }).catch(data => {
                        reject(data);
                    })
                })
            })
        })
    })
}

function getSizeExtracted() {
    return `Rows extracted: ${competitors.size}`;
}