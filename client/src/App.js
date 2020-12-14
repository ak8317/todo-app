import React,{useState,useEffect,useRef} from 'react'
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';
import './App.css';
import Modal from './Modal'

function App() {
  const checkRef=useRef();
  const modalRef=useRef();
  const editRef=useRef()
  const [isCompleted,setIsCompleted]=useState(false)
  const [editField,setEditField]=useState('');
  const [editLabel,setEditLabel]=useState('');
  const [taskField,setTaskField]=useState('')
  const [bucketLabel,setBucketLabel]=useState('disabledOption')
  const [bucketInput,setBucketInput]=useState('')
  const [buckets,setBuckets]=useState([])
  const [tasks,setTasks]=useState([])
 const [edit,setEdit]=useState({})
  useEffect(()=>{
    const getBuckets=async()=>{
      try {
        const response=await fetch('/api/buckets')
      const result=await response.json()
      setBuckets(result)
      } catch (err) {
        console.error(err)
      }
      
    }
    const getTasks=async()=>{
      try {
        const response=await fetch("/api/tasks")
        const result=await response.json()
        setTasks(result)
      } catch (err) {
        console.error(err)
      }
    }
    getBuckets()
    getTasks()

  },[])
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      if(taskField ){
        
        let bucket_name=bucketLabel
        if(bucket_name==='disabledOption'){
          bucket_name=''
        }
        const body={
          bucket_name:bucket_name,task_name:taskField
        }
        const response=await fetch("/api/tasks",{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(body)
        })
        const newTask=await response.json()
        const newtasks=[...tasks]
        newtasks.push(newTask)
        setTasks(newtasks)
      }
      
    } catch (err) {
      console.error(err)
    }
    setTaskField('')
    setBucketLabel('disabledOption')
  }
  const bucketSubmit=async (e)=>{
    e.preventDefault()
    try {
      const response=await fetch("/api/buckets",{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({bucket_name:bucketInput})
      })
      const newBucket=await response.json()
      const newBuckets=[...buckets]
      newBuckets.push(newBucket)
      setBuckets(newBuckets)
    } catch (err) {
      console.error(err)
    }
    setBucketInput('')
  }
  const deleteTask=async (_id)=>{
   
    try {
      await fetch("/api/tasks",{
        method:'DELETE',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({_id:_id})
      })
      const updatedTasks=[...tasks].filter(task=>task._id!==_id)
      //const newBucket=await response.json()
      // const newBuckets=[...buckets]
      // newBuckets.push(newBucket)
      setTasks(updatedTasks)
    } catch (err) {
      console.error(err)
    }
   
  }
 const openModal=(_id)=>{
  setEdit([...tasks].filter(task=>task._id===_id)[0])
  const task=[...tasks].filter(task=>task._id===_id)[0]
  
  setEditField(task.task_name)
  if(task.bucket_name===''){
    setEditLabel('disabledOption')
  }
  else{
    setEditLabel(task.bucket_name)
  }
  
   modalRef.current.openModal()
   console.log(editRef)
   
 // modalRef.current.openModal()
 }
 const updateTask=async(e)=>{
   e.preventDefault()
    //console.log(edit)
    try {
      const body={
        _id:edit._id,
        task_name:editField,
        bucket_name:editLabel
      }
      const reponse=await fetch("/api/tasks",{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(body)
      })
      const result=await reponse.json()
      const editedTasks=[...tasks].map(task => (task._id === body._id ? result : task))
      setTasks(editedTasks)
      //console.log(result)
    } catch (err) {
      console.error(err)
    }

  modalRef.current.closeModal()
 }

 const toggleTask=async(_id)=>{
   setIsCompleted(!isCompleted)
   let check
   if(checkRef.current.checked){
    check=checkRef.current.checked
   }
   else{
     check=false
   }
    const body={
     _id:_id,
     task_isCompleted:check
   }
   
   
   try {
     const response=await fetch("/api/tasks/toggle",{
       method:"PUT",
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify(body)

     })
     const result=await response.json()
     console.log(result)
     const editedTasks=[...tasks].map(task => (task._id === _id ? result : task))
      setTasks(editedTasks)
   } catch (err) {
     console.error(err)
   }
 }

  return (
    <div className="App">
      <div className="buckets container">
        <h2>Buckets</h2>
          <ul className="buckets-list">
                {buckets.map(({_id,bucket_name})=>{
                  return(
                    <li className="bucket-name" key={_id}>{bucket_name}</li>
                  )
                })}
              {/* <li className="bucket-name">Important</li>
                <li className="bucket-name">Updates</li>
                <li className="bucket-name">other</li> */}
            </ul>
            <form className="bucketForm"onSubmit={bucketSubmit}>
                <input type="text"
                        className="bucketInput"
                        placeholder="new bucket"
                        aria-label="new bucket name"
                        value={bucketInput}
                        onChange={(e)=>setBucketInput(e.target.value)}
                />
                <button className="btn create" aria-label="create new bucket">+</button>
            </form>
      </div>
      <div className="todo-container container">
      <h1>What's the Plan for Today?</h1>
          <div className="todo-form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-fields">
              <input type="text" 
                      placeholder="Enter a new task"
                      value={taskField}
                      onChange={(e)=>setTaskField(e.target.value)}
              />
              <select  className="label-todo"value={bucketLabel} onChange={(e)=>setBucketLabel(e.target.value)}>
              <option  value="disabledOption" disabled >Add Bucket</option>
                {buckets.map(({bucket_name,_id})=>{
                  return(
                    <option  className="label-option" key={_id} value={bucket_name}>{bucket_name}</option>
                  )
                })}
              </select>
              </div>
              
              <div className="todo-btn">
                  <button >
                          Add Task
                </button>
                </div>
            </form>
          </div>
          <div className="todo-list">
            <div className="tasks">
              {tasks.map(({_id,task_name,bucket_name,task_isCompleted})=>{
                return(
                  <div className="task-container" key={_id}>
                    <div className="task">
                      <div className="task-input-label" >
                      
                        <input type="checkbox" 
                                ref={checkRef}
                                id={_id} 
                                defaultChecked={task_isCompleted?task_isCompleted:isCompleted}
                              onChange={()=>toggleTask(_id)}
                              
                        />
                        <label htmlFor={_id} >
                          <span className="custom-checkbox"></span>
                            {task_name}
                        </label>
                      </div>
                      <span>{bucket_name}</span>
                    </div>
                    <div className="icons">
                      <TiEdit className="edit-icon" onClick={()=>openModal(_id)}/>
                      <RiCloseCircleLine className="delete-icon" onClick={()=>deleteTask(_id)}/>
                    </div>
                  </div>
                )
              })}
             
            </div>
          </div>
         
         
        </div>
        <Modal ref={modalRef} >
              <div className="modal-form">
              <form onSubmit={updateTask}>
              <div className="form-fields">
              <input type="text" 
                      placeholder="update existing task"
                      value={editField}
                      ref={editRef}
                      onChange={(e)=>setEditField(e.target.value)}
              />
              <select  className="label-todo"value={editLabel} onChange={(e)=>setEditLabel(e.target.value)}>
              <option  value="disabledOption" disabled >Add Bucket</option>
                {buckets.map(({bucket_name,_id})=>{
                  return(
                    <option  className="label-option" key={_id} value={bucket_name}>{bucket_name}</option>
                  )
                })}
              </select>
              </div>
              
              <div className="todo-btn">
                  <button >
                          Update Task
                </button>
                </div>
            </form>
            </div>
        </Modal>
      </div>
    
  );
}

export default App;
