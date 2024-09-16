import { useEffect, useRef, useState } from "react";
import { SWATCHES } from "@/constants";
import {ColorSwatch,Group} from '@mantine/core';
import {Button} from '@/components/ui/button';
import axios from 'axios';
//for backend interface
interface Response {
    expr:string;
    result:string;
    assign:boolean;
}
//result for our expression like x+y
interface GeneratedResult{
    expression:string;
    answer:string;
}
export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null); //used to store a value in a component but dont want to re render
    const [isDrawing,setIsDrawing] = useState(false);
    const [color,setColor] = useState('rgb(255,255,255)');
    const [reset,setReset] = useState(false);
    const [result,setResult] = useState<GeneratedResult>(); //generated result state
    const [dictOfVars,setDictOfVars] = useState({}); //used when assigning values to variable like x=5 ,x=8;

    useEffect(() => {
      if(reset){
        resetCanvas();
        setReset(false);
      }
    
     
    }, [reset]);
    
    useEffect(()=>{
        //initialize the canvas elements
        const canvas = canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext('2d');
            if(ctx){
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round' //for brush type
                ctx.lineWidth = 3;

            }
        }
    },[])

    const sendData =async()=>{
        const canvas = canvasRef.current;
        if(canvas){
            const response = await axios({
                method:'post',
                url:`${import.meta.env.VITE_API_URL}/calculate`,
                data:{
                    image:canvas.toDataURL('image/png'),
                    dict_of_vars:dictOfVars
                }
            })
            const resp = await response.data;
            console.log('Response' + resp);
        }
    }
    const resetCanvas = ()=>{
        const canvas = canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext('2d');
            if(ctx){
                ctx.clearRect(0,0,canvas.width,canvas.height);
            }
        }
    };
    //mouse click event for start drawing
    //<HTMLCanvasElement>: This is a generic parameter that specifies which HTML element the event is associated with
    const startDrawing = (e:React.MouseEvent<HTMLCanvasElement>)=>{
        const canvas = canvasRef.current;
        // setting background color and 2d context to draw 2d drawings
        
        if(canvas){
                canvas.style.background = 'black';
                const ctx = canvas.getContext('2d');
                if(ctx){
                    ctx.beginPath();
                    ctx.moveTo(e.nativeEvent.offsetX,e.nativeEvent.offsetY); //// The X and y coordinate of the mouse event relative to the canvas
                    setIsDrawing(true);
                }
        }
    }
    const stopDrawing = ()=>{
        setIsDrawing(false);
    }
    const draw = (e:React.MouseEvent<HTMLCanvasElement>)=>{
        if(!isDrawing){
            return;
        }
        const canvas = canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext('2d');
            if(ctx){
                ctx.strokeStyle = color;
                ctx.lineTo(e.nativeEvent.offsetX,e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };

    return (
        <>
        <div className="grid grid-cols-3 gap-2">
            <Button onClick={()=>{setReset(true)}}
                className="z-20 bg-black text-white" variant='default' color="black">Reset
            </Button>
            <Group className="z-20">
                {SWATCHES.map((Swatchcolor:string)=>(
                    <ColorSwatch key={Swatchcolor} color={Swatchcolor} onClick={()=>setColor(Swatchcolor)}/>
                ))}
            </Group>
            <Button onClick={sendData}
                className="z-20 bg-black text-white" variant='default' color="black">Calculate</Button>
        </div>
        <canvas ref={canvasRef} id="canvas" className="absolute top-0 left-0 w-full h-full bg-black" onMouseDown={startDrawing} onMouseOut={stopDrawing}
        onMouseUp={stopDrawing} onMouseMove={draw}/>
        </>
    )

}