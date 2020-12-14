import React,{useState,forwardRef,useImperativeHandle} from 'react'

const Modal=forwardRef((props,ref)=>{
    const [display,setDisplay]=useState(null)

    useImperativeHandle(ref,()=>{
        return{
            openModal:()=>open(),
            closeModal:()=>close()
        }
    })

    const open=()=>{
        setDisplay(true)
    }
    const close=()=>{
        setDisplay(false)
    }
    if(display){
        return (
        <div className={"modal-wrapper"}>
            <div onClick={close} className={"modal-backdrop"}/>
            <div className={"modal-box"}>
                {props.children}
            </div>
        </div>
        )
       
        
    }
    return null

})
export default Modal;