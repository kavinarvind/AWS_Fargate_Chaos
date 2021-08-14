exports.handler =  async function (event) 
  const AWS = require('aws-sdk');
  console.log("Starting lambda");
  AWS.config.region = event.key4;
  const ecs = new AWS.ECS({ apiVersion: '2014-11-13' });
  const sns = new AWS.SNS({ apiVersion: '2016-11-15' });
 
  const FARGATE_CLUSTERS = [
      {
        cluster: event.key1,
        service: event.key2,
        enabled: true
      }];
    
      try {   
       
          for (var i = 0; i < FARGATE_CLUSTERS.length; i++) {
              if (FARGATE_CLUSTERS[i].enabled) {
                    
                      var res = await ecs.listTasks({
                          cluster: FARGATE_CLUSTERS[i].cluster,
                          serviceName: FARGATE_CLUSTERS[i].service,
                          desiredStatus: 'RUNNING',
                          launchType: 'FARGATE',
                          maxResults: event.key3
                      }).promise();
                        
                     var index =  Math.floor(res.taskArns.length);

                    for ( var j=0; j< index; j++) {
                      var stoppedTask = res.taskArns[j];
                      await ecs.stopTask({
                          cluster: FARGATE_CLUSTERS[i].cluster,
                          task: stoppedTask,
                          reason: 'AWS FIS'
                      
                      }).promise();
                    
                  }
              }
          }
      } catch (err) {
        console.log("Didnt enter");
          console.log(err.stack);
       
      }
 
  };
