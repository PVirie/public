const display_load=function(flag){if(window.loader_dom==null){const loader_dom=document.createElement("dialog");loader_dom.classList.add("float-loader","hide");loader_dom.innerHTML=`
            <span class="hide">loading</span>
            <span class="loader"></span>
        `;document.body.appendChild(loader_dom);window.loader_dom=loader_dom;}
if(flag){window.loader_dom.classList.remove("hide");window.loader_dom.classList.remove("fade-out");window.loader_dom.showModal();}else{window.loader_dom.classList.add("fade-out");setTimeout(()=>{window.loader_dom.classList.add("hide");window.loader_dom.close();},250);}};display_load(true);