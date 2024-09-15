import { useEffect, useRef, useState } from "react";

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null); //used to store a value in a component but dont want to re render
    const [isDrawing,setIsDrawing] = useState(false);
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
                ctx.strokeStyle = 'white';
                ctx.lineTo(e.nativeEvent.offsetX,e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };

    return (
        <>
        <canvas ref={canvasRef} id="canvas" className="absolute top-0 left-0 w-full h-full bg-black" onMouseDown={startDrawing} onMouseOut={stopDrawing}
        onMouseUp={stopDrawing} onMouseMove={draw}/>
        </>
    )

}