const cluster = require('cluster');
const totalCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        console.log('Forking a new worker');
        cluster.fork();
    });
} else {
    // 在这里引入你的主应用文件
    require('./app'); // 假设你的主应用文件名为 app.js
}