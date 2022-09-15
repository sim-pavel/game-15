const startBtn = document.querySelector('#start')
const repeatBtn = document.querySelector('#repeat')
const screens = document.querySelectorAll('.screen')
const dimList = document.querySelector('#dim_list')
const dimEl = document.querySelector('#dim')
const board = document.querySelector('#board')
let dimension = 3
let emptyCell = { x: 0, y: 0 }
let isWin = false
let moves = 0

startBtn.addEventListener('click', (ev) => {
    ev.preventDefault()
    screens[0].classList.add('up')
})


repeatBtn.addEventListener('click', (ev) => {
    ev.preventDefault()
    resetGame()
})


dimList.addEventListener('click', (ev) => {
    if (ev.target.classList.contains('dim-btn')) {
        dimension = parseInt(ev.target.getAttribute('data-dim'))
        screens[1].classList.add('up')
        startGame()
    }
})


function setEmptyCell(newX, newY) {
    emptyCell = { x: newX, y: newY }
}

function getCellName(i, j) {
    return 'cell_' + i + '_' + j
}

function setCell(i, j, val) {
    const square = document.getElementById(getCellName(i,j))
    if (square) {
        square.setAttribute('val',val)        
        if (parseInt(val) === 0) {            
            square.textContent = ''
            square.classList.add('empty')            
        } else {
            square.textContent = val
            square.classList.remove('empty')
        }
    }
}

function printField() {
    board.style.maxWidth = (dimension * 84) + 'px'
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            const square = document.createElement('div')
            square.classList.add('square')
            square.id = getCellName(i, j)
            square.addEventListener('click', cellClick)
            board.append(square)
        }
    }
}

function getCellInfo(cell) {
    const pos = cell.id.split('_')
    const val = cell.getAttribute('val')
    return {
        'i' : parseInt(pos[1]),
        'j' : parseInt(pos[2]),
        'val': parseInt(val)
    }
}

function cellClick(ev) {
    if (!isWin) {
        const cell = ev.target
        const info = getCellInfo(cell)

        if (canMove(info)) {
            moves++
            setCell(emptyCell.x, emptyCell.y, info.val)
            setCell(info.i, info.j, 0)
            setEmptyCell(info.i, info.j)

            if (checkWin()) {
                isWin = true;
                setTimeout( () => alert('Поздравляем! Вы выиграли!!! Количество шагов: ' + moves),100)
            }
        } else {
            return ;
        }
    }
}

function canMove(info) {
    if (info.val === 0) return;
    if ((Math.abs( info.i - emptyCell.x ) === 0) && (Math.abs( info.j - emptyCell.y ) === 1) || 
        (Math.abs( info.i - emptyCell.x ) === 1) && (Math.abs( info.j - emptyCell.y ) === 0)) {
            return true
        }
    else 
        return false;
}

function shuffleArray(arr) {
    let rnd = 0    
    for (let i = 0; i < arr.length; i++) {
        rnd = Math.floor(Math.random() * i);
        [arr[i], arr[rnd]] = [arr[rnd], arr[i]]
    }
    console.log('Shuffle array = ', arr)
    return arr
}

function generateGame() {
    const arr = []
    for (let i = 0; i < dimension*dimension; i++) {
        arr.push(i)
    }
    console.log(arr)
    return shuffleArray(arr)    
}

function startGame() {
    printField()
    const game = generateGame()
    const cells = document.querySelectorAll('.square')
    for (let i = 0; i < game.length; i++) {
        cells[i] = setCell( Math.floor(i / dimension), i % dimension, game[i])
        if (game[i] === 0) {
            setEmptyCell(Math.floor(i / dimension), i % dimension) 
        }
    }
}

function checkWin() {
    const cells = document.querySelectorAll('.square')
    let currentValue = getCellInfo(cells[0]).val
    for (let i = 1; i < cells.length-1; i++) {
        if (currentValue >= getCellInfo(cells[i]).val) {
            return false
        } else {
            currentValue = getCellInfo(cells[i]).val
        }
    }
    return true
}

function resetGame() {
    isWin = false
    board.textContent = ''
    screens.forEach(elem => {elem.classList.remove('up')});
    moves = 0
}


