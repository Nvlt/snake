

export default class scene
{
    constructor()
    {
        
        document.body.addEventListener('keydown',(e)=>{
            //console.log(e.key);
            if(e.key === 's')
            {
                this.velocity.y = 1;
            }
            if(e.key === 'w')
            {
                this.velocity.y = -1;
            }
            if(e.key === 'a')
            {
                this.velocity.x = -1;
            }
            if(e.key === 'd')
            {
                this.velocity.x = 1;
            }
            //console.log(this.velocity)
        })
        document.body.addEventListener('keyup',(e)=>{
            //console.log(e.key);
            if(e.key === 's')
            {
                this.velocity.y = 0;
            }
            if(e.key === 'w')
            {
                this.velocity.y = 0;
            }
            if(e.key === 'a')
            {
                this.velocity.x = 0;
            }
            if(e.key === 'd')
            {
                this.velocity.x = 0;
            }
        })
        this.score = 0;
        this.status = "Game time!"
        this.gridSize = 40;
        this.vect2D_grid = [];
        this.generateGrid();
        this.velocity = {x:0,y:0};
        this.object = {x:0,y:0};
        this.temporarySquare();
        this.actionLoop = setInterval(()=>{
            
            let {x,y} = this.object;
            
            
            this.object.x = (this.object.x + this.velocity.x)%this.gridSize;
            if(this.object.x < 0)
            {
                this.object.x = this.gridSize - 1;
            }
            this.object.y = (this.object.y + this.velocity.y)%this.gridSize;
            if(this.object.y < 0)
            {
                this.object.y = this.gridSize - 1;
            }
            if(this.vect2D_grid[y] != undefined && (this.velocity.x || this.velocity.y)) 
            {
                if(!this.collisionCheck())
                {
                    
                    this.temporarySquare();
                }

            }
            
            
            this.render();
        },5)
        this.randomGoal()
    }
    generateGrid()
    {
        let size = this.gridSize;
        let grid = [];
        for(let y = 0; y<size; y++)
        {
            grid[y] = [];
            for(let x = 0; x<size; x++)
            {
                grid[y][x] = 0;
            }
        }
        
        this.vect2D_grid = grid;
        
    }
    render()
    {
        let html = `<h1>Score: ${this.score} || Status: ${this.status}</h1><div class='grid_container' style='display: flex;
        flex-direction: column;'>`;
        for(const y of this.vect2D_grid)
        {
            html += `<div class='row' style='display: flex;
            flex-direction: row;'>`;
            for(const x of y)
            {
                const color = 100 * (x == 1) || 200* (x == 2) ||  150;
                html+=`<div style='background-color:rgb(${color},${color},${color}); width: 15px;
                height: 15px;'></div>`
            }
            html += `</div>`;
        }
        html += `</div>`;
        document.body.innerHTML = html;
    }
    collisionCheck()
    {
        
        if(this.vect2D_grid[this.object.y][this.object.x] == 2)
        {
            this.vect2D_grid[this.object.y][this.object.x] = 0;
            this.Score();
            this.temporarySquare()
            this.randomGoal();
            this.status="Wow!"
            console.log('test')
            return 1;
        }
        if(this.vect2D_grid[this.object.y][this.object.x] == 1)
        {
            this.vect2D_grid[this.object.y][this.object.x] = 0;
            this.score=0;
            this.status="Oh no.."
            this.generateGrid();
            this.randomGoal();
            this.object = {x:0,y:0};
            this.temporarySquare();
            //console.log('test')
            return 1;
        }
        

    }
    Score()
    {
        this.score++;
    }
    randomGoal()
    {
        this.vect2D_grid[Math.floor(Math.random()*this.gridSize)][Math.floor(Math.random()*this.gridSize)] = 2;
    }
    temporarySquare()
    {
        let {x,y} = this.object;
        this.vect2D_grid[y][x] = 1;
        this.clearSpot(x,y);
    }
    clearSpot(x,y)
    {
        let wait = setTimeout(()=>{
            
            if(!(this.object.y == y && this.object.x == x))
            {
                this.vect2D_grid[y][x] = 0;
            }
            else
            {
                this.clearSpot(x,y);
            }
            
            
            

        },100 + 100 * this.score);
    }

}

    