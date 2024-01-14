var crsr=document.querySelector("#cursor")
document.addEventListener("mousemove",function(dets){
    crsr.style.left=dets.x-12.5+"px"
    crsr.style.top=dets.y-12.5+"px"
})

var h4all=document.querySelectorAll("#nav h4")
h4all.forEach(function(elem){
    elem.addEventListener("mouseenter",function(){
        crsr.style.scale=3
        crsr.style.border="0.5px solid white"
        crsr.style.backgroundColor="transparent"
    })
})
h4all.forEach(function(elem){
    elem.addEventListener("mouseleave",function(){
        crsr.style.scale=1
        crsr.style.border="0px solid #95C11E"
        crsr.style.backgroundColor="#95C11E"
    })
})
gsap.to("#nav",{
    backgroundColor:"#000",
    height:"110px",
    duration:0.5,
    scrollTrigger:{
        trigger:"#nav",
        scroller:"body",
        start:"top -10%",
        scrub:1
        // markers:true
    }
})

gsap.to("#main",{
    backgroundColor:"#000",
    scrollTrigger:{
        trigger:"#main",
        scoller:"body",
        start:"top -50%",
         end:"top -100%",
        scrub:2
        //markers:true
    }
})

