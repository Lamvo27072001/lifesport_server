import cron from 'node-cron';
const MasterCronJob = () => {
    const job = cron.schedule("* * * * *", function () {
        console.log('running a task every minute');
    }, {
        scheduled:false
    });
    job.start();
    
}
export default MasterCronJob;