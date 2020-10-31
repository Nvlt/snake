import scene from './scene.js';
function deg2Rad(deg)
{
    return (deg * Math.PI/180);
}
function generateGrid(size = 4,reserved={})
{
    
    let html = `<div class='grid_container'>`;
    for(let row = 0; row<size; row++)
    {
        html += `<div class='row'>`;
        for(let column = 0; column<size; column++)
        {
            if(!reserved[row])
            {
                reserved[row] = {};
            }
            if(!reserved[row][column])
            {
                reserved[row][column] = false;
            }
            html+=`<button style='background-color:rgb(${Math.sin(deg2Rad(row*(180/size)))*255},${Math.sin(deg2Rad(column*(180/size)))*255},${Math.cosh(deg2Rad(column*(180/size)))*255});' class='grid_btn ${(reserved[row][column] == true)? 'reserved':''}' x=${column} y=${row}></button>`;
        }
        html += `</div>`;
    }
    html += `</div>`;
    return html;
}
function main()
{
    const _scene = new scene();
}
main();