import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const markCommit = (x, y) => {
    const date = moment()
        .set("year", 2024)
        .month(3)
        .date(1)
        .add(x, "w")
        .add(y, "d")
        .format();

    const data = {
        date: date,
    };

    jsonfile.writeFile(path, data, () => {
        simpleGit().add([path]).commit(date, { "--date": date }).push();
    });
};
//.ф
const makeCommits = (n) => {
    if (n === 0) return simpleGit().push();

    const commitsThisWeek = random.int(5, 8);

    for (let i = 0; i < commitsThisWeek; i++) {
        const x = random.int(0, 4);
        const y = random.int(0, 6);
        let date = moment()
            .set("year", 2024)
            .month(3)
            .date(1)
            .add(x, "w")
            .add(y, "d")
            .format();

        const currentMonth = moment(date).month();
        if (currentMonth >= 3) {
            jsonfile.writeFile(path, { date: date }, () => {
                simpleGit().add([path]).commit(date, { "--date": date });
            });
        }
    }

    makeCommits(n - 1);
};

makeCommits(100);
