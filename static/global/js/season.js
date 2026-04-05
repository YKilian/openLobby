const snowflakes = ["❄", "❅", "❆"];

function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];

    snowflake.style.left = Math.random() * window.innerWidth + "px";
    snowflake.style.fontSize = (Math.random() * 10 + 10) + "px";
    snowflake.style.opacity = Math.random();
    snowflake.style.animationDuration = (Math.random() * 5 + 5) + "s";

    document.body.appendChild(snowflake);

    setTimeout(() => snowflake.remove(), 10000);
}

const month = new Date().getMonth();
if (month === 11 || month === 0 || month === 1) {
    setInterval(createSnowflake, 200);
}