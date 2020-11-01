

export default class scene
{
    constructor()
    {
        
        this.updateQueue = [];
        document.body.addEventListener('keydown',(e)=>{
            //console.log(e.key);
            this.lastActionTime = Date.now();
            if(e.key === 's' || e.key === 'ArrowDown')
            {
                this.velocity.y = 1;
            }
            if(e.key === 'w' || e.key === 'ArrowUp')
            {
                this.velocity.y = -1;
            }
            if(e.key === 'a' || e.key === 'ArrowLeft')
            {
                this.velocity.x = -1;
            }
            if(e.key === 'd' || e.key === 'ArrowRight')
            {
                this.velocity.x = 1;
            }
            //console.log(this.velocity)
        })
        document.body.addEventListener('keyup',(e)=>{
            this.lastActionTime = Date.now();
            if(e.key === 's' || e.key === 'ArrowDown')
            {
                this.velocity.y = 0;
            }
            if(e.key === 'w' || e.key === 'ArrowUp')
            {
                this.velocity.y = 0;
            }
            if(e.key === 'a' || e.key === 'ArrowLeft')
            {
                this.velocity.x = 0;
            }
            if(e.key === 'd' || e.key === 'ArrowRight')
            {
                this.velocity.x = 0;
            }
        })
        this.score = 0;
        this.status = "Game time!"
        this.gridSize = 50;
        this.squareSize = 12;
        this.vect2D_grid = [];
        this.generateGrid();
        this.generateBoard();
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
            
            this.checkUserActivity();
            this.render();
        },33)
        this.randomGoal()
        this.lastActionTime = Date.now();
        this.bloopEffect = this.addBloopEffect();
        this.failEffect = this.addFailEffect();
        this.theme = this.addMusic();
        this.playing = false;
        
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
    generateBoard()
    {
        let html = `<div class='grid_container' style='display: flex;
        flex-direction: column;'><h1 id='status_text'>Score: ${this.score} || Status: ${this.status}</h1>`;
        for(const y in this.vect2D_grid)
        {
            html += `<div class='row' style='display: flex;
            flex-direction: row;'>`;
            for(const x in this.vect2D_grid[y])
            {   
                html+=`<div id='_${x}_${y}_' style='background-color:rgb(100,0,100); width: ${this.squareSize}px;
                height: ${this.squareSize}px;'></div>`
            }
            html += `</div>`;
        }
        html += `</div>`;
        document.body.innerHTML = html;
    }
    render()
    {
        for(const update of this.updateQueue)
        {
            
            if(update.type == 'grid' && update.value == 1)
            {
                document.getElementById(update.id).style.backgroundColor = 'rgb(0,0,0)';
            }
            if(update.type == 'grid' && update.value == 0)
            {
                document.getElementById(update.id).style.backgroundColor = 'rgb(100,0,100)';
            }
            if(update.type == 'grid' && update.value == 2)
            {
                document.getElementById(update.id).style.backgroundColor = 'rgb(0,0,0)';
            }
            if(update.type == 'status')
            {
                document.getElementById('status_text').innerHTML = `Score: ${this.score} || Status: ${this.status}`;
            }
            
        }
        this.updateQueue = [];
    }
    setValue(x,y,value)
    {
        this.vect2D_grid[y][x] = value;
        this.updateQueue.push({id:`_${x}_${y}_`,value:value,type:'grid'});
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
            this.bloopEffect.play();
            
            
            return 1;
        }
        if(this.vect2D_grid[this.object.y][this.object.x] == 1)
        {
            this.vect2D_grid[this.object.y][this.object.x] = 0;
            this.score=0;
            this.status="Oh no.."
            this.updateQueue.push({id:`status_text`,value:this.score,type:'status'})
            this.failEffect.play();
            this.generateGrid();
            this.generateBoard();
            this.randomGoal();
            this.object = {x:0,y:0};
            this.temporarySquare();
            this.theme.play();
            //console.log('test')
            return 1;
        }
        

    }
    addBloopEffect()
    {
        document.body.innerHTML += `<audio id="bloopEffect" hidden controls>
                    <source src="./sounds/bloop.wav" type="audio/mpeg">
                    Your browser does not support the audio element.
                    </audio>`;
        let effectPlayer = document.getElementById('bloopEffect');
        return effectPlayer;
    }
    addFailEffect()
    {
        document.body.innerHTML += `<audio id="failEffect" hidden controls>
                    <source src="./sounds/Fail.wav" type="audio/mpeg">
                    Your browser does not support the audio element.
                    </audio>`;
        let effectPlayer = document.getElementById('failEffect');
        return effectPlayer;
    }
    addMusic()
    {
        document.body.innerHTML += `<audio id="theme" hidden controls>
                    <source src="./sounds/theme.mp3" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>`;
        let themePlayer = document.getElementById('theme');
        themePlayer.loop = true;
        return themePlayer;
        
    }
    checkUserActivity()
    {
        let timeDif = Date.now() - this.lastActionTime;
        //console.log(timeDif);
        if(timeDif > 500 && this.playing == true)
        {
            //Blah
            this.playing = false;
        }
        else if(timeDif < 500 && this.playing == false)
        {
            this.theme.play();
            this.playing = true;
        }
    }
    Score()
    {
        this.score++;
        this.updateQueue.push({id:`status_text`,value:this.score,type:'status'})
    }
    randomGoal()
    {
        if(this.vect2D_grid[Math.floor(Math.random()*this.gridSize)][Math.floor(Math.random()*this.gridSize)] == 1)
        {
            this.randomGoal();
        }
        else
        {
            let x = Math.floor(Math.random()*this.gridSize);
            let y = Math.floor(Math.random()*this.gridSize);
            this.setValue(x,y,2);
        }
    }
    temporarySquare()
    {
        let {x,y} = this.object;
        this.setValue(x,y,1);
        this.clearSpot(x,y);
    }
    clearSpot(x,y)
    {
        let wait = setTimeout(()=>{
            
            if(!(this.object.y == y && this.object.x == x))
            {
                this.setValue(x,y,0);
            }
            else
            {
                this.clearSpot(x,y);
            }
            
            
            

        },100 + 100 * this.score);
    }

}

    