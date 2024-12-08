utils=(function(){const table_to_csv_clipboard=function(table_dom){const rows=table_dom.querySelectorAll("tr");let num_rows=0;let max_num_cols=0;for(let i=0;i<rows.length;i++){const cells=rows[i].querySelectorAll("th, td");let num_cols=0;for(const cell of cells){const colspan=cell.getAttribute("colspan");if(colspan){num_cols+=parseInt(colspan);}else{num_cols++;}}
max_num_cols=Math.max(max_num_cols,num_cols);num_rows++;}
const csv=[];for(const row of rows){const cells=row.querySelectorAll("th, td");let csv_row=[];let col_idx=0;for(const cell of cells){const colspan=cell.getAttribute("colspan");if(colspan){const num_cols=parseInt(colspan);for(let i=0;i<num_cols;i++){csv_row.push(cell.textContent);col_idx++;}}else{csv_row.push(cell.textContent);col_idx++;}}
for(let i=col_idx;i<max_num_cols;i++){csv_row.push("");}
csv.push(csv_row.join(","));}
navigator.clipboard.writeText(csv.join("\n"));};return{table_to_csv_clipboard:table_to_csv_clipboard,};})();