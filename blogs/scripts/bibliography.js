const bib_index={};const compile_citation=function(){const bib=document.querySelector(".bibliography");for(const b of citation_blocks){const content=b.innerHTML;if(bib_index[content]==null){bib_index[content]=Object.keys(bib_index).length+1;}
if(bib!=null){const li=document.createElement("li");li.innerHTML=bib_index[content]+". "+content;bib.appendChild(li);}
b.innerHTML=bib_index[content];}};const citation_blocks=document.querySelectorAll(".cite");window.addEventListener("load",function(){compile_citation();});