const postMyData = async (data) => {
    console.log("aqui vamos", data);
    try {
        const response = await fetch("http://localhost:8080/api/products/", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const datos = await response.json();
        return datos;
    } catch (err) {
        console.log(err);
    }
};

document.getElementById("createPproduct").addEventListener("submit", (event) => {
    const icon = document.getElementById("icon").value;
    const name = document.getElementById("name").value;
    const type = document.getElementById("type").value
    const rank = document.getElementById("rank").value;
    const pattack = document.getElementById("pattack").value;
    const mattack = document.getElementById("mattack").value;
    const atkspd = document.getElementById("atkspd").value;
    const critical = document.getElementById("critical").value;
    const soulshots = document.getElementById("soulshots").value;
    const spiritshots = document.getElementById("spiritshots").value;
    const weight = document.getElementById("weight").value;
    const image = document.getElementById("pattack").value;
    const data = { icon, name, type, rank, pattack, mattack, atkspd, critical, soulshots, spiritshots, weight, image };
    postMyData(data)
        .then(alert("Creado exitosamente"))
        .catch((err) => console.log("error"));
});