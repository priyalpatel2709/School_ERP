module.exports = {
    apps: [
        {
            name: "school-erp-backend",
            script: "./index.js",
            instances: "max", // Utilize all available CPU cores
            exec_mode: "cluster", // Enable clustering
            watch: false, // Don't watch files in production
            max_memory_restart: "1G", // Restart if memory exceeds 1GB
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
            error_file: "./logs/pm2-error.log",
            out_file: "./logs/pm2-out.log",
            merge_logs: true,
        },
    ],
};
