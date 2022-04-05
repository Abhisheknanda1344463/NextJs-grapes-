// module.exports = {
//   apps: [
//     {
//       // script: "app.js",
//       instances: "max",
//       // script: "./app.js",
//       watch: true,
//       /// interpreter: "npm",
//       script: "./node_modules/.bin/next",
//       exec_mode: "cluster",
//     },
//   ],
// };
module.exports = {
  apps: [
    {
      name: "green",
      exec_mode: "cluster",
      instances: 4,
      cwd: "/home/zegashop/public_html/zegashop_stores/public/themes/purple",
      script: "./node_modules/.bin/next",
      port: 3500,
      // "post-deploy": "pm2 startOrRestart ecosystem.json --env production",
      env_production: {
        PORT: 80,
        NODE_ENV: "production",
      },
      ////args: "-c /var/www/nuxt.config.js",
    },
  ],
};
