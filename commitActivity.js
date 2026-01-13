import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const makeCommits = (startDate) => {
    const today = moment();
    let currentDate = moment(startDate);
    
    const commits = [];
    
    while (currentDate.isBefore(today) || currentDate.isSame(today, 'day')) {
        const year = currentDate.year();
        let shouldCommit;
        
        if (year === 2025) {
            shouldCommit = random.int(1, 100) <= 65;
        } else {
            shouldCommit = random.int(1, 10) > 2;
        }
        
        if (shouldCommit) {
            let commitsToday;
            if (year === 2025) {
                commitsToday = random.int(1, 4);
            } else {
                commitsToday = random.int(1, 8);
            }
            
            for (let i = 0; i < commitsToday; i++) {
                commits.push(currentDate.format());
            }
        }
        
        if (year === 2025 && random.int(1, 100) <= 10) {
            currentDate.add(random.int(7, 14), 'days');
        } else {
            currentDate.add(1, 'day');
        }
    }
    
    let index = 0;
    const commitNext = () => {
        if (index >= commits.length) {
            return simpleGit().push();
        }
        
        const date = commits[index];
        jsonfile.writeFile(path, { date: date }, () => {
            simpleGit().add([path]).commit(date, { "--date": date }, () => {
                index++;
                commitNext();
            });
        });
    };
    
    commitNext();
};

makeCommits("2024-01-01");
