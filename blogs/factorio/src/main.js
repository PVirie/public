const add_result_row=function(parent,production_data,count){let elem=document.createElement("tr");let product_counts=0;const machine_name_elem=document.createElement("td");machine_name_elem.innerText=production_data.craft_machine;elem.appendChild(machine_name_elem);const count_elem=document.createElement("td");count_elem.innerText=count.toFixed(2);elem.appendChild(count_elem);for(const p of production_data.products){elem.insertAdjacentHTML("beforeend",`<td class="output">Output</td>
        <td class="output">${p.id}</td>
        <td class="output">${((p.num_per_tick * count) / production_data.craft_time).toFixed(2)}</td>`);product_counts+=1;parent.appendChild(elem);elem=document.createElement("tr");}
if(production_data.fuel!=null){elem.insertAdjacentHTML("beforeend",`<td class="fuel">Fuel</td>
        <td class="fuel">${production_data.fuel.id}</td>
        <td class="fuel">${(production_data.fuel.consumption_rate * count).toFixed(2)}</td>`);product_counts+=1;parent.appendChild(elem);elem=document.createElement("tr");}
for(const p of production_data.requires){elem.insertAdjacentHTML("beforeend",`<td class="input">Input</td>
        <td class="input">${p.id}</td>
        <td class="input">${((p.num_per_tick * count) / production_data.craft_time).toFixed(2)}</td>`);product_counts+=1;parent.appendChild(elem);elem=document.createElement("tr");}
if(product_counts>1){machine_name_elem.rowSpan=product_counts;count_elem.rowSpan=product_counts;}};const get_csv_data=async function(url){const r=await fetch(url,{method:"GET",});if(r.status!==200){console.error("Failed to fetch data from "+url);return;}
return await r.text();};const trim_item=function(item){return item.trim();};const csv_to_float=function(str){if(str===""){return 0;}
return parseFloat(str);};const csv_to_int=function(str){if(str===""){return 0;}
return parseInt(str);};const make_set=function(arr){const set=new Set();for(const a of arr){set.add(a);}
return set;};const split_csv_line=function(line){const results=[];let current="";let in_string=false;for(let i=0;i<line.length;i++){if(line[i]==='"'){in_string=!in_string;}else if(line[i]===","&&!in_string){results.push(current);current="";}else{current+=line[i];}}
results.push(current);return results;};window.addEventListener("load",async function(){const hashes=window.location.hash.substring(1).split("&");let source=hashes.find((h)=>h.startsWith("source="));let num_max_by_products=2;let assembler_list=null;let recipe_list=null;if(source==null){assembler_list="./data/assemblers.csv";recipe_list="./data/recipes.csv";}
const assembler_data=await get_csv_data(assembler_list);const recipe_data=await get_csv_data(recipe_list);let assemblers={};const assembler_lines=assembler_data.split("\n");const assembler_headers=split_csv_line(assembler_lines[0]);for(let i=1;i<assembler_lines.length;i++){const row=split_csv_line(assembler_lines[i]);if(row[0]===""){continue;}
const id=row[0];const assembler={id:id,speed_factor:csv_to_float(row[1]),base_productivity:csv_to_float(row[2]),power_consumption:csv_to_float(row[3]),power_drain:csv_to_float(row[4]),pollution:csv_to_float(row[5]),module_slots:csv_to_int(row[6]),unlock_planet:row[7],fuel_id:row[8],fuel_consumption_rate:csv_to_float(row[9]),};assemblers[id]=assembler;}
let data=[];const recipe_lines=recipe_data.split("\n");const recipe_headers=split_csv_line(recipe_lines[0]);for(let i=1;i<recipe_lines.length;i++){const row=split_csv_line(recipe_lines[i]);if(row[0]===""){continue;}
const craft_machines=row[4+num_max_by_products*2].split(",").map(trim_item);const base_craft_time=csv_to_float(row[2+num_max_by_products*2]);const buildable_on=make_set(row[3+num_max_by_products*2].split(",").map(trim_item));const base_product={id:row[0],built_per_tick:csv_to_float(row[1]),};let by_product_1=null;if(row[2]!==""){by_product_1={id:row[2],built_per_tick:csv_to_float(row[3]),};}
let by_product_2=null;if(row[4]!==""){by_product_2={id:row[4],num_per_tick:csv_to_float(row[5]),};}
for(const craft_machine of craft_machines){const speed_factor=assemblers[craft_machine].speed_factor;const productivity=assemblers[craft_machine].base_productivity/100+1.0;const datum={craft_machine:craft_machine,craft_from:craft_machine,craft_time:base_craft_time/speed_factor,fuel:null,unlock_planet:assemblers[craft_machine].unlock_planet,buildable_on:buildable_on,products:[{id:base_product.id,num_per_tick:base_product.built_per_tick*productivity,},],requires:[],};if(by_product_1!=null){datum.products.push({id:by_product_1.id,num_per_tick:by_product_1.built_per_tick*productivity,});}
if(by_product_2!=null){datum.products.push({id:by_product_2.id,num_per_tick:by_product_2.num_per_tick*productivity,});}
if(assemblers[craft_machine].fuel_id!==""){datum.fuel={id:assemblers[craft_machine].fuel_id,consumption_rate:assemblers[craft_machine].fuel_consumption_rate,};}
let component_index=5+num_max_by_products*2;while(component_index<row.length){if(row[component_index]!==""){datum.requires.push({id:row[component_index],num_per_tick:csv_to_float(row[component_index+1]),});}
component_index+=2;}
data.push(datum);}}
let use_cost=true;if(true){const new_data=[];const products=[];let requires=null;let craft_time=null;let unlock_planet=null;let buildable_on=null;for(const datum of data){if(datum.craft_machine.trim().toLowerCase()==="scrap recycling"){craft_time=datum.craft_time;unlock_planet=datum.unlock_planet;buildable_on=datum.buildable_on;products.push(...datum.products);requires=datum.requires;}else{new_data.push(datum);}}
const recycling_datum={craft_machine:"Recycler",craft_from:"Recycler",craft_time:craft_time,unlock_planet:unlock_planet,buildable_on:buildable_on,products:products,requires:requires,cost:10,};new_data.push(recycling_datum);data=new_data;}
const all_products={};const all_bases={};const all_productions={};const all_production_details={};const product_speed_suggest=new Suggest_list(document.querySelector("#product-speed .widget-search-input"),document.querySelector("#product-speed .widget-tag-list"),document.querySelector("#product-speed .widget-tag-suggest"),(id)=>{const elem=document.createElement("span");elem.classList.add("button");elem.id=id;elem.innerText=all_products[id];return elem;},(id)=>{const elem=document.createElement("div");elem.classList.add("left-right");const label=document.createElement("label");const close_button=document.createElement("div");close_button.classList.add("material-symbols-outlined","button","close");close_button.innerText="close";label.appendChild(close_button);label.appendChild(document.createTextNode(all_products[id]));const item_container=document.createElement("div");elem.appendChild(label);const item=document.createElement("input");item.id=`${id}-target-speed`;item.type="number";item.value=1;item.min=0;item.max=1000;item.step=0.25;item_container.appendChild(item);item_container.appendChild(document.createTextNode(" pcs/s"));elem.appendChild(item_container);return elem;});const process_disable_suggest=new Suggest_list(document.querySelector("#process-disabled .widget-search-input"),document.querySelector("#process-disabled .widget-tag-list"),document.querySelector("#process-disabled .widget-tag-suggest"),(id)=>{const elem=document.createElement("span");elem.classList.add("button");elem.id=id;elem.innerText=all_productions[id];return elem;},(id)=>{const elem=document.createElement("label");elem.id=id;const close_button=document.createElement("div");close_button.classList.add("material-symbols-outlined","button","close");close_button.innerText="close";elem.appendChild(close_button);elem.appendChild(document.createTextNode(all_productions[id]));return elem;});for(const datum of data){for(const p of datum.products){const id=p.id.replaceAll(" ","_").replaceAll(".","_");if(all_products[id]==null){all_products[id]=p.id;}}
const is_base=datum.requires.length===0;if(is_base){for(const p of datum.products){const id=p.id.replaceAll(" ","_").replaceAll(".","_");all_bases[id]=p.id;}}
const prod_id=`${datum.products.map((p) => p.id.replaceAll(" ", "_").replaceAll(".", "_")).join("_")}-from-${datum.requires.map((p) => p.id.replaceAll(" ", "_").replaceAll(".", "_")).join("-")}-where-${datum.craft_machine}`;all_productions[prod_id]=`${datum.craft_from} for ${datum.products.map((p) => p.id).join(", ")} from ${datum.requires.map((p) => p.id).join(", ")}`;all_production_details[prod_id]=datum;}
product_speed_suggest.add_items(Object.keys(all_products).map((id)=>{return{tag:id,display:all_products[id],};}));process_disable_suggest.add_items(Object.keys(all_productions).map((id)=>{return{tag:id,display:all_productions[id],};}));const require_resource_rate=Object.keys(all_products).map((id)=>{return Object.keys(all_productions).map((production_id)=>{return 0;});});const production_speed=Object.keys(all_products).map((id)=>{return Object.keys(all_productions).map((production_id)=>{return 0;});});for(const datum of data){const prod_id=`${datum.products.map((p) => p.id.replaceAll(" ", "_").replaceAll(".", "_")).join("_")}-from-${datum.requires.map((p) => p.id.replaceAll(" ", "_").replaceAll(".", "_")).join("-")}-where-${datum.craft_machine}`;const prod_index=Object.keys(all_productions).indexOf(prod_id);for(const p of datum.products){const id=p.id.replaceAll(" ","_").replaceAll(".","_");const index=Object.keys(all_products).indexOf(id);production_speed[index][prod_index]=p.num_per_tick/datum.craft_time;}
for(const p of datum.requires){const id=p.id.replaceAll(" ","_").replaceAll(".","_");const index=Object.keys(all_products).indexOf(id);require_resource_rate[index][prod_index]=p.num_per_tick/datum.craft_time;}
if(datum.fuel!=null){const id=datum.fuel.id.replaceAll(" ","_").replaceAll(".","_");const index=Object.keys(all_products).indexOf(id);require_resource_rate[index][prod_index]=datum.fuel.consumption_rate;}}
const highs_settings={locateFile:(file)=>"../../libs/"+file,};const highs=await Module(highs_settings);const calculate_button=document.getElementById("calculate-button");const result=document.getElementById("result");calculate_button.addEventListener("click",async function(e){display_load(true);let unlocked_planets=[];if(document.querySelector("#enable-nauvis").checked)unlocked_planets.push("Nauvis");if(document.querySelector("#enable-space-platform").checked)unlocked_planets.push("Space platform");if(document.querySelector("#enable-vulcanus").checked)unlocked_planets.push("Vulcanus");if(document.querySelector("#enable-fulgora").checked)unlocked_planets.push("Fulgora");if(document.querySelector("#enable-gleba").checked)unlocked_planets.push("Gleba");if(document.querySelector("#enable-aquilo").checked)unlocked_planets.push("Aquilo");unlocked_planets=make_set(unlocked_planets);let material_form=[];if(document.querySelector("#import-from-nauvis").checked)material_form.push("Nauvis");if(document.querySelector("#import-from-space-platform").checked)material_form.push("Space platform");if(document.querySelector("#import-from-vulcanus").checked)material_form.push("Vulcanus");if(document.querySelector("#import-from-fulgora").checked)material_form.push("Fulgora");if(document.querySelector("#import-from-gleba").checked)material_form.push("Gleba");if(document.querySelector("#import-from-aquilo").checked)material_form.push("Aquilo");material_form=make_set(material_form);const allowed_production=Object.keys(all_productions).map((id)=>{const recipe=all_production_details[id];return!process_disable_suggest.get_selected().includes(id)&&unlocked_planets.has(recipe.unlock_planet)&&!recipe.buildable_on.isDisjointFrom(material_form);});const target_speed=Object.keys(all_products).map((id)=>{const v=product_speed_suggest.get_selected().includes(id)?document.getElementById(`${id}-target-speed`).value:"";if(v==="")return 0;return parseFloat(v);});let costs=null;if(use_cost){costs=Object.keys(all_productions).map((id)=>{return all_production_details[id].cost||1;});}
const params=op.build_matrices(require_resource_rate,production_speed,allowed_production,target_speed,costs);const PROBLEM=`Minimize
                                    obj:
                                     ${params.obj}
                                    Subject To
                                     ${params.constraints
                                         .map((c, i) => {
                                             return `c${i}:${c}`;
                                         })
                                         .join("\n ")}
                                    Bounds
                                     ${params.bounds.join("\n ")}
                                    End`;const sol=highs.solve(PROBLEM);console.log(sol);const results=Object.keys(sol.Columns).filter((id)=>{return id.startsWith("x")&&sol.Columns[id].Primal>0;}).map((id,index)=>{return[sol.Columns[id].Index,sol.Columns[id].Primal];});const result_list=document.getElementById("production-plan");while(result_list.firstChild)result_list.firstChild.remove();for(const r of results){const id=Object.keys(all_productions)[r[0]];const detail=all_production_details[id];console.log(`${id}: ${r[1]}`);add_result_row(result_list,detail,r[1]);}
const product_statistics={};for(const r of results){const id=Object.keys(all_productions)[r[0]];const detail=all_production_details[id];for(const p of detail.products){const product_id=p.id;if(product_statistics[product_id]==null){product_statistics[product_id]=[0,0];}
product_statistics[product_id][0]+=(p.num_per_tick*r[1])/detail.craft_time;}
for(const p of detail.requires){const product_id=p.id;if(product_statistics[product_id]==null){product_statistics[product_id]=[0,0];}
product_statistics[product_id][1]+=(p.num_per_tick*r[1])/detail.craft_time;}
if(detail.fuel!=null){const product_id=detail.fuel.id;if(product_statistics[product_id]==null){product_statistics[product_id]=[0,0];}
product_statistics[product_id][1]+=detail.fuel.consumption_rate*r[1];}}
const production_statistics=document.querySelector("#production-statistics");while(production_statistics.firstChild)production_statistics.firstChild.remove();for(const id of Object.keys(product_statistics)){const row=document.createElement("tr");const product=document.createElement("td");product.innerText=id;row.appendChild(product);const produce=document.createElement("td");produce.innerText=product_statistics[id][0].toFixed(2);row.appendChild(produce);const consume=document.createElement("td");consume.innerText=product_statistics[id][1].toFixed(2);row.appendChild(consume);const net=document.createElement("td");net.innerText=(product_statistics[id][0]-product_statistics[id][1]).toFixed(2);row.appendChild(net);production_statistics.appendChild(row);}
display_load(false);const result_doms=document.getElementById("results");result_doms.scrollIntoView({behavior:"smooth"});});for(const result_element of document.querySelectorAll(".result")){const copy_button=result_element.querySelector(".button");const table=result_element.querySelector("table");copy_button.addEventListener("click",function(){utils.table_to_csv_clipboard(table);});}
display_load(false);});