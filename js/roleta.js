/**
 * ROLETA PREMIADA MIX - RENDERIZAÇÃO 100% FIEL COM IMAGENS PNG
 */

const DEFAULT_PREMIO_CONFIG = [
    {
        name: "PRÊMIO ESPECIAL",
        sub: "VOCÊ GANHOU\nALGO INCRÍVEL!",
        iconSrc: "assets/icons/presente.png",
        bg: "#0E4F36",
        color: "#FFFFFF",
    },
    {
        name: "",
        sub: "APROVEITE\nESSA VANTAGEM!",
        iconSrc: "assets/icons/cupom.png",
        bg: "#F58220",
        color: "#FFFFFF",
    },
    {
        name: "CANETA EXCLUSIVA",
        sub: "PEQUENOS DETALHES\nGRANDES IDEIAS!",
        iconSrc: "assets/icons/caneta.png",
        bg: "#FFFFFF",
        color: "#0E4F36",
    },
    {
        name: "BRINDE SURPRESA",
        sub: "SEMPRE É BOM\nRECEBER UM MIMO!",
        iconSrc: "assets/icons/sacola.png",
        bg: "#0E4F36",
        color: "#FFFFFF",
    },
    {
        name: "GIRE NOVAMENTE",
        sub: "A SORTE PODE ESTAR\nNA PRÓXIMA!",
        iconSrc: "assets/icons/gire.png",
        bg: "#F58220",
        color: "#FFFFFF",
    },
    {
        name: "MIMO CASA & DECOR",
        sub: "BELEZA TAMBÉM\nFAZ PARTE DO SEU DIA!",
        iconSrc: "assets/icons/casa.png",
        bg: "#FFFFFF",
        color: "#0E4F36",
    },
    {
        name: "",
        sub: "COMPARTILHE ESSE\nMOMENTO COM A GENTE!",
        iconSrc: "assets/icons/camera.png",
        bg: "#0E4F36",
        color: "#FFFFFF",
    },
    {
        name: "ATÉ 20% OFF",
        sub: "EM ITENS\nSELECIONADOS",
        iconSrc: "assets/icons/porcentagem.png",
        bg: "#F58220",
        color: "#FFFFFF",
    },
];

let activeSegments = [];
let loadedImages = {};
let currentRotation = 0;
let isSpinning = false;

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultModal = document.getElementById("resultModal");
const modalIcon = document.getElementById("modalIcon");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalPrize = document.getElementById("modalPrize");
const closeModalBtn = document.getElementById("closeModalBtn");

// Precarregamento das imagens dos ícones antes de desenhar a roleta
function preloadImages(segments, callback) {
    let loadedCount = 0;
    const totalImages = segments.length;

    segments.forEach((seg, index) => {
        const img = new Image();
        img.src = seg.iconSrc;
        img.onload = () => {
            loadedImages[index] = img;
            loadedCount++;
            if (loadedCount === totalImages) {
                callback();
            }
        };
        // Fallback caso a imagem não exista no caminho
        img.onerror = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                callback();
            }
        };
    });
}

document.addEventListener("DOMContentLoaded", () => {
    activeSegments = DEFAULT_PREMIO_CONFIG;

    preloadImages(activeSegments, () => {
        setupCanvas();
        renderWheel();
    });

    window.addEventListener("resize", () => {
        setupCanvas();
        renderWheel();
    });

    spinBtn.addEventListener("click", startSpin);
    closeModalBtn.addEventListener("click", closeModal);
});

function setupCanvas() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
}

function renderWheel() {
    const container = canvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(centerX, centerY);

    ctx.clearRect(0, 0, width, height);

    const totalSegments = activeSegments.length;
    const arcSize = (2 * Math.PI) / totalSegments;
    const angleOffset = -Math.PI / 2 - arcSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);

    for (let i = 0; i < totalSegments; i++) {
        const startAngle = i * arcSize + currentRotation + angleOffset;
        const endAngle = startAngle + arcSize;
        const seg = activeSegments[i];

        // 1. Desenhar a Fatia da Roleta
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, outerRadius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = seg.bg;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();

        // 2. Desenhar Conteúdo (Imagem PNG + Textos Féis)
        ctx.save();
        const midAngle = startAngle + arcSize / 2;
        const centerDistance = outerRadius * 0.58;

        const tx = Math.cos(midAngle) * centerDistance;
        const ty = Math.sin(midAngle) * centerDistance;

        ctx.translate(tx, ty);
        ctx.rotate(midAngle + Math.PI / 2);

        // Renderizar a Imagem PNG do Ícone
        // Renderizar a Imagem PNG do Ícone
        const iconImg = loadedImages[i];
        if (iconImg) {
            let iconSize = outerRadius * 0.22;
            let iconYOffset = -outerRadius * 0.32;

            // Aumento exclusivo para a imagem da CÂMERA
            if (seg.iconSrc.includes("camera.png")) {
                iconSize *= 1.75; // +40% de tamanho
                iconYOffset = -outerRadius * 0.40;
            }

            // Aumento exclusivo para a imagem do CUPOM
            if (seg.iconSrc.includes("cupom.png")) {
                iconSize *= 1.40; // +35% de tamanho
                iconYOffset = -outerRadius * 0.34; // Ajusta levemente a altura
            }

            ctx.drawImage(iconImg, -iconSize / 2, iconYOffset, iconSize, iconSize);
        }

        // Título do Prêmio (Texto em Negrito Identico)
        ctx.fillStyle = seg.color;
        ctx.textAlign = "center";

        const titleFontSize = Math.max(9, Math.min(outerRadius * 0.045, 14));
        ctx.font = `900 ${titleFontSize}px 'Montserrat', sans-serif`;

        const titleWords = seg.name.split(" ");
        if (titleWords.length > 2 && seg.name.length > 12) {
            const mid = Math.ceil(titleWords.length / 2);
            ctx.fillText(titleWords.slice(0, mid).join(" "), 0, 0);
            ctx.fillText(titleWords.slice(mid).join(" "), 0, titleFontSize * 1.1);
        } else {
            ctx.fillText(seg.name, 0, 0);
        }

        // Subtítulo do Prêmio
        const subFontSize = Math.max(6.5, Math.min(outerRadius * 0.026, 8.5));
        ctx.font = `700 ${subFontSize}px 'Montserrat', sans-serif`;
        ctx.globalAlpha = 0.9;

        const lines = seg.sub.split("\n");
        lines.forEach((line, idx) => {
            ctx.fillText(line, 0, titleFontSize * 1.25 + idx * subFontSize * 1.2);
        });

        ctx.restore();
    }

    ctx.restore();

    // Desenhar os pinos brancos idênticos na borda
    drawOuterPins(centerX, centerY, outerRadius, totalSegments);
}

function drawOuterPins(centerX, centerY, outerRadius, totalSegments) {
    const pinRadius = Math.max(3.5, outerRadius * 0.024);
    const pinDistance = outerRadius - 7;
    const arcSize = (2 * Math.PI) / totalSegments;

    for (let i = 0; i < totalSegments; i++) {
        const pinAngle = i * arcSize + currentRotation;
        const px = centerX + Math.cos(pinAngle) * pinDistance;
        const py = centerY + Math.sin(pinAngle) * pinDistance;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, pinRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 1;
        ctx.fill();

        ctx.strokeStyle = "#D5D5D5";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    }
}

// Lógica de Giro e Animação
function startSpin() {
    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;

    const selectedIndex = Math.floor(Math.random() * activeSegments.length);
    const selectedPrize = activeSegments[selectedIndex];

    const totalSegments = activeSegments.length;
    const arcSize = (2 * Math.PI) / totalSegments;

    const targetAngleForSegment = (totalSegments - selectedIndex) * arcSize;
    const extraTurns = (6 + Math.floor(Math.random() * 3)) * (2 * Math.PI);

    const finalRotation = currentRotation + extraTurns + (targetAngleForSegment - (currentRotation % (2 * Math.PI)));

    const duration = 5000;
    const startTime = performance.now();
    const initialRotation = currentRotation;

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        currentRotation = initialRotation + (finalRotation - initialRotation) * easeOut;
        renderWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            onSpinComplete(selectedPrize);
        }
    }

    requestAnimationFrame(animate);
}

function onSpinComplete(prize) {
    if (prize.name.includes("GIRE NOVAMENTE")) {
        modalIcon.textContent = "🔄";
        modalTitle.textContent = "GIRE NOVAMENTE!";
        modalSubtitle.textContent = "A sorte está ao seu lado";
        modalPrize.textContent = "TENTE MAIS UMA VEZ";
        closeModalBtn.textContent = "GIRAR DE NOVO";
    } else {
        modalIcon.textContent = "🎉";
        modalTitle.textContent = "PARABÉNS!";
        modalSubtitle.textContent = "Você ganhou";
        modalPrize.textContent = prize.name;
        closeModalBtn.textContent = "RESGATAR PRÊMIO";
    }

    resultModal.classList.remove("hidden");
}

function closeModal() {
    resultModal.classList.add("hidden");
    spinBtn.disabled = false;
    renderWheel();
}
