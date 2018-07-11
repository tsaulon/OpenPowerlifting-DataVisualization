const Papa = require("papaparse");
const path = require("path");
const fs = require("fs");

var meets = [];
var competitors = [];



module.exports.Initialize = () => {

    return new Promise((resolve, reject) => {

        populateMeets().then(console.log(meets)).catch(data => reject(data));
    });
}

function populateMeets() {
    return Promise((resolve, reject) => {

        //  Read file contents
        fs.readFile(path.join(__dirname, "/data/meets.csv"), "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            } else {

                //  begin parsing data...
                Papa.parse(data, {
                    delimiter: ',',
                    newline: '\n',
                    complete: function (results) {

                        //  push to meets array
                        for (let i = 1; i < results.data.length - 1; i++) {   //NOTE: Last element extracted is NaN. Look more into this.

                            meets.push({
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

                        Promise.all(meets).then(() => resolve(meets))
                            .catch(data => reject(data));
                    }
                });
            }
        });
    })
}

function populateCompetitors() {

    return Promise((resolve, reject) => {

        //  Read file contents
        fs.readFile(path.join(__dirname, "/data/openpowerlifting.csv"), "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            } else {

                //  begin parsing data...
                Papa.parse(data, {
                    delimiter: ',',
                    newline: '\n',
                    complete: function (results) {

                        //  push to competitors array
                        for (let i = 1; i < results.data.length - 1; i++) {   //NOTE: Last element extracted is NaN. Look more into this.

                            competitors.push({
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

                        Promise.all(competitors).then(() => resolve(competitors))
                            .catch(data => reject(data));
                    }
                });
            }
        });
    })
}