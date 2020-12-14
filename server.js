let express=require('express')
let app=express()
const  cors=require('cors')
let mongodb=require('mongodb')
let db
const PORT=process.env.PORT || 5000
app.use(cors());
app.use(express.json())
const path = require('path')
//const url =process.env.MONGOGN_URI || 'mongodb://127.0.0.1:27017';
const matlas = require("./config/keys").mongoURI;
process.env.PWD = process.cwd();
mongodb.connect(process.env.MONGODB_URI || matlas,{useNewUrlParser:true,useUnifiedTopology:true},function(err,client){
    if(err){
        return console.log(err)
    }
        

    db=client.db()
    console.log(`MongoDB Connected: ${matlas}`);
    console.log(__dirname)
    
})
if (process.env.NODE_ENV === 'production') {
    //app.use(express.static(path.join(__dirname, 'client/build')));
    //app.use(express.static(process.env.PWD + '/client/build'));
    app.use(express.static(__dirname + '/client/build'));
}
//create-bucket
app.post('/api/buckets',function(req,res){
  
    const newBucket={bucket_name:req.body.bucket_name}
    const t=db.collection('buckets').insertOne(newBucket,function(err,client){
        if(err){
            return console.log(err)
        }
        res.send(client['ops'][0])
      
    })
    
    
})
//create-task
app.post('/api/tasks',function(req,res){
   
    const newTasks={bucket_name:req.body.bucket_name,task_name:req.body.task_name,task_isCompleted:false}
    db.collection('tasks').insertOne(newTasks,function(err,client){
        if(err){
            return console.log(err)
        }
        res.send(client['ops'][0])
       
    })
    
    
})
//get buckets
app.get('/api/buckets',function(req,res){
   
    db.collection('buckets').find().toArray(function(err,items){
        if(err){
            return console.log(err)
        }
        
        res.send(items)
    })
    

})
//get-tasks
app.get('/api/tasks',function(req,res){
    
    db.collection('tasks').find().toArray(function(err,items){
        if(err){
            return console.log(err)
        }
       
        res.send(items)
    })
    

})
//delete task
app.delete('/api/tasks',function(req,res){
    db.collection('tasks').deleteOne({_id:new mongodb.ObjectID(req.body._id)},{returnOriginal: false},function(err,client){
        if(err){
            return console.log(err)
        }
        res.send(client)
    })
})

//edit a task
app.put('/api/tasks',function(req,res){

    db.collection('tasks').findOneAndUpdate({_id:new mongodb.ObjectID(req.body._id)},{$set: {'task_name': req.body.task_name,'bucket_name':req.body.bucket_name}},{returnOriginal: false},function(err,client){
        if(err){
            return console.log(err)
        }
       
        res.send(client["value"])
        
    })
    
    
})
//toggle a task
app.put('/api/tasks/toggle',function(req,res){
    
    db.collection('tasks').findOneAndUpdate({_id:new mongodb.ObjectID(req.body._id)},{$set: {'task_isCompleted': req.body.task_isCompleted}},{returnOriginal: false},function(err,client){
        if(err){
            return console.log(err)
        }
        res.send(client["value"])
     
    })
    
    
})
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.

// app.get('*', function (req, res) {
//   //const index = path.join(__dirname, 'client\build\', 'index.html');
//   //res.sendFile(index);
//    const index = path.join(process.env.PWD, '/client/build/index.html');
//    res.sendFile(index)
// });
   
// app.get('/*', function(req,res) {
//     res.sendFile(path.join(__dirname + '/client/build/index.html'));
    
//     });

app.listen(PORT,()=>{
    console.log(`Severis starting at ${PORT}`)
})


