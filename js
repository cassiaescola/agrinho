const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const inventoryDisplay = document.getElementById('inventory');

let score = 0;
let inventory = 0; // Contador de produtos coletados
let player = { x: 50, y: 50, width: 40, height: 40, speed: 5 };
let items = [];
let obstacles = [];
let shop = { x: canvas.width - 100, y: 20, width: 80, height: 80 }; // Loja no canto superior direito
let gameOver = false;

// Definir os emojis de itens
const itemTypes = ['🍅', '🥬', '🍇']; // Tomate, Alface e Uva

// Função para gerar itens com emojis
function spawnItem() {
    const item = {
        x: Math.random() * (canvas.width - 30),
        y: Math.random() * (canvas.height - 30),
        width: 30,
        height: 30,
        type: itemTypes[Math.floor(Math.random() * itemTypes.length)], // Escolher aleatoriamente um emoji
        timeToLive: 6000 // Tempo de vida do item (6 segundos)
    };
    items.push(item);

    // Remover o item após 6 segundos
    setTimeout(() => {
        items = items.filter(i => i !== item); // Remove o item da lista
    }, item.timeToLive);
}

// Função para gerar obstáculos (com emoji de madeira)
function spawnObstacle() {
    const obstacle = {
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * (canvas.height - 50),
        width: 50,
        height: 50,
        type: '🪵', // Emoji de madeira
        timeToLive: 6000 // Tempo de vida do obstáculo (6 segundos)
    };
    obstacles.push(obstacle);

    // Remover o obstáculo após 6 segundos
    setTimeout(() => {
        obstacles = obstacles.filter(o => o !== obstacle); // Remove o obstáculo da lista
    }, obstacle.timeToLive);
}

// Desenhar o jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar jogador (emoji de trator)
    const tractorEmoji = '🚜'; // Emoji de trator
    ctx.font = '40px Arial'; // Tamanho da fonte ajustado para o emoji
    ctx.fillText(tractorEmoji, player.x, player.y + player.height); // Desenha o emoji do trator

    // Desenhar itens (produtos agrícolas com emojis)
    items.forEach(item => {
        ctx.font = '30px Arial'; // Definir o tamanho da fonte para o emoji
        ctx.fillText(item.type, item.x, item.y); // Desenhar o emoji no local do item
    });

    // Desenhar obstáculos (com emoji de madeira)
    ctx.font = '30px Arial';
    obstacles.forEach(obstacle => {
        ctx.fillText(obstacle.type, obstacle.x, obstacle.y); // Desenha o emoji de madeira
    });

    // Desenhar loja com emoji de lojinha
    const shopEmoji = '🏪'; // Emoji de loja
    ctx.fillStyle = '#ff4500'; // Cor de fundo da loja
    ctx.fillRect(shop.x, shop.y, shop.width, shop.height); // Desenha o retângulo da loja

    // Desenhar o emoji de loja dentro da loja
    ctx.font = '30px Arial'; // Define o tamanho da fonte
    ctx.fillStyle = '#ffffff'; // Cor do emoji (branco para destacar)
    ctx.fillText(shopEmoji, shop.x + 10, shop.y + 45); // Desenha o emoji de loja dentro da loja

    // Atualizar interface
    scoreDisplay.textContent = `Pontos: ${score}`;
    inventoryDisplay.textContent = `Produtos coletados: ${inventory}`;
}

// Verificar colisões
function checkCollisions() {
    // Colisão com itens
    items = items.filter(item => {
        if (
            player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.y + player.height > item.y
        ) {
            inventory += 1; // Incrementa inventário
            return false; // Remove item coletado
        }
        return true;
    });

    // Colisão com obstáculos
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true;
            alert('Game Over! Pontuação final: ' + score);
        }
    });

    // Colisão com a loja
    if (
        player.x < shop.x + shop.width &&
        player.x + player.width > shop.x &&
        player.y < shop.y + shop.height &&
        player.y + player.height > shop.y &&
        inventory > 0
    ) {
        score += inventory * 20; // Cada item entregue vale 20 pontos
        alert(`Você entregou ${inventory} produtos para a festa! +${inventory * 20} pontos!`);
        inventory = 0; // Zera o inventário após entrega
    }
}

// Controle do jogador
document.addEventListener('keydown', (e) => {
    if (!gameOver) {
        if (e.key === 'ArrowUp' && player.y > 0) player.y -= player.speed;
        if (e.key === 'ArrowDown' && player.y < canvas.height - player.height) player.y += player.speed;
        if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
        if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed;
    }
});

// Loop do jogo
function gameLoop() {
    if (!gameOver) {
        draw();
        checkCollisions();
        requestAnimationFrame(gameLoop);
    }
}

// Gerar itens e obstáculos periodicamente
setInterval(spawnItem, 2000); // Novo item a cada 2 segundos
setInterval(spawnObstacle, 5000); // Novo obstáculo a cada 5 segundos

// Iniciar o jogo
gameLoop();
