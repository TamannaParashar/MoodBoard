"use client"
import "../style.css"
export default function Top() {
  return (
    <div>
      <div className="balloon-container">
        
        {/* Changed 'class' to 'className' */}
        <div className="balloon balloon-left-1 red"></div>
        <div className="balloon balloon-left-2 blue"></div>
        
        <div className="balloon balloon-right-1 green"></div>
        <div className="balloon balloon-right-2 purple"></div>
    </div>
    </div>
  )
}
