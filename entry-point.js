const { exec } = require('child_process');

exec('npm run run-less', (error, stdout, stderr) => {
  if (error) {
    console.error('Error occurred during the "run-less" script:', error.message);
  } else {
    console.log('less Script executed successfully!');
    console.log(stdout);

    // Run the "node index.js" command after the "run-less" script completes
    exec('node index.js', (error, stdout, stderr) => {
      if (error) {
        console.error('Error occurred while starting the server:', error.message);
      } else {
        console.log('Server started successfully!');
        console.log(stdout);
      }
    });
  }
});