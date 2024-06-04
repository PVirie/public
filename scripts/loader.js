const display_load=function(flag){if(window.loader_dom==null){const loader_dom=document.createElement("div");loader_dom.classList.add("float-loader","hide");loader_dom.innerHTML=`
            <div class="loader"><span></span></div>
        `;document.body.appendChild(loader_dom);window.loader_dom=loader_dom;}
if(flag){window.loader_dom.classList.remove("hide");}else{window.loader_dom.classList.add("fade-out");setTimeout(()=>{window.loader_dom.classList.add("hide");},1000);}};display_load(true);