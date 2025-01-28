let table = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
]

let turn = 1

let winner = 0

const players = [
    'Player1',
    'Player2'
]

const COLORS = {
    0: '#6e6e6e',
    1: 'teal',
    2: 'blue',
    3: 'yellow'
}

const winning_array = 4

function createBoard(){
    let board = document.getElementById('board')
    let board_html = ''
    for(let x = 0, y = 0; y <= table.length-1;){
        board_html += `<button onclick="move(${x}, ${y}); this.style.backgroundColor=this.bg; this.style.opacity='100%'" onmouseleave="this.style.backgroundColor=this.bg; this.style.opacity='100%'" onmouseover="is_move_valid(${x}, ${y})?this.style.backgroundColor='lightgreen':this.style.backgroundColor='#ff1414'; this.style.opacity='50%'" pos="{'x':${x}, 'y':${y}}" class="w-full game-square aspect-square bg-[#6e6e6e] rounded-[5px] shrink-0"></button>`
        if(x >= table[0].length-1){
            x = 0
            y++
            continue
        }
        x++
    }
    board.innerHTML = board_html
}

function move(x, y){
    if(is_move_valid(x, y) && winner===0){
        setTable(x, y, turn)
        redraw_table()

        let winning_player = isWinningMove(x, y)
        if(winning_player!==0){
            won(winning_player)
        }

        changeTurns()
    }
}

function won(winning_player){
    winner = winning_player
    alert(`winner is ${players[winning_player-1]}!`)
}

function changeTurns(){
    if(turn === 1){
        turn = 2
    }else if(turn === 2){
        turn = 1
    }
}

function redraw_table(){
    let squares = document.getElementsByClassName('game-square')
    for(let square of squares){
        const pos = JSON.parse(square.getAttribute("pos").replaceAll('\'', '"'))
        square.style.background = COLORS[String(accessTable(pos.x, pos.y))]
        square.bg = COLORS[String(accessTable(pos.x, pos.y))]
    }
}

function is_move_valid(moveX, moveY){
    const own_square = accessTable(moveX, moveY)
    if(own_square !== 0){
        return false
    }

    const north = accessTable(moveX, moveY-1)
    const west = accessTable(moveX-1, moveY)
    const east = accessTable(moveX+1, moveY)
    const south = accessTable(moveX, moveY+1)

    let top_solid = false
    let left_solid = false
    let right_solid = false
    let bottom_solid = false

    if(north === 'colliding_with_wall' || north !== 0){
        top_solid = true
    }
    if(west === 'colliding_with_wall' || west !== 0){
        left_solid = true
    }
    if(east === 'colliding_with_wall' || east !== 0){
        right_solid = true
    }
    if(south === 'colliding_with_wall' || south !== 0){
        bottom_solid = true
    }

    return validMoveRules(top_solid, left_solid, right_solid, bottom_solid)
}

function accessTable(x, y){
    try{
        return table[y][x]
    }catch{
        return 'colliding_with_wall'
    }
}

function setTable(x, y, value){
    table[y][x] = value
}

//uses all the parameters for different types of games, like double gravity
function validMoveRules(top_solid, left_solid, right_solid, bottom_solid){
    return bottom_solid
}

function isWinningMove(){
    let x_incremented = false
    for(let lastX = 0, lastY = 0; lastY <= table.length-1;){
        x_incremented = false

        let current_square = accessTable(lastX, lastY)
        console.log(`${lastX}, ${lastY}`);
        
        if(current_square===0&&!x_incremented){
            x_incremented = true
            if(lastX >= table[0].length-1){
                lastY++
                lastX = 0
            }else{
                lastX++
            }
            continue
        }

        let top_win_possible = true
        let left_win_possible = true
        let right_win_possible = true
        let bottom_win_possible = true
        let top_left_win_possible = true
        let top_right_win_possible = true
        let bottom_left_win_possible = true
        let bottom_right_win_possible = true

        let win = true

        for(let i = 1; i < winning_array; i++){
            const top = accessTable(lastX, lastY-i)
            const left = accessTable(lastX-i, lastY)
            const right = accessTable(lastX+i, lastY)
            const bottom = accessTable(lastX, lastY+i)
            const top_left = accessTable(lastX-i, lastY-i)
            const top_right = accessTable(lastX+i, lastY-i)
            const bottom_left = accessTable(lastX-i, lastY+i)
            const bottom_right = accessTable(lastX+i, lastY+i)
    
            let top_win = top!=='colliding_with_wall'
            let left_win = left!=='colliding_with_wall'
            let right_win = right!=='colliding_with_wall'
            let bottom_win = bottom!=='colliding_with_wall'
            let top_left_win = top_left!=='colliding_with_wall'
            let top_right_win = top_right!=='colliding_with_wall'
            let bottom_left_win = bottom_left!=='colliding_with_wall'
            let bottom_right_win = bottom_right!=='colliding_with_wall'
    
            if(left !== 'colliding_with_wall' && left_win){
                if(left !== current_square){
                    left_win = false
                }
            }
            if(right !== 'colliding_with_wall' && right_win){
                if(right !== current_square){
                    right_win = false
                }
            }
            if(top !== 'colliding_with_wall' && top_win){
                if(top !== current_square){
                    top_win = false
                }
            }
            if(bottom !== 'colliding_with_wall' && bottom_win){
                if(bottom !== current_square){
                    bottom_win = false
                }
            }
            if(top_left !== 'colliding_with_wall' && top_left_win){
                if(top_left !== current_square){
                    top_left_win = false
                }
            }
            if(top_right !== 'colliding_with_wall' && top_right_win){
                if(top_right !== current_square){
                    top_right_win = false
                }
            }
            if(bottom_left !== 'colliding_with_wall' && bottom_left_win){
                if(bottom_left !== current_square){
                    bottom_left_win = false
                }
            }
            if(bottom_right !== 'colliding_with_wall' && bottom_right_win){
                if(bottom_right !== current_square){
                    bottom_right_win = false
                }
            }
    
            if(top_win_possible){
                top_win_possible = top_win
            }
            if(left_win_possible){
                left_win_possible = left_win
            }
            if(right_win_possible){
                right_win_possible = right_win
            }
            if(bottom_win_possible){
                bottom_win_possible = bottom_win
            }
            if(top_left_win_possible){
                top_left_win_possible = top_left_win
            }
            if(top_right_win_possible){
                top_right_win_possible = top_right_win
            }
            if(bottom_left_win_possible){
                bottom_left_win_possible = bottom_left_win
            }
            if(bottom_right_win_possible){
                bottom_right_win_possible = bottom_right_win
            }
            if(!(top_win_possible||left_win_possible||right_win_possible||bottom_win_possible||top_left_win_possible||top_right_win_possible||bottom_left_win_possible||bottom_right_win_possible)){
                win = false
                break
            }
        }
        if(win){
            if(top_win_possible){
                for(let i = 0; i < winning_array; i++){
                    setTable(lastX, lastY-i, 3)
                }
            }
            if(left_win_possible){
                for(let i = 0; i < winning_array; i++){
                    setTable(lastX-i, lastY, 3)
                }
            }
            if(right_win_possible){
                for(let i = 0; i < winning_array; i++){
                    setTable(lastX+i, lastY, 3)
                }
            }
            if(bottom_win_possible){
                for(let i = 0; i < winning_array; i++){
                    setTable(lastX, lastY+i, 3)
                }
            }
            if(top_left_win_possible){
                for(let i = 0; i < winning_array; i++){
                    setTable(lastX-i, lastY-i, 3)
                }
            }
            if(top_right_win_possible){
                for(let i = 0; i < winning_array; i++){
                    setTable(lastX+i, lastY-i, 3)
                }
            }
            if(bottom_left_win_possible){
                for(let i = 0; i < winning_array; i++){
                    setTable(lastX-i, lastY+i, 3)
                }
            }
            if(bottom_right_win_possible){
                for(let i = 0; i < winning_array; i++){
                    setTable(lastX+i, lastY+i, 3)
                }
            }
            redraw_table()
            return current_square
        }
        if(lastX >= table[0].length-1&&!x_incremented){
            lastY++
            lastX = 0
        }else if(!x_incremented){
            lastX++
        }
    }
    return 0
}

function restart(){
    table = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    let board = document.getElementById('board')
    board.innerHTML = ''

    turn = 1

    winner = 0  

    createBoard()
    redraw_table()
}