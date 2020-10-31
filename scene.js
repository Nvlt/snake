

export default class scene
{
    constructor()
    {
        
        document.body.addEventListener('keydown',(e)=>{
            //console.log(e.key);
            this.lastActionTime = Date.now();
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
            this.lastActionTime = Date.now();
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
            
            this.checkUserActivity();
            this.render();
        },5)
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
    render()
    {
        let html = `<div class='grid_container' style='display: flex;
        flex-direction: column;'><h1>Score: ${this.score} || Status: ${this.status}</h1>`;
        for(const y in this.vect2D_grid)
        {
            html += `<div class='row' style='display: flex;
            flex-direction: row;'>`;
            for(const x in this.vect2D_grid[y])
            {
               
                const x_dif = Math.abs(x - -this.object.x);
                const y_dif = Math.abs(y - -this.object.y);
                const multi = 255/this.gridSize;
                let colors = `${x_dif*multi},0,${y_dif*multi}`
                if(this.vect2D_grid[y][x] == 2)
                {
                    colors = `60,0,50`;
                }
                if(this.vect2D_grid[y][x] == 1)
                {
                    colors = `100,0,90`;
                }
                html+=`<div style='background-color:rgb(${colors}); width: 15px;
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
            this.bloopEffect.play();
            
            
            return 1;
        }
        if(this.vect2D_grid[this.object.y][this.object.x] == 1)
        {
            this.vect2D_grid[this.object.y][this.object.x] = 0;
            this.score=0;
            this.status="Oh no.."
            this.failEffect.play();
            this.generateGrid();
            this.randomGoal();
            this.object = {x:0,y:0};
            this.temporarySquare();
            //console.log('test')
            return 1;
        }
        

    }
    addBloopEffect()
    {
        document.body.innerHTML += `<audio id="bloopEffect" controls>
                    <source src="./sounds/bloop.wav" type="audio/mpeg">
                    Your browser does not support the audio element.
                    </audio>`;
        let effectPlayer = document.getElementById('bloopEffect');
        return effectPlayer;
    }
    addFailEffect()
    {
        document.body.innerHTML += `<audio id="failEffect" controls>
                    <source src="./sounds/Fail.wav" type="audio/mpeg">
                    Your browser does not support the audio element.
                    </audio>`;
        let effectPlayer = document.getElementById('failEffect');
        return effectPlayer;
    }
    addMusic()
    {
        document.body.innerHTML += `<audio id="theme" controls>
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
    }
    randomGoal()
    {
        if(this.vect2D_grid[Math.floor(Math.random()*this.gridSize)][Math.floor(Math.random()*this.gridSize)] == 1)
        {
            this.randomGoal();
        }
        else
        {
            this.vect2D_grid[Math.floor(Math.random()*this.gridSize)][Math.floor(Math.random()*this.gridSize)] = 2;
        }
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

    