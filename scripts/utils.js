utils=(function(){const table_to_csv_clipboard=function(table_dom){const rows=table_dom.querySelectorAll("tr");let max_num_rows=0;let max_num_cols=0;for(let i=0;i<rows.length;i++){const cells=rows[i].querySelectorAll("th, td");let num_cols=0;let row_span=1;for(const cell of cells){const colspan=cell.getAttribute("colspan");const rowspan=cell.getAttribute("rowspan");if(colspan){num_cols+=parseInt(colspan);}else{num_cols++;}
if(rowspan){row_span=Math.max(row_span,parseInt(rowspan));}}
max_num_cols=Math.max(max_num_cols,num_cols);max_num_rows=Math.max(max_num_rows,i+row_span);}
const csv=[];for(let i=0;i<max_num_rows;i++){const row=[];for(let j=0;j<max_num_cols;j++){row.push(null);}
csv.push(row);}
for(let i=0;i<rows.length;i++){const cells=rows[i].querySelectorAll("th, td");let col=0;for(const cell of cells){const colspan=cell.getAttribute("colspan");const rowspan=cell.getAttribute("rowspan");let text=cell.innerText;const row_span=rowspan?parseInt(rowspan):1;const col_span=colspan?parseInt(colspan):1;for(let r=0;r<row_span;r++){for(let c=0;c<col_span;c++){while(csv[i+r][col+c]!=null){c++;}
csv[i+r][col+c]=text;text="";}}
col+=col_span;}}
navigator.clipboard.writeText(csv.join("\n"));};return{table_to_csv_clipboard:table_to_csv_clipboard,};})();