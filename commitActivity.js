import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import fs from "fs/promises";

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
    
    console.log(`Total commits to create: ${commits.length}`);
    
    const git = simpleGit();
    const batchSize = 50;
    
    const commitBatch = async () => {
        try {
            for (let i = 0; i < commits.length; i++) {
                const date = commits[i];
                await fs.writeFile(path, JSON.stringify({ date: date }, null, 2));
                await git.add([path]);
                await git.commit(date, { "--date": date });
                
                if ((i + 1) % batchSize === 0) {
                    console.log(`Progress: ${i + 1}/${commits.length} - Pushing batch...`);
                    await git.push();
                }
                
                if ((i + 1) % 10 === 0) {
                    process.stdout.write('.');
                }
            }
            
            console.log('\nFinal push...');
            await git.push();
            console.log('Done! Created ' + commits.length + ' commits');
        } catch (err) {
            console.error('Error at commit:', err.message);
            throw err;
        }
    };
    
    commitBatch().catch(err => console.error('Fatal error:', err));
};

makeCommits("2024-01-01");
